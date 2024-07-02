(function($) {
    'use strict';

    let mode;
    let isSubmitting = false;
    const kpiPositionTypeYearPeriodId = getkpiPositionTypeYearPeriodIdVal();
    const kpiPositionTypePositionType = getKpiPositionTypePositionTypeVal();
    const kpiPositionTypeGroupPositionTypeId = getKpiPositionTypeGroupPositionTypeIdVal();
    let kpiUnitTypes = [];
    let dataKpiUnitType = [];
    let dataKpiPositionType = [];
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

    function getkpiPositionTypeYearPeriodIdVal() {
        return $('#kpiPositionTypeYearPeriodId').val();
    }
    
    function getKpiPositionTypePositionTypeVal() {
        return $('#kpiPositionTypePositionType').val();
    }

    function getKpiPositionTypeGroupPositionTypeIdVal() {
        return $('#kpiPositionTypeGroupPositionTypeId').val();
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
        const kpiPositionTypes = await getgetKpiPositionType();
        if (kpiPositionTypes && kpiPositionTypes.length > 0) {
            $('#createKpi').addClass('d-none');
            kpiUnitTypes = await getKpiUnitTypeByGroupUnitTypeId(kpiPositionTypes);
            dataKpiUnitType = await processKpiUnitTypeData(kpiUnitTypes);
            dataKpiPositionType = await processKpiPositionTypeData(kpiPositionTypes);
            const totalWeightSumKpiPositionType = dataKpiPositionType.reduce((sum, item) => sum + parseFloat(item.total_weight_perspective), 0);
            updatePercentage(totalWeightSumKpiPositionType);
            renderKpiUnitType();
            renderKpiPositionType();
        } else {
            $('#createKpi').removeClass('d-none');
        }
    }
    
    async function getKpiUnitTypeByGroupUnitTypeId(kpiPositionType) {
        const kpiPositionTypeGroupUnitTypeId = kpiPositionType[0].group_unit_type_id;
        try {
            const response = await fetch(`${config.siteUrl}mapping/kpi_position_type/get_kpi_unit_type_by_group_unit_type_id`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    year_period_id: kpiPositionTypeYearPeriodId,
                    group_unit_type_id: kpiPositionTypeGroupUnitTypeId,
                }).toString()
            });
            const result = await response.json();
            const data = result.data;
            return data;
        } catch (error) {
            return false;
        }
    }

    async function getgetKpiPositionType() {
        if (kpiPositionTypePositionType && kpiPositionTypeYearPeriodId && kpiPositionTypeGroupPositionTypeId) {
            try {
                const response = await fetch(`${config.siteUrl}mapping/kpi_position_type/get_kpi_position_type`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({
                        position_type: kpiPositionTypePositionType,
                        year_period_id: kpiPositionTypeYearPeriodId,
                        group_position_type_id: kpiPositionTypeGroupPositionTypeId,
                    }).toString()
                });
                const result = await response.json();
                const data = result.data;
                return data;
            } catch (error) {
                return false;
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

    async function processKpiUnitTypeData(kpiUnitType) {
        const groupedData = kpiUnitType.reduce((acc, item) => {
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
            return acc;
        }, {});

        return Object.values(groupedData);
    }

    async function processKpiPositionTypeData(kpiPositionType) {
        const groupedData = kpiPositionType.reduce((acc, item) => {
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
                position_type: item.position_type,
                group_position_type_id: item.group_position_type_id,
                group_unit_type_id: item.group_unit_type_id,
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

    function renderKpiUnitType() {
        if (dataKpiUnitType.length === 0) return;
        
        let kpis = [];
        let html = '';
    
        dataKpiUnitType.forEach(perspective => {
            html += `
                <div class="row mb-3 mt-3">
                    <div class="col-md-12">
                        <div class="card">
                            <div class="card-header bg-info text-white d-flex justify-content-between align-items-center">
                                <h5>${perspective.perspective}</h5>
                                <span class="badge bg-danger" id="kpiUnitTypeTotalWeight-${perspective.perspective_id}">${perspective.total_weight_perspective} %</span>
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
                                    <th>Weight (%)</th>
                                    <th>Measure</th>
                                    <th>Counter</th>
                                    <th>Polarization</th>
                                </tr>
                            </thead>
                            <tbody>
                `;
    
                let no = 1;
                objective.kpi_detail.forEach(kpi => {
                    kpis.push(kpi);
                    const isChecked = dataKpiPositionType.some(perspective => 
                        perspective.objective_detail.some(objective => 
                            objective.kpi_detail.some(posType => {
                                return posType.kpi_id === kpi.kpi_id && 
                                               posType.perspective_id === kpi.perspective_id && 
                                               posType.objective_id === kpi.objective_id;
                            })
                        )
                    ) ? 'checked' : '';
                    html += `
                        <tr>
                            <td>${no++}</td>
                            <td class="is-submit-kpi">
                                <div class="form-check w-100">
                                    <label class="form-check-label"><input id="kpiUnitTypeCheckId-${kpi.id}" class="checkbox" type="checkbox" data-bs-toggle="tooltip" data-placement="right" title="check/uncheck" value="${kpi.id}" ${isChecked}></label>
                                </div>
                            </td>
                            <td>
                                <select type="text" class="form-control select2-js-kpi" style="width: 200px" id="kpiUnitTypeKpiId-${kpi.id}" name="kpi_unit_type_kpi_id_${kpi.id}" data-kpi-unit-type-kpi-id="${kpi.id}" disabled>
                                    <option value="">- Choose -</option>
                                </select>
                                <div class="error-message text-small text-danger mt-1" id="error-kpi_unit_type_kpi_id_${kpi.id}"></div>
                            </td>
                            <td>
                                <input type="text" class="form-control" id="kpiUnitTypeWeight-${kpi.id}" name="kpi_unit_type_weight_${kpi.id}" value="${kpi.weight}" disabled>
                            </td>
                            <td>
                                <span id="kpiUnitTypeMeasurement-${kpi.id}">-</span>
                            </td>
                            <td>
                                <span id="kpiUnitTypeCounter-${kpi.id}">-</span>
                            </td>
                            <td>
                                <span id="kpiUnitTypePolarization-${kpi.id}">-</span>
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

        $('#kpiUnitTypeContainer').html(html);
        initializeSelect2();
        $(".form-check label,.form-radio label").append('<i class="input-helper"></i>');
        setupValueKpiUnitTypes(kpis);
        setupCheckboxEventHandlers();
    }
    
    function setupCheckboxEventHandlers() {
        $('.checkbox').on('change', async function() {
            toggleBarLoader(this, true);
            const kpiUnitTypeId = $(this).val();
            if ($(this).is(':checked')) {
                await insertKpiPositionType(kpiUnitTypeId, this);
                await new Promise(resolve => setTimeout(resolve, 300));
            } else {
                await deleteKpiPositionType(kpiUnitTypeId, this);
                await new Promise(resolve => setTimeout(resolve, 300));
            }
            toggleBarLoader(this, false);
        });
    }

    async function insertKpiPositionType(kpiUnitTypeId, checkbox) {
        const kpiUnitType = kpiUnitTypes.find(unitType => unitType.id === kpiUnitTypeId);
        const data = {
            id: generateUUIDv7(),
            position_type: kpiPositionTypePositionType,
            year_period_id: kpiPositionTypeYearPeriodId,
            perspective_id: kpiUnitType.perspective_id,
            objective_id: kpiUnitType.objective_id,
            kpi_id: kpiUnitType.kpi_id,
            weight: 0,
            is_submit: 0,
            group_position_type_id: kpiPositionTypeGroupPositionTypeId,
            group_unit_type_id: kpiUnitType.group_unit_type_id,
        }
        try {
            const response = await fetch(`${config.siteUrl}mapping/kpi_position_type/insert_kpi_position_type`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(data).toString()
            });
            const result = await response.json();
            if (result.status === 'success') {
                displayToast('Success', result.message, 'success');
                updateKpiIdInDataKPI(result.data, 'insert');
            } else {
                displayToast('Error', result.message, 'error');
                $(checkbox).prop('checked', false);
            }
        } catch (error) {
            displayToast('Error', 'Error insert kpi position type', 'error');
            $(checkbox).prop('checked', false);
        }
    }

    async function deleteKpiPositionType(kpiUnitTypeId, checkbox) {
        const kpiUnitType = kpiUnitTypes.find(unitType => unitType.id === kpiUnitTypeId);
        const data = {
            position_type: kpiPositionTypePositionType,
            year_period_id: kpiPositionTypeYearPeriodId,
            perspective_id: kpiUnitType.perspective_id,
            objective_id: kpiUnitType.objective_id,
            kpi_id: kpiUnitType.kpi_id,
            group_position_type_id: kpiPositionTypeGroupPositionTypeId,
            group_unit_type_id: kpiUnitType.group_unit_type_id,
        }
        try {
            const response = await fetch(`${config.siteUrl}mapping/kpi_position_type/delete_kpi_position_type`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(data).toString()
            });
            const result = await response.json();
            if (result.status === 'success') {
                displayToast('Success', result.message, 'success');
                await updateKpiIdInDataKPI(data, 'delete');
            } else {
                displayToast('Error', result.message, 'error');
                $(checkbox).prop('checked', true);
            }
        } catch (error) {
            displayToast('Error', 'Error delete kpi position type', 'error');
            $(checkbox).prop('checked', true);
        }

    }

    async function updateKpiIdInDataKPI(data, action) {
        if (action === 'insert') {
            let id = data.id;
            let perspectiveFound = false;
            let objectiveFound = false;

            dataKpiPositionType.forEach(perspective => {
                if (perspective.perspective_id === data.perspective_id) {
                    perspectiveFound = true;
                    perspective.objective_detail.forEach(objective => {
                        if (objective.objective_id === data.objective_id) {
                            objectiveFound = true;
                            let kpiFound = false;
                            objective.kpi_detail.forEach(kpi => {
                                if (kpi.id === id) {
                                    kpi.kpi_id = data.kpi_id;
                                    kpi.weight = parseFloat(data.weight);
                                    kpi.mode = '';
                                    kpiFound = true;
                                }
                            });
                            if (!kpiFound) {
                                objective.kpi_detail.push({
                                    id: data.id,
                                    perspective_id: data.perspective_id,
                                    objective_id: data.objective_id,
                                    kpi_id: data.kpi_id,
                                    position_type: data.position_type,
                                    group_position_type_id: data.group_position_type_id,
                                    group_unit_type_id: data.group_unit_type_id,
                                    weight: parseFloat(data.weight),
                                    score: 0,
                                    mode: ''
                                });
                            }
                            objective.total_weight = objective.kpi_detail.reduce((sum, kpi) => sum + parseFloat(kpi.weight), 0);
                        }
                    });
                    perspective.total_weight_perspective = perspective.objective_detail.reduce((sum, objective) => sum + parseFloat(objective.total_weight), 0);
                }
            });

            if (!perspectiveFound) {
                dataKpiPositionType.push({
                    perspective_id: data.perspective_id,
                    perspective: data.perspective,
                    is_submit: 0,
                    total_weight_perspective: parseFloat(data.weight),
                    objective_detail: [{
                        objective_id: data.objective_id,
                        objective: data.objective,
                        kpi_detail: [{
                            id: data.id,
                            perspective_id: data.perspective_id,
                            objective_id: data.objective_id,
                            kpi_id: data.kpi_id,
                            position_type: data.position_type,
                            group_position_type_id: data.group_position_type_id,
                            group_unit_type_id: data.group_unit_type_id,
                            weight: parseFloat(data.weight),
                            score: 0,
                            mode: ''
                        }],
                        total_weight: parseFloat(data.weight)
                    }]
                });
            } else if (!objectiveFound) {
                dataKpiPositionType.forEach(perspective => {
                    if (perspective.perspective_id === data.perspective_id) {
                        perspective.objective_detail.push({
                            objective_id: data.objective_id,
                            objective: data.objective,
                            kpi_detail: [{
                                id: data.id,
                                perspective_id: data.perspective_id,
                                objective_id: data.objective_id,
                                kpi_id: data.kpi_id,
                                position_type: data.position_type,
                                group_position_type_id: data.group_position_type_id,
                                group_unit_type_id: data.group_unit_type_id,
                                weight: parseFloat(data.weight),
                                score: 0,
                                mode: ''
                            }],
                            total_weight: parseFloat(data.weight)
                        });
                        perspective.total_weight_perspective += parseFloat(data.weight);
                    }
                });
            }
        } else if (action === 'delete') {
            dataKpiPositionType = dataKpiPositionType.filter(perspective => {
                perspective.objective_detail = perspective.objective_detail.filter(objective => {
                    objective.kpi_detail = objective.kpi_detail.filter(kpi => 
                        !(kpi.position_type === data.position_type &&
                            kpi.kpi_id === data.kpi_id &&
                            kpi.perspective_id === data.perspective_id &&
                            kpi.objective_id === data.objective_id &&
                            kpi.group_position_type_id === data.group_position_type_id &&
                            kpi.group_unit_type_id === data.group_unit_type_id)
                    );
                    return objective.kpi_detail.length > 0;
                });
                return perspective.objective_detail.length > 0;
            });
        }
        
        renderKpiPositionType();
    }

    function setupValueKpiUnitTypes(kpis) {
        kpis.forEach(async kpi => {
            setupValueKpiUnitType(kpi);
        });
    }

    async function setupValueKpiUnitType(kpi) {
        if (kpi.kpi_id) {
            const data = await getKpiById(kpi.kpi_id);
            if (data) {
                $(`#kpiUnitTypeMeasurement-${kpi.id}`).text(data.measurement);
                $(`#kpiUnitTypeCounter-${kpi.id}`).text(data.counter);
                $(`#kpiUnitTypePolarization-${kpi.id}`).text(data.polarization);
                
                const newOption = new Option(data.kpi, data.id, true, true);
                $(`#kpiUnitTypeKpiId-${kpi.id}`).append(newOption).trigger('change');
            }

        }
    }

    function renderKpiPositionType() {
        if (dataKpiPositionType.length === 0) {
            $('#kpiUnitTypeContainer').empty();
            $('#kpiPositionTypeContainer').empty();
            initializeData();
            return;
        }
        let kpis = [];
        let html = '';
    
        dataKpiPositionType.forEach(perspective => {
            html += `
                <div class="row mb-3 mt-3">
                    <div class="col-md-12">
                        <div class="card">
                            <div class="card-header bg-info text-white d-flex justify-content-between align-items-center">
                                <h5>${perspective.perspective}</h5>
                                <span class="badge bg-danger" id="kpiPositionTypeTotalWeight-${perspective.perspective_id}">${perspective.total_weight_perspective} %</span>
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
                                    <th>Weight (%)</th>
                                    <th>Measure</th>
                                    <th>Counter</th>
                                    <th>Polarization</th>
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
                                <button type="button" class="btn btn-sm btn-success btn-icon-text btn-save d-none" data-kpi-position-type-id="${kpi.id}" data-kpi-position-type-perspective-id="${kpi.perspective_id}" data-kpi-position-type-objective-id="${kpi.objective_id}" data-bs-toggle="tooltip" data-placement="right" title="Save">
                                    <i class="mdi mdi-check"></i>
                                </button>
                                <button type="button" class="btn btn-sm btn-danger btn-icon-text btn-cancel d-none" data-kpi-position-type-id="${kpi.id}" data-bs-toggle="tooltip" data-placement="right" title="Cancel">
                                    <i class="mdi mdi-close"></i>
                                </button>
                                <button type="button" class="btn btn-sm btn-warning btn-icon-text btn-edit" data-kpi-position-type-id="${kpi.id}" data-bs-toggle="tooltip" data-placement="right" title="Edit">
                                    <i class="mdi mdi-pencil"></i>
                                </button>
                            </td>
                            <td>
                                <select type="text" class="form-control select2-js-kpi" style="width: 200px" id="kpiPositionTypeKpiId-${kpi.id}" name="kpi_position_type_kpi_id_${kpi.id}" data-kpi-position-type-kpi-id="${kpi.id}" disabled>
                                    <option value="">- Choose -</option>
                                </select>
                                <div class="error-message text-small text-danger mt-1" id="error-kpi_position_type_kpi_id_${kpi.id}"></div>
                            </td>
                            <td>
                                <input type="text" class="form-control" id="kpiPositionTypeWeight-${kpi.id}" name="kpi_position_type_weight_${kpi.id}" value="${kpi.weight}" disabled>
                                
                                <div class="error-message text-small text-danger mt-1" id="error-kpi_position_type_weight_${kpi.id}"></div>
                            </td>
                            <td>
                                <span id="kpiPositionTypeMeasurement-${kpi.id}">-</span>
                            </td>
                            <td>
                                <span id="kpiPositionTypeCounter-${kpi.id}">-</span>
                            </td>
                            <td>
                                <span id="kpiPositionTypePolarization-${kpi.id}">-</span>
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

        $('#kpiPositionTypeContainer').html(html);
        $('[data-bs-toggle="tooltip"]').tooltip();
        toggleSubmitButton();
        initializeSelect2();
        setupValueKpiPositionTypes(kpis);
    }

    function setupValueKpiPositionTypes(kpis) {
        kpis.forEach(async kpi => {
            setupValueKpiPositionType(kpi);
        });
    }

    async function setupValueKpiPositionType(kpi) {
        if (kpi.kpi_id) {
            const data = await getKpiById(kpi.kpi_id);
            if (data) {
                $(`#kpiPositionTypeMeasurement-${kpi.id}`).text(data.measurement);
                $(`#kpiPositionTypeCounter-${kpi.id}`).text(data.counter);
                $(`#kpiPositionTypePolarization-${kpi.id}`).text(data.polarization);
                
                const newOption = new Option(data.kpi, data.id, true, true);
                $(`#kpiPositionTypeKpiId-${kpi.id}`).append(newOption).trigger('change');
            }

        }
    }

    async function getKpiById(id) {
        try {
            const response = await fetch(`${config.siteUrl}mapping/kpi_position_type/get_kpi_by_id/${id}`, { method: 'GET' });
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
                    url: `${config.siteUrl}mapping/kpi_position_type/get_kpi_unit_type_groups_options`,
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

        $('#perspectiveId').each(function () {
            $(this).select2({
                theme: 'bootstrap',
                dropdownParent: $(this).parent(),
                ajax: {
                    url: `${config.siteUrl}mapping/kpi_position_type/get_perspective_options_by_year_period_id`,
                    dataType: 'json',
                    delay: 250,
                    data: params => ({
                        q: params.term || '',
                        page: params.page || 1,
                        year_period_id: kpiPositionTypeYearPeriodId
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
                    url: `${config.siteUrl}mapping/kpi_position_type/get_objective_options_by_year_period_id`,
                    dataType: 'json',
                    delay: 250,
                    data: params => ({
                        q: params.term || '',
                        page: params.page || 1,
                        year_period_id: kpiPositionTypeYearPeriodId
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
                    url: `${config.siteUrl}mapping/kpi_position_type/get_kpi_options_by_year_period_id`,
                    dataType: 'json',
                    delay: 250,
                    data: params => ({
                        q: params.term || '',
                        page: params.page || 1,
                        year_period_id: kpiPositionTypeYearPeriodId
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
            const id = $(this).attr('data-kpi-position-type-id');
            
            const selectedOption = $(`#kpiPositionTypeKpiId-${id}`).find('option:selected');
            const selectedValue = selectedOption.val();
            const selectedText = selectedOption.text();
            const dataBeforeEdit = {
                id: id,
                kpi_id: selectedValue,
                kpi_name: selectedText,
                weight: $(`#kpiPositionTypeWeight-${id}`).val(),
                score: $(`#kpiPositionTypeScore-${id}`).text()
            }

            dataKpiBeforeEdit.push(dataBeforeEdit);

            toggleEditButtons(id, false);
        });
        
        $(document).on('click', '.btn-save', _.debounce(async function() {
            const id = $(this).attr('data-kpi-position-type-id');
            const perspectiveId = $(this).attr('data-kpi-position-type-perspective-id');
            const objectiveId = $(this).attr('data-kpi-position-type-objective-id');
        
            const kpiId = $(`#kpiPositionTypeKpiId-${id}`).val();
            const weight = $(`#kpiPositionTypeWeight-${id}`).val();
            
            const data = {
                id: id,
                position_type: kpiPositionTypePositionType,
                year_period_id: kpiPositionTypeYearPeriodId,
                group_position_type_id: kpiPositionTypeGroupPositionTypeId,
                perspective_id: perspectiveId,
                objective_id: objectiveId,
                kpi_id: kpiId,
                weight: weight,
            }
            toggleButtonLoader(this, true, { data: '' });

            if (checkPercentage(data) > 100) {
                displayToast('Error', 'Total weight is more than 100%, please check your data.', 'error');
            } else {
                await updateKpiPositionType(data);
                calculateAndDisplayPercentageAndTotalWeight();
            }
            toggleButtonLoader(this, false, { data: '<i class="mdi mdi-check"></i>' });
        }, 300));

        $(document).on('click', '.btn-cancel', function() {
            const id = $(this).attr('data-kpi-position-type-id');
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
                position_type: kpiPositionTypePositionType,
                year_period_id: kpiPositionTypeYearPeriodId,
                group_position_type_id: kpiPositionTypeGroupPositionTypeId,
                is_submit: 1
            }

            confirmSubmit(data);
        });

        $(document).on('click', '.btn-cancel-submit-kpi', function() {
            const data = {
                position_type: kpiPositionTypePositionType,
                year_period_id: kpiPositionTypeYearPeriodId,
                group_position_type_id: kpiPositionTypeGroupPositionTypeId,
                is_submit: 0
            }

            confirmSubmit(data);
        });

        $('#modalPerformance').on('shown.bs.modal', () => {});     

        $('#modalPerformance').on('hidden.bs.modal', () => {});
    }

    function checkPercentage(data) {
        let totalWeight = 0;
        dataKpiPositionType.forEach(perspective => {
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
        $(`.btn-save[data-kpi-position-type-id="${id}"]`).toggleClass('d-none', isCancel);
        $(`.btn-cancel[data-kpi-position-type-id="${id}"]`).toggleClass('d-none', isCancel);
        $(`.btn-edit[data-kpi-position-type-id="${id}"]`).toggleClass('d-none', !isCancel);
        $(`.btn-delete[data-kpi-position-type-id="${id}"]`).toggleClass('d-none', !isCancel);
        $(`#kpiPositionTypeWeight-${id}`).prop('disabled', isCancel);
    }

    function restoreKpiData(id) {
        const dataBeforeEditIndex = dataKpiBeforeEdit.findIndex(item => item.id === id);
        if (dataBeforeEditIndex !== -1) {
            const dataBeforeEdit = dataKpiBeforeEdit[dataBeforeEditIndex];
            const newOption = new Option(dataBeforeEdit.kpi_name, dataBeforeEdit.kpi_id, true, true);
            $(`#kpiPositionTypeKpiId-${id}`).append(newOption).trigger('change');
            $(`#kpiPositionTypeWeight-${id}`).val(dataBeforeEdit.weight);
            
            dataKpiBeforeEdit.splice(dataBeforeEditIndex, 1);
        }
    }

    function calculateAndDisplayPercentageAndTotalWeight() {
        let totalWeightSum = 0;
        let totalPercentage = 0;
    
        dataKpiPositionType.forEach(perspective => {
            totalWeightSum += perspective.total_weight_perspective;
            perspective.objective_detail.forEach(objective => {
                totalPercentage += objective.total_weight;
            });
            $('#kpiPositionTypeTotalWeight-' + perspective.perspective_id).text(perspective.total_weight_perspective + ' %');
        });
    
        updatePercentage(totalPercentage);
    }

    async function updateKpiPositionType(data) {
        try {
            const response = await fetch(`${config.siteUrl}mapping/kpi_position_type/update_kpi_position_type`, {
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

            updateKpiIdInDataKpi(prevData, currData);
        } else {
            displayToast('Error', response.message, 'error');
            $.each(response.errors, (key, value) => {
                $(`#error-kpi_position_type_${key}_${data.id}`).html(value);
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
            const response = await fetch(`${config.siteUrl}mapping/kpi_position_type/submit_kpi`, {
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
                const response = await fetch(`${config.siteUrl}mapping/kpi_position_type/delete`, {
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
            const response = await fetch(`${config.siteUrl}mapping/kpi_position_type/create_kpi`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    year_period_id: kpiPositionTypeYearPeriodId,
                    position_type: kpiPositionTypePositionType,
                    group_position_type_id: kpiPositionTypeGroupPositionTypeId,
                    group_unit_type_id: $('#groupUnitTypeId').val(),
                }).toString()
            });
            const result = await response.json();
            if (result.status === 'success') {
                $('#kpiContainer').empty();
                initializeData();
                displayToast('Success', 'Your data has been created', 'success');
            } else {
                
                $('#kpiContainer').html(`
                    <div class="alert alert-fill-danger" role="alert">
                        <i class="mdi mdi-alert-circle"></i> Oh snap!. KPI for this unit is not available. Please check again and try submitting.
                    </div>
                `);
                // displayToast('Error', 'There was an error creating the data.', 'error');
            }
        } catch (error) {
            displayToast('Error', 'There was an error creating the data.', 'error');
        }
        toggleButtonLoader('#btnCreateKPI', false, { data: 'Create KPI' });
    }

    

    function updateKpiIdInDataKpi(data) {
        let updateKpi = null;
        let id = data.id;

        dataKpiPositionType.forEach(perspective => {
            perspective.objective_detail.forEach(objective => {
                objective.kpi_detail.forEach(kpi => {
                    if (kpi.id === id) {
                        kpi.weight = parseFloat(data.weight);
                        updateKpi = kpi;
                    }
                });
                objective.total_weight = objective.kpi_detail.reduce((sum, kpi) => sum + parseFloat(kpi.weight), 0);
            });
            perspective.total_weight_perspective = perspective.objective_detail.reduce((sum, objective) => sum + parseFloat(objective.total_weight), 0);
        });

        setupValueKpiPositionType(updateKpi);

        const dataKpiBeforeEditIndex = dataKpiBeforeEdit.findIndex(item => item.id === id);
        if (dataKpiBeforeEditIndex !== -1) {
            dataKpiBeforeEdit.splice(dataKpiBeforeEditIndex, 1);
        }
        toggleEditButtons(id, true);
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