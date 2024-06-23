<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require APPPATH . '/libraries/BaseController.php';

class Profile extends BaseController {

    protected $repository;

    public function __construct() {
        parent::__construct();
        $this->is_logged_in();
        $this->load->repository('Profile_repository');
        $this->repository = new Profile_repository();
    }

    public function index() {
        $user = $this->repository->get_user($this->vendor_id);

        $data = array_merge($this->global, [
            'title' => 'Profile',
            'js' => [
                'profile' => 'profile.js'
            ],
            'user' => $user
        ]);
        $this->template->load('admin', 'admin/profile/index', $data);
    }

    public function change_password() {
        $id = $this->vendor_id;

        if (!$id) {
            $this->jsonresponse->error('ID is required.');
            return;
        }

        if (!$this->validate_input_change_password()) {
            $this->handle_validation_error_change_password();
            return;
        }
        $data = $this->collect_input_data_change_password(false, $id);

        $is_exists = $this->repository->check_old_password($id, $this->input->post('old_password'));
        
        if (!$is_exists) {
            $this->jsonresponse->error(
                'The old password is incorrect.'
            );
            return;
        }

        $this->update_data($data);
    }

    private function validate_input_change_password() {
        $this->form_validation->set_rules('old_password', 'Old Password', 'required|trim');
        $this->form_validation->set_rules('new_password', 'New Password', 'required|trim|min_length[6]');
        $this->form_validation->set_rules('confirm_password', 'Confirm Password', 'required|trim|matches[new_password]');
        $this->form_validation->set_error_delimiters('', '');
        return $this->form_validation->run();
    }

    private function collect_input_data_change_password($is_store = false, $id = null) {
        $data = $_POST;

        $input_data = [
            'password' => password_hash($data['new_password'], PASSWORD_BCRYPT)
        ];
        
        $input_data['id'] = $id;

        return $input_data;
    }

    private function handle_validation_error_change_password() {
        $errors = $this->collect_form_errors_change_password();
        $this->jsonresponse->error('Failed to save data.', $errors);
    }

    private function collect_form_errors_change_password() {
        return [
            'old_password' => form_error('old_password'),
            'new_password' => form_error('new_password'),
            'confirm_password' => form_error('confirm_password')
        ];
    }

    private function update_data($data) {
        $update = $this->repository->update($data);
        $message = $update ? 'Data successfully updated.' : 'Failed to update data.';
        $this->jsonresponse->{$update ? 'success' : 'error'}($message, $update);
    }
}