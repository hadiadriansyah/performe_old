<div class="page-header">
    <h3 class="page-title">
    <span class="page-title-icon bg-gradient-primary text-white me-2">
        <i class="mdi mdi-scale-balance"></i>
    </span> Index Score
    </h3>
    <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="#">Master</a></li>
        <li class="breadcrumb-item active" aria-current="page">Index Scores</li>
    </ol>
    </nav>
</div>
<div class="row">
    <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h4 class="card-title">Data Index Score</h4>
                    <button class="btn btn-lg btn-gradient-primary btn-modal" type="button" data-bs-toggle="modal" data-bs-target="#modalIndexScore" data-mode="modalAddIndexScore">+ Add </button>
                </div>
                <div class="row d-flex align-items-center">
                    <p class="col-12">Filter:</p>
                    <div class="form-group col-md-3 col-sm-6">
                        <label for="filterYearPeriodId">Year Period</label>
                        <select class="form-select select2-js-server" id="filterYearPeriodId" name="year_period_id">
                            <option value="all">All</option>
                        </select>
                    </div>
                    <div class="col-md-3 col-sm-12 mt-2 mt-md-0">
                        <button type="button" id="filterBtn" class="btn btn-primary btn-md">Filter</button>
                    </div>
                </div>
                <div class="modal fade" id="modalIndexScore" tabindex="-1" role="dialog" aria-labelledby="modalLabelIndexScore" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="modalLabelIndexScore">Add/Edit Index Score</h5>
                            <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <form id="formIndexScore">
                                <input type="hidden" class="form-control" id="id" name="id" placeholder="">
                                <div class="form-group row">
                                    <label for="indexValue" class="col-sm-3 col-form-label">Index Value</label>
                                    <div class="col-sm-9">
                                        <input type="text" class="form-control" id="indexValue" name="index_value" placeholder="Index Value">
                                        <div class="error-message text-small text-danger mt-1" id="error-index_value"></div>
                                    </div>
                                </div><div class="form-group row">
                                    <label for="operator1" class="col-sm-3 col-form-label">Operator 1</label>
                                    <div class="col-sm-9">
                                        <select type="text" class="form-control select2-js-basic" style="width: 100%;" id="operator1" name="operator_1" placeholder="[ >, >=]">
                                            <option value="">- Choose -</option>
                                            <option value=">">></option>
                                            <option value=">=">>=</option>
                                        </select>
                                        <div class="error-message text-small text-danger mt-1" id="error-operator_1"></div>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label for="value1" class="col-sm-3 col-form-label">Value 1</label>
                                    <div class="col-sm-9">
                                        <input type="number" min="0" max="999" step="0.01" class="form-control" id="value1" name="value_1" placeholder="Value 1" value="1">
                                        <div class="error-message text-small text-danger mt-1" id="error-value_1"></div>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label for="operator2" class="col-sm-3 col-form-label">Operator 2</label>
                                    <div class="col-sm-9">
                                        <select type="text" class="form-control select2-js-basic" style="width: 100%;" id="operator2" name="operator_2" placeholder="[<, <= ]">
                                            <option value="">- Choose -</option>
                                            <option value="<"><</option>
                                            <option value="<="><=</option>
                                        </select>
                                        <div class="error-message text-small text-danger mt-1" id="error-operator_2"></div>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label for="value2" class="col-sm-3 col-form-label">Value 2</label>
                                    <div class="col-sm-9">
                                        <input type="number" class="form-control" id="value2" name="value_2" placeholder="Value 2" value="1">
                                        <div class="error-message text-small text-danger mt-1" id="error-value_2"></div>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label for="description" class="col-sm-3 col-form-label">Description</label>
                                    <div class="col-sm-9">
                                        <input type="text" class="form-control" id="description" name="description" placeholder="Description">
                                        <div class="error-message text-small text-danger mt-1" id="error-description"></div>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label for="color" class="col-sm-3 col-form-label">Color</label>
                                    <div class="col-sm-9">
                                        <input type="text" class="form-control spectrum with-add-on" value="#f44336" id="color" name="color" placeholder="Color">
                                        <div class="error-message text-small text-danger mt-1" id="error-color"></div>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label for="order" class="col-sm-3 col-form-label">Order</label>
                                    <div class="col-sm-9">
                                        <input type="number" min="1" class="form-control" id="order" name="order" placeholder="Order" value="1">
                                        <div class="error-message text-small text-danger mt-1" id="error-order"></div>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label for="yearPeriodId" class="col-sm-3 col-form-label">Year Period</label>
                                    <div class="col-sm-9">
                                        <select type="text" class="form-control select2-js-server" style="width: 100%;" 
                                        id="yearPeriodId" name="year_period_id" placeholder="Year Period">
                                            <option value="">-- Choose --</option>
                                        </select>
                                        <div class="error-message text-small text-danger mt-1" id="error-year_period_id"></div>
                                    </div>
                                </div>
                                
                                <button type="submit" class="btn btn-gradient-primary d-none">Save</button>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" id="btnSaveIndexScore" class="btn btn-gradient-primary">
                                <div class="loader-container">Save</div>
                            </button>
                            <button type="button" class="btn btn-light" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                    </div>
                </div>
                <div class="table-responsive pb-2">
                    <table id="tableIndexScore" class="table table-hover">
                        <thead>
                            <tr>
                                <th class="text-center">No</th>
                                <th class="text-center">Index Value</th>
                                <th class="text-center">Operator 1</th>
                                <th class="text-center">Value 1</th>
                                <th class="text-center">Operator 2</th>
                                <th class="text-center">Value 2</th>
                                <th class="text-center">Description</th>
                                <th class="text-center">Color</th>
                                <th class="text-center">Order</th>
                                <th class="text-center">Year Period</th>
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

