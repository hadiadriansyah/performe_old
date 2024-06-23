(function($) {
    'use strict';

    $(initializePage);

    function initializePage() {
        handleFormEvents();
        initializeModalBtn();
    }

    function handleFormEvents() {
        $('#formChangePassword').submit(event => {
            event.preventDefault();
            setupFormSubmission();
        });
    }

    function setupFormSubmission() {
        const formDetails = {
            url: 'profile/change_password',
            formData: $('#formChangePassword').serialize()
        };
        submitFormData(formDetails);
    }

    async function submitFormData(formDetails) {
        const $this = $('#btnSaveChangePassword');
        $this.prop('disabled', true);
        renderLoader({ size: 'sm' });
        try {
            const response = await fetch(`${config.siteUrl}${formDetails.url}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formDetails.formData
            });

            await new Promise(resolve => setTimeout(resolve, 500));

            const result = await response.json();
            handleFormResponse(result);
        } catch (error) {
            displayToast('Error', 'Error while submitting data', 'error');
        }
        $this.prop('disabled', false);
        renderLoader({ text: 'Save' });
    }

    function handleFormResponse(response) {
        if (response.status === 'success') {
            displayToast('Success', response.message, 'success');
            $('#formChangePassword').trigger('reset');
        } else {
            displayToast('Error', response.message, 'error');
            $.each(response.errors, function(key, value) {
                $(`#formChangePassword`).find(`#error-${key}`).html(value);
            });
        }
    }

    $('#formChangePassword').on('reset', function() {
        $('.error-message').html('');
    });
})(jQuery);