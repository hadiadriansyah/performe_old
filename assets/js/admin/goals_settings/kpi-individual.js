(function($) {
    'use strict';

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

        if (yearPeriodId && employeeId) {
            const goalSettings = await getGoalSettings(yearPeriodId, employeeId);
            console.log(goalSettings);
        }
    }

    async function getGoalSettings(yearPeriodId, employeeId) {
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
            return result;
        } catch (error) {
            return false;
        }
    }
})(jQuery);