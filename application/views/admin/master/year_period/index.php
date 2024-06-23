<div class="page-header">
    <h3 class="page-title">
    <span class="page-title-icon bg-gradient-primary text-white me-2">
        <i class="mdi mdi-calendar"></i>
    </span> Year Periods
    </h3>
    <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="#">Master</a></li>
        <li class="breadcrumb-item active" aria-current="page">Year Periods</li>
    </ol>
    </nav>
</div>
<div class="row">
    <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <h4 class="card-title">Data Year Period</h4>
                    <button class="btn btn-lg btn-gradient-primary btn-modal" type="button" data-bs-toggle="modal" data-bs-target="#modalYearPeriod" data-mode="modalAddYearPeriod">+ Add </button>
                </div>
                <div class="row d-flex align-items-center">
                    <p class="col-12">Filter:</p>
                    <div class="form-group col-md-3 col-sm-6">
                        <label for="filterStatusAppraisal">Status Appraisal</label>
                        <select class="form-select select2-js-basic" id="filterStatusAppraisal" name="status_appraisal">
                            <option value="all">All</option>
                            <option value="0">Not Active</option>
                            <option value="1">Active</option>
                        </select>
                    </div>
                    <div class="col-md-3 col-sm-12 mt-2 mt-md-0">
                        <button type="button" id="filterBtn" class="btn btn-primary btn-md">Filter</button>
                    </div>
                </div>
                <div class="modal fade" id="modalYearPeriod" tabindex="-1" role="dialog" aria-labelledby="modalLabelYearPeriod" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="modalLabelYearPeriod">Add/Edit Year Period</h5>
                                <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <form id="formYearPeriod">
                                    <input type="hidden" class="form-control" id="id" name="id" placeholder="">
                                    <div class="form-group row">
                                        <label for="yearPeriod" class="col-sm-3 col-form-label">Year Period</label>
                                        <div class="col-sm-9">
                                            <input type="text" class="form-control" id="yearPeriod" name="year_period" placeholder="Year Period">
                                            <div class="error-message text-small text-danger mt-1" id="error-year_period"></div>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="statusAppraisal" class="col-sm-3 col-form-label">Status Appraisal</label>
                                        <div class="col-sm-9">
                                            <select class="form-select select2-js-basic" id="statusAppraisal" name="status_appraisal">
                                                <option value="0">Not Active</option>
                                                <option value="1">Active</option>
                                            </select>
                                            <div class="error-message text-small text-danger mt-1" id="error-status_appraisal"></div>
                                        </div>
                                    </div>
                                    
                                    <button type="submit" class="btn btn-gradient-primary d-none">Save</button>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" id="btnSaveYearPeriod" class="btn btn-gradient-primary">
                                    Save
                                </button>
                                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="table-responsive pb-2">
                    <table id="tableYearPeriod" class="table table-hover">
                        <thead>
                            <tr>
                                <th class="text-center">No</th>
                                <th class="text-center">Year Period</th>
                                <th class="text-center">Status Appraisal</th>
                                <th class="text-center">Created at</th>
                                <th class="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>

