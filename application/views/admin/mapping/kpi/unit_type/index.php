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
                                <label class="col-sm-4 col-form-label">Unit Type</label>
                                <div class="col-sm-8 px-2">
                                    <select class="form-select select2-js-basic" id="unitType" name="unit_type">
                                        <option value=""> - Choose - </option>
                                        <option value="KCK"> Kantor Cabang Koordinator </option>
                                        <option value="KC"> Kantor Cabang </option>
                                        <option value="KCP"> Kantor Cabang Pembantu </option>
                                    </select>
                                    <div class="error-message text-small text-danger mt-1" id="error-unit_type"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group row">
                                <label class="col-sm-4 col-md-4 col-form-label">Group Unit</label>
                                <div class="col-sm-4 col-md-5 px-2">
                                    <select class="form-select select2-js-basic" id="groupUnitTypeId" name="group_unit_type_id">
                                        <option value=""> - Choose - </option>
                                    </select>
                                    <div class="error-message text-small text-danger mt-1" id="error-group_unit_type_id"></div>
                                </div>
                                <div class="col-sm-4 col-md-3">
                                    <button id="btnModalAddGroup" class="btn btn-inverse-success btn-rounded btn-icon mb-1" type="button" data-bs-toggle="modal" data-bs-target="#modalGroup" data-mode="modalAddGroup"> <i class="mdi mdi-plus"></i> </button>

                                    <button id="btnModalEditGroup" class="btn btn-inverse-warning btn-rounded btn-icon mb-1 d-none" type="button" data-bs-toggle="modal" data-bs-target="#modalGroup" data-mode="modalEditGroup"> <i class="mdi mdi-file-check"></i> </button>

                                    <button id="btnModalDeleteGroup" class="btn btn-inverse-danger btn-rounded btn-icon mb-1 d-none" type="button"> <i class="mdi mdi-delete"></i> </button>
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
                <div class="row">
                    <div id="groupUnitContainer" class="col-sm-12 col-md-10 offset-md-2 mt-sm-5 text-center d-none">
                        <h5>Unit List</h5>
                        <div class="row">
                            <div class="col-12 list-wrapper">
                                <ul>
                                    <li class="d-flex justify-content-between align-items-center">
                                        <div class="form-check w-100">
                                            <label class="form-check-label">
                                                <input class="checkbox" type="checkbox" data-bs-toggle="tooltip" data-placement="right" title="Select All"> Select All
                                            </label>
                                        </div>
                                        <button type="button" class="btn btn-inverse-primary">Update</button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modalGroup" tabindex="-1" role="dialog" aria-labelledby="modalLabelAddEditGroup" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalLabelAddEditGroup">Group</h5>
                <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form id="formGroup">
                    <input type="hidden" class="form-control" id="id" name="id" placeholder="">
                    <div class="form-group row">
                        <label for="groupType" class="col-sm-3 col-form-label">Group Type</label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" id="groupType" name="group_type" placeholder="Group Type Name">
                            <div class="error-message text-small text-danger mt-1" id="error-group_type"></div>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="description" class="col-sm-3 col-form-label">Desc</label>
                        <div class="col-sm-9">
                            <textarea type="text" class="form-control" id="description" name="description" placeholder="Description"></textarea>
                            <div class="error-message text-small text-danger mt-1" id="error-description"></div>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-gradient-primary d-none">Save</button>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" id="btnSaveGroup" class="btn btn-gradient-primary">
                    <div class="loader-container">Save</div>
                </button>
                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>


