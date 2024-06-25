<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>PerforMe <?= isset($title) ? ' - ' . $title : '' ?></title>
    <!-- plugins:css -->
    <link rel="stylesheet" href="<?= base_url('assets/') ?>vendors/mdi/css/materialdesignicons.min.css">
    <link rel="stylesheet" href="<?= base_url('assets/') ?>vendors/css/vendor.bundle.base.css">
    <!-- endinject -->
    <!-- Plugin css for this page -->
    <link rel="stylesheet" href="<?= base_url('assets/') ?>vendors/datatables5/datatables.css">
    <link rel="stylesheet" href="<?= base_url('assets/') ?>vendors/bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css">
    <link rel="stylesheet" href="<?= base_url('assets/') ?>vendors/select2/dist/css/select2.min.css">
    <link rel="stylesheet" href="<?= base_url('assets/') ?>vendors/select2-bootstrap-theme/dist/select2-bootstrap.min.css">
    <link rel="stylesheet" href="<?= base_url('assets/') ?>vendors/spectrum-colorpicker/spectrum.css">
    <link rel="stylesheet" href="<?= base_url('assets/') ?>vendors/jquery-toast-plugin/dist/jquery.toast.min.css">
    <!-- End plugin css for this page -->
    <!-- inject:css -->
    <!-- endinject -->
    <!-- Layout styles -->
    <link rel="stylesheet" href="<?= base_url('assets/') ?>css/style.css">
    <style>
        img.logo {
            object-fit: contain;
        }
        img {
          width: 100%;
          height: 100%;
        }
        .centered-image {
            margin-left: auto;
            margin-right: auto;
            object-fit: contain;
        }
        #fullscreen-button {
            cursor: pointer;
        }

        pre {
            background-color: #f4f4f4;
            padding: 5px;
            border: 1px solid #ddd;
            overflow: auto;
        }
        code {
            font-family: Consolas, "Courier New", monospace;
        }
    </style>
    <!-- End layout styles -->
    <link rel="shortcut icon" href="<?= base_url('assets/') ?>images/logo-blue-mini.png" />
  </head>
  <!-- <body class="sidebar-icon-only"> -->
  <body>
    <div id="bar-loader" class="bar-loader bar-lg d-none">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
    <div class="container-scroller">
      <!-- partial:partials/_navbar.html -->
      <nav class="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
        <div class="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
          <a class="navbar-brand brand-logo" href="<?= base_url('dashboard') ?>"><img src="<?= base_url('assets/') ?>images/logo-blue.png" class="logo" alt="logo" /></a>
          <a class="navbar-brand brand-logo-mini" href="<?= base_url('dashboard') ?>"><img src="<?= base_url('assets/') ?>images/logo-blue-mini.png" class="logo" alt="logo" /></a>
        </div>
        <div class="navbar-menu-wrapper d-flex align-items-stretch">
          <button class="navbar-toggler navbar-toggler align-self-center" type="button" data-toggle="minimize">
            <span class="mdi mdi-menu"></span>
          </button>
          <ul class="navbar-nav navbar-nav-right">
            
          <li class="nav-item dropdown">
              <a class="nav-link count-indicator dropdown-toggle" id="lastLoginDropdown" href="#" data-bs-toggle="dropdown">
                <i class="mdi mdi-history"></i>
              </a>
              <div class="dropdown-menu dropdown-menu-end navbar-dropdown preview-list" aria-labelledby="lastLoginDropdown">
                <a href="<?= base_url('user_management/user/activity_log/') . $vendor_id ?>" class="dropdown-item preview-item">
                  <p class="text-gray m-0">
                  Last Login : <i class="mdi mdi-clock-outline"></i> <?= empty($last_login) ? "First Time Login" : format_date($last_login); ?>
                  </p>
                </a>
              </div>
            </li>
            <li class="nav-item nav-profile dropdown">
              <a class="nav-link dropdown-toggle" id="profileDropdown" href="#" data-bs-toggle="dropdown" aria-expanded="false">
                <div class="nav-profile-img">
                  <img src="<?= base_url('uploads/profile_pictures/') . $profile_picture ?>" class="centered-image" alt="image" onerror="this.src='<?= base_url('assets/') ?>images/logo-blue-mini.png'">
                  <span class="availability-status online"></span>
                </div>
                <div class="nav-profile-text">
                  <p class="mb-1 text-black"><?= $name ?? '' ?></p>
                </div>
              </a>
              <div class="dropdown-menu navbar-dropdown" aria-labelledby="profileDropdown">
                <a class="dropdown-item" href="<?= base_url('profile') ?>">
                  <i class="mdi mdi-account me-2 text-success"></i> Profile </a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="<?= base_url('Login/logout') ?>">
                  <i class="mdi mdi-logout me-2 text-primary" ></i> Signout </a>
              </div>
            </li>
            <li class="nav-item d-none d-lg-block full-screen-link">
              <a class="nav-link">
                <i class="mdi mdi-fullscreen" id="fullscreen-button"></i>
              </a>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link count-indicator dropdown-toggle" id="notificationDropdown" href="#" data-bs-toggle="dropdown">
                <i class="mdi mdi-bell-outline"></i>
                <span class="count-symbol bg-danger"></span>
              </a>
              <div class="dropdown-menu dropdown-menu-end navbar-dropdown preview-list" aria-labelledby="notificationDropdown">
                <h6 class="p-3 mb-0">Notifications</h6>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item preview-item">
                  <div class="preview-thumbnail">
                    <div class="preview-icon bg-success">
                      <i class="mdi mdi-calendar"></i>
                    </div>
                  </div>
                  <div class="preview-item-content d-flex align-items-start flex-column justify-content-center">
                    <h6 class="preview-subject font-weight-normal mb-1">Event today</h6>
                    <p class="text-gray ellipsis mb-0"> Just a reminder that you have an event today </p>
                  </div>
                </a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item preview-item">
                  <div class="preview-thumbnail">
                    <div class="preview-icon bg-warning">
                      <i class="mdi mdi-cog"></i>
                    </div>
                  </div>
                  <div class="preview-item-content d-flex align-items-start flex-column justify-content-center">
                    <h6 class="preview-subject font-weight-normal mb-1">Settings</h6>
                    <p class="text-gray ellipsis mb-0"> Update dashboard </p>
                  </div>
                </a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item preview-item">
                  <div class="preview-thumbnail">
                    <div class="preview-icon bg-info">
                      <i class="mdi mdi-link-variant"></i>
                    </div>
                  </div>
                  <div class="preview-item-content d-flex align-items-start flex-column justify-content-center">
                    <h6 class="preview-subject font-weight-normal mb-1">Launch Admin</h6>
                    <p class="text-gray ellipsis mb-0"> New admin wow! </p>
                  </div>
                </a>
                <div class="dropdown-divider"></div>
                <h6 class="p-3 mb-0 text-center">See all notifications</h6>
              </div>
            </li>
          </ul>
          <button class="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" data-toggle="offcanvas">
            <span class="mdi mdi-menu"></span>
          </button>
        </div>
      </nav>
      <!-- partial -->
      <div class="container-fluid page-body-wrapper">
        <!-- partial:partials/_sidebar.html -->
        <nav class="sidebar sidebar-offcanvas" id="sidebar">
          <ul class="nav">
            <li class="nav-item nav-profile">
              <a href="#" class="nav-link">
                <div class="nav-profile-image">
                  <img src="<?= base_url('uploads/profile_pictures/') . $profile_picture ?>" class="centered-image" alt="image" onerror="this.src='<?= base_url('assets/') ?>images/logo-blue-mini.png'" />
                  <span class="login-status online"></span>
                  <!--change to offline or busy as needed-->
                </div>
                <div class="nav-profile-text d-flex flex-column">
                  <span class="font-weight-bold mb-2"><?= $name ?? '' ?></span>
                  <span class="text-secondary text-small"><?= $role_name ?? '' ?></span>
                </div>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="<?= base_url('dashboard') ?>">
                <span class="menu-title">Dashboard</span>
                <i class="mdi mdi-home menu-icon"></i>
              </a>
            </li>
            <li class="nav-item sidebar-actions">
              <span class="nav-label">
                <div class="border-bottom">
                  <p class="text-secondary text-small">Main Menu</p>
                </div>
              </span>
            </li>
            <?php if($is_admin): ?>
            <li class="nav-item">
              <a class="nav-link" data-bs-toggle="collapse" href="#master" aria-expanded="false" aria-controls="master">
                <span class="menu-title">Master</span>
                <i class="menu-arrow"></i>
                <i class="mdi mdi-database menu-icon"></i>
              </a>
              <div class="collapse" id="master">
                <ul class="nav flex-column sub-menu">
                  <li class="nav-item"> <a class="nav-link" href="<?= base_url('master/perspective') ?>"> Perspectives </a></li>
                  <li class="nav-item"> <a class="nav-link" href="<?= base_url('master/objective') ?>"> Objectives </a></li>
                  <li class="nav-item"> <a class="nav-link" href="<?= base_url('master/kpi') ?>"> KPIs </a></li>
                  <li class="nav-item"> <a class="nav-link" href="<?= base_url('master/kpi_counter') ?>"> Counters </a></li>
                  <li class="nav-item"> <a class="nav-link" href="<?= base_url('master/kpi_polarization') ?>"> Polarizations </a></li>
                  <li class="nav-item"> <a class="nav-link" href="<?= base_url('master/directorate') ?>"> Directorates </a></li>
                  <li class="nav-item"> <a class="nav-link" href="<?= base_url('master/index_score') ?>"> Index Scores </a></li>
                  <li class="nav-item"> <a class="nav-link" href="<?= base_url('master/year_period') ?>"> Year Periods </a></li>
                  <li class="nav-item"> <a class="nav-link" href="<?= base_url('master/copy_parameter') ?>"> Copy Parameters </a></li>
                  <li class="nav-item"> <a class="nav-link" href="<?= base_url('master/privileges') ?>"> Privileges </a></li>
                </ul>
              </div>
            </li>
            <li class="nav-item">
              <a class="nav-link" data-bs-toggle="collapse" href="#mapping" aria-expanded="false" aria-controls="mapping">
                <span class="menu-title">Mapping</span>
                <i class="menu-arrow"></i>
                <i class="mdi mdi-map menu-icon"></i>
              </a>
              <div class="collapse" id="mapping">
                <ul class="nav flex-column sub-menu">
                  <li class="nav-item"> <a id="menu-corporate-kpi" class="nav-link" href="<?= base_url('mapping/kpi_corporate') ?>"> KPI Corporate </a></li>
                  <li class="nav-item"> <a id="menu-directorate-kpi" class="nav-link" href="<?= base_url('mapping/kpi_directorate') ?>"> KPI Directorate </a></li>
                  <li class="nav-item"> <a id="menu-unit_type-kpi" class="nav-link" href="<?= base_url('mapping/kpi_unit_type') ?>"> KPI Unit Types </a></li>
                  <li class="nav-item"> <a id="menu-position-kpi" class="nav-link" href="<?= base_url('mapping/kpi_position_type') ?>"> KPI Position </a></li>
                  <li class="nav-item"> <a id="menu-corporate-target" class="nav-link" href="<?= base_url('mapping/corporate_target') ?>"> Corporate Targets </a></li>
                </ul>
              </div>
            </li>
            <?php endif; ?>
            <li class="nav-item">
              <a class="nav-link" data-bs-toggle="collapse" href="#goals-settings" aria-expanded="false" aria-controls="goals-settings">
                <span class="menu-title">Goals Settings</span>
                <i class="menu-arrow"></i>
                <i class="mdi mdi-settings menu-icon"></i>
              </a>
              <div class="collapse" id="goals-settings">
                <ul class="nav flex-column sub-menu">
                  <li class="nav-item"> <a id="menu-create-gs" class="nav-link" href="<?= base_url('goals_settings/create_gs') ?>"> Create GS </a></li>
                  <li class="nav-item"> <a id="menu-entry-target-individual" class="nav-link" href="<?= base_url('goals_settings/kpi_individual') ?>"> KPI Individual </a></li>
                  <li class="nav-item"> <a id="menu-entry-target-individual" class="nav-link" href="<?= base_url('goals_settings/kpi_unit') ?>"> KPI Unit </a></li>
                </ul>
              </div>
            </li>
            <li class="nav-item">
              <a class="nav-link" data-bs-toggle="collapse" href="#performance-appraisal" aria-expanded="false" aria-controls="performance-appraisal">
                <span class="menu-title">Performance Appraisal</span>
                <i class="menu-arrow"></i>
                <i class="mdi mdi-file-document-edit menu-icon"></i>
              </a>
              <div class="collapse" id="performance-appraisal">
                <ul class="nav flex-column sub-menu">
                  <li class="nav-item"> <a id="menu-entry-actual" class="nav-link" href="<?= base_url('performance_appraisal/individual_performance_appraisal') ?>"> Individual Performance Appraisal </a></li>
                  <li class="nav-item"> <a id="menu-entry-actual" class="nav-link" href="<?= base_url('performance_appraisal/unit_performance_appraisal') ?>"> Unit Performance Appraisal </a></li>
                </ul>
              </div>
            </li>
            
            <li class="nav-item">
                <a id="menu-approval" class="nav-link" href="<?= base_url('talent_management') ?>">
                    <span class="menu-title">Talent Management</span>
                    <i class="mdi mdi-account-group menu-icon"></i>
                </a>
            </li>
            
            <?php if($is_admin): ?>
            <li class="nav-item">
                <a id="menu-approval" class="nav-link" href="<?= base_url('approval') ?>">
                    <span class="menu-title">Approvals</span>
                    <i class="mdi mdi-check-all menu-icon"></i>
                </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" data-bs-toggle="collapse" href="#report-monitoring" aria-expanded="false" aria-controls="report-monitoring">
                <span class="menu-title">Report & Monitoring</span>
                <i class="menu-arrow"></i>
                <i class="mdi mdi-chart-areaspline menu-icon"></i>
              </a>
              <div class="collapse" id="report-monitoring">
                <ul class="nav flex-column sub-menu">
                  <li class="nav-item"> <a id="menu-unit-performance" class="nav-link" href="<?= base_url('report/unit_performance') ?>"> Unit Performance </a></li>
                  <li class="nav-item"> <a id="menu-individual-performance" class="nav-link" href="<?= base_url('report/individual_performance') ?>"> Individual Performance </a></li>
                </ul>
              </div>
            </li>
            <li class="nav-item">
              <a class="nav-link" data-bs-toggle="collapse" href="#user-management" aria-expanded="false" aria-controls="user-management">
                <span class="menu-title">User Management</span>
                <i class="menu-arrow"></i>
                <i class="mdi mdi-account-multiple menu-icon"></i>
              </a>
              <div class="collapse" id="user-management">
                <ul class="nav flex-column sub-menu">
                  <li class="nav-item"> <a id="menu-create-gs" class="nav-link" href="<?= base_url('user_management/user') ?>"> Users </a></li>
                  <li class="nav-item"> <a id="menu-entry-target-individual" class="nav-link" href="<?= base_url('user_management/role') ?>"> Role and Permission </a></li>
                </ul>
              </div>
            </li>
            <?php endif; ?>
          </ul>
        </nav>
        <!-- partial -->
        <div class="main-panel">
          <div class="content-wrapper">
            <?php echo isset($body) ? $body : 'Default Body Content'; ?>
            
          </div>
          <!-- content-wrapper ends -->
          <!-- partial:partials/_footer.html -->
          <footer class="footer">
            <div class="container-fluid d-flex justify-content-between">
              <span class="text-muted d-block text-center text-sm-start d-sm-inline-block">Copyright © bootstrapdash.com <?= date('Y') ?> | <a href="https://www.banksumut.co.id" target="_blank">Edited by PerforMe</a></span>
              <span class="float-none float-sm-right d-block mt-1 mt-sm-0 text-center">PerforMe & made with <i class="mdi mdi-heart text-danger"></i></span>
            </div>
          </footer>
          <!-- partial -->
        </div>
        <!-- main-panel ends -->
      </div>
      <!-- page-body-wrapper ends -->
    </div>
    <!-- container-scroller -->
    <script>
    var config = {
        siteUrl: "<?= site_url(); ?>"
    };

    function renderLoader({ text = null, color = null } = {}) {
        const loaderContainer = document.querySelector('.loader-container');
        loaderContainer.innerHTML = '';

        if (text) {
            const loadingText = document.createElement('div');
            loadingText.className = 'loading-text';
            loadingText.innerHTML = text;
            loaderContainer.appendChild(loadingText);
        } else {
            const barLoader = document.createElement('div');
            barLoader.className = `bar-loader bar-sm ${color ? 'bar-' + color : 'bar-primary'}`;
            for (let i = 0; i < 5; i++) {
                const span = document.createElement('span');
                barLoader.appendChild(span);
            }
            loaderContainer.appendChild(barLoader);
        }
    }
    </script>
    <!-- plugins:js -->
    <script src="<?= base_url('assets/') ?>vendors/js/vendor.bundle.base.js"></script>
    <script src="<?= base_url('assets/') ?>vendors/jquery/dist/jquery.min.js"></script>
    <!-- endinject -->
    <!-- Plugin js for this page -->
    
    <script src="<?= base_url('assets/') ?>vendors/chart.js/Chart.min.js"></script>
    <script src="<?= base_url('assets/') ?>vendors/datatables5/datatables.min.js"></script>
    <script src="<?= base_url('assets/') ?>vendors/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js"></script>
    <script src="<?= base_url('assets/') ?>vendors/jquery-toast-plugin/dist/jquery.toast.min.js"></script>
    <script src="<?= base_url('assets/') ?>vendors/select2/dist/js/select2.min.js"></script>
    <script src="<?= base_url('assets/') ?>vendors/spectrum-colorpicker/spectrum.js"></script>
    <script src="<?= base_url('assets/') ?>vendors/sweetalert/dist/sweetalert.min.js"></script>
    <script src="<?= base_url('assets/') ?>js/jquery.cookie.js" type="text/javascript"></script>
    <script src="<?= base_url('assets/') ?>vendors/lodash/lodash.min.js"></script>
    
    <!-- End plugin js for this page -->
    <!-- inject:js -->
    <script src="<?= base_url('assets/') ?>js/off-canvas.js"></script>
    <script src="<?= base_url('assets/') ?>js/hoverable-collapse.js"></script>
    <script src="<?= base_url('assets/') ?>js/misc.js"></script>
    <!-- endinject -->
    <!-- Custom js for this page -->
    <script src="<?= base_url('assets/') ?>js/global.js"></script>

    <?php if (isset($js) && is_array($js)): ?>
        <?php foreach ($js as $script): ?>
            <script src="<?= base_url('assets/') ?>js/<?= $script ?>"></script>
        <?php endforeach; ?>
    <?php endif; ?>
    <!-- End custom js for this page -->
  </body>
</html>
