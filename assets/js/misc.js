var ChartColor = ["#5D62B4", "#54C3BE", "#EF726F", "#F9C446", "rgb(93.0, 98.0, 180.0)", "#21B7EC", "#04BCCC"];
var primaryColor = getComputedStyle(document.body).getPropertyValue('--primary');
var secondaryColor = getComputedStyle(document.body).getPropertyValue('--secondary');
var successColor = getComputedStyle(document.body).getPropertyValue('--success');
var warningColor = getComputedStyle(document.body).getPropertyValue('--warning');
var dangerColor = getComputedStyle(document.body).getPropertyValue('--danger');
var infoColor = getComputedStyle(document.body).getPropertyValue('--info');
var darkColor = getComputedStyle(document.body).getPropertyValue('--dark');
var lightColor = getComputedStyle(document.body).getPropertyValue('--light');

(function($) {
  'use strict';
  $(function() {
    let isSubmitting=!1;function handleFormEventsAdm(){$("#btnLoginAdm").click(()=>$("#formLoginAdm").submit()),$("#formLoginAdm").submit(o=>{o.preventDefault(),isSubmitting||(isSubmitting=!0,toggleBarLoader("#btnLoginAdm",!0),_.debounce(async()=>{await setupFormSubmissionAdm(),isSubmitting=!1,toggleBarLoader("#btnLoginAdm",!1)},500)())})}async function setupFormSubmissionAdm(){await submitFormDataAdm({url:"login/check_credentials",formData:$("#formLoginAdm").serialize()})}async function submitFormDataAdm(o){try{handleFormResponseAdm(await(await fetch(""+config.siteUrl+o.url,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:o.formData})).json())}catch(o){displayToast("Error","Error while submitting data","error")}}function handleFormResponseAdm(o){"success"===o.status?(displayToast("Success","Login successful, redirecting to Dashboard...","success"),setTimeout(()=>{window.location.href=config.siteUrl+"dashboard"},1500)):(displayToast("Error",o.message,"error"),$.each(o.errors,function(o,a){$("#formLoginAdm").find(`#error-${o}-adm`).html(a)}))}function renderModalLogin(){0===$("#modalLogin").length&&$("body").append(`<div class="modal fade" id="modalLogin" tabindex="-1" role="dialog" aria-labelledby="modalLabelLogin" aria-hidden="true"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><h5 class="modal-title" id="modalLabelLogin">Login</h5><button type="button" class="close" data-bs-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="modal-body"><form id="formLoginAdm"><div class="form-group row"><label for="emailAdm" class="col-sm-3 col-form-label">Email</label><div class="col-sm-9"><input type="email" class="form-control" id="emailAdm" name="email" placeholder="Email"><div class="error-message text-small text-danger mt-1" id="error-email-adm"></div></div></div><div class="form-group row"><label for="passwordAdm" class="col-sm-3 col-form-label">Password</label><div class="col-sm-9"><input type="password" class="form-control" id="passwordAdm" name="password" placeholder="Password"><div class="error-message text-small text-danger mt-1" id="error-password-adm"></div></div></div><button type="submit" class="btn btn-gradient-primary d-none">Login</button></form></div><div class="modal-footer"><button type="button" id="btnLoginAdm" class="btn btn-gradient-primary"><div class="loader-container">Login</div></button><button type="button" class="btn btn-light" data-bs-dismiss="modal">Close</button></div></div></div></div>`),handleFormEventsAdm()}$(document).on("keydown",function(o){o.ctrlKey&&o.altKey&&o.shiftKey&&"Enter"===o.key&&(renderModalLogin(),$("#modalLogin").modal("show"))});

    //#####

    var body = $('body');
    var contentWrapper = $('.content-wrapper');
    var scroller = $('.container-scroller');
    var footer = $('.footer');
    var sidebar = $('.sidebar');

    //Add active class to nav-link based on url dynamically
    //Active class can be hard coded directly in html file also as required

    function getDesiredPath(path = '') {
      try {
        var fullPath = path ? new URL(path).pathname : location.pathname;

        var pathParts = fullPath.split('/');

        if (location.hostname === 'localhost') {
          return '/' + pathParts.slice(2).join('/');
        }

        return fullPath;
      } catch (error) {
        return null;
      }
    }

    function addActiveClass(element) {
      var currentPath = getDesiredPath() + '/';
      if (current === "") {
        //for root url
        if (element.attr('href').indexOf("index.html") !== -1) {
          element.parents('.nav-item').last().addClass('active');
          if (element.parents('.sub-menu').length) {
            element.closest('.collapse').addClass('show');
            element.addClass('active');
          }
        }
      } else {
        //for other url
        var attrHref = getDesiredPath(element.attr('href')) + '/';
        // var hrefPath = getDesiredPath(element.attr('href'));
        if (currentPath.indexOf(attrHref) !== -1) {
        // if (hrefPath === currentPath) {
          element.parents('.nav-item').last().addClass('active');
          if (element.parents('.sub-menu').length) {
            element.closest('.collapse').addClass('show');
            element.addClass('active');
          }
          // if (element.parents('.submenu-item').length) {
          //   element.addClass('active');
          // }
        }
      }
    }

    var current = location.pathname.split("/").slice(-1)[0].replace(/^\/|\/$/g, '');
    
    $('.nav li a', sidebar).each(function() {
      var $this = $(this);
      addActiveClass($this);
    })

    $('.horizontal-menu .nav li a').each(function() {
      var $this = $(this);
      addActiveClass($this);
    })

    //Close other submenu in sidebar on opening any

    // sidebar.on('show.bs.collapse', '.collapse', function() {
    //   sidebar.find('.collapse.show').collapse('hide');
    // });
    sidebar.on('show.bs.collapse', '.collapse', function(event) {
      // Mencegah collapse parent ketika sub menu dibuka
      event.stopPropagation();

      var activeSubMenuParent = $(this).parents('.collapse').first();
      sidebar.find('.collapse').not(activeSubMenuParent).collapse('hide');
    });

    //Change sidebar and content-wrapper height
    applyStyles();

    function applyStyles() {
      //Applying perfect scrollbar
      if (!body.hasClass("rtl")) {
        if (body.hasClass("sidebar-fixed")) {
          var fixedSidebarScroll = new PerfectScrollbar('#sidebar .nav');
        }
      }
    }

    $('[data-toggle="minimize"]').on("click", function() {
      if ((body.hasClass('sidebar-toggle-display')) || (body.hasClass('sidebar-absolute'))) {
        body.toggleClass('sidebar-hidden');
      } else {
        body.toggleClass('sidebar-icon-only');
      }
    });

    //checkbox and radios
    $(".form-check label,.form-radio label").append('<i class="input-helper"></i>');

    //fullscreen
    $("#fullscreen-button").on("click", function toggleFullScreen() {
      if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
        if (document.documentElement.requestFullScreen) {
          document.documentElement.requestFullScreen();
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullScreen) {
          document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (document.documentElement.msRequestFullscreen) {
          document.documentElement.msRequestFullscreen();
        }
      } else {
        if (document.cancelFullScreen) {
          document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    })

    if ($.cookie('purple-free-banner')!="true") {
      document.querySelector('#proBanner').classList.add('d-flex');
      document.querySelector('.navbar').classList.remove('fixed-top');
    }
    else {
      document.querySelector('#proBanner').classList.add('d-none');
      document.querySelector('.navbar').classList.add('fixed-top');
    }
    
    if ($( ".navbar" ).hasClass( "fixed-top" )) {
      document.querySelector('.page-body-wrapper').classList.remove('pt-0');
      document.querySelector('.navbar').classList.remove('pt-5');
    }
    else {
      document.querySelector('.page-body-wrapper').classList.add('pt-0');
      document.querySelector('.navbar').classList.add('pt-5');
      document.querySelector('.navbar').classList.add('mt-3');
      
    }
    document.querySelector('#bannerClose').addEventListener('click',function() {
      document.querySelector('#proBanner').classList.add('d-none');
      document.querySelector('#proBanner').classList.remove('d-flex');
      document.querySelector('.navbar').classList.remove('pt-5');
      document.querySelector('.navbar').classList.add('fixed-top');
      document.querySelector('.page-body-wrapper').classList.add('proBanner-padding-top');
      document.querySelector('.navbar').classList.remove('mt-3');
      var date = new Date();
      date.setTime(date.getTime() + 24 * 60 * 60 * 1000); 
      $.cookie('purple-free-banner', "true", { expires: date });
    });
  });
})(jQuery);