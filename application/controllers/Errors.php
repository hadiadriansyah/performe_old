<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Errors extends CI_Controller {

    public function __construct()
    {
        parent::__construct();
        $this->load->library('Base_controller', null, 'bc');
    }

    public function page_not_found() {
        $this->output->set_status_header('404');
        $data = [
            'title' => '404 Page Not Found'
        ];
        $this->template->load('main', 'errors/error_404', $data);
    }
    
    public function access_denied() {
        $this->bc->is_logged_in();
        $this->output->set_status_header('403');
        $data = array_merge($this->bc->get_global(), [
            'title' => '403 Access Denied'
        ]);
        $this->template->load('admin', 'errors/error_403', $data);
    }
}