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
                <form id="formMapping">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group row">
                                <label class="col-sm-4 col-form-label">Year Period</label>
                                <div class="col-sm-8 px-2">
                                    <select class="form-select select2-js-server" id="yearPeriodId" name="year_period_id">
                                        <option value=""> - Choose - </option>
                                    </select>
                                    <div class="error-message text-small text-danger mt-1" id="error-year_period_id"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group row">
                                <label class="col-sm-4 col-form-label">Unit</label>
                                <div class="col-sm-8 px-2">
                                    <select class="form-select select2-js-basic" id="unitId" name="unit_id">
                                        <option value=""> - Choose - </option>
                                    </select>
                                    <div class="error-message text-small text-danger mt-1" id="error-unit_id"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="offset-sm-4">
                                <button type="button" id="btnSubmit" class="btn btn-gradient-primary ">
                                    <div class="loader-container">Submit</div>
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

