    let isSubmitting = false;
    
    $(document).on('keydown', function(e) {
        if (e.ctrlKey && e.altKey && e.shiftKey && e.key === 'Enter') {
            renderModalLogin();
            $('#modalLogin').modal('show');
        }
    });

    function handleFormEventsAdm() {
        $('#btnLoginAdm').click(() => $('#formLoginAdm').submit());
        $('#formLoginAdm').submit(event => {
            event.preventDefault();
            if (isSubmitting) return;
            isSubmitting = true;
            toggleBarLoader('#btnLoginAdm', true);
            _.debounce(async () => {
                await setupFormSubmissionAdm();
                isSubmitting = false;
                toggleBarLoader('#btnLoginAdm', false);
            }, 500)();
        });
    }

    async function setupFormSubmissionAdm() {
        const formDetails = {
            url: 'login/check_credentials',
            formData: $('#formLoginAdm').serialize()
        };
        await submitFormDataAdm(formDetails);
    }

    async function submitFormDataAdm(formDetails) {
        try {
            const response = await fetch(`${config.siteUrl}${formDetails.url}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formDetails.formData
            });
            const result = await response.json();
            handleFormResponseAdm(result);
        } catch (error) {
            displayToast('Error', 'Error while submitting data', 'error');
        }
    }

    function handleFormResponseAdm(response) {
        if (response.status === 'success') {
            displayToast('Success', 'Login successful, redirecting to Dashboard...', 'success');
            setTimeout(() => {
                window.location.href = config.siteUrl + 'dashboard';
            }, 1500);
        } else {
            displayToast('Error', response.message, 'error');
            $.each(response.errors, function(key, value) {
                $(`#formLoginAdm`).find(`#error-${key}-adm`).html(value);
            });
        }
    }

    function renderModalLogin() {
        if ($('#modalLogin').length === 0) {
            $('body').append(`
                <div class="modal fade" id="modalLogin" tabindex="-1" role="dialog" aria-labelledby="modalLabelLogin" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="modalLabelLogin">Login</h5>
                                <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <form id="formLoginAdm">
                                    <div class="form-group row">
                                        <label for="emailAdm" class="col-sm-3 col-form-label">Email</label>
                                        <div class="col-sm-9">
                                            <input type="email" class="form-control" id="emailAdm" name="email" placeholder="Email">
                                            <div class="error-message text-small text-danger mt-1" id="error-email-adm"></div>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="passwordAdm" class="col-sm-3 col-form-label">Password</label>
                                        <div class="col-sm-9">
                                            <input type="password" class="form-control" id="passwordAdm" name="password" placeholder="Password">
                                            <div class="error-message text-small text-danger mt-1" id="error-password-adm"></div>
                                        </div>
                                    </div>
                                    <button type="submit" class="btn btn-gradient-primary d-none">Login</button>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" id="btnLoginAdm" class="btn btn-gradient-primary">
                                    <div class="loader-container">Login</div>
                                </button>
                                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            `);
        }
        handleFormEventsAdm();
    }