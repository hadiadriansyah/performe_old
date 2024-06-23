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
    <link rel="stylesheet" href="<?= base_url('assets/') ?>vendors/jquery-toast-plugin/dist/jquery.toast.min.css">
    <!-- End plugin css for this page -->
    <!-- inject:css -->
    <!-- endinject -->
    <!-- Layout styles -->
    <link rel="stylesheet" href="<?= base_url('assets/') ?>css/style.css">
    <style>
      .navbar .navbar-brand.logo img {
        width: 200px;
      }

      #tree {
          width: 100%;
          height: 800px;
      }

      /*partial*/
      .node.RUPS rect {
          fill: #F57C00;
      }
      .node.RUPS text {
          fill: #ffffff;
      }

      .node.Direktur rect {
          fill: #039BE5;
      }
      .node.Direktur text {
          fill: #ffffff;
      }

      .node rect {
          fill: #ffffff;
      }
      .node text {
          fill: #000000;
      }
    </style>
    <!-- End layout styles -->
    <link rel="shortcut icon" href="<?= base_url('assets/') ?>images/logo-blue-mini.png" />
  </head>
  <body>
    <div class="container-scroller">
      <?php echo isset($body) ? $body : 'Default Body Content'; ?>
    </div>

    <script>
    function renderLoader({ text = null, color = null } = {}) {
        const loaderContainer = document.querySelector('.loaderContainer');
        loaderContainer.innerHTML = '';

        if (text) {
            const loadingText = document.createElement('div');
            loadingText.className = 'loading-text';
            loadingText.textContent = text;
            loaderContainer.appendChild(loadingText);
        } else {
            const barLoader = document.createElement('div');
            barLoader.className = `bar-loader bar-sm bar-${color ? 'bar-' + color : 'bar-primary'}`;
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
    <script src="<?= base_url('assets/') ?>vendors/jquery-toast-plugin/dist/jquery.toast.min.js"></script>
    <script src="<?= base_url('assets/') ?>vendors/orgchart.js/orgchart.js"></script>
    <script src="<?= base_url('assets/') ?>vendors/lodash/lodash.min.js"></script>
    <!-- endinject -->
    <!-- Plugin js for this page -->
    <!-- End plugin js for this page -->
    <!-- inject:js -->
    <script src="<?= base_url('assets/') ?>js/off-canvas.js"></script>
    <script src="<?= base_url('assets/') ?>js/hoverable-collapse.js"></script>
    <script src="<?= base_url('assets/') ?>js/misc.js"></script>
    <!-- endinject -->
    <!-- Custom js for this page -->
    <script src="<?= base_url('assets/') ?>js/global.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jsencrypt/3.0.0/jsencrypt.min.js"></script>
    <script>
      var config = {
          siteUrl: "<?= site_url(); ?>"
      };
    </script>
    
    <?php if (isset($js) && is_array($js)): ?>
        <?php foreach ($js as $script): ?>
            <script src="<?= base_url('assets/') ?>js/<?= $script ?>"></script>
        <?php endforeach; ?>
    <?php endif; ?>
    <!-- End custom js for this page -->
  </body>
</html>