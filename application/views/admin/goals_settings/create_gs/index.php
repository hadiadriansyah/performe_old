<div class="page-header">
    <h3 class="page-title">
    <span class="page-title-icon bg-gradient-primary text-white me-2">
        <i class="mdi mdi-chart-bar"></i>
    </span> Create Goals Setting
    </h3>
    <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="#">Goals Settings</a></li>
        <li class="breadcrumb-item active" aria-current="page">Create Goals Setting</li>
    </ol>
    </nav>
</div>
<div class="row">
    <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
            <div class="card-body">
                <div class="row mb-5">
                    <div class="col-md-12">
                        <div class="alert alert-fill-danger" role="alert">
                            <i class="mdi mdi-alert-circle"></i> Only PKWTT/PKWT employees can participate in the Performance Assessment process – DSDM_UMK.
                        </div>
                    </div>
                </div>
                <form id="formCreateGs">
                    <div class="row">
                        <div class="col-sm-12 col-md-4">
                            <div class="row">
                                <div class="col-12">
                                    <div class="form-group">
                                        <label for="employeeId">Employee</label>
                                        <select class="form-select select2-js-server" id="employeeId" name="employee_id">
                                            <option value=""> - Choose - </option>
                                        </select>
                                        <div class="error-message text-small text-danger mt-1" id="error-employee_id"></div>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="form-group">
                                        <label for="unitId">Unit</label>
                                        <select class="form-select select2-js-basic" id="unitId" name="unit_id" disabled>
                                            <option value=""> - Choose - </option>
                                        </select>
                                        <div class="error-message text-small text-danger mt-1" id="error-unit_id"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-4">
                            <div class="row">
                                <div class="col-12">
                                    <div class="form-group">
                                        <label for="positionId">Position</label>
                                        <select class="form-select select2-js-basic" id="positionId" name="position_id" disabled>
                                            <option value=""> - Choose - </option>
                                        </select>
                                        <div class="error-message text-small text-danger mt-1" id="error-position_id"></div>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="form-group">
                                        <label for="placementUnitId">Placement Unit</label>
                                        <select class="form-select select2-js-basic" id="placementUnitId" name="placement_unit_id" disabled>
                                            <option value=""> - Choose - </option>
                                        </select>
                                        <div class="error-message text-small text-danger mt-1" id="error-placement_unit_id"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-4">
                            <div class="row">
                                <div class="col-12">
                                    <div class="form-group">
                                        <label for="yearPeriodId">Year Period</label>
                                        <select class="form-select select2-js-server" id="yearPeriodId" name="year_period_id">
                                            <option value=""> - Choose - </option>
                                        </select>
                                        <div class="error-message text-small text-danger mt-1" id="error-year_period_id"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12 d-grid gap-2">
                            <button type="button" id="btnCreateGs" class="btn btn-gradient-danger btn-block" disabled>
                                <div class="loader-container">Create GS</div>
                            </button>
                        </div>
                    </div>
                </form>

            </div>
        </div>
    </div>
</div>

