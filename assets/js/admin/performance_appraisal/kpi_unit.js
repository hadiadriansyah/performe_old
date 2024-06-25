(function($) {
    'use strict';

    let mode;
    let isSubmitting = false;
    const kpiUnitYearPeriodId = getKpiUnitYearPeriodIdVal();
    const kpiUnitUnitId = getKpiUnitUnitIdVal();
    let dataKpi = [];
    let indexScoreRule = [];
    const newItemKPI = {
        perspective_id: null,
        perspective: null,
        is_submit_target: 0,
        is_submit_actual: 0,
        total_weight_perspective: 0,
        total_score_perspective: 0,
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
            total_weight: 0,
            total_score: 0
        }]
    };
    let kpiIsSubmitTarget = 0;
    let kpiIsSubmitActual = 0;

    $(initializePage);

    async function initializePage() {
        await initializeIndexScoreRule();
        initializeData();
        toggleSubmitButton();
        setupPercentage();
        initializeSelect2();
        initializeModalButton();
        handleFormEvents();
        monthPeriodOnChange();
    }

    async function initializeIndexScoreRule() {
        try {
            const response = await fetch(`${config.siteUrl}performance_appraisal/unit_performance_appraisal/get_index_scores`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ year_period_id: kpiUnitYearPeriodId }).toString()
            });
            const result = await response.json();
            indexScoreRule = result
        } catch (error) {}
    }

    function getKpiUnitYearPeriodIdVal() {
        return $('#kpiUnitYearPeriodId').val();
    }
    
    function getKpiUnitUnitIdVal() {
        return $('#kpiUnitUnitId').val();
    }

    function monthPeriodOnChange() {
        $('#firstMonthPeriod').on('change', function() {
            const selectedMonth = $(this).val();
            if (selectedMonth) {
                calculateDataPerformanceOnChange()
            }
        });
        
        $('#lastMonthPeriod').on('change', function() {
            const selectedMonth = $(this).val();
            if (selectedMonth) {
                calculateDataPerformanceOnChange()
            }
        });
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

    function updateScore(score = 0) {
        $('#score').text(score);
    }

    async function initializeData() {
        if (kpiUnitUnitId && kpiUnitYearPeriodId) {
            try {
                const response = await fetch(`${config.siteUrl}performance_appraisal/unit_performance_appraisal/get_kpi_unit`, {
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
                

                if (kpiIsSubmitTarget == 1) {
                    const totalWeightSum = dataKpi.reduce((sum, item) => sum + parseFloat(item.total_weight_perspective), 0);
                    const totalScoreSum = dataKpi.reduce((sum, item) => sum + parseFloat(item.total_score_perspective), 0);
                    updatePercentage(totalWeightSum);
                    updateScore(totalScoreSum);
                    renderKPI();
                } else {
                    $('#kpiContainer').html(`
                        <div class="alert alert-fill-danger" role="alert">
                            <i class="mdi mdi-alert-circle"></i> Oh snap!. KPI for this unit is not available. Please check again and try submitting.
                        </div>
                    `);
                }
            } catch (error) {
                displayToast('Error', 'Error fetching KPI', 'error');
            }
        }
    }

    function toggleSubmitButton() {
        if (kpiIsSubmitTarget != 1) {
            $('.is-submit-kpi').addClass('d-none');
            $('.btn-cancel-submit-kpi').addClass('d-none');
        } else {
            if (kpiIsSubmitActual == 1) {
                $('.is-submit-kpi').addClass('d-none');
                $('.btn-cancel-submit-kpi').removeClass('d-none');
            } else {
                $('.is-submit-kpi').removeClass('d-none');
                $('.btn-cancel-submit-kpi').addClass('d-none');
            }
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
                    is_submit_target: item.is_submit_target,
                    is_submit_actual: item.is_submit_actual,
                    total_weight_perspective: 0,
                    total_score_perspective: 0,
                    objective_detail: []
                };
            }

            let objectiveDetail = acc[perspective].objective_detail.find(obj => obj.objective_id === objective);
            if (!objectiveDetail) {
                objectiveDetail = {
                    objective_id: item.objective_id,
                    objective: item.objective,
                    kpi_detail: [],
                    total_weight: 0,
                    total_score: 0
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
            objectiveDetail.total_score += parseFloat(item.score);
            acc[perspective].total_weight_perspective += parseFloat(item.weight);
            acc[perspective].total_score_perspective += parseFloat(item.score);
            kpiIsSubmitTarget = item.is_submit_target;
            kpiIsSubmitActual = item.is_submit_actual;
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
                                <div>
                                    <span class="badge bg-danger" id="totalWeight-${perspective.perspective_id}">${perspective.total_weight_perspective} %</span>
                                    <span class="badge bg-danger" id="totalScore-${perspective.perspective_id}">${perspective.total_score_perspective}</span>
                                </div>
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
                                <button type="button" class="btn btn-sm btn-success btn-icon-text btn-done d-none" data-id="${kpi.id}" data-bs-toggle="tooltip" data-placement="right" title="Done">
                                    <i class="mdi mdi-check"></i>
                                </button>
                                <button type="button" class="btn btn-sm btn-warning btn-icon-text btn-edit" data-id="${kpi.id}" data-bs-toggle="tooltip" data-placement="right" title="Edit">
                                    <i class="mdi mdi-pencil"></i>
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
                                <button type="button" id="target-${kpi.id}" class="btn btn-sm btn-modal-target-actual ${kpi.target_id ? 'text-success' : 'text-danger'}" data-bs-toggle="modal" data-bs-target="#modalTargetActual" data-mode="modalTarget" data-id="${kpi.id}" disabled>0</button>
                                <p id="targetId-${kpi.id}" class="d-none"></p>
                                <p id="targetMonth-${kpi.id}" class="d-none"></p>
                            </td>
                            <td>
                                <button type="button" id="actual-${kpi.id}" class="btn btn-sm btn-modal-target-actual ${kpi.actual_id ? 'text-success' : 'text-danger'}" data-bs-toggle="modal" data-bs-target="#modalTargetActual" data-mode="modalActual" data-id="${kpi.id}" disabled>0</button>
                                <p id="actualId-${kpi.id}" class="d-none"></p>
                                <p id="actualMonth-${kpi.id}" class="d-none"></p>   
                            </td>
                            <td>
                                <span id="counter-${kpi.id}">-</span>
                            </td>
                            <td>
                                <span id="polarization-${kpi.id}">-</span>
                                <span id="formula-${kpi.id}" class="d-none">-</span>
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
        $(`#targetId-${kpi.id}`).text(kpi.target_id);
        $(`#actualId-${kpi.id}`).text(kpi.actual_id);

        if (kpi.kpi_id) {
            const data = await getKpiById(kpi.kpi_id);
            if (data) {
                $(`#measurement-${kpi.id}`).text(data.measurement);
                $(`#counter-${kpi.id}`).text(data.counter);
                $(`#polarization-${kpi.id}`).text(data.polarization);
                $(`#formula-${kpi.id}`).text(data.formula);
                
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
                $(`#formula-${kpi.id}`).text(data.formula);
            }
        });
        
        const target = await getTarget(kpi.id); 

        if (target) {
            dataKpi.forEach(perspective => {
                perspective.objective_detail.forEach(objective => {
                    objective.kpi_detail.forEach(data => {
                        if (data.id === kpi.id) {
                            data.target = target.target;
                        }
                    });
                });
            });
            $(`#targetMonth-${kpi.id}`).text(target.target);
        }

        const actual = await getActual(kpi.id); 

        if (actual) {
            dataKpi.forEach(perspective => {
                perspective.objective_detail.forEach(objective => {
                    objective.kpi_detail.forEach(data => {
                        if (data.id === kpi.id) {
                            data.actual = actual.actual;
                        }
                    });
                });
            });
            $(`#actualMonth-${kpi.id}`).text(actual.actual);
        }
    }

    async function getTarget(id) {
        try {
            const response = await fetch(`${config.siteUrl}performance_appraisal/unit_performance_appraisal/get_target_by_id/${id}`, { method: 'GET' });
            const result = await response.json();
            const data = result.data;
            return data;
        } catch (error) {
            return false;
        }
    }

    async function getActual(id) {
        try {
            const response = await fetch(`${config.siteUrl}performance_appraisal/unit_performance_appraisal/get_actual_by_id/${id}`, { method: 'GET' });
            const result = await response.json();
            const data = result.data;
            return data;
        } catch (error) {
            return false;
        }
    }

    async function getKpiById(id) {
        try {
            const response = await fetch(`${config.siteUrl}performance_appraisal/unit_performance_appraisal/get_kpi_by_id/${id}`, { method: 'GET' });
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
                    url: `${config.siteUrl}performance_appraisal/unit_performance_appraisal/get_perspective_options_by_year_period_id`,
                    dataType: 'json',
                    delay: 250,
                    data: params => ({
                        q: params.term || '',
                        page: params.page || 1,
                        year_period_id: kpiUnitYearPeriodId
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
                    url: `${config.siteUrl}performance_appraisal/unit_performance_appraisal/get_objective_options_by_year_period_id`,
                    dataType: 'json',
                    delay: 250,
                    data: params => ({
                        q: params.term || '',
                        page: params.page || 1,
                        year_period_id: kpiUnitYearPeriodId
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
                    url: `${config.siteUrl}performance_appraisal/unit_performance_appraisal/get_kpi_options_by_year_period_id`,
                    dataType: 'json',
                    delay: 250,
                    data: params => ({
                        q: params.term || '',
                        page: params.page || 1,
                        year_period_id: kpiUnitYearPeriodId
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
            toggleEditButtons(id, false);
        });

        $(document).on('click', '.btn-done', function() {
            const id = $(this).attr('data-id');
            toggleEditButtons(id, true);
        });

        $(document).on('click', '.btn-modal-target-actual', function() {
            mode = $(this).attr('data-mode');
            const id = $(this).attr('data-id');

            $('#modalLabelTargetActual').text(mode === 'modalTarget' ? 'Target' : 'Actual');

            const selectedUnit = $(`#kpiId-${id}`).find('option:selected');
            const unitName = selectedUnit.text();
            const measurement = $(`#measurement-${id}`).text();
            const counter = $(`#counter-${id}`).text();
            const polarization = $(`#polarization-${id}`).text();
            const targetId = $(`#targetId-${id}`).text();
            const actualId = $(`#actualId-${id}`).text();
            const targetMonth = (() => {
                try {
                    return JSON.parse($(`#targetMonth-${id}`).text());
                } catch (e) {
                    return {};
                }
            })();
            const actualMonth = (() => {
                try {
                    return JSON.parse($(`#actualMonth-${id}`).text());
                } catch (e) {
                    return {};
                }
            })();

            $('#kpiUnitId').val(id);
            $('#kpiName').val(unitName);
            $('#modeKpi').val(modeKpi);
            $('#measurementText').val(measurement);
            $('#polarizationText').val(polarization);
            $('#counterText').val(counter);
            if (mode === 'modalTarget') {
                if (targetId) {
                    $('#targetId').val(targetId);
                    for (const [key, value] of Object.entries(targetMonth)) {
                        $(`#month${key}`).val(value);
                    }
                } else {
                    $('#targetId').val('');
                    $('input[id^="month"]').val(0);
                }
                $('#btnTargetActual').hide();
            } else if (mode === 'modalActual') {
                if (actualId) {
                    $('#actualId').val(actualId);
                    for (const [key, value] of Object.entries(actualMonth)) {
                        $(`#month${key}`).val(value);
                    }
                } else {
                    $('#actualId').val('');
                    $('input[id^="month"]').val(0);
                }
                $('#btnTargetActual').show();
            }
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

    function toggleEditButtons(id, isDone) {
        $(`.btn-done[data-id="${id}"]`).toggleClass('d-none', isDone);
        $(`.btn-edit[data-id="${id}"]`).toggleClass('d-none', !isDone);
        $(`#target-${id}`).prop('disabled', isDone);
        $(`#actual-${id}`).prop('disabled', isDone);
    }

    async function calculateDataPerformanceOnChange() {
        dataKpi.forEach(perspective => {
            perspective.objective_detail.forEach(objective => {
                objective.kpi_detail.forEach(kpi => {
                    const firstMonthPeriod = $('#firstMonthPeriod').val();
                    const lastMonthPeriod = $('#lastMonthPeriod').val();
                    let targetCounter = 0;
                    let targetArray = [];
                    const counter = $(`#counter-${kpi.id}`).text();
                    const polarization = $(`#polarization-${kpi.id}`).text();
                    const formula = (() => {
                        try {
                            return JSON.parse($(`#formula-${kpi.id}`).text());
                        } catch (e) {
                            return {};
                        }
                    })();
                    targetArray = (() => {
                        try {
                            return JSON.parse(kpi.target);
                        } catch (e) {
                            return {};
                        }
                    })();
                    if (targetArray) {
                        const resultTarget = [];
                        for (let i = firstMonthPeriod; i <= lastMonthPeriod; i++) {
                            if (targetArray.hasOwnProperty(i.toString())) {
                                resultTarget.push(parseInt(targetArray[i.toString()], 10));
                            }
                        }
                        targetCounter = calculateCounter(counter, resultTarget);
                    }
                    $(`#target-${kpi.id}`).text(targetCounter);

                    let actualCounter = 0;
                    let actualArray = [];
                    actualArray = (() => {
                        try {
                            return JSON.parse(kpi.actual);
                        } catch (e) {
                            return {};
                        }
                    })();
                    if (actualArray) {
                        const resultActual = [];
                        for (let i = firstMonthPeriod; i <= lastMonthPeriod; i++) {
                            if (actualArray.hasOwnProperty(i.toString())) {
                                resultActual.push(parseInt(actualArray[i.toString()], 10));
                            }
                        }
                        actualCounter = calculateCounter(counter, resultActual);
                        
                    }
                    $(`#actual-${kpi.id}`).text(actualCounter);
                    let indexCounter = calculateIndex(actualCounter, targetCounter, polarization, formula);
                    let num = parseFloat(indexCounter);
                    if (isNaN(num)) {
                        num = 0;
                    }
                    const indexValue = getIndexValue(num);
                    $(`#index-${kpi.id}`).text(indexValue);
                    $(`#weight-${kpi.id}`).val(parseFloat(kpi.weight));
                    $(`#score-${kpi.id}`).text(parseFloat(indexValue) * parseFloat(kpi.weight));
                });
            });
        });
        const totalScore = dataKpi.reduce((sum, perspective) => {
            return sum + perspective.objective_detail.reduce((subSum, objective) => {
                return subSum + objective.kpi_detail.reduce((subSubSum, kpi) => {
                    return subSubSum + parseFloat($(`#score-${kpi.id}`).text());
                }, 0);
            }, 0);
        }, 0);
        updateScore(totalScore);
        dataKpi.forEach(perspective => {
            const totalScorePerspective = perspective.objective_detail.reduce((subSum, objective) => {
                return subSum + objective.kpi_detail.reduce((subSubSum, kpi) => {
                    return subSubSum + parseFloat($(`#score-${kpi.id}`).text());
                }, 0);
            }, 0);
            $(`#totalScore-${perspective.perspective_id}`).text(totalScorePerspective);
        });
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
            const response = await fetch(`${config.siteUrl}performance_appraisal/unit_performance_appraisal/submit_kpi`, {
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

    function handleFormEvents() {
        $('#btnTargetActual').click(() => $('#formTargetActual').submit());
        $('#formTargetActual').submit(event => {
            event.preventDefault();
            if (isSubmitting) return;
            isSubmitting = true;
            
            toggleButtonLoader('#btnTargetActual', true, { data: '' });
            _.debounce(async () => {
                if (mode === 'modalActual') {
                    await setupFormSubmission();
                }
                isSubmitting = false;
                toggleButtonLoader('#btnTargetActual', false);
            }, 500)();
            
        });
    }

    async function setupFormSubmission() {
        $('.error-message').html('');
        let url = '';
        let formData = '';
        
        url = 'performance_appraisal/unit_performance_appraisal/add_edit_actual';
        formData = $('#formTargetActual').serialize();

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
            await handleFormResponse(result);
        } catch (error) {
            displayToast('Error', 'Error while submitting data', 'error');
        }
    }

    async function handleFormResponse(response) {
        if (response.status === 'success') {
        displayToast('Success', response.message, 'success');
            $('#modalTargetActual').modal('hide');
            const id = $('#kpiUnitId').val();
            const actualId = response.data.id;
            let updateKpi = null;
            dataKpi.forEach(perspective => {
                perspective.objective_detail.forEach(objective => {
                    objective.kpi_detail.forEach(kpi => {
                        if (kpi.id === id) {
                            kpi.actual_id = actualId;
                            updateKpi = kpi;
                        }
                    });
                });
            });
            await setupValueKpi(updateKpi);
            await calculateDataPerformanceOnChange();
            $(`#actual-${id}`).removeClass('text-danger').addClass('text-success');
            $(`#actualId-${id}`).text(response.data.id);
            $(`#actualMonth-${id}`).text(response.data.actual);
        } else {
            displayToast('Error', response.message, 'error');
            $.each(response.errors, (key, value) => {
                if (mode === 'modalTarget') {
                    $(`#formTargetActual`).find(`#error-${key}`).html(value);
                }
            });
        }
    }

    function calculateCounter(counter, counterData) {
        if (counter.includes('SUM')) {
            // Rule of SUM
            // SUM value from month x to month y
            return counterData.reduce((a, b) => a + b, 0);
        } else if (counter.includes('AVG')) {
            // Rule of AVG
            // Average value from month x to month y
            const sum = counterData.reduce((a, b) => a + b, 0);
            return sum / counterData.length;
        } else if (counter.includes('LAST')) {
            // Rule of LAST
            // Last value of period
            return counterData[counterData.length - 1];
        } else {
            return "Error 404";
        }
    }

    function compare(a, operator, b) {
        switch (operator) {
            case '<=':
                return a <= b;
            case '>':
                return a > b;
            case '==':
                return a == b;
            case '<':
                return a < b;
            case '>=':
                return a >= b;
            default:
                throw new Error("Operator tidak valid");
        }
    }
    
    function calculateIndex(actual, target, polarization, polarizationData) {
        let valueapp = (actual / target) * 100;
        if (polarization.includes('Minimize')) {
            if (compare(valueapp, polarizationData['min_opr_1'], polarizationData['value_min_1'])) {
                return polarizationData['pol_min_index1'];
            } else if (compare(valueapp, polarizationData['min_opr_2'], polarizationData['value_min_1']) && compare(valueapp, polarizationData['min_opr_1'], polarizationData['value_min_2'])) {
                return polarizationData['pol_min_index2'];
            } else if (compare(valueapp, polarizationData['min_opr_2'], polarizationData['value_min_2']) && compare(valueapp, polarizationData['min_opr_1'], polarizationData['value_min_3'])) {
                return polarizationData['pol_min_index3'];
            } else if (compare(valueapp, polarizationData['min_opr_2'], polarizationData['value_min_3']) && compare(valueapp, polarizationData['min_opr_1'], polarizationData['value_min_4'])) {
                return polarizationData['pol_min_index4'];
            } else if (compare(valueapp, polarizationData['min_opr_2'], polarizationData['value_min_5'])) {
                return polarizationData['pol_min_index5'];
            } else {
                return "Error";
            }
        } else if (polarization.includes('Absolute')) {
            if (compare(valueapp, polarizationData['abs_opr_1'], target)) {
                return polarizationData['pol_abs_index_1'];
            } else if (compare(valueapp, polarizationData['abs_opr_2'], target)) {
                return polarizationData['pol_abs_index_2'];
            } else {
                return "Error";
            }
        } else if (polarization.includes('Stabilize')) {
            valueapp = actual - target;
            if (compare(valueapp, polarizationData.stab_opr_1_target, target)) {
                return polarizationData.pol_stab_index_1;
            } else if (compare(valueapp, polarizationData.stab_opr_2_target, target)) {
                return polarizationData.pol_stab_index_2;
            } else if (compare(valueapp, polarizationData.stab_opr_2_target, target)) {
                return polarizationData.pol_stab_index_3;
            } else if (compare(valueapp, polarizationData.stab_opr_2_target, target)) {
                return polarizationData.pol_stab_index_4;
            } else if (compare(valueapp, polarizationData.stab_opr_2_target, target)) {
                return polarizationData.pol_stab_index_5;
            } else {
                return "Error";
            }
        } else if (polarization.includes('Maximize')) {
            return "Can't process Maximize polarization for temporary";
        } else {
            return "Error";
        }
    }

    function compareIndexScore(value, operator, threshold) {
        if (operator === null || operator === '') {
            return true;
        }
        switch (operator) {
            case '>=':
                return value >= threshold;
            case '<':
                return value < threshold;
            default:
                throw new Error(`Invalid operator: ${operator}`);
        }
    }
    
    function getIndexValue(value) {
        for (const rule of indexScoreRule) {
            if (compareIndexScore(value, rule.operator_1, rule.value_1) && compareIndexScore(value, rule.operator_2, rule.value_2)) {
                return rule.index_value;
            }
        }
        return 1;
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