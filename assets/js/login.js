(function($) {
    'use strict';

    let isSubmitting = false;

    $(initializePage);

    function initializePage() {
        handleFormEvents();
    }

    function handleFormEvents() {
        $('#formLogin').submit(event => {
            event.preventDefault();
            if (isSubmitting) return;
            isSubmitting = true;
            toggleBarLoader('#btnLogin', true);
            _.debounce(async () => {
                await setupFormSubmission();
                isSubmitting = false;
                toggleBarLoader('#btnLogin', false);
            }, 500)();
        });
    }

    async function setupFormSubmission() {
        const formDetails = {
            url: 'login/check_credentials_emp',
            formData: $('#formLogin').serialize()
        };
        await submitFormData(formDetails);
    }

    async function submitFormData({ url, formData }) {
        try {
            const response = await fetch(`${config.siteUrl}${url}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData,
                cache: 'no-cache'
            });
            const result = await response.json();
            handleFormResponse(result);
        } catch (error) {
            displayToast('Error', 'Error while submitting data', 'error');
        }
    }

    function handleFormResponse(response) {
        if (response.status === 'success') {
            displayToast('Success', 'Login successful, redirecting to Dashboard...', 'success');
            setTimeout(() => {
                window.location.href = config.siteUrl + 'dashboard';
            }, 1500);
        } else {
            displayToast('Error', response.message, 'error');
            $.each(response.errors, function(key, value) {
                $(`#formLogin`).find(`#error-${key}`).html(value);
            });
        }
    }

})(jQuery);