(function($) {
    'use strict';

    let mode;
    let isSubmitting = false;

    $(initializePage);

    function initializePage() {
        initializeDataTable();
        customizeDataTableUI();
        initializeSelect2();
        initializeModalButton();
        handleFilterButton();
        handleFormEvents();
    }

    function initializeDataTable(dataFilter = {}) {
        const table = $('#tableObjective').DataTable({
            processing: true,
            serverSide: true,
            order: [],
            ajax: {
                url: `${config.siteUrl}master/objective/data_server`,
                type: "POST",
                data: Object.keys(dataFilter).length ? dataFilter : {},
            },
            columns: [
                { data: "no", className: "text-center", orderable: false, searchable: false },
                { data: "objective", className: "text-left" },
                { data: "description", className: "text-left" },
                { data: "year_period", className: "text-center" },
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
                    targets: -1,
                    data: "id",
                    render: (data, type, row) => `
                        <button type="button" class="btn btn-gradient-dark btn-icon-text btn-modal" data-bs-toggle="modal" data-bs-target="#modalObjective" data-mode="modalEditObjective" data-id="${row.id}"> Edit <i class="mdi mdi-file-check btn-icon-append"></i></button>
                        <button type="button" class="btn btn-gradient-danger btn-icon-text btn-delete" data-mode="modalDeleteObjective" data-id="${row.id}"> Delete <i class="mdi mdi-delete btn-icon-append"></i></button>`
                }
            ]
        });
    }

    function customizeDataTableUI() {
        $('#tableObjective').each(function() {
            const datatable = $(this);
            const searchInput = datatable.closest('#tableObjective_wrapper').find('div[class="dt-search"] input');
            searchInput.attr('placeholder', 'Search...');
        });
    }

    function initializeSelect2() {
        $('.select2-js-basic').each(function () {
            $(this).select2({
                theme: 'bootstrap',
                dropdownParent: $(this).parent(),
            })
        })

        $('#yearPeriodId, #filterYearPeriodId').each(function () {
            $(this).select2({
                theme: 'bootstrap',
                dropdownParent: $(this).parent(),
                ajax: {
                    url: `${config.siteUrl}master/objective/get_year_period_options`,
                    dataType: 'json',
                    delay: 250,
                    data: params => ({
                        q: params.term || '',
                        page: params.page || 1
                    }),
                    processResults: (data, params) => {
                        params.page = params.page || 1;
                        if (params.page === 1) {
                            if ($(this).attr('id') === 'filterYearPeriodId') {
                                data.data.items.unshift({ id: 'all', text: 'All' });
                            } else {
                                data.data.items.unshift({ id: '', text: '- Choose -' });
                            }
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
    }

    function initializeModalButton() {
        $(document).on('click', '.btn-modal', function() {
            mode = $(this).data('mode');
            const id = $(this).data('id');
            
            $('#modalLabelObjective').text(mode === 'modalAddObjective' ? 'Add Objective' : 'Edit Objective');

            if (mode === 'modalEditObjective') {
                fetchObjectiveData(id);
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

        $('#modalObjective').on('shown.bs.modal', () => {});     

        $('#modalObjective').on('hidden.bs.modal', () => {
            if (mode === 'modalEditObjective') {
                $('#formObjective').trigger('reset');
            }
        });
    }

    async function fetchObjectiveData(id) {
        try {
            const response = await fetch(`${config.siteUrl}master/objective/get_by_id/${id}`, { method: 'GET' });
            const result = await response.json();
            const data = result.data;
            $('#id').val(data.id);
            $('#objective').val(data.objective);
            $('#description').val(data.description);
            const newOption = new Option(data.year_period, data.year_period_id, true, true);
            $('#yearPeriodId').append(newOption).trigger('change');
        } catch (error) {
            displayToast('Error', 'Error fetching objective data', 'error');
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
            const response = await fetch(`${config.siteUrl}master/objective/delete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ id }).toString()
            });

            const result = await response.json();

            if (result.status === 'success') {
                displayToast('Success', 'Your data has been deleted', 'success');
                $('#tableObjective').DataTable().ajax.reload();
            } else {
                displayToast('Error', 'There was an error deleting the data.', 'error');
            }
        } catch (error) {
            displayToast('Error', 'There was an error deleting the data.', 'error');
        }
        toggleBarLoader(null, false);
    }

    function handleFilterButton() {
        $('#filterBtn').on('click', function() {
            const year_period_id = $('#filterYearPeriodId').val();
            $('#tableObjective').DataTable().destroy();
            const dataFilter = {
                year_period_id: year_period_id
            }
            initializeDataTable(dataFilter);
        });
    }

    function handleFormEvents() {
        $('#btnSaveObjective').click(() => $('#formObjective').submit());
        $('#formObjective').submit(event => {
            event.preventDefault();
            if (isSubmitting) return;
            isSubmitting = true;
            
            toggleButtonLoader('#btnSaveObjective', true, { data: '' });
            _.debounce(async () => {
                await setupFormSubmission();
                isSubmitting = false;
                toggleButtonLoader('#btnSaveObjective', false);
            }, 500)();
        });
    }

    async function setupFormSubmission() {
        const formDetails = {
            url: mode === 'modalAddObjective' ? 'master/objective/store' : 'master/objective/update',
            formData: $('#formObjective').serialize()
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
            displayToast('Error', 'Error while submitting data', 'error');
        }
    }

    function handleFormResponse(response) {
        if (response.status === 'success') {
            displayToast('Success', response.message, 'success');
            $('#formObjective').trigger('reset');
            $('#tableObjective').DataTable().ajax.reload();
            $('#modalObjective').modal('hide');
        } else {
            displayToast('Error', response.message, 'error');
            $.each(response.errors, function(key, value) {
                $(`#formObjective`).find(`#error-${key}`).html(value);
            });
        }
    }

    $('#formObjective').on('reset', function() {
        $('#formObjective').find('.error-message').html('');
        $('#formObjective').find('.select2-js-basic').val(null).trigger('change');
        const newOption = new Option('- Choose -', '', true, true);
        $('#formObjective').find('.select2-js-server').append(newOption).trigger('change');
    });

})(jQuery);