<div class="page-header">
    <h3 class="page-title">
    <span class="page-title-icon bg-gradient-primary text-white me-2">
        <i class="mdi mdi-counter"></i>
    </span> KPI Counter
    </h3>
    <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="#">Master</a></li>
        <li class="breadcrumb-item"><a href="#">KPI</a></li>
        <li class="breadcrumb-item active" aria-current="page">Counter</li>
    </ol>
    </nav>
</div>
<div class="row">
    <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <h4 class="card-title">Data Counter</h4>
                    <button class="btn btn-lg btn-gradient-primary btn-modal" type="button" data-bs-toggle="modal" data-bs-target="#modalCounter" data-mode="modalAddCounter">+ Add </button>
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
                <div class="modal fade" id="modalCounter" tabindex="-1" role="dialog" aria-labelledby="modalLabelCounter" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="modalLabelCounter">Add/Edit/View Counter</h5>
                            <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <form id="formCounter">
                                <input type="hidden" class="form-control" id="id" name="id" placeholder="">
                                <div class="form-group row">
                                    <label for="counter" class="col-sm-3 col-form-label">Counter</label>
                                    <div class="col-sm-9">
                                        <div class="row">
                                            <div class="col-md-12 col-sm-3">
                                                <select class="form-control select2-js-basic" id="counterType" name="counter_type">
                                                    <option value="">- Choose -</option>
                                                    <option value="SUM">SUM</option>
                                                    <option value="AVG">AVG</option>
                                                    <option value="LAST">LAST</option>
                                                </select>
                                            </div>
                                            <div class="col-md-12 col-sm-9">
                                                <input type="text" class="form-control" id="counterText" name="counter_text" placeholder="Counter Text">
                                            </div>
                                        </div>
                                        <div class="error-message text-small text-danger mt-1" id="error-counter_type"></div>
                                    </div>
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
                            <button type="button" id="btnSaveCounter" class="btn btn-gradient-primary">
                                <div class="loader-container">Save</div>
                            </button>
                            <button type="button" class="btn btn-light" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                    </div>
                </div>
                <div class="table-responsive pb-2">
                    <table id="tableCounter" class="table table-hover">
                        <thead>
                            <tr>
                                <th class="text-center">No</th>
                                <th class="text-left">Counter</th>
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