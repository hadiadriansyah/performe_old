<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once(APPPATH . 'interface/mapping/Kpi_position_type_repository_interface.php');

#[\AllowDynamicProperties]
class Kpi_position_type_repository implements Kpi_position_type_repository_interface {
    protected $model;
    protected $kpi_position_type_group_model;
    protected $year_period_model;
    protected $md_jabatan_model;
    protected $kpi_model;
    protected $perspective_model;
    protected $objective_model;

    public function __construct() {
        $CI =& get_instance();
        $CI->load->model('Kpi_position_type_model');
        $this->model = $CI->Kpi_position_type_model;
        $CI->load->model('Kpi_unit_type_model');
        $this->kpi_unit_type_model = $CI->Kpi_unit_type_model;
        $CI->load->model('Kpi_position_type_group_model');
        $this->kpi_position_type_group_model = $CI->Kpi_position_type_group_model;
        $CI->load->model('Kpi_unit_type_group_model');
        $this->kpi_unit_type_group_model = $CI->Kpi_unit_type_group_model;
        $CI->load->model('Position_kpi_position_type_group_model');
        $this->position_kpi_position_type_group_model = $CI->Position_kpi_position_type_group_model;
        $CI->load->model('Year_period_model');
        $this->year_period_model = $CI->Year_period_model;
        $CI->load->model('Md_jabatan_model');
        $this->md_jabatan_model = $CI->Md_jabatan_model;
        $CI->load->model('Kpi_model');
        $this->kpi_model = $CI->Kpi_model;
        $CI->load->model('Perspective_model');
        $this->perspective_model = $CI->Perspective_model;
        $CI->load->model('Objective_model');
        $this->objective_model = $CI->Objective_model;
    }

    #####

    public function exists_group(array $data) {
        return $this->kpi_position_type_group_model->exists($data);
    }

    public function unique_group(array $data) {
        return $this->kpi_position_type_group_model->unique($data);
    }

    #####

    public function store($data) {
        return $this->model->store($data);
    }

    public function update($data) {
        return $this->model->update($data);
    }


    public function store_group($data) {
        return $this->kpi_position_type_group_model->store($data);
    }

    public function update_group($data) {
        return $this->kpi_position_type_group_model->update($data);
    }
    
    public function store_positions($positions) {
        return $this->position_kpi_position_type_group_model->store_positions($positions);
    }

    public function delete_positions($group_id, $position_ids) {
        return $this->position_kpi_position_type_group_model->delete_positions($group_id, $position_ids);
    }

    public function delete_group($id) {
        return $this->kpi_position_type_group_model->delete($id);
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
    
    public function get_position_by_position_type($position_type) {
        return $this->md_jabatan_model->get_by_position_type($position_type);
    }

    public function get_positions_by_group_id($id) {
        return $this->position_kpi_position_type_group_model->get_positions_by_group_id($id);
    }

    public function get_kpi_position_type($data) {
        return $this->model->get_kpi_position_type($data);
    }

    public function get_kpi_unit_type_by_group_unit_type_id($data) {
        return $this->kpi_unit_type_model->get_by_group_unit_type_id($data);
    }

    public function get_kpi_by_id($id) {
        return $this->kpi_model->get_by_id($id);
    }

    public function get_kpi_options_by_year_period_id($search, $page, $year_period_id)
    {
        return $this->kpi_model->get_options_by_year_period_id($search, $page, $year_period_id);
    }

    public function get_group_by_id($id) {
        return $this->kpi_position_type_group_model->get_by_id($id);
    }

    public function get_kpi_position_type_groups_options($search, $page) {
        return $this->kpi_position_type_group_model->get_options($search, $page);
    }

    public function get_kpi_unit_type_groups_options($search, $page) {
        return $this->kpi_unit_type_group_model->get_options($search, $page);
    }

    public function get_year_period_options($search, $page) {
        return $this->year_period_model->get_options($search, $page);
    }

    public function get_position_type_options($search, $page) {
        return $this->md_jabatan_model->get_position_type_options($search, $page);
    }

    public function get_position_options($search, $page) {
        return $this->md_jabatan_model->get_options($search, $page);
    }

    public function get_perspective_options_by_year_period_id($search, $page, $year_period_id) {
        return $this->perspective_model->get_options_by_year_period_id($search, $page, $year_period_id);
    }

    public function get_objective_options_by_year_period_id($search, $page, $year_period_id) {
        return $this->objective_model->get_options_by_year_period_id($search, $page, $year_period_id);
    }
}