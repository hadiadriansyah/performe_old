(function($) {
    'use strict';

    let isSubmitting = false;

    $(initializePage);

    function initializePage() {
        initializeSelect2();
        handleFormEvents();
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
                    url: `${config.siteUrl}goals_settings/create_gs/get_year_period_options`,
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
        })

        $('#employeeId').each(async function () {
            $(this).select2({
                theme: 'bootstrap',
                dropdownParent: $(this).parent(),
                ajax: {
                    url: `${config.siteUrl}goals_settings/create_gs/get_employee_options`,
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
        const response = await fetch(`${config.siteUrl}goals_settings/create_gs/get_position_unit_placement_unit_by_employee_id/${employeeId}`);
        const result = await response.json();
        const data = result.data;
        return data;
    }

    function handleFormEvents() {
        $('#btnCreateGs').click(() => $('#formCreateGs').submit());
        $('#formCreateGs').submit(event => {
            event.preventDefault();if (isSubmitting) return;
            isSubmitting = true;
            
            toggleButtonLoader('#btnCreateGs', true, { data: '' });
            _.debounce(async () => {
                await setupFormSubmission();
                isSubmitting = false;
                toggleButtonLoader('#btnCreateGs', false, { data: 'Create GS' });
            }, 500)();
        });
    }

    async function setupFormSubmission() {
        const formData = new URLSearchParams(new FormData($('#formCreateGs')[0]));
        formData.append('unit_id', $('#unitId').val());
        formData.append('position_id', $('#positionId').val());
        formData.append('placement_unit_id', $('#placementUnitId').val());
        const formDetails = {
            url: 'goals_settings/create_gs/create_gs',
            formData: formData
        };
        await submitFormData(formDetails);
    }

    async function submitFormData(formDetails) {
        try {
            const response = await fetch(`${config.siteUrl}${formDetails.url}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formDetails.formData
            });
            const result = await response.json();
            handleFormResponse(result);
        } catch (error) {
            displayToast('Error', 'Error while creating Goal Setting', 'error');
        }
    }

    function handleFormResponse(response) {
        if (response.status === 'success') {
            displayToast('Success', response.message, 'success');
        } else {
            displayToast('Error', response.message, 'error');
            $.each(response.errors, function(key, value) {
                $(`#formCreateGs`).find(`#error-${key}`).html(value);
            });
        }
    }
})(jQuery);