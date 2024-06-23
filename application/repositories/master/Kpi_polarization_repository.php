<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once(APPPATH . 'interface/master/Kpi_polarization_repository_interface.php');

class Kpi_polarization_repository implements Kpi_polarization_repository_interface {
    protected $model;
    protected $year_period_model;

    public function __construct() {
        $CI =& get_instance();
        $CI->load->model('Kpi_polarization_model');
        $this->model = $CI->Kpi_polarization_model;
        $CI->load->model('Year_period_model');
        $this->year_period_model = $CI->Year_period_model;
    }

    #####

    public function get_datatables() {
        return $this->model->get_datatables();
    }

    public function count_all() {
        return $this->model->count_all();
    }

    public function count_filtered() {
        return $this->model->count_filtered();
    }

    #####

    public function exists(array $data) {
        return $this->model->exists($data);
    }

    public function unique(array $data) {
        return $this->model->unique($data);
    }

    #####

    public function store(array $data) {
        return $this->model->store($data);
    }

    public function update(array $data) {
        return $this->model->update($data);
    }

    public function delete($id) {
        return $this->model->delete($id);
    }

    #####

    public function get_by_id($id) {
        return $this->model->get_by_id($id);
    }

    #####

    public function get_year_period_options($search = '', $page = 1) {
        return $this->year_period_model->get_options($search, $page);
    }
}