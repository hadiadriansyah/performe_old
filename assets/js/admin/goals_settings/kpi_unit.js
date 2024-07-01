(function($) {
    'use strict';

    let mode;
    let isSubmitting = false;
    const kpiUnitYearPeriodId = getKpiUnitYearPeriodIdVal();
    const kpiUnitUnitId = getKpiUnitUnitIdVal();
    let dataKpi = [];
    let dataKpiBeforeEdit = []
    const newItemKPI = {
        perspective_id: null,
        perspective: null,
        is_submit: 2,
        total_weight_perspective: 0,
        objective_detail: [{
            objective_id: null,
            objective: null,
            kpi_detail: [{
                id: null,
                perspective_id: null,
                objective_id: null,
                kpi_id: null,
                target_id: null,
                actual_id: null,
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

    function getKpiUnitYearPeriodIdVal() {
        return $('#kpiUnitYearPeriodId').val();
    }
    
    function getKpiUnitUnitIdVal() {
        return $('#kpiUnitUnitId').val();
    }

    function setupPercentage() {
        $('#percentageInput').on('input', async function() {
            const percentage = $(this).val();
            if (percentage < 100) {
                $('.btn-submit-kpi').prop('disabled', true);
            } else {
                const kpiUnitTarget = await getKpiUnitTargetByUnitIdYearPeriodId();
                let totalKpiDetailCount = 0;
                dataKpi.forEach(perspective => {
                    perspective.objective_detail.forEach(objective => {
                        totalKpiDetailCount += objective.kpi_detail.length;
                    });
                });
                console.log(kpiUnitTarget.length, totalKpiDetailCount);
                if (kpiUnitTarget.length === totalKpiDetailCount) {
                    $('.btn-submit-kpi').prop('disabled', false);
                } else {
                    $('.btn-submit-kpi').prop('disabled', true);
                }
            }
        });
    }

    async function getKpiUnitTargetByUnitIdYearPeriodId() {
        try {
            const response = await fetch(`${config.siteUrl}goals_settings/kpi_unit/get_kpi_unit_target_by_unit_id`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    unit_id: kpiUnitUnitId,
                    year_period_id: kpiUnitYearPeriodId,
                }).toString()
            });
            const result = await response.json();
            return result.data;
        } catch (error) {
            return false
        }
    }

    function updatePercentage(percentage = 0) {
        $('#percentage').text(percentage + ' %');
        $('#percentageInput').val(percentage).trigger('input');
    }

    async function initializeData() {
        if (kpiUnitUnitId && kpiUnitYearPeriodId) {
            try {
                const response = await fetch(`${config.siteUrl}goals_settings/kpi_unit/get_kpi_unit`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({
                        unit_id: kpiUnitUnitId,
                        year_period_id: kpiUnitYearPeriodId,
                    }).toString()
                });
                const result = await response.json();
                const data = result.data;
                dataKpi = await processKpiData(data);
                const totalWeightSum = dataKpi.reduce((sum, item) => sum + parseFloat(item.total_weight_perspective), 0);
                updatePercentage(totalWeightSum);
                renderKPI();
            } catch (error) {
                displayToast('Error', 'Error fetching KPI', 'error');
            }
        }
    }

    function toggleSubmitButton() {
        if (kpiIsSubmit == 1) {
            $('.is-submit-kpi').addClass('d-none');
            $('.btn-cancel-submit-kpi').removeClass('d-none');
        } else {
            $('.is-submit-kpi').removeClass('d-none');
            $('.btn-cancel-submit-kpi').addClass('d-none');
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
                target_id: item.target_id,
                actual_id: item.actual_id,
                weight: item.weight,
                score: item.score,
                mode: null
            });

            objectiveDetail.total_weight += parseFloat(item.weight);
            acc[perspective].total_weight_perspective += parseFloat(item.weight);
            kpiIsSubmit = item.is_submit_target;
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
                                    <th class="is-submit-kpi">Action</th>
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
                            <td class="is-submit-kpi">
                                <button type="button" class="btn btn-sm btn-success btn-icon-text btn-save d-none" data-id="${kpi.id}" data-kpi-mode="${kpi.mode}" data-perspective-id="${kpi.perspective_id}" data-objective-id="${kpi.objective_id}" data-bs-toggle="tooltip" data-placement="right" title="Save">
                                    <i class="mdi mdi-check"></i>
                                </button>
                                <button type="button" class="btn btn-sm btn-danger btn-icon-text btn-cancel d-none" data-id="${kpi.id}" data-bs-toggle="tooltip" data-placement="right" title="Cancel">
                                    <i class="mdi mdi-close"></i>
                                </button>
                                <button type="button" class="btn btn-sm btn-warning btn-icon-text btn-edit" data-id="${kpi.id}" data-bs-toggle="tooltip" data-placement="right" title="Edit">
                                    <i class="mdi mdi-pencil"></i>
                                </button>
                                <button type="button" class="btn btn-sm btn-danger btn-icon-text btn-delete" data-id="${kpi.id}" data-bs-toggle="tooltip" data-placement="right" title="Delete">
                                    <i class="mdi mdi-delete"></i>
                                </button>
                            </td>
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
                                <button type="button" id="target-${kpi.id}" class="btn btn-sm btn-modal-target-actual ${kpi.target_id ? 'btn-success' : 'btn-danger'}" data-bs-toggle="modal" data-bs-target="#modalTargetActual" data-mode="modalTarget" data-id="${kpi.id}" data-mode-kpi="${kpi.mode}" disabled>target</button>
                                <p id="targetId-${kpi.id}" class="d-none"></p>
                                <p id="targetMonth-${kpi.id}" class="d-none"></p>
                            </td>
                            <td>
                                <button type="button" id="actual-${kpi.id}" class="btn btn-sm btn-modal-target-actual ${kpi.target ? 'btn-primary' : 'btn-danger'}" data-bs-toggle="modal" data-bs-target="#modalTargetActual" data-mode="modalActual" data-id="${kpi.id}" disabled>actual</button>
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
            $(`#targetId-${kpi.id}`).text(kpi.target_id);
            $(`#actualId-${kpi.id}`).text(kpi.actual_id);

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
            
            const target = await getTarget(kpi.id); 

            if (target) {
                $(`#targetMonth-${kpi.id}`).text(target.target);
            }
        }
    }

    async function getTarget(id) {
        try {
            const response = await fetch(`${config.siteUrl}goals_settings/kpi_unit/get_target_by_id/${id}`, { method: 'GET' });
            const result = await response.json();
            const data = result.data;
            return data;
        } catch (error) {
            return false;
        }
    }

    async function getKpiById(id) {
        try {
            const response = await fetch(`${config.siteUrl}goals_settings/kpi_unit/get_kpi_by_id/${id}`, { method: 'GET' });
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

        $('#perspectiveId').each(function () {
            $(this).select2({
                theme: 'bootstrap',
                dropdownParent: $(this).parent(),
                ajax: {
                    url: `${config.siteUrl}goals_settings/kpi_unit/get_perspective_options_by_year_period_id`,
                    dataType: 'json',
                    delay: 250,
                    data: params => ({
                        q: params.term || '',
                        page: params.page || 1,
                        year_period_id: kpiUnitYearPeriodId
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

        $('#objectiveId').each(function () {
            $(this).select2({
                theme: 'bootstrap',
                dropdownParent: $(this).parent(),
                ajax: {
                    url: `${config.siteUrl}goals_settings/kpi_unit/get_objective_options_by_year_period_id`,
                    dataType: 'json',
                    delay: 250,
                    data: params => ({
                        q: params.term || '',
                        page: params.page || 1,
                        year_period_id: kpiUnitYearPeriodId
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

        $('.select2-js-kpi').each(function () {
            $(this).select2({
                theme: 'bootstrap',
                dropdownParent: $(this).parent(),
                ajax: {
                    url: `${config.siteUrl}goals_settings/kpi_unit/get_kpi_options_by_year_period_id`,
                    dataType: 'json',
                    delay: 250,
                    data: params => ({
                        q: params.term || '',
                        page: params.page || 1,
                        year_period_id: kpiUnitYearPeriodId
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
                unit_id: kpiUnitUnitId,
                year_period_id: kpiUnitYearPeriodId,
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
        }, 300));

        $(document).on('click', '.btn-cancel', function() {
            const id = $(this).attr('data-id');
            toggleEditButtons(id, true);
            restoreKpiData(id);
        });

        $(document).on('click', '.btn-modal-target-actual', function() {
            mode = $(this).attr('data-mode');
            const id = $(this).attr('data-id');
            const modeKpi = $(this).attr('data-mode-kpi');

            if (modeKpi === 'add') {
                displayToast('Warning', 'Make sure you have added and saved the KPI.', 'warning');
            } 
            const selectedUnit = $(`#kpiId-${id}`).find('option:selected');
            const unitId = selectedUnit.val();
            const unitName = selectedUnit.text();
            const measurement = $(`#measurement-${id}`).text();
            const counter = $(`#counter-${id}`).text();
            const polarization = $(`#polarization-${id}`).text();
            const targetId = $(`#targetId-${id}`).text();
            const targetMonth = (() => {
                try {
                    return JSON.parse($(`#targetMonth-${id}`).text());
                } catch (e) {
                    return {};
                }
            })();

            $('#kpiUnitId').val(id);
            $('#kpiName').val(unitName);
            $('#modeKpi').val(modeKpi);
            $('#measurementText').val(measurement);
            $('#counterText').val(counter);
            $('#polarizationText').val(polarization);
            if (targetId) {
                $('#targetId').val(targetId);
                for (const [key, value] of Object.entries(targetMonth)) {
                    $(`#month${key}`).val(value);
                }
            } else {
                $('#targetId').val('');
                $('input[id^="month"]').val(0);
            }
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
                unit_id: kpiUnitUnitId,
                year_period_id: kpiUnitYearPeriodId,
                is_submit: 1
            }

            confirmSubmit(data);
        });

        $(document).on('click', '.btn-cancel-submit-kpi', function() {
            const data = {
                unit_id: kpiUnitUnitId,
                year_period_id: kpiUnitYearPeriodId,
                is_submit: 0
            }

            confirmSubmit(data);
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
        $(`#target-${id}`).prop('disabled', isCancel);
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
            const response = await fetch(`${config.siteUrl}goals_settings/kpi_unit/store_update_kpi`, {
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

    async function submitKpi(data) {
        toggleBarLoader(null, true);
        try {
            const response = await fetch(`${config.siteUrl}goals_settings/kpi_unit/submit_kpi`, {
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
                const response = await fetch(`${config.siteUrl}goals_settings/kpi_unit/delete`, {
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
            const response = await fetch(`${config.siteUrl}goals_settings/kpi_unit/delete_target`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ id }).toString()
            });

            const result = await response.json();

            if (result.status !== 'success') {
                displayToast('Error', 'There was an error deleting the data target.', 'error');
            }
        } catch (error) {
            displayToast('Error', 'There was an error deleting the data target.', 'error');
        }
        toggleBarLoader(null, false);
    }

    function handleFormEvents() {
        $('#btnAddKpi').click(() => $('#formAddKpi').submit());
        $('#formAddKpi').submit(event => {
            event.preventDefault();
            if (validateForm()) {
                if (isSubmitting) return;
                isSubmitting = true;
                
                toggleButtonLoader('#btnAddKpi', true, { data: '' });
                _.debounce(async () => {
                    await addKpi();
                    isSubmitting = false;
                    toggleButtonLoader('#btnAddKpi', false);
                }, 500)();
            }
        });
        $('#btnTargetActual').click(() => $('#formTargetActual').submit());
        $('#formTargetActual').submit(event => {
            event.preventDefault();
            if (isSubmitting) return;
            isSubmitting = true;
            
            toggleButtonLoader('#btnTargetActual', true, { data: '' });
            _.debounce(async () => {
                await setupFormSubmission();
                isSubmitting = false;
                toggleButtonLoader('#btnTargetActual', false);
            }, 500)();
            
        });
    }

    async function setupFormSubmission() {
        $('.error-message').html('');
        let url = '';
        let formData = '';
        
        if (mode === 'modalTarget') {
            url = 'goals_settings/kpi_unit/add_edit_target';
            formData = $('#formTargetActual').serialize();
        }

        const formDetails = {
            mode: mode,
            url: url,
            formData: formData
        };
        submitFormData(formDetails);
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

    async function handleFormResponse(response) {
        if (response.status === 'success') {
            displayToast('Success', response.message, 'success');
            if (mode === 'modalTarget') {
                $('#modalTargetActual').modal('hide');
                const id = $('#kpiUnitId').val();
                const targetId = response.data.id;
                dataKpi.forEach(perspective => {
                    perspective.objective_detail.forEach(objective => {
                        objective.kpi_detail.forEach(kpi => {
                            if (kpi.id === id) {
                                kpi.target_id = targetId;
                            }
                        });
                    });
                });
                $(`#target-${id}`).removeClass('btn-danger').addClass('btn-success');
                $(`#targetId-${id}`).text(response.data.id);
                $(`#targetMonth-${id}`).text(response.data.target);
            }
        } else {
            displayToast('Error', response.message, 'error');
            $.each(response.errors, (key, value) => {
                if (mode === 'modalTarget') {
                    $(`#formTargetActual`).find(`#error-${key}`).html(value);
                }
            });
        }
    }

    function validateForm() {
        let isValid = true;

        const perspectiveId = $('#perspectiveId').val();
        const objectiveId = $('#objectiveId').val();

        if (!perspectiveId) {
            $('#error-perspective_id').text('Perspective is required.');
            isValid = false;
        } else {
            $('#error-perspective_id').text('');
        }

        if (!objectiveId) {
            $('#error-objective_id').text('Objective is required.');
            isValid = false;
        } else {
            $('#error-objective_id').text('');
        }

        return isValid;
    }

    async function addKpi() {
        const selectedPerspective = $(`#perspectiveId`).find('option:selected');
        const perspectiveId = selectedPerspective.val();
        const perspectiveName = selectedPerspective.text();
        const selectedObjective = $(`#objectiveId`).find('option:selected');
        const objectiveId = selectedObjective.val();
        const objectiveName = selectedObjective.text();

        const numberOfRows = $('#numberOfRows').val();

        const newItem = {
            ...newItemKPI,
            perspective_id: perspectiveId,
            perspective: perspectiveName,
            total_weight_perspective: 0,
            objective_detail: [
                {
                    objective_id: objectiveId,
                    objective: objectiveName,
                    kpi_detail: [],
                    total_weight: 0
                }
            ]
        }
        
        for (let i = 0; i < numberOfRows; i++) {
            const newKPIDetail = {
                id: generateUUIDv7(),
                perspective_id: perspectiveId,
                objective_id: objectiveId,
                kpi_id: null,
                target_id: null,
                actual_id: null,
                weight: 0,
                score: 0,
                mode: 'add'
            };
            newItem.objective_detail[0].kpi_detail.push(newKPIDetail);
        }

        let foundPerspective = false;
        for (let i = 0; i < dataKpi.length; i++) {
            if (dataKpi[i].perspective_id === newItem.perspective_id) {
                let foundObjective = false;
                for (let j = 0; j < dataKpi[i].objective_detail.length; j++) {
                    if (dataKpi[i].objective_detail[j].objective_id === newItem.objective_detail[0].objective_id) {
                        dataKpi[i].objective_detail[j].kpi_detail.push(...newItem.objective_detail[0].kpi_detail);
                        foundObjective = true;
                        break;
                    }
                }
                if (!foundObjective) {
                    dataKpi[i].objective_detail.push(newItem.objective_detail[0]);
                }
                foundPerspective = true;
                break;
            }
        }
    
        if (!foundPerspective) {
            dataKpi.push(newItem);
        }

        await new Promise(resolve => setTimeout(resolve, 500));

        $('#modalAddKpi').modal('hide');        
        renderKPI();
    }

    function updateKpiIdInDataKPI(data) {
        let updateKpi = null;
        let id = data.id;

        dataKpi.forEach(perspective => {
            perspective.objective_detail.forEach(objective => {
                objective.kpi_detail.forEach(kpi => {
                    if (kpi.id === id) {
                        kpi.kpi_id = data.kpi_id;
                        kpi.weight = parseFloat(data.weight);
                        kpi.mode = '';
                        updateKpi = kpi;
                    }
                });
                objective.total_weight = objective.kpi_detail.reduce((sum, kpi) => sum + parseFloat(kpi.weight), 0);
            });
            perspective.total_weight_perspective = perspective.objective_detail.reduce((sum, objective) => sum + parseFloat(objective.total_weight), 0);
        });

        setupValueKpi(updateKpi);

        const dataKpiBeforeEditIndex = dataKpiBeforeEdit.findIndex(item => item.id === id);
        if (dataKpiBeforeEditIndex !== -1) {
            dataKpiBeforeEdit.splice(dataKpiBeforeEditIndex, 1);
        }
        toggleEditButtons(id, true);
        $(`button#target-${id}`).attr('data-mode-kpi', '');
    }

    function generateUUIDv7() {
        const now = Date.now();
        const ts = BigInt(now);
    
        // Generate 10 random bytes
        const randomBytes = new Uint8Array(10);
        window.crypto.getRandomValues(randomBytes);
    
        // Construct the UUID v7
        const timeHigh = (ts >> 28n) & 0xFFFFFFFFn;
        const timeMid = (ts >> 12n) & 0xFFFFn;
        const timeLow = ts & 0xFFFn;
        const version = 0x7n;
    
        const uuid = [
            timeHigh.toString(16).padStart(8, '0'), // time_high
            timeMid.toString(16).padStart(4, '0'), // time_mid
            version.toString(16) + timeLow.toString(16).padStart(3, '0'), // version and time_low
            (randomBytes[0] & 0x3F | 0x80).toString(16).padStart(2, '0') + // variant
            randomBytes[1].toString(16).padStart(2, '0'), // random part
            Array.from(randomBytes.slice(2, 8)).map(b => b.toString(16).padStart(2, '0')).join('') // remaining random part
        ].join('-');
    
        return uuid;
    }
})(jQuery);