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
        const table = $('#tableDirectorate').DataTable({
            processing: true,
            serverSide: true,
            order: [],
            ajax: {
                url: `${config.siteUrl}master/directorate/data_server`,
                type: "POST",
                data: Object.keys(dataFilter).length ? dataFilter : {},
            },
            columns: [
                { data: "no", className: "text-center", orderable: false, searchable: false },
                { data: "directorate", className: "text-left" },
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
                        <button type="button" class="btn btn-gradient-dark btn-icon-text btn-modal" data-bs-toggle="modal" data-bs-target="#modalDirectorate" data-mode="modalEditDirectorate" data-id="${row.id}"> Edit <i class="mdi mdi-file-check btn-icon-append"></i></button>
                        <button type="button" class="btn btn-gradient-danger btn-icon-text btn-delete" data-mode="modalDeleteDirectorate" data-id="${row.id}"> Delete <i class="mdi mdi-delete btn-icon-append"></i></button>`
                }
            ]
        });
    }

    function customizeDataTableUI() {
        $('#tableDirectorate').each(function() {
            const datatable = $(this);
            const searchInput = datatable.closest('#tableDirectorate_wrapper').find('div[class="dt-search"] input');
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
                    url: `${config.siteUrl}master/directorate/get_year_period_options`,
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
            
            $('#modalLabelDirectorate').text(mode === 'modalAddDirectorate' ? 'Add Directorate' : 'Edit Directorate');

            if (mode === 'modalEditDirectorate') {
                fetchDirectorateData(id);
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

        $('#modalDirectorate').on('shown.bs.modal', () => {});     

        $('#modalDirectorate').on('hidden.bs.modal', () => {
            if (mode === 'modalEditDirectorate') {
                $('#formDirectorate').trigger('reset');
            }
        });
    }

    async function fetchDirectorateData(id) {
        try {
            const response = await fetch(`${config.siteUrl}master/directorate/get_by_id/${id}`, { method: 'GET' });
            const result = await response.json();
            const data = result.data;
            $('#id').val(data.id);
            $('#directorate').val(data.directorate);
            $('#description').val(data.description);
            const newOption = new Option(data.year_period, data.year_period_id, true, true);
            $('#yearPeriodId').append(newOption).trigger('change');
        } catch (error) {
            displayToast('Error', 'Error fetching directorate data', 'error');
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
            const response = await fetch(`${config.siteUrl}master/directorate/delete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ id }).toString()
            });

            const result = await response.json();

            if (result.status === 'success') {
                displayToast('Success', 'Your data has been deleted', 'success');
                $('#tableDirectorate').DataTable().ajax.reload();
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
            $('#tableDirectorate').DataTable().destroy();
            const dataFilter = {
                year_period_id: year_period_id
            }
            initializeDataTable(dataFilter);
        });
    }

    function handleFormEvents() {
        $('#btnSaveDirectorate').click(() => $('#formDirectorate').submit());
        $('#formDirectorate').submit(event => {
            event.preventDefault();
            if (isSubmitting) return;
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
        const formDetails = {
            url: mode === 'modalAddDirectorate' ? 'master/directorate/store' : 'master/directorate/update',
            formData: $('#formDirectorate').serialize()
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
            $('#formDirectorate').trigger('reset');
            $('#tableDirectorate').DataTable().ajax.reload();
            $('#modalDirectorate').modal('hide');
        } else {
            displayToast('Error', response.message, 'error');
            $.each(response.errors, function(key, value) {
                $(`#formDirectorate`).find(`#error-${key}`).html(value);
            });
        }
    }

    $('#formDirectorate').on('reset', function() {
        $('#formDirectorate').find('.error-message').html('');
        $('#formDirectorate').find('.select2-js-basic').val(null).trigger('change');
        const newOption = new Option('- Choose -', '', true, true);
        $('#formDirectorate').find('.select2-js-server').append(newOption).trigger('change');
    });

})(jQuery);