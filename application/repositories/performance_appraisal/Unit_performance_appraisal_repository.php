<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once(APPPATH . 'interface/performance_appraisal/Unit_performance_appraisal_repository_interface.php');

#[\AllowDynamicProperties]
class Unit_performance_appraisal_repository implements Unit_performance_appraisal_repository_interface {
    protected $model;
    protected $year_period_model;
    protected $unit_model;
    protected $kpi_model;
    protected $kpi_unit_target_model;
    protected $kpi_unit_actual_model;
    protected $perspective_model;
    protected $objective_model;

    public function __construct() {
        $CI =& get_instance();
        $CI->load->model('Kpi_unit_model');
        $this->model = $CI->Kpi_unit_model;
        $CI->load->model('Year_period_model');
        $this->year_period_model = $CI->Year_period_model;
        $CI->load->model('Unit_model');
        $this->unit_model = $CI->Unit_model;
        $CI->load->model('Kpi_model');
        $this->kpi_model = $CI->Kpi_model;
        $CI->load->model('Kpi_unit_target_model');
        $this->kpi_unit_target_model = $CI->Kpi_unit_target_model;
        $CI->load->model('Kpi_unit_actual_model');
        $this->kpi_unit_actual_model = $CI->Kpi_unit_actual_model;
        $CI->load->model('Index_score_model');
        $this->index_score_model = $CI->Index_score_model;
        $CI->load->model('Perspective_model');
        $this->perspective_model = $CI->Perspective_model;
        $CI->load->model('Objective_model');
        $this->objective_model = $CI->Objective_model;
    }

    #####
    
    public function store_actual(array $data) {
        return $this->kpi_unit_actual_model->store($data);
    }

    public function update_actual(array $data) {
        return $this->kpi_unit_actual_model->update($data);
    }

    public function submit_kpi(array $data) {
        return $this->model->submit_kpi_actual($data);
    }

    #####

    public function get_kpi_unit($data) {
        return $this->model->get_kpi_unit($data);
    }

    public function get_kpi_by_id($id) {
        return $this->kpi_model->get_by_id($id);
    }

    public function get_kpi_options_by_year_period_id($search, $page, $year_period_id)
    {
        return $this->kpi_model->get_options_by_year_period_id($search, $page, $year_period_id);
    }

    public function get_target_by_id($id) {
        return $this->kpi_unit_target_model->get_by_kpi_unit_id($id);
    }

    public function get_actual_by_id($id) {
        return $this->kpi_unit_actual_model->get_by_kpi_unit_id($id);
    }

    public function get_index_scores($year_period_id) {
        return $this->index_score_model->get_by_year_period_id($year_period_id);
    }

    public function get_year_period_options($search, $page) {
        return $this->year_period_model->get_options($search, $page);
    }

    public function get_unit_options($search, $page) {
        return $this->unit_model->get_options($search, $page);
    }

    public function get_perspective_options_by_year_period_id($search, $page, $year_period_id) {
        return $this->perspective_model->get_options_by_year_period_id($search, $page, $year_period_id);
    }

    public function get_objective_options_by_year_period_id($search, $page, $year_period_id) {
        return $this->objective_model->get_options_by_year_period_id($search, $page, $year_period_id);
    }
}