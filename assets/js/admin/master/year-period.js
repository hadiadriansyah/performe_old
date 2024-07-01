(function($) {
    'use strict';

    let mode;
    let isSubmitting = false;

    $(initializePage);

    function initializePage() {
        initializeDataTable();
        customizeDataTableUI();
        initializeYearPicker();
        initializeSelect2();
        initializeModalButton();
        handleFilterButton();
        handleFormEvents();
    }

    function initializeDataTable(dataFilter = {}) {
        const table = $('#tableYearPeriod').DataTable({
            processing: true,
            serverSide: true,
            order: [],
            ajax: {
                url: `${config.siteUrl}master/year_period/data_server`,
                type: "POST",
                data: Object.keys(dataFilter).length ? dataFilter : {},
            },
            columns: [
                { data: "no", className: "text-center", orderable: false, searchable: false },
                { data: "year_period", className: "text-center" },
                { data: "status_appraisal", className: "text-center" },
                { data: "created_at", className: "text-center" },
                { data: "actions", className: "text-center", orderable: false, searchable: false }
            ],
            aLengthMenu: [
                [5, 10, 15, -1],
                [5, 10, 15, "All"]
            ],
            iDisplayLength: 10,
            language: {
                search: "",
                paginate: {
                    previous: "Previous",
                    next: "Next",
                    first: "First",
                    last: "Last"
                }
            },
            columnDefs: [
                {
                    targets: 2,
                    data: "status_appraisal",
                    render: (data) => `<span class="badge ${data == '1' ? 'badge-success' : 'badge-danger'}">${data == '1' ? 'Active' : 'Not Active'}</span>`
                },
                {
                    targets: -1,
                    data: "id",
                    render: (data, type, row) => `
                        <button type="button" class="btn btn-gradient-dark btn-icon-text btn-modal" data-bs-toggle="modal" data-bs-target="#modalYearPeriod" data-mode="modalEditYearPeriod" data-id="${row.id}"> Edit <i class="mdi mdi-file-check btn-icon-append"></i></button>
                        <button type="button" class="btn btn-gradient-danger btn-icon-text btn-delete" data-mode="modalDeleteYearPeriod" data-id="${row.id}"> Delete <i class="mdi mdi-delete btn-icon-append"></i></button>`
                }
            ]
            
        });
    }
    
    function customizeDataTableUI() {
        $('#tableYearPeriod').each(function() {
            const datatable = $(this);
            const searchInput = datatable.closest('#tableYearPeriod_wrapper').find('div[class="dt-search"] input');
            searchInput.attr('placeholder', 'Search...');
        });
    }

    function initializeYearPicker() {
        const yearPicker = $("#yearPeriod");
        if (yearPicker.length) {
            yearPicker.datepicker({
                format: "yyyy",
                viewMode: "years",
                minViewMode: "years",
                enableOnReadonly: true,
                todayHighlight: true,
            });
        }
    }

    function initializeSelect2() {
        $('.select2-js-basic').each(function () {
            $(this).select2({
                theme: 'bootstrap',
                dropdownParent: $(this).parent(),
            })
        })
    }

    function initializeModalButton() {
        $(document).on('click', '.btn-modal', function() {
            mode = $(this).data('mode');
            const id = $(this).data('id');
            
            $('#modalLabelYearPeriod').text(mode === 'modalAddYearPeriod' ? 'Add YearPeriod' : 'Edit YearPeriod');

            if (mode === 'modalEditYearPeriod') {
                fetchYearPeriodData(id);
            }
        });

        $(document).on('click', '.btn-delete', function() {
            const id = $(this).data('id');
            if (!id) {
                displayToast('Danger', 'ID not found or is invalid.', 'error');
                return;
            }
            confirmDeletion(id);
        });

        
        $('#modalYearPeriod').on('shown.bs.modal', () => {});     

        $('#modalYearPeriod').on('hidden.bs.modal', () => {
            if (mode === 'modalEditYearPeriod') {
                $('#formYearPeriod').trigger('reset');
            }
        });
    }
    
    async function fetchYearPeriodData(id) {
        try {
            const response = await fetch(`${config.siteUrl}master/year_period/get_by_id/${id}`, { method: 'GET' });
            const result = await response.json();
            const data = result.data;
            $('#id').val(data.id);
            $('#yearPeriod').datepicker('setDate', data.year_period);
            $('#statusAppraisal').val(data.status_appraisal).trigger('change');
        } catch (error) {
            displayToast('Error', 'Error fetching year period data', 'error');
        }
    }
    
    function confirmDeletion(id) {
        swal({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            buttons: {
                cancel: {
                    text: "Cancel",
                    visible: true,
                    className: "btn btn-danger",
                    closeModal: true,
                },
                confirm: {
                    text: "OK",
                    visible: true,
                    className: "btn btn-primary",
                    closeModal: true
                }
            }
        }).then(willDelete => {
            if (willDelete) deleteData(id);
        });
    }

    async function deleteData(id) {
        toggleBarLoader(null, true);
        try {
            const response = await fetch(`${config.siteUrl}master/year_period/delete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ id }).toString()
            });
            const result = await response.json();

            if (result.status === 'success') {
                displayToast('Success', 'Your data has been deleted', 'success');
                $('#tableYearPeriod').DataTable().ajax.reload();
            } else {
                displayToast('Error', 'Data could not be deleted. The record is still related to other records', 'error');
            }
        } catch (error) {
            displayToast('Error', 'Data could not be deleted. The record is still related to other records', 'error');
        }
        toggleBarLoader(null, false);
    }

    function handleFilterButton() {
        $('#filterBtn').on('click', function() {
            const status_appraisal = $('#filterStatusAppraisal').val();
            $('#tableYearPeriod').DataTable().destroy();
            const dataFilter = {
                status_appraisal: status_appraisal
            }
            initializeDataTable(dataFilter);
        });
    }

    function handleFormEvents() {
        $('#btnSaveYearPeriod').click(() => $('#formYearPeriod').submit());
        $('#formYearPeriod').submit((event) => {
            event.preventDefault();
            if (isSubmitting) return;
            isSubmitting = true;
            
            toggleButtonLoader('#btnSaveYearPeriod', true, { data: '' });
            _.debounce(async () => {
                await setupFormSubmission();
                isSubmitting = false;
                toggleButtonLoader('#btnSaveYearPeriod', false);
            }, 500)();
        });
    }

    async function setupFormSubmission() {
        $('.error-message').html('');
        const formDetails = {
            url: mode === 'modalAddYearPeriod' ? 'master/year_period/store' : 'master/year_period/update',
            formData: $('#formYearPeriod').serialize()
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
            await new Promise(resolve => setTimeout(resolve, 500));
            const result = await response.json();
            handleFormResponse(result);
        } catch (error) {
            displayToast('Error', 'Error while submitting data', 'error');
        }
    }

    function handleFormResponse(response) {
        if (response.status === 'success') {
            displayToast('Success', response.message, 'success');
            $('#formYearPeriod').trigger('reset');
            $('#tableYearPeriod').DataTable().ajax.reload();
            $('#modalYearPeriod').modal('hide');
        } else {
            displayToast('Error', response.message, 'error');
            $.each(response.errors, function(key, value) {
                $(`#formYearPeriod`).find(`#error-${key}`).html(value);
            });
        }
    }
    
    $('#formYearPeriod').on('reset', function() {
        $('#formYearPeriod').find('.error-message').html('');
        $('#formYearPeriod').find('.select2-js-basic').val('0').trigger('change');
    });
})(jQuery);