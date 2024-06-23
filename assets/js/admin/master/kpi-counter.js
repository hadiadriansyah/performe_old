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
        const table = $('#tableCounter').DataTable({
            processing: true,
            serverSide: true,
            order: [],
            ajax: {
                url: `${config.siteUrl}master/kpi_counter/data_server`,
                type: "POST",
                data: Object.keys(dataFilter).length ? dataFilter : {},
            },
            columns: [
                { data: "no", className: "text-center", orderable: false, searchable: false },
                { data: "counter", className: "text-left" },
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
                // {
                //     targets: 2,
                //     data: "formula",
                //     render: (data, type, row) => `
                //         <button type="button" class="btn btn-inverse-primary btn-icon-text btn-modal" data-bs-toggle="modal" data-bs-target="#modalCounter" data-mode="modalViewCounter" data-id="${row.id}"> Edit <i class="mdi mdi-eye btn-icon-append"></i></button>`
                // },
                {
                    targets: -1,
                    data: "id",
                    render: (data, type, row) => `
                        <button type="button" class="btn btn-gradient-dark btn-icon-text btn-modal" data-bs-toggle="modal" data-bs-target="#modalCounter" data-mode="modalEditCounter" data-id="${row.id}"> Edit <i class="mdi mdi-file-check btn-icon-append"></i></button>
                        <button type="button" class="btn btn-gradient-danger btn-icon-text btn-delete" data-mode="modalDeleteCounter" data-id="${row.id}"> Delete <i class="mdi mdi-delete btn-icon-append"></i></button>`
                }
            ]
        });
    }

    function customizeDataTableUI() {
        $('#tableCounter').each(function() {
            const datatable = $(this);
            const searchInput = datatable.closest('#tableCounter_wrapper').find('div[class="dt-search"] input');
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
                    url: `${config.siteUrl}master/kpi_counter/get_year_period_options`,
                    dataType: 'json',
                    delay: 250,
                    data: params => ({
                        q: params.term || '',
                        page: params.page || 1
                    }),
                    processResults: (data, params) => ({
                        results: data.items,
                        pagination: {
                            more: (params.page * 10) < data.total_count
                        }
                    }),
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
            
            $('#modalLabelCounter').text(mode === 'modalAddCounter' ? 'Add Counter' : (mode === 'modalEditCounter' ? 'Edit Counter' : 'View Counter'));

            if (mode === 'modalEditCounter' || mode === 'modalViewCounter') {
                fetchCounterData(id);
                $('.code').toggleClass('d-none', mode !== 'modalViewCounter');
                $('.code-button').toggleClass('d-none', mode === 'modalViewCounter');
            } else if (mode === 'modalAddCounter') {
                $('.code').addClass('d-none');
                $('.code-button').removeClass('d-none');
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

        $('#modalCounter').on('shown.bs.modal', () => {});     

        $('#modalCounter').on('hidden.bs.modal', () => {
            if (mode === 'modalEditCounter') {
                $('#formCounter').trigger('reset');
            }
        });
    }

    async function fetchCounterData(id) {
        try {
            const response = await fetch(`${config.siteUrl}master/kpi_counter/get_by_id/${id}`, { method: 'GET' });
            const result = await response.json();
            const data = result.data;
            $('#id').val(data.id);
            const counterParts = data.counter.split('_');
            const selectedValue = counterParts[0];
            const remainingText = counterParts.slice(1).join('_');
            $("#counterType").val(selectedValue).trigger('change');
            $('#counterText').val(remainingText);
            $('#description').val(data.description);
            const newOption = new Option(data.year_period, data.year_period_id, true, true);
            $('#yearPeriodId').append(newOption).trigger('change');
        } catch (error) {
            displayToast('Error', 'Error fetching counter data', 'error');
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
            const response = await fetch(`${config.siteUrl}master/kpi_counter/delete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ id }).toString()
            });

            const result = await response.json();

            if (result.status === 'success') {
                displayToast('Success', 'Your data has been deleted', 'success');
                $('#tableCounter').DataTable().ajax.reload();
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
            const year_period_id = $('#filterYearPeriodId').val();
            $('#tableCounter').DataTable().destroy();
            const dataFilter = {
                year_period_id: year_period_id
            }
            initializeDataTable(dataFilter);
        });
    }

    function handleFormEvents() {
        $('#btnSaveCounter').click(() => $('#formCounter').submit());
        $('#formCounter').submit(event => {
            event.preventDefault();
            if (isSubmitting) return;
            isSubmitting = true;
            
            toggleButtonLoader('#btnSaveCounter', true, { data: '' });
            _.debounce(async () => {
                if (mode === 'modalAddCounter' || mode === 'modalEditCounter') {
                    await setupFormSubmission();
                }
                isSubmitting = false;
                toggleButtonLoader('#btnSaveCounter', false);
            }, 500)();
        });
    }

    async function setupFormSubmission() {
        const formDetails = {
            url: mode === 'modalAddCounter' ? 'master/kpi_counter/store' : 'master/kpi_counter/update',
            formData: $('#formCounter').serialize()
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
            $('#formCounter').trigger('reset');
            $('#tableCounter').DataTable().ajax.reload();
            $('#modalCounter').modal('hide');
        } else {
            displayToast('Error', response.message, 'error');
            $.each(response.errors, function(key, value) {
                $(`#formCounter`).find(`#error-${key}`).html(value);
            });
        }
    }

    $('#formCounter').on('reset', function() {
        $('.error-message').html('');
        $('.select2-js-basic').val(null).trigger('change');
        const newOption = new Option('- Choose -', '', true, true);
        $('.select2-js-server').append(newOption).trigger('change');
    });

})(jQuery);