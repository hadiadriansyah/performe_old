<div class="page-header">
    <h3 class="page-title">
        <span class="page-title-icon bg-gradient-primary text-white me-2">
            <i class="mdi mdi-chart-bar"></i>
        </span> KPI Unit Type
    </h3>
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="#">Mapping</a></li>
            <li class="breadcrumb-item"><a href="#">KPI</a></li>
            <li class="breadcrumb-item active" aria-current="page">Unit Type</li>
        </ol>
    </nav>
</div>
<div class="row">
    <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
            <div class="card-body">
                <div class="container-fluid mt-4">
                    <div class="card">
                        <div class="card-header bg-gradient-primary text-white d-flex justify-content-between align-items-center">
                            <h4 class="mb-0">Unit KPIs</h4>
                            <button type="button" class="btn btn-light btn-submit-kpi is-submit-kpi d-none" disabled>Submit</button>
                            <div class="btn-cancel-generate-submit-kpi is-submit-kpi d-none">
                                <?php if (!$is_admin): ?>
                                    <button type="button" class="btn btn-light btn-cancel-submit-kpi">Cancel Submit</button>
                                <?php endif; ?>
                                <button type="button" class="btn btn-light btn-generate-kpi">Generate</button>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="row d-flex align-items-center">
                                <div class="col-md-6 col-sm-6">
                                    <input type="hidden" id="kpiUnitTypeYearPeriodId" value="<?= $year_period_id ?>">
                                    <input type="hidden" id="kpiUnitTypeUnitType" value="<?= $unit_type ?>">
                                    <input type="hidden" id="kpiUnitTypeGroupId" value="<?= $group_id ?>">
                                    <div class="row">
                                        <div class="col-12 mb-2">
                                            <label for="unitTypeName" class="form-label me-2">Unit Type Name</label>
                                            <input type="text" class="form-control" id="unitTypeName" value="<?= $unit_type_name ?>" readonly>
                                        </div>
                                        <div class="col-12 mb-2">
                                            <label for="yearPeriodName" class="form-label me-2">Year Period</label>
                                            <input type="text" class="form-control" id="yearPeriodName" value="<?= $year_period_name ?>" readonly>
                                        </div>
                                        <div class="col-12 mb-2">
                                            <label for="groupName" class="form-label me-2">Group</label>
                                            <input type="text" class="form-control" id="groupName" value="<?= $group_name ?>" readonly>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-3 offset-md-3 col-sm-6">
                                    <div class="card aligner-wrapper w-100">
                                        <div class="card-body d-flex align-items-center">
                                            <div class="absolute left top bottom h-100 v-strock-2 bg-success me-2"></div>
                                            <div>
                                                <p class="text-muted mb-2">Percentage</p>
                                                <h1 class="font-weight-medium mb-2" id="percentage">0 %</h1>
                                                <input type="hidden" id="percentageInput" value="0">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr class="mt-5">
                            <div class="row">
                                <div class="col-md-12 text-end">
                                    <button class="btn btn-gradient-primary btn-modal is-submit-kpi d-none" type="button" data-bs-toggle="modal" data-bs-target="#modalAddKpi" data-mode="modalAddKpi"> Add KPI </button>
                                </div>
                                <div class="modal fade" id="modalAddKpi" tabindex="-1" role="dialog" aria-labelledby="modalLabelAddKpi" aria-hidden="true">
                                    <div class="modal-dialog" role="document">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title" id="modalLabelAddKpi">Add KPI</h5>
                                                <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div class="modal-body">
                                                <form id="formAddKpi">
                                                    <div class="form-group row">
                                                        <label for="perspectiveId" class="col-sm-3 col-form-label">Perspective</label>
                                                        <div class="col-sm-9">
                                                            <select type="text" class="form-control select2-js-server" style="width: 100%;" 
                                                            id="perspectiveId" name="perspective_id" placeholder="Perspective">
                                                                <option value="">-- Choose --</option>
                                                            </select>
                                                            <div class="error-message text-small text-danger mt-1" id="error-perspective_id"></div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group row">
                                                        <label for="objectiveId" class="col-sm-3 col-form-label">Objective</label>
                                                        <div class="col-sm-9">
                                                            <select type="text" class="form-control select2-js-server" style="width: 100%;" 
                                                            id="objectiveId" name="objective_id" placeholder="Objective">
                                                                <option value="">-- Choose --</option>
                                                            </select>
                                                            <div class="error-message text-small text-danger mt-1" id="error-objective_id"></div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group row">
                                                        <label for="numberOfRows" class="col-sm-3 col-form-label">Row</label>
                                                        <div class="col-sm-9">
                                                            <input type="number" class="form-control" id="numberOfRows" name="number_of_rows" min="1" value="1" placeholder="Number of Rows">
                                                        </div>
                                                    </div>
                                                    <button type="submit" class="btn btn-gradient-primary d-none">Save</button>
                                                </form>
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" id="btnAddKpi" class="btn btn-gradient-primary">
                                                    <div class="loader-container">Add</div>
                                                </button>
                                                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Close</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="kpiContainer"></div>
                            
                            <div class="modal fade" id="modalGenerate" tabindex="-1" role="dialog" aria-labelledby="modalLabelGenerateKpi" aria-hidden="true">
                                <div class="modal-dialog" role="document">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="modalLabelGenerateKpi">Generate KPI Unit</h5>
                                            <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div class="modal-body">
                                            <div class="d-flex justify-content-between">
                                                <small>Generate KPI Unit</small>
                                                <small id="countGenerate">0/0</small>
                                            </div>
                                            <div class="progress progress-lg mt-2">
                                                <div class="progress-bar bg-danger" id="progressBar" role="progressbar" style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="0">0%</div>
                                            </div>
                                            <div id="successMessages" class="mt-3"></div>
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-light" data-bs-dismiss="modal">Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>