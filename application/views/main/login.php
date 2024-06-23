<div class="container-fluid page-body-wrapper full-page-wrapper">
    <div class="content-wrapper d-flex align-items-stretch auth auth-img-bg">
        <div class="row flex-grow">
            <div class="col-lg-6 d-flex align-items-center justify-content-center">
              <div class="auth-form-transparent text-left p-3">
                <div class="brand-logo">
                  <img src="<?= base_url('assets/') ?>images/logo-blue.png" alt="logo">
                </div>
                <h4>PerforMe</h4>
                <h6 class="font-weight-light">Login using HRIS username and password</h6>
                <form class="pt-3" id="formLogin">
                  <div class="form-group">
                    <label for="nrik">NPP</label>
                    <div class="input-group">
                      <div class="input-group-prepend bg-transparent">
                        <span class="input-group-text bg-transparent border-right-0">
                          <i class="mdi mdi-account-outline text-primary"></i>
                        </span>
                      </div>
                      <input type="text" class="form-control form-control-sm border-left-0" id="nrik" name="nrik" placeholder="NPP (4 digit pertama)">
                    </div>
                    <div class="error-message text-small text-danger mt-1" id="error-nrik"></div>
                  </div>
                  <div class="form-group">
                    <label for="password">Password</label>
                    <div class="input-group">
                      <div class="input-group-prepend bg-transparent">
                        <span class="input-group-text bg-transparent border-right-0">
                          <i class="mdi mdi-lock-outline text-primary"></i>
                        </span>
                      </div>
                      <input type="password" class="form-control form-control-sm border-left-0" id="password" name="password" placeholder="Password">
                    </div>
                    <div class="error-message text-small text-danger mt-1" id="error-password"></div>
                  </div>
                  <div class="my-3 d-grid gap-2">
                    <button type="submit" class="btn btn-block btn-gradient-primary btn-lg font-weight-medium auth-form-btn">
                      Login
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div class="col-lg-6 login-half-bg d-flex flex-row">
              <p class="text-white font-weight-medium text-center flex-grow align-self-end">Copyright &copy; <?= date('Y') ?> All rights reserved.</p>
            </div>
        </div>
    </div>
</div>
