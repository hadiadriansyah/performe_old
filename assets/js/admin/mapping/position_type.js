(function($) {
    'use strict';

    let mode;
    let currentSelectedPositions = [];
    let previousSelectedPositions = [];
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
                    url: `${config.siteUrl}mapping/kpi_position_type/get_year_period_options`,
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

        $('#positionType').each(function () {
            $(this).select2({
                theme: 'bootstrap',
                dropdownParent: $(this).parent(),
                ajax: {
                    url: `${config.siteUrl}mapping/kpi_position_type/get_position_type_options`,
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

        $('#groupPositionTypeId').each(function () {
            $(this).select2({
                theme: 'bootstrap',
                dropdownParent: $(this).parent(),
                ajax: {
                    url: `${config.siteUrl}mapping/kpi_position_type/get_kpi_position_type_groups_options`,
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
        $('#positionType').change(async function() {
            const selectedValue = $(this).val();
            isChangingGroupId = false;

            $('#groupPositionTypeId').val(null).trigger('change');

            if (selectedValue) {
                $(`#formMapping`).find(`#error-position_type`).html('');
                await getPositionTypeList(selectedValue);
            } else {
                $(`#formMapping`).find(`#error-position_type`).html('Please select position type first');
                $('#groupPositionTypeId').val('').trigger('change');
                $('#groupPositionContainer').addClass('d-none')
            }
        });

        $('#groupPositionTypeId').change(async function() {
            if (isChangingGroupId) return;
            isChangingGroupId = true;

            const selectedValue = $(this).val();
            const selectedPositionType = $('#positionType').val();

            if (!selectedPositionType) {
                $(`#formMapping`).find(`#error-position_type`).html('Please select position type first');
                $('#groupPositionTypeId').val('').trigger('change');
                isChangingGroupId = false;
                return;
            }
            
            selectedGroupId = selectedValue;
            handleGroupChange(selectedGroupId);

            isChangingGroupId = false;
        });
    }

    async function handleGroupChange(groupPositionTypeId) {
        currentSelectedPositions = [];
        previousSelectedPositions = [];
        
        toggleUpdateButton();
        if (groupPositionTypeId) {
            $('.checkbox').prop('checked', false).prop('disabled', false);
            $('#btnModalEditGroup, #btnModalDeleteGroup').removeClass('d-none');

            await fetchPositionsByGroupId(groupPositionTypeId);
        } else {
            $('.checkbox').prop('checked', false).prop('disabled', true);
            $('#btnModalEditGroup, #btnModalDeleteGroup').addClass('d-none');
        }
    }

    async function fetchPositionsByGroupId(groupPositionTypeId) {
        try {
            const response = await fetch(`${config.siteUrl}mapping/kpi_position_type/get_positions_by_group_position_type_id/${groupPositionTypeId}`, { method: 'GET' });
            const result = await response.json();
            const positions = result.data;

            positions.forEach(position => {
                $(`.checkbox[value="${position.position_id}"]`).prop('checked', true);
                currentSelectedPositions.push(position.position_id);
                previousSelectedPositions.push(position.position_id);
            });
        } catch (error) {
            displayToast('Error', 'Error fetching positions data', 'error');
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
            const response = await fetch(`${config.siteUrl}mapping/kpi_position_type/get_group_by_id/${id}`, { method: 'GET' });
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
            const response = await fetch(`${config.siteUrl}mapping/kpi_position_type/delete_group`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ id }).toString()
            });
            const result = await response.json();

            if (result.status === 'success') {
                displayToast('Success', 'Your data has been deleted', 'success');
                $('#groupPositionTypeId').val('').trigger('change');
            } else {
                displayToast('Error', 'Data could not be deleted. The record is still related to other records', 'error');
            }
        } catch (error) {
            displayToast('Error', 'Data could not be deleted. The record is still related to other records', 'error');
        }
        toggleBarLoader(null, false);
    }

    async function getPositionTypeList(positionType) {
        try {
            const response = await fetch(`${config.siteUrl}mapping/kpi_position_type/get_position_by_position_type`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    position_type: positionType
                }).toString()
            });
            const result = await response.json();
            displayPositionList(result.data);
        } catch (error) {}
    }

    async function displayPositionList(data) {
        const groupPositionContainer = $('#groupPositionContainer');
        groupPositionContainer.empty();
    
        const title = $('<h5>Position List</h5>');
        groupPositionContainer.append(title);
    
        const row = $('<div class="row"></div>');
    
        const selectAllOption = $(`
                                    <div class="col-12 list-wrapper">
                                        <ul>
                                            <li>
                                                <div class="form-check w-100">
                                                    <label class="form-check-label"><input id="selectAll" class="checkbox" type="checkbox" data-bs-toggle="tooltip" data-placement="right" title="Select All" value=""> Select All </label>
                                                </div>
                                                <div class="w-100"></div>
                                                <button type="button" id="btnUpdateSelectedPosition" class="btn btn-inverse-primary d-none">Update</button>
                                            </li>
                                        </ul>
                                    </div>
                                `);
        row.append(selectAllOption);
    
        const column1 = $('<div class="col-6 list-wrapper"><ul></ul></div>');
        const column2 = $('<div class="col-6 list-wrapper"><ul></ul></div>');
    
        data.forEach((position, index) => {
            const checkbox = $(`<input class="checkbox" type="checkbox" data-bs-toggle="tooltip" data-placement="right" title="${position.nm_jabatan}">`).val(position.id);
            const label = $(`<label class="form-check-label"></label>`).text(position.nm_jabatan);
            const formCheck = $(`<div class="form-check"></div>`).append(label.prepend(checkbox));
            const listItem = $(`<li></li>`).append(formCheck);
    
            if (index % 2 === 0) {
                column1.find('ul').append(listItem);
            } else {
                column2.find('ul').append(listItem);
            }
        });
    
        row.append(column1).append(column2);
        groupPositionContainer.append(row);
        groupPositionContainer.removeClass('d-none');
        $(".form-check label,.form-radio label").append('<i class="input-helper"></i>');

        if ($('#groupPositionTypeId').val()) {
            $('.checkbox').prop('disabled', false);
        } else {
            $('.checkbox').prop('disabled', true);
        }

        handleSelectAll();
        handleCheckboxChange();
        $('#btnUpdateSelectedPosition').click(function() {
            updateSelectedPositionsData();
        });
    }

    function handleSelectAll() {
        $('#selectAll').change(function() {
            const checkboxes = $('.checkbox');
            checkboxes.prop('checked', $(this).prop('checked'));
            checkboxes.each(function() {
                updateSelectedPositions($(this).val(), $(this).prop('checked'));
            });
            toggleUpdateButton();
        });
    }

    function handleCheckboxChange() {
        $('.checkbox').change(function() {
            updateSelectedPositions($(this).val(), $(this).prop('checked'));
            if (!$(this).prop('checked')) {
                $('#selectAll').prop('checked', false);
            }
            toggleUpdateButton();
        });
    }

    function updateSelectedPositions(value, isChecked) {
        if (isChecked && value !== '') {
            if (!currentSelectedPositions.includes(value)) {
                currentSelectedPositions.push(value);
            }
        } else {
            currentSelectedPositions = currentSelectedPositions.filter(item => item !== value);
        }
    }

    function toggleUpdateButton() {
        const addedPositions = currentSelectedPositions.filter(position => !previousSelectedPositions.includes(position));
        const removedPositions = previousSelectedPositions.filter(position => !currentSelectedPositions.includes(position));
        if (addedPositions.length > 0 || removedPositions.length > 0) {
            $('#btnUpdateSelectedPosition').removeClass('d-none');
        } else {
            $('#btnUpdateSelectedPosition').addClass('d-none');
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

        $('#btnUpdateSelectedPosition').click(function() {
            updateSelectedPositionsData();
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

    function updateSelectedPositionsData() {
        confirmUpdateSelectedPositions();
    }

    function confirmUpdateSelectedPositions() {
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
            if (willUpdate) doUpdateSelectedPositionsData();
        });
    }

    async function doUpdateSelectedPositionsData() {
        toggleBarLoader(null, true);
        try {
            const addedPositions = currentSelectedPositions.filter(position => !previousSelectedPositions.includes(position));
            const removedPositions = previousSelectedPositions.filter(position => !currentSelectedPositions.includes(position));
            
            const response = await fetch(`${config.siteUrl}mapping/kpi_position_type/update_selected_positions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    group_position_type_id: $('#groupPositionTypeId').val(),
                    added_positions: JSON.stringify(addedPositions),
                    removed_positions: JSON.stringify(removedPositions)
                }).toString()
            });
            const result = await response.json();
            if (result.status === 'success') {
                displayToast('Success', 'Selected positions updated successfully', 'success');
                
                previousSelectedPositions = [...currentSelectedPositions];
            } else {
                displayToast('Error', 'Failed to update selected positions', 'error');
            }
        } catch (error) {
            displayToast('Error', 'An error occurred while updating selected positions', 'error');
        }
        toggleBarLoader(null, false);
    }

    async function setupFormSubmission() {
        let formData;
        let url;
        if (mode === 'modalAddGroup') {
            url = 'mapping/kpi_position_type/store_group';
            formData = new URLSearchParams(new FormData($('#formGroup')[0]));
        } else if (mode === 'modalEditGroup') {
            url = 'mapping/kpi_position_type/update_group';
            formData = new URLSearchParams(new FormData($('#formGroup')[0]));
        } else {
            const selectedPositionType = $(`#positionType`).find('option:selected');
            const selectedPositionTypeName = selectedPositionType.text();
            const selectedYearPeriodId = $(`#yearPeriodId`).find('option:selected');
            const selectedYearPeriodName = selectedYearPeriodId.text();
            const selectedGroupId = $(`#groupPositionTypeId`).find('option:selected');
            const selectedGroupName = selectedGroupId.text();
            
            url = 'mapping/kpi_position_type/mapping_data';

            formData = new URLSearchParams(new FormData($('#formMapping')[0]));
            formData.append('position_type_name', selectedPositionTypeName);
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
                $('#groupPositionTypeId').empty();
                const newOption = new Option('- Choose -', '', true, true);
                $('#groupPositionTypeId').append(newOption).trigger('change');
                mode = '';
            } else {
                displayToast('Success', response.message + ', generate to KPI page...', 'success');
                setTimeout(() => {
                    window.location.href = `${config.siteUrl}mapping/kpi_position_type/kpi?data=${response.data.encrypted_data}`;
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