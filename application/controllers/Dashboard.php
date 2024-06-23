<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Dashboard extends CI_Controller {
    public function __construct()
    {
        parent::__construct();
        $this->load->library('Base_controller', null, 'bc');

        $this->bc->is_logged_in();
    }

    public function index() {
        $data = array_merge($this->bc->get_global(), [
            'title' => 'Dashboard',
            'current_page' => 'Dashboard',
            'js' => [
                'admin/dashboard.js'
            ]
        ]);
        $this->template->load('admin', 'admin/dashboard', $data);
    }
}