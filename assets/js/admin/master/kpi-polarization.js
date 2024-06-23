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
        setupPolarizationChange();
        handleFilterButton();
        handleFormEvents();
    }

    function initializeDataTable(dataFilter = {}) {
        const table = $('#tablePolarization').DataTable({
            processing: true,
            serverSide: true,
            order: [],
            ajax: {
                url: `${config.siteUrl}master/kpi_polarization/data_server`,
                type: "POST",
                data: Object.keys(dataFilter).length ? dataFilter : {},
            },
            columns: [
                { data: "no", className: "text-center", orderable: false, searchable: false },
                { data: "polarization", className: "text-left" },
                // { data: "formula", className: "text-left" },
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
                //         <button type="button" class="btn btn-inverse-primary btn-icon-text btn-modal" data-bs-toggle="modal" data-bs-target="#modalPolarization" data-mode="modalViewPolarization" data-id="${row.id}"> Edit <i class="mdi mdi-eye btn-icon-append"></i></button>`
                // },
                {
                    targets: -1,
                    data: "id",
                    render: (data, type, row) => `
                        <button type="button" class="btn btn-gradient-dark btn-icon-text btn-modal" data-bs-toggle="modal" data-bs-target="#modalPolarization" data-mode="modalEditPolarization" data-id="${row.id}"> Edit <i class="mdi mdi-file-check btn-icon-append"></i></button>
                        <button type="button" class="btn btn-gradient-danger btn-icon-text btn-delete" data-mode="modalDeletePolarization" data-id="${row.id}"> Delete <i class="mdi mdi-delete btn-icon-append"></i></button>`
                }
            ]
        });
    }

    function customizeDataTableUI() {
        $('#tablePolarization').each(function() {
            const datatable = $(this);
            const searchInput = datatable.closest('#tablePolarization_wrapper').find('div[class="dt-search"] input');
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
                    url: `${config.siteUrl}master/kpi_polarization/get_year_period_options`,
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
            
            $('#modalLabelPolarization').text(mode === 'modalAddPolarization' ? 'Add Polarization' : (mode === 'modalEditPolarization' ? 'Edit Polarization' : 'View Polarization'));

            if (mode === 'modalEditPolarization' || mode === 'modalViewPolarization') {
                fetchPolarizationData(id);
                $('.code').toggleClass('d-none', mode !== 'modalViewPolarization');
                $('.code-button').toggleClass('d-none', mode === 'modalViewPolarization');
            } else if (mode === 'modalAddPolarization') {
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

        $('#modalPolarization').on('shown.bs.modal', () => {
            if (mode === 'modalAddPolarization') {
                // $('.minimize-form, .absolute-form, .stabilize-form').addClass('d-none');
            }
        });     

        $('#modalPolarization').on('hidden.bs.modal', () => {
            if (mode === 'modalEditPolarization') {
                $('#formPolarization').trigger('reset');
            }
        });
    }

    async function fetchPolarizationData(id) {
        try {
            const response = await fetch(`${config.siteUrl}master/kpi_polarization/get_by_id/${id}`, { method: 'GET' });
            const result = await response.json();
            const data = result.data;
            $('#id').val(data.id);
            const polarizationParts = data.polarization.split('_');
            const selectedValue = polarizationParts[0];
            const remainingText = polarizationParts.slice(1).join('_');
            $("#polarizationType").val(selectedValue).trigger('change');
            $('#polarizationText').val(remainingText);
            for (const [key, value] of Object.entries(data.formula)) {
                console.log(snakeToCamel(key), value)
                $(`#${snakeToCamel(key)}`).val(value).trigger('change');
            }
            $('#description').val(data.description);
            const newOption = new Option(data.year_period, data.year_period_id, true, true);
            $('#yearPeriodId').append(newOption).trigger('change');

            const forms = {
                'Minimize': '.minimize-form',
                'Absolute': '.absolute-form',
                'Stabilize': '.stabilize-form'
            };
            $(forms[selectedValue]).removeClass('d-none');
        } catch (error) {
            displayToast('Error', 'Error fetching perspective data', 'error');
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
            const response = await fetch(`${config.siteUrl}master/kpi_polarization/delete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ id }).toString()
            });

            const result = await response.json();

            if (result.status === 'success') {
                displayToast('Success', 'Your data has been deleted', 'success');
                $('#tablePolarization').DataTable().ajax.reload();
            } else {
                displayToast('Error', 'Data could not be deleted. The record is still related to other records', 'error');
            }
        } catch (error) {
            displayToast('Error', 'Data could not be deleted. The record is still related to other records', 'error');
        }
        toggleBarLoader(null, false);
    }

    function setupPolarizationChange() {
        $('#polarizationType').change(function() {
            const selectedValue = $(this).val();
            $('.minimize-form, .absolute-form, .stabilize-form').addClass('d-none');
            const forms = {
                'Minimize': '.minimize-form',
                'Absolute': '.absolute-form',
                'Stabilize': '.stabilize-form'
            };
            $(forms[selectedValue]).removeClass('d-none');

            if (mode != 'modalEditPolarization' && mode != 'modalViewPolarization') {
                if (selectedValue === 'Minimize') {
                    $('#minOpr1').val('>=').trigger('change');
                    $('#minOpr2').val('>').trigger('change');
                } else if (selectedValue === 'Absolute') {
                    $('#absOpr1').val('==').trigger('change');
                    $('#absOpr2').val('>').trigger('change');
                } else if (selectedValue === 'Stabilize') {
                    $('#stabOpr1Target').val('<').trigger('change');
                    $('#stabOpr2Target').val('>=').trigger('change');
                }
            }
        });
    }

    function handleFilterButton() {
        $('#filterBtn').on('click', function() {
            const year_period_id = $('#filterYearPeriodId').val();
            $('#tablePolarization').DataTable().destroy();
            const dataFilter = {
                year_period_id: year_period_id
            }
            initializeDataTable(dataFilter);
        });
    }

    function handleFormEvents() {
        $('#btnSavePolarization').click(() => $('#formPolarization').submit());
        $('#formPolarization').submit(event => {
            event.preventDefault();
            if (isSubmitting) return;
            isSubmitting = true;
            
            toggleButtonLoader('#btnSavePolarization', true, { data: '' });
            _.debounce(async () => {
                if (mode === 'modalAddPolarization' || mode === 'modalEditPolarization') {
                    await setupFormSubmission();
                }
                isSubmitting = false;
                toggleButtonLoader('#btnSavePolarization', false);
            }, 500)();
        });
    }

    async function setupFormSubmission() {
        const formDetails = {
            url: mode === 'modalAddPolarization' ? 'master/kpi_polarization/store' : 'master/kpi_polarization/update',
            formData: $('#formPolarization').serialize()
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
            $('#formPolarization').trigger('reset');
            $('#tablePolarization').DataTable().ajax.reload();
            $('#modalPolarization').modal('hide');
        } else {
            displayToast('Error', response.message, 'error');
            $.each(response.errors, function(key, value) {
                $(`#formPolarization`).find(`#error-${key}`).html(value);
            });
        }
    }

    $('#formPolarization').on('reset', function() {
        $('.error-message').html('');
        $('.select2-js-basic').val(null).trigger('change');
        const newOption = new Option('- Choose -', '', true, true);
        $('.select2-js-server').append(newOption).trigger('change');
    });

    function snakeToCamel(string) {
        return string.toLowerCase().split('_').map((word, index) => {
            if (index === 0) {
                return word;
            }
            return word.charAt(0).toUpperCase() + word.slice(1);
        }).join('');
    }

})(jQuery);