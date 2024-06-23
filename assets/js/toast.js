(function($) {
    window.displayToast = function(heading, text, icon) {
        const loaderBackground = icon === 'success' ? '#f96868' : '#f2a654';
        $.toast({
            heading: heading,
            text: text,
            showHideTransition: 'slide',
            icon: icon,
            loaderBg: loaderBackground,
            position: 'top-right'
        });
    }

})(jQuery);
