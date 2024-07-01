<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Profile extends CI_Controller {


    public function __construct() {
        parent::__construct();

        $this->load->library('Base_controller', null, 'bc');
        $this->bc->is_logged_in();
    }
}