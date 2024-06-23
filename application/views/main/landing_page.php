<div class="banner-wrapper">
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <nav class="navbar navbar-expand-lg">
          <a class="navbar-brand logo" href="<?= site_url() ?>"><img src="<?= base_url('assets/') ?>images/logo-white.png" alt=""></a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="mdi mdi-menu"></span>
          </button>
          <div class="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
            <ul class="navbar-nav">
              <li class="nav-item active">
                <a class="nav-link" href="<?= site_url() ?>">Home</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="<?= site_url('login') ?>">Login</a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
    <div class="row py-sm-5 py-0">
      <div class="col-lg-7 banner-content">
        <h1 class="me-2 text-white"> Welcome to PerforMe </h1>
        <h3 class="font-weight-light text-white pt-2 pb-5"> PerforMe is the future of performance management </h3>
      </div>
    </div>
  </div>
</div>
<div id="tree"></div>
<footer>
  <div class="border-bottom footer-top">
    <div class="container">
      <div class="row">
        <div class="col-lg-4">
          <img class="img-fluid" src="<?= base_url('assets/') ?>images/logo-white.png" alt="">
        </div>
      </div>
    </div>
  </div>
  <div class="container">
    <div class="row">
      <div class="col-sm-8">
        <h4 class="mt-3">Copyright © <?= date('Y') ?> <a href="#">bootstrapdash | Edited by PerforMe</a>. All rights reserved.</h4>
      </div>
      <div class="col-sm-4">
        <h4>PerforMe &amp; made with <i class="mdi mdi-heart text-danger d-inline-block"></i>
        </h4>
      </div>
    </div>
  </div>
</footer>