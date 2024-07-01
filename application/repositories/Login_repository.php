<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once(APPPATH . 'interface/Login_repository_interface.php');

#[\AllowDynamicProperties]
class Login_repository implements Login_repository_interface {
    protected $model;
    protected $last_login_model;
    protected $adm_user_model;

    public function __construct() {
        $CI =& get_instance();
        $CI->load->model('User_model');
        $this->model = $CI->User_model;
        $CI->load->model('Last_login_model');
        $this->last_login_model = $CI->Last_login_model;
        $CI->load->model('Adm_user_model');
        $this->adm_user_model = $CI->Adm_user_model;
    }

    public function check_credentials($email, $password) {
        return $this->model->check_credentials($email, $password);
    }

    public function check_credentials_emp($nrik, $password) {
        return $this->adm_user_model->check_credentials($nrik, $password);
    }
    
    public function last_login($login_info) {
        return $this->last_login_model->last_login($login_info);
    }
    
    public function last_login_info($user_id) {
        return $this->last_login_model->last_login_info($user_id);
    }
}

