<div class="page-header">
    <h3 class="page-title">
    <span class="page-title-icon bg-gradient-primary text-white me-2">
        <i class="mdi mdi-chart-bar"></i>
    </span> KPI Individual
    </h3>
    <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="#">Goals Settings</a></li>
        <li class="breadcrumb-item active" aria-current="page">KPI Individual</li>
    </ol>
    </nav>
</div>
<div class="row">
    <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
            <div class="card-body">
                <div class="card">
                    <div class="card-header bg-gradient-info text-white d-flex justify-content-between align-items-center">
                        <h5>KPI Individual</h5>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-group row">
                                    <label class="col-sm-6 col-form-label">Year Period</label>
                                    <div class="col-sm-6 px-2">
                                        <select class="form-select select2-js-server" id="yearPeriodId" name="year_period_id">
                                            <option value=""> - Choose - </option>
                                        </select>
                                        <div class="error-message text-small text-danger mt-1" id="error-year_period_id"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-group row">
                                    <label class="col-sm-6 col-form-label">Employee</label>
                                    <div class="col-sm-6 px-2">
                                        <select class="form-select select2-js-server" id="employeeId" name="employee_id">
                                            <option value=""> - Choose - </option>
                                        </select>
                                        <div class="error-message text-small text-danger mt-1" id="error-employee_id"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-group row">
                                    <label class="col-sm-6 col-form-label">Position <sup>(* currently)</sup></label>
                                    <div class="col-sm-6 px-2">
                                        <select class="form-select select2-js-basic" id="positionId" name="position_id" disabled>
                                            <option value=""> - Choose - </option>
                                        </select>
                                        <div class="error-message text-small text-danger mt-1" id="error-employee_id"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-group row">
                                    <label class="col-sm-6 col-form-label">Unit <sup>(* currently)</sup></label>
                                    <div class="col-sm-6 px-2">
                                        <select class="form-select select2-js-basic" id="unitId" name="unit_id" disabled>
                                            <option value=""> - Choose - </option>
                                        </select>
                                        <div class="error-message text-small text-danger mt-1" id="error-unit_id"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-group row">
                                    <label class="col-sm-6 col-form-label">Placement Unit <sup>(* currently)</sup></label>
                                    <div class="col-sm-6 px-2">
                                        <select class="form-select select2-js-basic" id="placementUnitId" name="placement_unit_id" disabled>
                                            <option value=""> - Choose - </option>
                                        </select>
                                        <div class="error-message text-small text-danger mt-1" id="error-placement_unit_id"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header bg-gradient-success text-white d-flex justify-content-between align-items-center">
                        <h5>Goals Settings</h5>
                    </div>
                    <div class="card-body">
                        <div id="goalsSettingsContainer">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

