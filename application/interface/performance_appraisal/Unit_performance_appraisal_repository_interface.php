<?php
interface Unit_performance_appraisal_repository_interface {
    #####
    public function store_actual(array $data);
    public function update_actual(array $data);
    public function submit_kpi(array $data);
    #####
    public function get_kpi_unit($data);
    public function get_kpi_by_id($id);
    public function get_kpi_options_by_year_period_id($search, $page, $year_period_id);
    public function get_target_by_id($data);
    public function get_actual_by_id($data);
    public function get_index_scores($year_period_id);
    public function get_year_period_options($search, $page);
    public function get_unit_options($search, $page);
    public function get_perspective_options_by_year_period_id($search, $page, $year_period_id);
    public function get_objective_options_by_year_period_id($search, $page, $year_period_id);
}