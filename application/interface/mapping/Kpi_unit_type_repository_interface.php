<?php

interface Kpi_unit_type_repository_interface {
    #####
    public function exists(array $data);
    public function unique(array $data);
    public function exists_group(array $data);
    public function unique_group(array $data);
    #####
    public function store($data);
    public function update($data);
    public function delete($id);
    public function store_group($data);
    public function update_group($data);
    public function store_units($units);
    public function delete_units($group_unit_type_id, $unit_ids);
    public function delete_group($id);
    public function submit_kpi(array $data);
    public function generate_kpi_row($data);
    #####
    public function get_unit_by_unit_type($unit_type);
    public function get_units_by_group_unit_type($data);
    public function get_units_by_group_unit_type_id($id);
    public function get_kpi_unit_type($data);
    public function get_kpi_by_id($id);
    public function get_kpi_options_by_year_period_id($search, $page, $year_period_id);
    public function get_group_by_id($id);
    public function get_kpi_unit_type_groups_options($search, $page);
    public function get_year_period_options($search, $page);
    public function get_unit_options($search, $page);
    public function get_perspective_options_by_year_period_id($search, $page, $year_period_id);
    public function get_objective_options_by_year_period_id($search, $page, $year_period_id);
}