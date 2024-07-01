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
                    url: `${config.siteUrl}goals_settings/kpi_unit/get_year_period_options`,
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

        $('#unitId').each(async function () {
            $(this).select2({
                theme: 'bootstrap',
                dropdownParent: $(this).parent(),
                ajax: {
                    url: `${config.siteUrl}goals_settings/kpi_unit/get_unit_options`,
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
    }

    function handleFormEvents() {
        $('#btnSubmit').click(() => $('#formMapping').submit());
        $('#formMapping').submit(event => {
            event.preventDefault();if (isSubmitting) return;
            isSubmitting = true;
            
            toggleButtonLoader('#btnSaveDirectorate', true, { data: '' });
            _.debounce(async () => {
                await setupFormSubmission();
                isSubmitting = false;
                toggleButtonLoader('#btnSaveDirectorate', false);
            }, 500)();
        });
    }

    async function setupFormSubmission() {
        const selectedUnitId = $(`#unitId`).find('option:selected');
        const selectedUnitName = selectedUnitId.text();
        const selectedYearPeriodId = $(`#yearPeriodId`).find('option:selected');
        const selectedYearPeriodName = selectedYearPeriodId.text();

        const formData = new URLSearchParams(new FormData($('#formMapping')[0]));
        formData.append('unit_name', selectedUnitName);
        formData.append('year_period_name', selectedYearPeriodName);

        const formDetails = {
            url: 'goals_settings/kpi_unit/mapping_data',
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
            await new Promise(resolve => setTimeout(resolve, 150));
            const result = await response.json();
            handleFormResponse(result);
        } catch (error) {
            displayToast('Error', 'Error while submitting data', 'error');
        }
    }

    function handleFormResponse(response) {
        if (response.status === 'success') {
            displayToast('Success', response.message + ', generate to KPI page...', 'success');
            setTimeout(() => {
                window.location.href = `${config.siteUrl}goals_settings/kpi_unit/kpi?data=${response.data.encrypted_data}`;
            }, 1000);
        } else {
            displayToast('Error', response.message, 'error');
            $.each(response.errors, function(key, value) {
                $(`#formMapping`).find(`#error-${key}`).html(value);
            });
        }
    }
})(jQuery);