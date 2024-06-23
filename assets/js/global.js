(function($) {
    'use strict';

    $(initializePage);

    function initializePage() {}

    function createBarLoader() {
        const barLoader = $('<div>', { id: 'bar-loader', class: 'bar-loader bar-lg d-none' });
        for (let i = 0; i < 5; i++) {
            barLoader.append($('<span>'));
        }
        $('body').append(barLoader);
    }
    
    function toggleBarLoader(buttonSelector = null, show) {
        let barLoader = $('#bar-loader');
        if (barLoader.length === 0) {
            createBarLoader();
            barLoader = $('#bar-loader');
        }
        barLoader.toggleClass('d-none', !show);
        if (buttonSelector) {
            const button = $(buttonSelector);
            button.prop('disabled', show);
        }
    }
    
    function toggleButtonLoader(buttonSelector, show, { color = 'bar-primary', data = 'Save' } = {}) {
        const button = $(buttonSelector);
        let barLoader = button.find('.bar-loader');
        
        if (show) {
            if (barLoader.length === 0) {
                barLoader = $('<div>', { class: `bar-loader bar-sm ${color}` });
                for (let i = 0; i < 5; i++) {
                    barLoader.append($('<span>'));
                }
                button.html(barLoader).append(` ${data}`);
            }
            barLoader.removeClass('d-none');
        } else {
            barLoader.addClass('d-none');
            button.html(data);
        }
        button.prop('disabled', show);
    }

    function displayToast(heading, message, iconType, position = 'top-right') {
        $.toast({
            heading,
            text: message,
            showHideTransition: 'slide',
            icon: iconType,
            loaderBg: iconType === 'success' ? '#f96868' : '#f2a654',
            position: position
        });
    }

    window.toggleBarLoader = toggleBarLoader;
    window.toggleButtonLoader = toggleButtonLoader;
    window.displayToast = displayToast;

})(jQuery);