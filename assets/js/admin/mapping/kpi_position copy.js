(function($) {
    'use strict';

    let mode;
    let isSubmitting = false;
    const kpiPositionYearPeriodId = getkpiPositionYearPeriodIdVal();
    const kpiPositionPosition = getKpiPositionPositionVal();
    const kpiPositionGroupId = getKpiPositionGroupIdVal();
    let dataKpi = [];
    let dataKpiBeforeEdit = []
    const newItemKPI = {
        perspective_id: null,
        perspective: null,
        is_submit: 0,
        total_weight_perspective: 0,
        objective_detail: [{
            objective_id: null,
            objective: null,
            kpi_detail: [{
                id: null,
                perspective_id: null,
                objective_id: null,
                kpi_id: null,
                weight: 0,
                score: 0,
                mode: ''
            }],
            total_weight: 0
        }]
    };
    let kpiIsSubmit = 0;

    $(initializePage);

    async function initializePage() {
        initializeData();
        toggleSubmitButton();
        setupPercentage();
        initializeSelect2();
        initializeModalButton();
        handleFormEvents();
    }

    function getkpiPositionYearPeriodIdVal() {
        return $('#kpiPositionYearPeriodId').val();
    }
    
    function getKpiPositionPositionVal() {
        return $('#kpiPositionPosition').val();
    }

    function getKpiPositionGroupIdVal() {
        return $('#kpiPositionGroupId').val();
    }

    function setupPercentage() {
        $('#percentageInput').on('input', function() {
            const percentage = $(this).val();
            $('.btn-submit-kpi').prop('disabled', percentage < 100);
        });
    }

    function updatePercentage(percentage = 0) {
        $('#percentage').text(percentage + ' %');
        $('#percentageInput').val(percentage).trigger('input');
    }

    async function initializeData() {
        if (kpiPositionPosition && kpiPositionYearPeriodId && kpiPositionGroupId) {
            try {
                const response = await fetch(`${config.siteUrl}mapping/kpi_position/get_kpi_position`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({
                        position: kpiPositionPosition,
                        year_period_id: kpiPositionYearPeriodId,
                        group_id: kpiPositionGroupId,
                    }).toString()
                });
                const result = await response.json();
                const data = result.data;
                if (data.length > 0) {
                    $('#createKPI').addClass('d-none');
                    dataKpi = await processKpiData(data);
                    const totalWeightSum = dataKpi.reduce((sum, item) => sum + parseFloat(item.total_weight_perspective), 0);
                    updatePercentage(totalWeightSum);
                    renderKPI();
                } else {
                    $('#createKPI').removeClass('d-none');
                }
            } catch (error) {
                displayToast('Error', 'Error fetching KPI', 'error');
            }
        }
    }

    function toggleSubmitButton() {
        if (kpiIsSubmit == 1) {
            $('.is-submit-kpi').addClass('d-none');
            $('.btn-cancel-generate-submit-kpi').removeClass('d-none');
        } else {
            $('.is-submit-kpi').removeClass('d-none');
            $('.btn-cancel-generate-submit-kpi').addClass('d-none');
        }
    }

    async function processKpiData(data) {
        const groupedData = data.reduce((acc, item) => {
            const perspective = item.perspective_id;
            const objective = item.objective_id;

            if (!acc[perspective]) {
                acc[perspective] = {
                    perspective_id: item.perspective_id,
                    perspective: item.perspective,
                    is_submit: item.is_submit,
                    total_weight_perspective: 0,
                    objective_detail: []
                };
            }

            let objectiveDetail = acc[perspective].objective_detail.find(obj => obj.objective_id === objective);
            if (!objectiveDetail) {
                objectiveDetail = {
                    objective_id: item.objective_id,
                    objective: item.objective,
                    kpi_detail: [],
                    total_weight: 0
                };
                acc[perspective].objective_detail.push(objectiveDetail);
            }

            objectiveDetail.kpi_detail.push({
                id: item.id,
                perspective_id: item.perspective_id,
                objective_id: item.objective_id,
                kpi_id: item.kpi_id,
                weight: item.weight,
                score: item.score,
                mode: null
            });

            objectiveDetail.total_weight += parseFloat(item.weight);
            acc[perspective].total_weight_perspective += parseFloat(item.weight);
            kpiIsSubmit = item.is_submit;
            return acc;
        }, {});

        return Object.values(groupedData);
    }

    function renderKPI() {
        if (dataKpi.length === 0) return;
    
        let kpis = [];
        let html = '';
    
        dataKpi.forEach(perspective => {
            html += `
                <div class="row mb-3 mt-3">
                    <div class="col-md-12">
                        <div class="card">
                            <div class="card-header bg-info text-white d-flex justify-content-between align-items-center">
                                <h5>${perspective.perspective}</h5>
                                <span class="badge bg-danger" id="totalWeight-${perspective.perspective_id}">${perspective.total_weight_perspective} %</span>
                            </div>
                            <div class="card-body px-3 py-3">
            `;
    
            perspective.objective_detail.forEach(objective => {
                html += `
                    <div class="row my-3">
                        <div class="col-md-12 d-flex justify-content-between align-items-center">
                            <label class="form-label">${objective.objective}</label>
                        </div>
                    </div>
                    <div class="table-responsive pb-2">
                        <table class="table table-hover">
                            <thead class="table-light">
                                <tr>
                                    <th>No</th>
                                    <th>KPI</th>
                                    <th>Measure</th>
                                    <th>Target</th>
                                    <th>Actual</th>
                                    <th>Counter</th>
                                    <th>Polarization</th>
                                    <th>Index</th>
                                    <th>Weight (%)</th>
                                    <th>Score</th>
                                </tr>
                            </thead>
                            <tbody>
                `;
    
                let no = 1;
                objective.kpi_detail.forEach(kpi => {
                    kpis.push(kpi);
                    html += `
                        <tr>
                            <td>${no++}</td>
                            <td>
                                <select type="text" class="form-control select2-js-kpi" style="width: 200px" id="kpiId-${kpi.id}" name="kpi_id-${kpi.id}" data-id="${kpi.id}" disabled>
                                    <option value="">- Choose -</option>
                                </select>
                                <div class="error-message text-small text-danger mt-1" id="error-kpi_id-${kpi.id}"></div>
                            </td>
                            <td>
                                <span id="measurement-${kpi.id}">-</span>
                            </td>
                            <td>
                                <button type="button" class="btn btn-sm btn-danger" disabled>target</button>
                            </td>
                            <td>
                                <button type="button" class="btn btn-sm btn-danger" disabled>actual</button>
                            </td>
                            <td>
                                <span id="counter-${kpi.id}">-</span>
                            </td>
                            <td>
                                <span id="polarization-${kpi.id}">-</span>
                            </td>
                            <td>
                                <span id="index-${kpi.id}">-</span>
                            </td>
                            <td>
                                <input type="text" class="form-control" id="weight-${kpi.id}" name="weight-${kpi.id}" value="${kpi.weight}" disabled>
                            </td>
                            <td>
                                <span id="score-${kpi.id}">0</span>
                            </td>
                        </tr>
                    `;
                });

                html += `
                            </tbody>
                        </table>
                    </div>
                `;
            });

            html += `
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        $('#kpiContainer').html(html);
        $('[data-bs-toggle="tooltip"]').tooltip();
        toggleSubmitButton();
        initializeSelect2();
        setupValueKpis(kpis);
    }

    function setupValueKpis(kpis) {
        kpis.forEach(async kpi => {
            setupValueKpi(kpi);
        });
    }

    async function setupValueKpi(kpi) {
        if (kpi.mode !== 'add') {
            $(`[data-id="${kpi.id}"]`).attr('data-kpi-mode', '');

            if (kpi.kpi_id) {
                const data = await getKpiById(kpi.kpi_id);
                if (data) {
                    $(`#measurement-${kpi.id}`).text(data.measurement);
                    $(`#counter-${kpi.id}`).text(data.counter);
                    $(`#polarization-${kpi.id}`).text(data.polarization);
                    
                    const newOption = new Option(data.kpi, data.id, true, true);
                    $(`#kpiId-${kpi.id}`).append(newOption).trigger('change');
                }

            }

            $(`#kpiId-${kpi.id}`).on('change', async function() {
                const id = $(this).val();
                const data = await getKpiById(id);
                if (data) {
                    $(`#measurement-${kpi.id}`).text(data.measurement);
                    $(`#counter-${kpi.id}`).text(data.counter);
                    $(`#polarization-${kpi.id}`).text(data.polarization);
                }
            });
        }
    }

    async function getKpiById(id) {
        try {
            const response = await fetch(`${config.siteUrl}mapping/kpi_position/get_kpi_by_id/${id}`, { method: 'GET' });
            const result = await response.json();
            const data = result.data;
            return data;
        } catch (error) {
            return false;
        }
    }

    function initializeSelect2() {
        $('.select2-js-basic').each(function () {
            $(this).select2({
                theme: 'bootstrap',
                dropdownParent: $(this).parent(),
            })
        })

        $('#groupUnitTypeId').each(function () {
            $(this).select2({
                theme: 'bootstrap',
                dropdownParent: $(this).parent(),
                ajax: {
                    url: `${config.siteUrl}mapping/kpi_position/get_kpi_unit_type_groups_options`,
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

        $('#perspectiveId').each(function () {
            $(this).select2({
                theme: 'bootstrap',
                dropdownParent: $(this).parent(),
                ajax: {
                    url: `${config.siteUrl}mapping/kpi_position/get_perspective_options_by_year_period_id`,
                    dataType: 'json',
                    delay: 250,
                    data: params => ({
                        q: params.term || '',
                        page: params.page || 1,
                        year_period_id: kpiPositionYearPeriodId
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
        });

        $('#objectiveId').each(function () {
            $(this).select2({
                theme: 'bootstrap',
                dropdownParent: $(this).parent(),
                ajax: {
                    url: `${config.siteUrl}mapping/kpi_position/get_objective_options_by_year_period_id`,
                    dataType: 'json',
                    delay: 250,
                    data: params => ({
                        q: params.term || '',
                        page: params.page || 1,
                        year_period_id: kpiPositionYearPeriodId
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
        });

        $('.select2-js-kpi').each(function () {
            $(this).select2({
                theme: 'bootstrap',
                dropdownParent: $(this).parent(),
                ajax: {
                    url: `${config.siteUrl}mapping/kpi_position/get_kpi_options_by_year_period_id`,
                    dataType: 'json',
                    delay: 250,
                    data: params => ({
                        q: params.term || '',
                        page: params.page || 1,
                        year_period_id: kpiPositionYearPeriodId
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
        });
    }
    
    function initializeModalButton() {
        $(document).on('click', '.btn-edit', function() {
            const id = $(this).attr('data-id');
            
            const selectedOption = $(`#kpiId-${id}`).find('option:selected');
            const selectedValue = selectedOption.val();
            const selectedName = selectedOption.text();
            const dataBeforeEdit = {
                id: id,
                kpi_id: selectedValue,
                kpi_name: selectedName,
                weight: $(`#weight-${id}`).val(),
                score: $(`#score-${id}`).text()
            }

            dataKpiBeforeEdit.push(dataBeforeEdit);

            toggleEditButtons(id, false);
        });
        
        $(document).on('click', '.btn-save', _.debounce(async function() {
            const id = $(this).attr('data-id');
            const kpiMode = $(this).attr('data-kpi-mode');
            const perspectiveId = $(this).attr('data-perspective-id');
            const objectiveId = $(this).attr('data-objective-id');
        
            const kpiId = $(`#kpiId-${id}`).val();
            const weight = $(`#weight-${id}`).val();
            
            const data = {
                id: id,
                position: kpiPositionPosition,
                year_period_id: kpiPositionYearPeriodId,
                group_id: kpiPositionGroupId,
                mode: kpiMode,
                perspective_id: perspectiveId,
                objective_id: objectiveId,
                kpi_id: kpiId,
                weight: weight,
            }
            toggleButtonLoader(this, true, { data: '' });

            if (checkPercentage(data) > 100) {
                displayToast('Error', 'Total weight is more than 100%, please check your data.', 'error');
            } else {
                await storeUpdateKpi(data);
                calculateAndDisplayPercentageAndTotalWeight();
            }
            toggleButtonLoader(this, false, { data: '<i class="mdi mdi-check"></i>' });
        }, 30));

        $(document).on('click', '.btn-cancel', function() {
            const id = $(this).attr('data-id');
            toggleEditButtons(id, true);
            restoreKpiData(id);
        });

        $(document).on('click', '.btn-delete', async function() {
            const id = $(this).attr('data-id');
            if (!id) {
                displayToast('Danger', 'ID not found or is invalid.', 'error');
                return;
            }

            confirmDeletion(id);
        });

        $(document).on('click', '.btn-submit-kpi', function() {
            const data = {
                position: kpiPositionPosition,
                year_period_id: kpiPositionYearPeriodId,
                group_position_id: kpiPositionGroupId,
                is_submit: 1
            }

            confirmSubmit(data);
        });

        $(document).on('click', '.btn-cancel-submit-kpi', function() {
            const data = {
                position: kpiPositionPosition,
                year_period_id: kpiPositionYearPeriodId,
                group_position_id: kpiPositionGroupId,
                is_submit: 0
            }

            confirmSubmit(data);
        });

        $(document).on('click', '.btn-generate-kpi', function() {
            confirmGenerate();
        });

        $('#modalPerformance').on('shown.bs.modal', () => {});     

        $('#modalPerformance').on('hidden.bs.modal', () => {});
    }

    function checkPercentage(data) {
        let totalWeight = 0;
        dataKpi.forEach(perspective => {
            perspective.objective_detail.forEach(objective => {
                objective.kpi_detail.forEach(kpi => {
                    const weight = (kpi.id === data.id && kpi.weight !== data.weight) ? data.weight : kpi.weight;
                    totalWeight += parseFloat(weight);
                });
            });
        });
        return totalWeight;
    }

    function toggleEditButtons(id, isCancel) {
        $(`.btn-save[data-id="${id}"]`).toggleClass('d-none', isCancel);
        $(`.btn-cancel[data-id="${id}"]`).toggleClass('d-none', isCancel);
        $(`.btn-edit[data-id="${id}"]`).toggleClass('d-none', !isCancel);
        $(`.btn-delete[data-id="${id}"]`).toggleClass('d-none', !isCancel);
        $(`#kpiId-${id}`).prop('disabled', isCancel);
        $(`#weight-${id}`).prop('disabled', isCancel);
    }

    function restoreKpiData(id) {
        const dataBeforeEditIndex = dataKpiBeforeEdit.findIndex(item => item.id === id);
        if (dataBeforeEditIndex !== -1) {
            const dataBeforeEdit = dataKpiBeforeEdit[dataBeforeEditIndex];
            const newOption = new Option(dataBeforeEdit.kpi_name, dataBeforeEdit.kpi_id, true, true);
            $(`#kpiId-${id}`).append(newOption).trigger('change');
            $(`#weight-${id}`).val(dataBeforeEdit.weight);
            
            dataKpiBeforeEdit.splice(dataBeforeEditIndex, 1);
        }
    }

    function calculateAndDisplayPercentageAndTotalWeight() {
        let totalWeightSum = 0;
        let totalPercentage = 0;
    
        dataKpi.forEach(perspective => {
            totalWeightSum += perspective.total_weight_perspective;
            perspective.objective_detail.forEach(objective => {
                totalPercentage += objective.total_weight;
            });
            $('#totalWeight-' + perspective.perspective_id).text(perspective.total_weight_perspective + ' %');
        });
    
        updatePercentage(totalPercentage);
    }

    async function storeUpdateKpi(data) {
        try {
            const response = await fetch(`${config.siteUrl}mapping/kpi_position/store_update_kpi`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(data).toString()
            });           
            const result = await response.json();
            handleStoreUpdateFormResponse(result, data);
        } catch (error) {
            displayToast('Error', 'Error while submitting data', 'error');
        }
    }

    function handleStoreUpdateFormResponse(response, data) {
        if (response.status === 'success') {
            displayToast('Success', response.message, 'success');
            $('.error-message').html('');
            const currData = response.data
            const prevData = data

            updateKpiIdInDataKPI(prevData, currData);
        } else {
            displayToast('Error', response.message, 'error');
            $.each(response.errors, (key, value) => {
                $(`#error-${key}-${data.id}`).html(value);
            });
        }
    }

    function confirmSubmit(data) {
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
        }).then(willSubmit => {
            if (willSubmit) submitKpi(data);
        });
    }

    function confirmGenerate() {
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
        }).then(willSubmit => {
            if (willSubmit) generateKpi();
        });
    }

    async function generateKpi() {
        $('#modalGenerate').modal('show');
        const data = {
            position: kpiPositionPosition,
            year_period_id: kpiPositionYearPeriodId,
            group_id: kpiPositionGroupId,
        }

        fetch(`${config.siteUrl}mapping/kpi_position/generate_kpi`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(data).toString()
        })
        .then(response => response.json())
        .then(response => {
            $('#successMessages').empty();
            if (response.status === 'success') {
                const units = response.data.units;
                const kpis = response.data.kpis;
                let total = units.length;
                let count = 0;

                units.forEach(unit => {
                    const rowData = new URLSearchParams({
                        year_period_id: kpiPositionYearPeriodId,
                        unit: JSON.stringify(unit),
                        kpi: JSON.stringify(kpis)
                    });
                    fetch(`${config.siteUrl}mapping/kpi_position/generate_kpi_row`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: rowData.toString()
                    })
                    .then(rowResponse => rowResponse.json())
                    .then(rowResponse => {
                        count++;
                        let progress = (count / total) * 100;
                        $('#countGenerate').text(count + '/' + total);
                        $('#progressBar').css('width', progress + '%').attr('aria-valuenow', progress).text(progress.toFixed(2) + '%');
                        if (rowResponse.status && rowResponse.data.mode === 'success') {
                            $('#successMessages').append('<div class="text-small alert alert-success">Unit: ' + unit.nm_unit_kerja + ' successfully generated</div>');
                        } else if (rowResponse.status && rowResponse.data.mode === 'warning') {
                            $('#successMessages').append('<div class="text-small alert alert-warning">Unit: ' + unit.nm_unit_kerja + ' already exists.</div>');
                        } else {
                            $('#successMessages').append('<div class="text-small alert alert-danger">An error occurred while generating row for Unit  ' + unit.nm_unit_kerja + '.</div>');
                        }
                    })
                    .catch(() => {
                        $('#successMessages').append('<div class="text-small alert alert-danger">An error occurred while generating row for Unit  ' + unit.nm_unit_kerja + '.</div>');
                    });
                });
            } else {
                $('#successMessages').append('<div class="text-small alert alert-danger">Failed to generate data.</div>');
            }
        })
        .catch(() => {
            $('#successMessages').append('<div class="text-small alert alert-danger">An error occurred while generating data.</div>');
        });
    }

    async function submitKpi(data) {
        toggleBarLoader(null, true);
        try {
            const response = await fetch(`${config.siteUrl}mapping/kpi_position/submit_kpi`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(data).toString()
            });

            const result = await response.json();

            if (result.status === 'success') {
                if (data.is_submit) {
                    displayToast('Success', 'Your data has been submitted', 'success');
                } else {
                    displayToast('Success', 'Your data submission has been canceled', 'success');
                }
                setTimeout(() => {
                    location.reload();
                }, 500);
            } else {
                displayToast('Error', 'There was an error submitting the data.', 'error');
            }
        } catch (error) {
            displayToast('Error', 'There was an error submitting the data.', 'error');
        }
        toggleBarLoader(null, false);
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
            let dataKpiItem;
            dataKpi.forEach(perspective => {
                perspective.objective_detail.forEach(objective => {
                    const kpiItem = objective.kpi_detail.find(kpi => kpi.id === id);
                    if (kpiItem) {
                        dataKpiItem = kpiItem;
                    }
                });
            });
            if (dataKpiItem.mode == 'add') {
                displayToast('Success', 'Your data has been deleted', 'success');

                dataKpi.forEach(perspective => {
                    perspective.objective_detail.forEach(objective => {
                        objective.kpi_detail = objective.kpi_detail.filter(kpi => kpi.id !== id);
                    });
                });

                const dataBeforeEditIndex = dataKpiBeforeEdit.findIndex(item => item.id === id);
                if (dataBeforeEditIndex !== -1) {
                    dataKpiBeforeEdit.splice(dataBeforeEditIndex, 1);
                }
                
                $(`tr:has(button[data-id="${id}"])`).remove();
            } else {
                const response = await fetch(`${config.siteUrl}mapping/kpi_position/delete`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({ id }).toString()
                });
    
                const result = await response.json();
    
                if (result.status === 'success') {
                    displayToast('Success', 'Your data has been deleted', 'success');
    
                    dataKpi.forEach(perspective => {
                        perspective.objective_detail.forEach(objective => {
                            objective.kpi_detail = objective.kpi_detail.filter(kpi => kpi.id !== id);
                            objective.total_weight = objective.kpi_detail.reduce((sum, kpi) => sum + parseFloat(kpi.weight), 0);
                        });
                        perspective.total_weight_perspective = perspective.objective_detail.reduce((sum, objective) => sum + parseFloat(objective.total_weight), 0);
                    });
    
                    const dataBeforeEditIndex = dataKpiBeforeEdit.findIndex(item => item.id === id);
                    if (dataBeforeEditIndex !== -1) {
                        dataKpiBeforeEdit.splice(dataBeforeEditIndex, 1);
                    }
                    
                    $(`tr:has(button[data-id="${id}"])`).remove();
                    calculateAndDisplayPercentageAndTotalWeight();
                } else {
                    displayToast('Error', 'There was an error deleting the data.', 'error');
                }
            }
        } catch (error) {
            displayToast('Error', 'There was an error deleting the data.', 'error');
        }
        toggleBarLoader(null, false);
    }

    function handleFormEvents() {
        $('#btnCreateKPI').click(_.debounce(async () => {
            if (validateCreateKpi()) {
                await createKpi();
            }
        }, 300));
    }

    function validateCreateKpi() {
        let isValid = true;

        const groupUnitTypeId = $('#groupUnitTypeId').val();

        if (!groupUnitTypeId) {
            $('#error-group_unit_type_id').text('Group Unit Type is required.');
            isValid = false;
        } else {
            $('#error-group_unit_type_id').text('');
        }

        return isValid;
    }

    async function createKpi() {
        toggleButtonLoader('#btnCreateKPI', true, { data: '' });
        try {
            const response = await fetch(`${config.siteUrl}mapping/kpi_position/create_kpi`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    year_period_id: kpiPositionYearPeriodId,
                    position: kpiPositionPosition,
                    group_position_id: kpiPositionGroupId,
                    group_unit_type_id: $('#groupUnitTypeId').val(),
                }).toString()
            });
            const result = await response.json();
            if (result.status === 'success') {
                initializeData();
                displayToast('Success', 'Your data has been created', 'success');
            } else {
                displayToast('Error', 'There was an error creating the data.', 'error');
            }
        } catch (error) {
            displayToast('Error', 'There was an error creating the data.', 'error');
        }
        toggleButtonLoader('#btnCreateKPI', false, { data: 'Create KPI' });
    }
})(jQuery);