<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once(APPPATH . 'interface/goals_settings/Kpi_individual_repository_interface.php');

#[\AllowDynamicProperties]
class Kpi_individual_repository implements Kpi_individual_repository_interface {
    protected $pa_individual_model;
    protected $year_period_model;
    protected $emp_data_peg_model;
    protected $hist_pelaksana_jabatan_model;
    protected $hist_jabatan_model;

    public function __construct() {
        $CI =& get_instance();
        $CI->load->model('Pa_individual_model');
        $this->pa_individual_model = $CI->Pa_individual_model;
        $CI->load->model('Hist_pa_individual_model');
        $this->hist_pa_individual_model = $CI->Hist_pa_individual_model;
        $CI->load->model('Year_period_model');
        $this->year_period_model = $CI->Year_period_model;
        $CI->load->model('Emp_data_peg_model');
        $this->emp_data_peg_model = $CI->Emp_data_peg_model;
        $CI->load->model('Hist_pelaksana_jabatan_model');
        $this->hist_pelaksana_jabatan_model = $CI->Hist_pelaksana_jabatan_model;
        $CI->load->model('Hist_jabatan_model');
        $this->hist_jabatan_model = $CI->Hist_jabatan_model;
        $CI->load->model('Md_jabatan_model');
        $this->md_jabatan_model = $CI->Md_jabatan_model;
        $CI->load->model('Unit_model');
        $this->unit_model = $CI->Unit_model;
    }

    #####

    public function get_temp_position_hist_by_employee_id($employee_id) {
        return $this->hist_pelaksana_jabatan_model->get_by_employee_id($employee_id);
    }

    public function get_position_hist_by_employee_id($employee_id) {
        return $this->hist_jabatan_model->get_by_employee_id($employee_id);
    }

    #####

    public function get_year_period_options($search, $page) {
        return $this->year_period_model->get_options($search, $page);
    }

    public function get_employee_options($search, $page) {
        return $this->emp_data_peg_model->get_options($search, $page);
    }

    public function get_position_by_id($id) {
        return $this->md_jabatan_model->get_by_id($id);
    }

    public function get_unit_by_id($id) {
        return $this->unit_model->get_by_id($id);
    }

    public function get_pa_individual($year_period_id, $employee_id) {
        return $this->pa_individual_model->get_by_year_period_id_employee_id($year_period_id, $employee_id);
    }
}