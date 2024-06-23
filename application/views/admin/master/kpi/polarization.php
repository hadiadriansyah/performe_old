<div class="page-header">
    <h3 class="page-title">
    <span class="page-title-icon bg-gradient-primary text-white me-2">
        <i class="mdi mdi-chart-bell-curve"></i>
    </span> KPI Polarization
    </h3>
    <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="#">Master</a></li>
        <li class="breadcrumb-item active" aria-current="page">KPI Polarization</li>
    </ol>
    </nav>
</div>
<div class="row">
    <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h4 class="card-title">Data Polarization</h4>
                    <button class="btn btn-lg btn-gradient-primary btn-modal" type="button" data-bs-toggle="modal" data-bs-target="#modalPolarization" data-mode="modalAddPolarization">+ Add </button>
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
                <div class="modal fade" id="modalPolarization" tabindex="-1" role="dialog" aria-labelledby="modalLabelPolarization" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="modalLabelPolarization">Add/Edit/View Polarization</h5>
                            <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <form id="formPolarization">
                                <input type="hidden" class="form-control" id="id" name="id" placeholder="">
                                <div class="form-group row">
                                    <label for="polarization" class="col-sm-3 col-form-label">Polarization</label>
                                    <div class="col-sm-9">
                                        <div class="row">
                                            <div class="col-md-12 col-sm-3">
                                                <select class="form-control select2-js-basic" id="polarizationType" name="polarization_type">
                                                    <option value="">- Choose -</option>
                                                    <option value="Minimize">Minimize</option>
                                                    <option value="Absolute">Absolute</option>
                                                    <option value="Stabilize">Stabilize</option>
                                                    <option value="Maximize">Maximize</option>
                                                </select>
                                            </div>
                                            <div class="col-md-12 col-sm-9">
                                                <input type="text" class="form-control" id="polarizationText" name="polarization_text" placeholder="Polarization Text">
                                            </div>
                                        </div>
                                        <div class="error-message text-small text-danger mt-1" id="error-polarization_type"></div>
                                    </div>
                                </div>
                                <div class="minimize-form d-none">    
                                    <hr>
                                    <div class="form-group row">
                                        <div class="col-6">
                                            <label for="minOpr1">Min Opr 1</label>
                                            <select type="text" class="form-control select2-js-basic" id="minOpr1" name="min_opr_1" placeholder="Min Opr 1">
                                                <option value="">- Choose -</option>
                                                <option value=">">></option>
                                                <option value=">=">>=</option>
                                                <option value="=">=</option>
                                                <option value="<"><</option>
                                                <option value="<=">></option>
                                            </select>
                                            <div class="error-message text-small text-danger mt-1" id="error-min_opr_1"></div>
                                        </div>
                                        <div class="col-6">
                                            <label for="minOpr2">Min Opr 2</label>
                                            <select type="text" class="form-control select2-js-basic" id="minOpr2" name="min_opr_2" placeholder="Min Opr 2">
                                                <option value="">- Choose -</option>
                                                <option value=">">></option>
                                                <option value=">=">>=</option>
                                                <option value="=">=</option>
                                                <option value="<"><</option>
                                                <option value="<=">></option>
                                            </select>
                                            <div class="error-message text-small text-danger mt-1" id="error-min_opr_2"></div>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <div class="col-6">
                                            <label for="valueMin1">Value Min 1</label>
                                            <input type="number" min="0" max="999" step="0.01" value="0" class="form-control" id="valueMin1" name="value_min_1" placeholder="Value Min 1">
                                            <div class="error-message text-small text-danger mt-1" id="error-value_min_1"></div>
                                        </div>
                                        <div class="col-6">
                                            <label for="valueMin2">Value Min 2</label>
                                            <input type="number" min="0" max="999" step="0.01" value="0" class="form-control" id="valueMin2" name="value_min_2" placeholder="Value Min 2">
                                            <div class="error-message text-small text-danger mt-1" id="error-value_min_2"></div>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <div class="col-6">
                                            <label for="valueMin3">Value Min 3</label>
                                            <input type="number" min="0" max="999" step="0.01" value="0" class="form-control" id="valueMin3" name="value_min_3" placeholder="Value Min 3">
                                            <div class="error-message text-small text-danger mt-1" id="error-value_min_3"></div>
                                        </div>
                                        <div class="col-6">
                                            <label for="valueMin4">Value Min 4</label>
                                            <input type="number" min="0" max="999" step="0.01" value="0" class="form-control" id="valueMin4" name="value_min_4" placeholder="Value Min 4">
                                            <div class="error-message text-small text-danger mt-1" id="error-value_min_4"></div>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <div class="col-6">
                                            <label for="valueMin5">Value Min 5</label>
                                            <input type="number" min="0" max="999" step="0.01" value="0" class="form-control" id="valueMin5" name="value_min_5" placeholder="Value Min 5">
                                            <div class="error-message text-small text-danger mt-1" id="error-value_min_5"></div>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <div class="col-6">
                                            <label for="polMinIndex1">Pol Min Index 1</label>
                                            <input type="number" min="0" max="999" step="0.01" value="0" class="form-control" id="polMinIndex1" name="pol_min_index_1" placeholder="Pol Min Index 1">
                                            <div class="error-message text-small text-danger mt-1" id="error-pol_min_index_1"></div>
                                        </div>
                                        <div class="col-6">
                                            <label for="polMinIndex2">Pol Min Index 2</label>
                                            <input type="number" min="0" max="999" step="0.01" value="0" class="form-control" id="polMinIndex2" name="pol_min_index_2" placeholder="Pol Min Index 2">
                                            <div class="error-message text-small text-danger mt-1" id="error-pol_min_index_2"></div>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <div class="col-6">
                                            <label for="polMinIndex3">Pol Min Index 3</label>
                                            <input type="number" min="0" max="999" step="0.01" value="0" class="form-control" id="polMinIndex3" name="pol_min_index_3" placeholder="Pol Min Index 3">
                                            <div class="error-message text-small text-danger mt-1" id="error-pol_min_index_3"></div>
                                        </div>
                                        <div class="col-6">
                                            <label for="polMinIndex4">Pol Min Index 4</label>
                                            <input type="number" min="0" max="999" step="0.01" value="0" class="form-control" id="polMinIndex4" name="pol_min_index_4" placeholder="Pol Min Index 4">
                                            <div class="error-message text-small text-danger mt-1" id="error-pol_min_index_4"></div>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <div class="col-6">
                                            <label for="polMinIndex5">Pol Min Index 5</label>
                                            <input type="number" min="0" max="999" step="0.01" value="0" class="form-control" id="polMinIndex5" name="pol_min_index_5" placeholder="Pol Min Index 5">
                                            <div class="error-message text-small text-danger mt-1" id="error-pol_min_index_5"></div>
                                        </div>
                                    </div>
                                    <hr>
                                </div>
                                <div class="absolute-form d-none">
                                    <hr>
                                    <div class="form-group row">
                                        <div class="col-6">
                                            <label for="absOpr1">Abs Opr 1</label>
                                            <select type="text" class="form-control select2-js-basic" id="absOpr1" name="abs_opr_1" placeholder="Abs Opr 1">
                                                <option value="">- Choose -</option>
                                                <option value=">">></option>
                                                <option value=">=">>=</option>
                                                <option value="==">==</option>
                                                <option value="<"><</option>
                                                <option value="<=">></option>
                                            </select>
                                            <div class="error-message text-small text-danger mt-1" id="error-abs_opr_1"></div>
                                        </div>
                                        <div class="col-6">
                                            <label for="absOpr2">Abs Opr 2</label>
                                            <select type="text" class="form-control select2-js-basic" id="absOpr2" name="abs_opr_2" placeholder="Abs Opr 2">
                                                <option value="">- Choose -</option>
                                                <option value=">">></option>
                                                <option value=">=">>=</option>
                                                <option value="==">==</option>
                                                <option value="<"><</option>
                                                <option value="<=">></option>
                                            </select>
                                            <div class="error-message text-small text-danger mt-1" id="error-abs_opr_2"></div>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <div class="col-6">
                                            <label for="polAbsIndex1">Pol Abs Index 1</label>
                                            <input type="number" min="0" max="999" step="0.01" value="0" class="form-control" id="polAbsIndex1" name="pol_abs_index_1" placeholder="Pol Abs Index 1">
                                            <div class="error-message text-small text-danger mt-1" id="error-pol_abs_index_1"></div>
                                        </div>
                                        <div class="col-6">
                                            <label for="polAbsIndex2">Pol Abs Index 2</label>
                                            <input type="number" min="0" max="999" step="0.01" value="0" class="form-control" id="polAbsIndex2" name="pol_abs_index_2" placeholder="Pol Abs Index 2">
                                            <div class="error-message text-small text-danger mt-1" id="error-pol_abs_index_2"></div>
                                        </div>
                                    </div>
                                    <hr>
                                </div>
                                <div class="stabilize-form d-none">
                                    <hr>
                                    <div class="form-group row">
                                        <div class="col-6">
                                            <label for="stabOpr1Target">Stab Opr 1 Target</label>
                                            <select type="text" class="form-control select2-js-basic" id="stabOpr1Target" name="stab_opr_1_target" placeholder="Stab Opr 1 Target">
                                                <option value="">- Choose -</option>
                                                <option value=">">></option>
                                                <option value=">=">>=</option>
                                                <option value="=">=</option>
                                                <option value="<"><</option>
                                                <option value="<=">></option>
                                            </select>
                                            <div class="error-message text-small text-danger mt-1" id="error-stab_opr_1_target"></div>
                                        </div>
                                        <div class="col-6">
                                            <label for="stabOpr2Target">Stab Opr 2 Target</label>
                                            <select type="text" class="form-control select2-js-basic" id="stabOpr2Target" name="stab_opr_2_target" placeholder="Stab Opr 2 Target">
                                                <option value="">- Choose -</option>
                                                <option value=">">></option>
                                                <option value=">=">>=</option>
                                                <option value="=">=</option>
                                                <option value="<"><</option>
                                                <option value="<=">></option>
                                            </select>
                                            <div class="error-message text-small text-danger mt-1" id="error-stab_opr_2_target"></div>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <div class="col-6">
                                            <label for="polStabIndex1">Pol Stab Index 1</label>
                                            <input type="number" min="0" max="999" step="0.01" value="0" class="form-control" id="polStabIndex1" name="pol_stab_index_1" placeholder="Pol Stab Index 1">
                                            <div class="error-message text-small text-danger mt-1" id="error-pol_stab_index_1"></div>
                                        </div>
                                        <div class="col-6">
                                            <label for="polStabIndex2">Pol Stab Index 2</label>
                                            <input type="number" min="0" max="999" step="0.01" value="0" class="form-control" id="polStabIndex2" name="pol_stab_index_2" placeholder="Pol Stab Index 2">
                                            <div class="error-message text-small text-danger mt-1" id="error-pol_stab_index_2"></div>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <div class="col-6">
                                            <label for="polStabIndex3">Pol Stab Index 3</label>
                                            <input type="number" min="0" max="999" step="0.01" value="0" class="form-control" id="polStabIndex3" name="pol_stab_index_3" placeholder="Pol Stab Index 3">
                                            <div class="error-message text-small text-danger mt-1" id="error-pol_stab_index_3"></div>
                                        </div>
                                        <div class="col-6">
                                            <label for="polStabIndex4">Pol Stab Index 4</label>
                                            <input type="number" min="0" max="999" step="0.01" value="0" class="form-control" id="polStabIndex4" name="pol_stab_index_4" placeholder="Pol Stab Index 4">
                                            <div class="error-message text-small text-danger mt-1" id="error-pol_stab_index_4"></div>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <div class="col-6">
                                            <label for="polStabIndex5">Pol Stab Index 5</label>
                                            <input type="number" min="0" max="999" step="0.01" value="0" class="form-control" id="polStabIndex5" name="pol_stab_index_5" placeholder="Pol Stab Index 5">
                                            <div class="error-message text-small text-danger mt-1" id="error-pol_stab_index_5"></div>
                                        </div>
                                    </div>
                                    <hr>
                                </div>
                                <div class="form-group row">
                                    <label for="description" class="col-sm-3 col-form-label">Desc</label>
                                    <div class="col-sm-9">
                                        <textarea type="text" class="form-control" id="description" name="description" placeholder="Description"></textarea>
                                        <div class="error-message text-small text-danger mt-1" id="error-description"></div>
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
                            <div class="code d-none">
                                <pre>
                                    <code>
                                    <?php
                                        $lines = file($filePath);
                                        for ($i = $startLine - 1; $i < $endLine; $i++) {
                                            echo htmlspecialchars($lines[$i]);
                                        }
                                    ?>
                                    </code>
                                </pre>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" id="btnSavePolarization" class="btn btn-gradient-primary">
                                <div class="loader-container">Save</div>
                            </button>
                            <button type="button" class="btn btn-light" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                    </div>
                </div>
                <div class="table-responsive pb-2">
                    <table id="tablePolarization" class="table table-hover">
                        <thead>
                            <tr>
                                <th class="text-center">No</th>
                                <th class="text-left">Polarization</th>
                                <!-- <th class="text-left">Formula</th> -->
                                <th class="text-left">Desc</th>
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
