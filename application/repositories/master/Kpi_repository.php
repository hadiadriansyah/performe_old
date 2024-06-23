<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once(APPPATH . 'interface/master/Kpi_repository_interface.php');

class Kpi_repository implements Kpi_repository_interface
{
    protected $model;
    protected $kpi_counter_model;
    protected $kpi_polarization_model;
    protected $year_period_model;

    public function __construct()
    {
        $CI =& get_instance();
        $CI->load->model('Kpi_model');
        $this->model = $CI->Kpi_model;
        $CI->load->model('Year_period_model');
        $this->year_period_model = $CI->Year_period_model;
        $CI->load->model('Kpi_counter_model');
        $this->kpi_counter_model = $CI->Kpi_counter_model;
        $CI->load->model('Kpi_polarization_model');
        $this->kpi_polarization_model = $CI->Kpi_polarization_model;
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

    public function get_kpi_counter_options_by_year_period_id($search = '', $page = 1, $year_period_id = '')
    {
        return $this->kpi_counter_model->get_options_by_year_period_id($search, $page, $year_period_id);
    }

    public function get_kpi_polarization_options_by_year_period_id($search = '', $page = 1, $year_period_id = '')
    {
        return $this->kpi_polarization_model->get_options_by_year_period_id($search, $page, $year_period_id);
    }
}
