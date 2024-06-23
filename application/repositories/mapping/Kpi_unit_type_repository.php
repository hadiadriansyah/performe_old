<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once(APPPATH . 'interface/mapping/Kpi_unit_type_repository_interface.php');

class Kpi_unit_type_repository implements Kpi_unit_type_repository_interface {
    protected $model;
    protected $kpi_unit_type_group_model;
    protected $year_period_model;
    protected $unit_model;
    protected $kpi_model;
    protected $kpi_unit_target_model;
    protected $perspective_model;
    protected $objective_model;

    public function __construct() {
        $CI =& get_instance();
        $CI->load->model('Kpi_unit_type_model');
        $this->model = $CI->Kpi_unit_type_model;
        $CI->load->model('Kpi_unit_type_group_model');
        $this->kpi_unit_type_group_model = $CI->Kpi_unit_type_group_model;
        $CI->load->model('Unit_kpi_unit_type_group_model');
        $this->unit_kpi_unit_type_group_model = $CI->Unit_kpi_unit_type_group_model;
        $CI->load->model('Year_period_model');
        $this->year_period_model = $CI->Year_period_model;
        $CI->load->model('Unit_model');
        $this->unit_model = $CI->Unit_model;
        $CI->load->model('Kpi_model');
        $this->kpi_model = $CI->Kpi_model;
        $CI->load->model('Kpi_unit_target_model');
        $this->kpi_unit_target_model = $CI->Kpi_unit_target_model;
        $CI->load->model('Perspective_model');
        $this->perspective_model = $CI->Perspective_model;
        $CI->load->model('Objective_model');
        $this->objective_model = $CI->Objective_model;
    }

    #####

    public function exists_group(array $data) {
        return $this->kpi_unit_type_group_model->exists($data);
    }

    public function unique_group(array $data) {
        return $this->kpi_unit_type_group_model->unique($data);
    }

    #####

    public function store($data) {
        return $this->model->store($data);
    }

    public function update($data) {
        return $this->model->update($data);
    }


    public function store_group($data) {
        return $this->kpi_unit_type_group_model->store($data);
    }

    public function update_group($data) {
        return $this->kpi_unit_type_group_model->update($data);
    }
    
    public function store_units($units) {
        return $this->unit_kpi_unit_type_group_model->store_units($units);
    }

    public function delete_units($group_id, $unit_ids) {
        return $this->unit_kpi_unit_type_group_model->delete_units($group_id, $unit_ids);
    }

    public function delete_group($id) {
        return $this->kpi_unit_type_group_model->delete($id);
    }

    public function submit_kpi(array $data) {
        return $this->model->submit_kpi($data);
    }

    public function delete($id) {
        return $this->model->delete($id);
    }

    public function generate_kpi_row($data) {
        return $this->model->generate_kpi_row($data);
    }

    #####
    
    public function get_unit_by_unit_type($unit_type) {
        return $this->unit_model->get_by_unit_type($unit_type);
    }

    public function get_units_by_group_id($id) {
        return $this->unit_kpi_unit_type_group_model->get_units_by_group_id($id);
    }

    public function get_kpi_unit_type($data) {
        return $this->model->get_kpi_unit_type($data);
    }

    public function get_kpi_by_id($id) {
        return $this->kpi_model->get_by_id($id);
    }

    public function get_kpi_options_by_year_period_id($search, $page, $year_period_id)
    {
        return $this->kpi_model->get_options_by_year_period_id($search, $page, $year_period_id);
    }

    public function get_group_by_id($id) {
        return $this->kpi_unit_type_group_model->get_by_id($id);
    }

    public function get_kpi_unit_type_groups_options($search = '', $page = 1) {
        return $this->kpi_unit_type_group_model->get_options($search, $page);
    }


    public function get_year_period_options($search = '', $page = 1) {
        return $this->year_period_model->get_options($search, $page);
    }

    public function get_unit_options($search = '', $page = 1) {
        return $this->unit_model->get_options($search, $page);
    }

    public function get_perspective_options_by_year_period_id($search = '', $page = 1, $year_period_id) {
        return $this->perspective_model->get_options_by_year_period_id($search, $page, $year_period_id);
    }

    public function get_objective_options_by_year_period_id($search = '', $page = 1, $year_period_id) {
        return $this->objective_model->get_options_by_year_period_id($search, $page, $year_period_id);
    }
}