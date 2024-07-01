<?php
interface Kpi_unit_repository_interface {
    #####
    public function exists(array $data);
    public function unique(array $data);
    #####
    public function store($data);
    public function update($data);
    public function store_target(array $data);
    public function update_target(array $data);
    public function submit_kpi(array $data);
    public function delete($id);
    public function delete_target($id);
    #####
    public function get_kpi_unit($data);
    public function get_kpi_unit_target_by_unit_id($data);
    public function get_kpi_by_id($id);
    public function get_kpi_options_by_year_period_id($search, $page, $year_period_id);
    public function get_target_by_id($data);
    public function get_year_period_options($search, $page);
    public function get_unit_options($search, $page);
    public function get_unit_options_by_unit_id($data);
    public function get_perspective_options_by_year_period_id($search, $page, $year_period_id);
    public function get_objective_options_by_year_period_id($search, $page, $year_period_id);
}