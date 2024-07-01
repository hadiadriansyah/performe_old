<div class="page-header">
    <h3 class="page-title">
        <span class="page-title-icon bg-gradient-primary text-white me-2">
            <i class="mdi mdi-chart-bar"></i>
        </span> KPI Position Type
    </h3>
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="#">Mapping</a></li>
            <li class="breadcrumb-item"><a href="#">KPI</a></li>
            <li class="breadcrumb-item active" aria-current="page">Position Type</li>
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
                            <h4 class="mb-0">Position KPIs</h4>
                            <button type="button" class="btn btn-light btn-submit-kpi is-submit-kpi d-none" disabled>Submit</button>
                            <div class="btn-cancel-submit-kpi is-submit-kpi d-none">

                                <?php if ($is_admin == SYSTEM_ADMIN): ?>
                                    <button type="button" class="btn btn-light btn-cancel-submit-kpi">Cancel Submit</button>
                                <?php endif; ?>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="row d-flex align-items-center">
                                <div class="col-md-6 col-sm-6">
                                    <input type="hidden" id="kpiPositionTypeYearPeriodId" value="<?= $year_period_id ?>">
                                    <input type="hidden" id="kpiPositionTypePositionType" value="<?= $position_type ?>">
                                    <input type="hidden" id="kpiPositionTypeGroupPositionTypeId" value="<?= $group_position_type_id ?>">
                                    <div class="row">
                                        <div class="col-12 mb-2">
                                            <label for="positionTypeName" class="form-label me-2">Position Type Name</label>
                                            <input type="text" class="form-control" id="positionTypeName" value="<?= $position_type_name ?>" readonly>
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
                            <div id="createKpi" class="row d-flex align-items-center">
                                <div class="form-group col-md-4 col-sm-6">
                                    <label for="groupUnitTypeId" class="mb-3">Group Unit Type</label>
                                    <select class="form-select select2-js-basic" id="groupUnitTypeId" name="group_unit_type_id">
                                        <option value=""> - Choose - </option>
                                    </select>
                                    <div class="error-message text-small text-danger mt-1" id="error-group_unit_type_id"></div>
                                </div>
                                <div class="col-md-4 col-sm-12 mt-2 mt-md-0">
                                    <button type="button" id="btnCreateKPI" class="btn btn-gradient-primary btn-md">Create KPI</button>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-12">
                                    <div id="kpiContainer"></div>
                                </div>
                                <div class="col-4">
                                    <div id="kpiUnitTypeContainer"></div>
                                </div>
                                <div class="col-8">
                                    <div id="kpiPositionTypeContainer"></div>
                                </div>
                            </div>
                            
                            <div class="modal fade" id="modalGenerate" tabindex="-1" role="dialog" aria-labelledby="modalLabelGenerateKpi" aria-hidden="true">
                                <div class="modal-dialog" role="document">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="modalLabelGenerateKpi">Generate KPI Position</h5>
                                            <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div class="modal-body">
                                            <div class="d-flex justify-content-between">
                                                <small>Generate KPI Position</small>
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