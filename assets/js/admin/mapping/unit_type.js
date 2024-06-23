(function($) {
    'use strict';

    let mode;
    let currentSelectedUnits = [];
    let previousSelectedUnits = [];
    let selectedGroupId = null;
    let isSubmitting = false;
    let isChangingGroupId = false; 

    $(initializePage);

    function initializePage() {
        initializeSelect2();
        initializeModalButton();
        handleFormEvents();
        $('[data-bs-toggle="tooltip"]').tooltip();
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
                    url: `${config.siteUrl}mapping/kpi_unit_type/get_year_period_options`,
                    dataType: 'json',
                    delay: 250,
                    data: params => ({
                        q: params.term || '',
                        page: params.page || 1
                    }),
                    processResults: (data, params) => ({
                        results: data.data.items,
                        pagination: {
                            more: (params.page * 10) < data.total_count
                        }
                    }),
                    cache: true
                },
                minimumInputLength: 0
            });
        })

        $('#groupId').each(function () {
            $(this).select2({
                theme: 'bootstrap',
                dropdownParent: $(this).parent(),
                ajax: {
                    url: `${config.siteUrl}mapping/kpi_unit_type/get_kpi_unit_type_groups_options`,
                    dataType: 'json',
                    delay: 250,
                    data: params => ({
                        q: params.term || '',
                        page: params.page || 1
                    }),
                    processResults: (data, params) => ({
                        results: data.data.items,
                        pagination: {
                            more: (params.page * 10) < data.total_count
                        }
                    }),
                    cache: true
                },
                minimumInputLength: 0
            });
        })
        $('#unitType').change(async function() {
            const selectedValue = $(this).val();
            isChangingGroupId = false;

            $('#groupId').val('').trigger('change');

            if (selectedValue) {
                $(`#formMapping`).find(`#error-unit_type`).html('');
                await getUnitTypeList(selectedValue);
            } else {
                $(`#formMapping`).find(`#error-unit_type`).html('Please select unit type first');
                $('#groupId').val('').trigger('change');
                $('#groupUnitContainer').addClass('d-none')
            }
        });

        $('#groupId').change(async function() {
            if (isChangingGroupId) return;
            isChangingGroupId = true;

            const selectedValue = $(this).val();
            const selectedUnitType = $('#unitType').val();

            if (!selectedUnitType) {
                $(`#formMapping`).find(`#error-unit_type`).html('Please select unit type first');
                $('#groupId').val('').trigger('change');
                isChangingGroupId = false;
                return;
            }
            
            selectedGroupId = selectedValue;
            handleGroupChange(selectedGroupId);

            isChangingGroupId = false;
        });
    }

    async function handleGroupChange(groupId) {
        currentSelectedUnits = [];
        previousSelectedUnits = [];
        
        toggleUpdateButton();
        if (groupId) {
            $('.checkbox').prop('checked', false).prop('disabled', false);
            $('#btnModalEditGroup, #btnModalDeleteGroup').removeClass('d-none');

            await fetchUnitsByGroupId(groupId);
        } else {
            $('.checkbox').prop('checked', false).prop('disabled', true);
            $('#btnModalEditGroup, #btnModalDeleteGroup').addClass('d-none');
        }
    }

    async function fetchUnitsByGroupId(groupId) {
        try {
            const response = await fetch(`${config.siteUrl}mapping/kpi_unit_type/get_units_by_group_id/${groupId}`, { method: 'GET' });
            const result = await response.json();
            const units = result.data;

            units.forEach(unit => {
                $(`.checkbox[value="${unit.unit_id}"]`).prop('checked', true);
                currentSelectedUnits.push(unit.unit_id);
                previousSelectedUnits.push(unit.unit_id);
            });
        } catch (error) {
            displayToast('Error', 'Error fetching units data', 'error');
        }
        
    }

    function initializeModalButton() {
        $(document).on('click', '#btnModalAddGroup', function() {
            mode = $(this).data('mode');
            $('#modalLabelAddEditGroup').text('Add Group');
        });

        $(document).on('click', '#btnModalEditGroup', function() {
            mode = $(this).data('mode');
            if (!selectedGroupId) {
                displayToast('Danger', 'ID not found or is invalid.', 'error');
                return;
            }
            $('#modalLabelAddEditGroup').text('Edit Group');
            fetchGroupData(selectedGroupId);
        });

        $(document).on('click', '#btnModalDeleteGroup', function() {
            if (!selectedGroupId) {
                displayToast('Danger', 'ID not found or is invalid.', 'error');
                return;
            }
            
            confirmDeletion(selectedGroupId);
        });

        $('#modalPerspective').on('shown.bs.modal', () => {});     

        $('#modalPerspective').on('hidden.bs.modal', () => {
            if (mode === 'modalEditPerspective') {
                $('#formPerspective').trigger('reset');
            }
        });
    }

    async function fetchGroupData(id) {
        try {
            const response = await fetch(`${config.siteUrl}mapping/kpi_unit_type/get_group_by_id/${id}`, { method: 'GET' });
            const result = await response.json();
            const data = result.data;
            $('#id').val(data.id);
            $('#groupType').val(data.group_type);
            $('#description').val(data.description);
        } catch (error) {
            displayToast('Error', 'Error fetching group data', 'error');
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
            const response = await fetch(`${config.siteUrl}mapping/kpi_unit_type/delete_group`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ id }).toString()
            });
            const result = await response.json();

            if (result.status === 'success') {
                displayToast('Success', 'Your data has been deleted', 'success');
                $('#groupId').val('').trigger('change');
            } else {
                displayToast('Error', 'Data could not be deleted. The record is still related to other records', 'error');
            }
        } catch (error) {
            displayToast('Error', 'Data could not be deleted. The record is still related to other records', 'error');
        }
        toggleBarLoader(null, false);
    }

    async function getUnitTypeList(unitType) {
        try {
            const response = await fetch(`${config.siteUrl}mapping/kpi_unit_type/get_unit_by_unit_type`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    unit_type: unitType
                }).toString()
            });
            const result = await response.json();
            displayUnitList(result.data);
        } catch (error) {}
    }

    async function displayUnitList(data) {
        const groupUnitContainer = $('#groupUnitContainer');
        groupUnitContainer.empty();
    
        const title = $('<h5>Unit List</h5>');
        groupUnitContainer.append(title);
    
        const row = $('<div class="row"></div>');
    
        const selectAllOption = $(`
                                    <div class="col-12 list-wrapper">
                                        <ul>
                                            <li>
                                                <div class="form-check w-100">
                                                    <label class="form-check-label"><input id="selectAll" class="checkbox" type="checkbox" data-bs-toggle="tooltip" data-placement="right" title="Select All" value=""> Select All </label>
                                                </div>
                                                <div class="w-100"></div>
                                                <button type="button" id="btnUpdateSelectedUnit" class="btn btn-inverse-primary d-none">Update</button>
                                            </li>
                                        </ul>
                                    </div>
                                `);
        row.append(selectAllOption);
    
        const column1 = $('<div class="col-6 list-wrapper"><ul></ul></div>');
        const column2 = $('<div class="col-6 list-wrapper"><ul></ul></div>');
    
        data.forEach((unit, index) => {
            const checkbox = $(`<input class="checkbox" type="checkbox" data-bs-toggle="tooltip" data-placement="right" title="${unit.nm_unit_kerja}">`).val(unit.id);
            const label = $(`<label class="form-check-label"></label>`).text(unit.nm_unit_kerja);
            const formCheck = $(`<div class="form-check"></div>`).append(label.prepend(checkbox));
            const listItem = $(`<li></li>`).append(formCheck);
    
            if (index % 2 === 0) {
                column1.find('ul').append(listItem);
            } else {
                column2.find('ul').append(listItem);
            }
        });
    
        row.append(column1).append(column2);
        groupUnitContainer.append(row);
        groupUnitContainer.removeClass('d-none');
        $(".form-check label,.form-radio label").append('<i class="input-helper"></i>');

        if ($('#groupId').val()) {
            $('.checkbox').prop('disabled', false);
        } else {
            $('.checkbox').prop('disabled', true);
        }

        handleSelectAll();
        handleCheckboxChange();
        $('#btnUpdateSelectedUnit').click(function() {
            updateSelectedUnitsData();
        });
    }

    function handleSelectAll() {
        $('#selectAll').change(function() {
            const checkboxes = $('.checkbox');
            checkboxes.prop('checked', $(this).prop('checked'));
            checkboxes.each(function() {
                updateSelectedUnits($(this).val(), $(this).prop('checked'));
            });
            toggleUpdateButton();
        });
    }

    function handleCheckboxChange() {
        $('.checkbox').change(function() {
            updateSelectedUnits($(this).val(), $(this).prop('checked'));
            if (!$(this).prop('checked')) {
                $('#selectAll').prop('checked', false);
            }
            toggleUpdateButton();
        });
    }

    function updateSelectedUnits(value, isChecked) {
        if (isChecked && value !== '') {
            if (!currentSelectedUnits.includes(value)) {
                currentSelectedUnits.push(value);
            }
        } else {
            currentSelectedUnits = currentSelectedUnits.filter(item => item !== value);
        }
    }

    function toggleUpdateButton() {
        const addedUnits = currentSelectedUnits.filter(unit => !previousSelectedUnits.includes(unit));
        const removedUnits = previousSelectedUnits.filter(unit => !currentSelectedUnits.includes(unit));
        if (addedUnits.length > 0 || removedUnits.length > 0) {
            $('#btnUpdateSelectedUnit').removeClass('d-none');
        } else {
            $('#btnUpdateSelectedUnit').addClass('d-none');
        }
    }

    function handleFormEvents() {
        $('#btnSaveGroup').click(() => $('#formGroup').submit());
        $('#formGroup').submit(event => {
            event.preventDefault();
            if (isSubmitting) return;
            isSubmitting = true;
            
            toggleButtonLoader('#btnSaveGroup', true, { data: '' });
            _.debounce(async () => {
                await setupFormSubmission();
                isSubmitting = false;
                toggleButtonLoader('#btnSaveGroup', false);
            }, 500)();
        });

        $('#btnUpdateSelectedUnit').click(function() {
            updateSelectedUnitsData();
        });

        $('#btnSubmit').click(() => $('#formMapping').submit());
        $('#formMapping').submit(event => {
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

    function updateSelectedUnitsData() {
        confirmUpdateSelectedUnits();
    }

    function confirmUpdateSelectedUnits() {
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
        }).then(willUpdate => {
            if (willUpdate) doUpdateSelectedUnitsData();
        });
    }

    async function doUpdateSelectedUnitsData() {
        toggleBarLoader(null, true);
        try {
            const addedUnits = currentSelectedUnits.filter(unit => !previousSelectedUnits.includes(unit));
            const removedUnits = previousSelectedUnits.filter(unit => !currentSelectedUnits.includes(unit));
            
            const response = await fetch(`${config.siteUrl}mapping/kpi_unit_type/update_selected_units`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    group_id: $('#groupId').val(),
                    added_units: JSON.stringify(addedUnits),
                    removed_units: JSON.stringify(removedUnits)
                }).toString()
            });
            const result = await response.json();
            if (result.status === 'success') {
                displayToast('Success', 'Selected units updated successfully', 'success');
                
                previousSelectedUnits = [...currentSelectedUnits];
            } else {
                displayToast('Error', 'Failed to update selected units', 'error');
            }
        } catch (error) {
            displayToast('Error', 'An error occurred while updating selected units', 'error');
        }
        toggleBarLoader(null, false);
    }

    async function setupFormSubmission() {
        let formData;
        let url;
        if (mode === 'modalAddGroup') {
            url = 'mapping/kpi_unit_type/store_group';
            formData = new URLSearchParams(new FormData($('#formGroup')[0]));
        } else if (mode === 'modalEditGroup') {
            url = 'mapping/kpi_unit_type/update_group';
            formData = new URLSearchParams(new FormData($('#formGroup')[0]));
        } else {
            const selectedUnitType = $(`#unitType`).find('option:selected');
            const selectedUnitTypeName = selectedUnitType.text();
            const selectedYearPeriodId = $(`#yearPeriodId`).find('option:selected');
            const selectedYearPeriodName = selectedYearPeriodId.text();
            const selectedGroupId = $(`#groupId`).find('option:selected');
            const selectedGroupName = selectedGroupId.text();
            
            url = 'mapping/kpi_unit_type/mapping_data';

            formData = new URLSearchParams(new FormData($('#formMapping')[0]));
            formData.append('unit_type_name', selectedUnitTypeName);
            formData.append('year_period_name', selectedYearPeriodName);
            formData.append('group_name', selectedGroupName);
        }

        const formDetails = {
            url: url,
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
            if (mode === 'modalAddGroup' || mode === 'modalEditGroup') {
                displayToast('Success', response.message, 'success');
                $('#formGroup').trigger('reset');
                $('#modalGroup').modal('hide');
                mode = '';
            } else {
                displayToast('Success', response.message + ', generate to KPI page...', 'success');
                setTimeout(() => {
                    window.location.href = `${config.siteUrl}mapping/kpi_unit_type/kpi?data=${response.data.encrypted_data}`;
                }, 1000);
            }
        } else {
            displayToast('Error', response.message, 'error');
            if (mode === 'modalAddGroup' || mode === 'modalEditGroup') {
                $.each(response.errors, function(key, value) {
                    $(`#formGroup`).find(`#error-${key}`).html(value);
                });
            } else {
                $.each(response.errors, function(key, value) {
                    $(`#formMapping`).find(`#error-${key}`).html(value);
                });
            }
        }
    }

    $('#formGroup').on('reset', function() {
        $(`#formGroup`).find('.error-message').html('');
    });
})(jQuery);