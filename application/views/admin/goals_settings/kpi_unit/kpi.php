<div class="page-header">
    <h3 class="page-title">
        <span class="page-title-icon bg-gradient-primary text-white me-2">
            <i class="mdi mdi-chart-bar"></i>
        </span> KPI Unit
    </h3>
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="#">Goals Settings</a></li>
            <li class="breadcrumb-item active" aria-current="page">Unit</li>
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
                            <?php if ($is_admin == SYSTEM_ADMIN): ?>
                                <button type="button" class="btn btn-light btn-cancel-submit-kpi is-submit-kpi d-none">Cancel Submit</button>
                            <?php endif; ?>
                        </div>
                        <div class="card-body">
                            <div class="row d-flex align-items-center">
                                <div class="col-md-6 col-sm-6">
                                    <input type="hidden" id="kpiUnitYearPeriodId" value="<?= $year_period_id ?>">
                                    <input type="hidden" id="kpiUnitUnitId" value="<?= $unit_id ?>">
                                    <div class="row">
                                        <div class="col-12 mb-2">
                                            <label for="unitName" class="form-label me-2">Unit Name</label>
                                            <input type="text" class="form-control" id="unitName" value="<?= $unit_name ?>" readonly>
                                        </div>
                                        <div class="col-12">
                                            <label for="yearPeriodName" class="form-label me-2">Year Period</label>
                                            <input type="text" class="form-control" id="yearPeriodName" value="<?= $year_period_name ?>" readonly>
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
                            <div class="modal fade" id="modalTargetActual" tabindex="-1" role="dialog" aria-labelledby="modalLabelTargetActual" aria-hidden="true">
                                <div class="modal-dialog" role="document">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="modalLabelTargetActual">Target/Actual</h5>
                                            <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div class="modal-body">
                                            <form id="formTargetActual">
                                                <input type="hidden" id="kpiUnitId" name="kpi_unit_id">
                                                <input type="hidden" id="modeKpi" name="mode">
                                                <input type="hidden" id="targetId" name="target_id">
                                                <input type="hidden" id="actualId" name="actual_id">
                                                <div class="form-group row">
                                                    <label for="kpiName" class="col-sm-4 col-form-label">KPI</label>
                                                    <div class="col-sm-8">
                                                        <input type="text" class="form-control" id="kpiName" name="kpiName" placeholder="KPI" readonly>
                                                    </div>
                                                </div>
                                                <div class="form-group row">
                                                    <label for="measurementText" class="col-sm-4 col-form-label">Measurement</label>
                                                    <div class="col-sm-8">
                                                        <input type="text" class="form-control" id="measurementText" name="measurement_text" placeholder="Measurement" readonly>
                                                    </div>
                                                </div>
                                                <div class="form-group row">
                                                    <label for="counterText" class="col-sm-4 col-form-label">Counter</label>
                                                    <div class="col-sm-8">
                                                        <input type="text" class="form-control" id="counterText" name="counter_text" placeholder="Counter" readonly>
                                                    </div>
                                                </div>
                                                <div class="form-group row">
                                                    <label for="polarizationText" class="col-sm-4 col-form-label">Polarization</label>
                                                    <div class="col-sm-8">
                                                        <input type="text" class="form-control" id="polarizationText" name="polarization_text" placeholder="Polarization" readonly>
                                                    </div>
                                                </div>
                                                <hr>
                                                <div class="form-group row">
                                                    <div class="col-6">
                                                        <label for="month1">January</label>
                                                        <input type="number" min="0" step="0.01" value="0" class="form-control" id="month1" name="month_1" placeholder="January">
                                                    </div>
                                                    <div class="col-6">
                                                        <label for="month2">February</label>
                                                        <input type="number" min="0" step="0.01" value="0" class="form-control" id="month2" name="month_2" placeholder="February">
                                                    </div>
                                                </div>
                                                <div class="form-group row">
                                                    <div class="col-6">
                                                        <label for="month3">March</label>
                                                        <input type="number" min="0" step="0.01" value="0" class="form-control" id="month3" name="month_3" placeholder="March">
                                                    </div>
                                                    <div class="col-6">
                                                        <label for="month4">April</label>
                                                        <input type="number" min="0" step="0.01" value="0" class="form-control" id="month4" name="month_4" placeholder="April">
                                                    </div>
                                                </div>
                                                <div class="form-group row">
                                                    <div class="col-6">
                                                        <label for="month5">May</label>
                                                        <input type="number" min="0" step="0.01" value="0" class="form-control" id="month5" name="month_5" placeholder="May">
                                                    </div>
                                                    <div class="col-6">
                                                        <label for="month6">June</label>
                                                        <input type="number" min="0" step="0.01" value="0" class="form-control" id="month6" name="month_6" placeholder="June">
                                                    </div>
                                                </div>
                                                <div class="form-group row">
                                                    <div class="col-6">
                                                        <label for="month7">July</label>
                                                        <input type="number" min="0" step="0.01" value="0" class="form-control" id="month7" name="month_7" placeholder="July">
                                                    </div>
                                                    <div class="col-6">
                                                        <label for="month8">August</label>
                                                        <input type="number" min="0" step="0.01" value="0" class="form-control" id="month8" name="month_8" placeholder="August">
                                                    </div>
                                                </div>
                                                <div class="form-group row">
                                                    <div class="col-6">
                                                        <label for="month9">September</label>
                                                        <input type="number" min="0" step="0.01" value="0" class="form-control" id="month9" name="month_9" placeholder="September">
                                                    </div>
                                                    <div class="col-6">
                                                        <label for="month10">October</label>
                                                        <input type="number" min="0" step="0.01" value="0" class="form-control" id="month10" name="month_10" placeholder="October">
                                                    </div>
                                                </div>
                                                <div class="form-group row">
                                                    <div class="col-6">
                                                        <label for="month11">November</label>
                                                        <input type="number" min="0" step="0.01" value="0" class="form-control" id="month11" name="month_11" placeholder="November">
                                                    </div>
                                                    <div class="col-6">
                                                        <label for="month12">December</label>
                                                        <input type="number" min="0" step="0.01" value="0" class="form-control" id="month12" name="month_12" placeholder="December">
                                                    </div>
                                                </div>
                                                <hr>
                                                <button type="submit" class="btn btn-gradient-primary d-none">Save</button>
                                            </form>
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" id="btnTargetActual" class="btn btn-gradient-primary">
                                                <div class="loader-container">Save</div>
                                            </button>
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