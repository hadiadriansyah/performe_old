<?php
interface Kpi_unit_repository_interface {
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
    public function get_kpi_by_id($id);
    public function get_kpi_options_by_year_period_id($search = '', $page = 1, $year_period_id);
    public function get_target_by_id($data);
    public function get_year_period_options($search = '', $page = 1);
    public function get_unit_options($search = '', $page = 1);
    public function get_unit_options_by_unit_id($data);
    public function get_perspective_options_by_year_period_id($search = '', $page = 1, $year_period_id);
    public function get_objective_options_by_year_period_id($search = '', $page = 1, $year_period_id);
}