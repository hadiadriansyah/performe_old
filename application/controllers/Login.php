<?php
defined('BASEPATH') OR exit('No direct script access allowed');

use \Firebase\JWT\JWT;
use Firebase\JWT\Key;

class Login extends CI_Controller {

    protected $repository;
    protected $secret_key = "YOUR_SECRET_KEY";
    
    public function __construct()
    {
        parent::__construct();
        $this->load->repository('Login_repository');
        $this->repository = new Login_repository();
    }

    public function index() {
        $this->is_logged_in();
    }

    public function is_logged_in() {
        if (!$this->session->userdata('is_logged_in')) {
            $data = [
                'title' => 'Home',
                'js' => [
                    '../vendors/crypto-js/crypto-js.js',
                    'login.js'
                ]
            ];
            $this->template->load('main', 'main/login', $data);
        } else {
            redirect('dashboard');
        }
    }

    // Admin 

    public function check_credentials() {
        if (!$this->validate_input_adm()) {
            $this->json_response->error('Invalid input.', $this->collect_form_errors_adm());
            return;
        }

        $data = $this->collect_input_data_adm();
        $check = $this->repository->check_credentials($data['email'], $data['password']);

        if ($check) {
            $this->process_user_login_adm($check);
        } else {
            $this->json_response->error('Email or password is incorrect.');
        }
    }

    private function process_user_login_adm($user) {
        if ($user->is_active == INACTIVE) {
            $this->json_response->error('The user is inactive');
            return;
        }

        $data = [
            'agent' => get_browser_agent(),
            'client_ip' => $this->input->ip_address()
        ];

        $last_login = $this->repository->last_login_info($user->id);

        $session_array = [
            'user_id' => $user->id,
            'name' => $user->name,
            'is_admin' => 1,
            'employee_id' => '',
            'employee_status' => '',
            'employee_position' => '',
            'employee_unit_id' => '',
            'last_login' => empty($last_login->created_at) ? '' : $last_login->created_at,
            'is_logged_in' => TRUE,
            'profile_picture' => $user->profile_picture
        ];

        $this->session->set_userdata($session_array);

        $login_info = [
            "user_id" => $user->id,
            "session_data" => json_encode(array_diff_key($session_array, array_flip(['user_id', 'is_logged_in', 'last_login']))),
            "machine_ip" => $_SERVER['REMOTE_ADDR'],
            "user_agent" => $this->agent->browser(),
            "agent_string" => $this->agent->agent_string(),
            "platform" => $this->agent->platform()
        ];

        $this->repository->last_login($login_info);
        $this->json_response->success('Login success');
    }

    // Employee

    public function check_credentials_emp() {
        if (!$this->validate_input_emp()) {
            $this->json_response->error('Invalid input.', $this->collect_form_errors_emp());
            return;
        }

        $data = $this->collect_input_data_emp();
        $check = $this->repository->check_credentials_emp($data['nrik'], $data['password']);

        if ($check) {
            $this->process_user_login_emp($check);
        } else {
            $this->json_response->error('Email or password is incorrect.');
        }
    }

    private function process_user_login_emp($user) {
        if ($user->status == INACTIVE) {
            $this->json_response->error('The user is inactive');
            return;
        }

        $data = [
            'agent' => get_browser_agent(),
            'client_ip' => $this->input->ip_address()
        ];

        $last_login = $this->repository->last_login_info($user->id);

        $session_array = [
            'user_id' => $user->id,
            'name' => $user->emp_name,
            'is_admin' => 0,
            'employee_id' => $user->id_peg,
            'employee_status' => $user->status_peg,
            'employee_position' => $user->id_jabatan,
            'employee_unit_id' => $user->id_unit_kerja,
            'last_login' => empty($last_login->created_at) ? '' : $last_login->created_at,
            'is_logged_in' => TRUE,
            'profile_picture' => ''
        ];

        $this->session->set_userdata($session_array);

        $login_info = [
            "user_id" => $user->id,
            "session_data" => json_encode(array_diff_key($session_array, array_flip(['user_id', 'is_logged_in', 'last_login']))),
            "machine_ip" => $_SERVER['REMOTE_ADDR'],
            "user_agent" => $this->agent->browser(),
            "agent_string" => $this->agent->agent_string(),
            "platform" => $this->agent->platform()
        ];

        $this->repository->last_login($login_info);
        $this->json_response->success('Login success');
    }

    private function validate_input_adm() {
        $this->form_validation->set_rules('email', 'Email', 'required|trim');
        $this->form_validation->set_rules('password', 'Password', 'required|trim');
        $this->form_validation->set_error_delimiters('', '');
        return $this->form_validation->run();
    }

    private function collect_input_data_adm() {
        return [
            'email' => $this->input->post('email', TRUE),
            'password' => $this->input->post('password', TRUE)
        ];
    }

    private function collect_form_errors_adm() {
        return [
            'email' => form_error('email'),
            'password' => form_error('password')
        ];
    }

    private function validate_input_emp() {
        $this->form_validation->set_rules('nrik', 'NRIK', 'required|trim|min_length[4]|max_length[4]');
        $this->form_validation->set_rules('password', 'Password', 'required|trim');
        $this->form_validation->set_error_delimiters('', '');
        return $this->form_validation->run();
    }

    private function collect_input_data_emp() {
        return [
            'nrik' => $this->input->post('nrik', TRUE),
            'password' => $this->input->post('password', TRUE)
        ];
    }

    private function collect_form_errors_emp() {
        return [
            'nrik' => form_error('nrik'),
            'password' => form_error('password')
        ];
    }

    public function generate_password_bcrypt($password = '') {
        echo password_hash($password, PASSWORD_BCRYPT);
    }

    public function logout() {
        $this->session->sess_destroy();
        redirect();
    } 
}