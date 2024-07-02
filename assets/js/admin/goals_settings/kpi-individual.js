(function($) {
    'use strict';

    let goalsSettingsData = {};

    $(initializePage);

    function initializePage() {
        initializeSelect2();
        initializeGoalsSettings();
    }

    function initializeSelect2() {
        $('.select2-js-basic').each(function () {
            $(this).select2({
                theme: 'bootstrap',
                dropdownParent: $(this).parent(),
            })
        })

        $('#yearPeriodId').each(function () {
            $(this).select2({
                theme: 'bootstrap',
                dropdownParent: $(this).parent(),
                ajax: {
                    url: `${config.siteUrl}goals_settings/kpi_individual/get_year_period_options`,
                    dataType: 'json',
                    delay: 250,
                    data: params => ({
                        q: params.term || '',
                        page: params.page || 1
                    }),
                    processResults: (data, params) => {
                        params.page = params.page || 1;
                        if (params.page === 1) {
                            data.data.items.unshift({ id: '', text: '- Choose -' });
                        }
                        return {
                            results: data.data.items,
                            pagination: {
                                more: (params.page * 10) < data.data.total_count
                            }
                        };
                    },
                    cache: true
                },
                minimumInputLength: 0
            });
        });
        
        $('#yearPeriodId').change(async function() {
            initializeGoalsSettings();
        });

        $('#employeeId').each(async function () {
            $(this).select2({
                theme: 'bootstrap',
                dropdownParent: $(this).parent(),
                ajax: {
                    url: `${config.siteUrl}goals_settings/kpi_individual/get_employee_options`,
                    dataType: 'json',
                    delay: 250,
                    data: params => ({
                        q: params.term || '',
                        page: params.page || 1
                    }),
                    processResults: (data, params) => {
                        params.page = params.page || 1;
                        if (params.page === 1) {
                            data.data.items.unshift({ id: '', text: '- Choose -' });
                        }
                        return {
                            results: data.data.items,
                            pagination: {
                                more: (params.page * 10) < data.data.total_count
                            }
                        };
                    },
                    cache: true
                },
                minimumInputLength: 0
            });
        });

        $('#employeeId').change(async function() {
            const employeeId = $(this).val();
            if (!employeeId) {
                $('#positionId').val(null).trigger('change');
                $('#unitId').val(null).trigger('change');
                $('#placementUnitId').val(null).trigger('change');
                return;
            }
            const positionUnitPlacementUnit = await getPositionUnitPlacementUnitByEmployeeId(employeeId);

            if (positionUnitPlacementUnit && positionUnitPlacementUnit.position || positionUnitPlacementUnit && positionUnitPlacementUnit.unit || positionUnitPlacementUnit && positionUnitPlacementUnit.placement_unit) {
                const newPositonOption = new Option(positionUnitPlacementUnit.position.nm_jabatan, positionUnitPlacementUnit.position.id, true, true);
                $('#positionId').children('option:not([value=""])').remove();
                $('#positionId').append(newPositonOption).trigger('change');

                const newUnitOption = new Option(positionUnitPlacementUnit.unit.nm_unit_kerja, positionUnitPlacementUnit.unit.id, true, true);
                $('#unitId').children('option:not([value=""])').remove();
                $('#unitId').append(newUnitOption).trigger('change');

                const newPlacementUnitOption = new Option(positionUnitPlacementUnit.placement_unit.nm_unit_kerja, positionUnitPlacementUnit.placement_unit.id, true, true);
                $('#placementUnitId').children('option:not([value=""])').remove();
                $('#placementUnitId').append(newPlacementUnitOption).trigger('change');
                
                initializeGoalsSettings();
            } else {
                $('#positionId').val(null).trigger('change');
                $('#positionId').children('option:not([value=""])').remove();
                $('#unitId').val(null).trigger('change');
                $('#unitId').children('option:not([value=""])').remove();
                $('#placementUnitId').val(null).trigger('change');
                $('#placementUnitId').children('option:not([value=""])').remove();
            }
            $('#btnCreateGs').prop('disabled', false).removeClass('btn-gradient-danger').addClass('btn-gradient-success');
        });

    }

    async function getPositionUnitPlacementUnitByEmployeeId(employeeId) {
        const response = await fetch(`${config.siteUrl}goals_settings/kpi_individual/get_position_unit_placement_unit_by_employee_id/${employeeId}`);
        const result = await response.json();
        const data = result.data;
        return data;
    }

    async function initializeGoalsSettings() {
        const yearPeriodId = $('#yearPeriodId').val();
        const employeeId = $('#employeeId').val();

        goalsSettingsData = {};
        $('#kpiIndividualContainer').addClass('d-none');

        if (yearPeriodId && employeeId) {
            const goalsSettings = await getGoalsSettings(yearPeriodId, employeeId);
            $('#goalsSettingsContainer tbody').empty();
            if (goalsSettings) {
                goalsSettings.forEach((gs, index) => {
                    goalsSettingsData[gs.id] = gs;
                    $('#goalsSettingsContainer tbody').append(`
                        <tr>
                            <td>${index + 1}</td>
                            <td>${gs.position_name}</td>
                            <td>${gs.unit_name}</td>
                            <td>${gs.placement_unit_name}</td>
                            <td>
                                <button type="button" class="btn btn-sm btn-gradient-success btn-icon-text btn-view-kpi" 
                                    data-id="${gs.id}"
                                    data-bs-toggle="tooltip" 
                                    data-placement="left" 
                                    title="View">
                                    <i class="mdi mdi-eye"></i>
                                </button>
                            </td>
                        </tr>
                    `);
                });

                $('.btn-view-kpi').on('click', function() {
                    const id = $(this).attr('data-id');
                    kpiData(id);
                });
            }
        }
    }

    async function kpiData(id) {
        $('#kpiIndividualContainer').removeClass('d-none');
        const gsData = goalsSettingsData[id];
        $('#position').val(gsData.position_name);

        const kpiUnit = await getKpiUnit(gsData.placement_unit_id, gsData.year_period_id);
        console.log(kpiUnit);

        const kpiIndividual = await getKpiIndividualByPaId(gsData.id);
        console.log(kpiIndividual);
    }

    async function getKpiUnit(unitId, yearPeriodId) {
        if (unitId && yearPeriodId) {
            try {
                const response = await fetch(`${config.siteUrl}goals_settings/kpi_individual/get_kpi_unit`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({
                        unit_id: unitId,
                        year_period_id: yearPeriodId,
                    }).toString()
                });
                const result = await response.json();
                const data = result.data;
                return data;
            } catch (error) {
                return false;
            }
        }
    }

    async function getKpiIndividualByPaId(id) {
        if (id) {
            try {
                const response = await fetch(`${config.siteUrl}goals_settings/kpi_individual/get_kpi_individual_by_pa_id`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({
                        id: id,
                    }).toString()
                });
                const result = await response.json();
                const data = result.data;
                return data;
            } catch (error) {
                return false;
            }
        }
    }

    async function getGoalsSettings(yearPeriodId, employeeId) {
        try {
            const response = await fetch(`${config.siteUrl}goals_settings/kpi_individual/get_goals_settings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    year_period_id: yearPeriodId,
                    employee_id: employeeId
                }).toString()
            });
            const result = await response.json();
            const data = result.data
            return data;
        } catch (error) {
            return false;
        }
    }


})(jQuery);