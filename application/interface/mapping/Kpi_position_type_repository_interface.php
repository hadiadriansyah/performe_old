<?php
interface Kpi_position_type_repository_interface {
    #####
    public function exists_group(array $data);
    public function unique_group(array $data);
    #####
    public function store($data);
    public function update($data);
    public function delete($id);
    public function store_group($data);
    public function update_group($data);
    public function store_positions($positions);
    public function delete_positions($group_id, $position_ids);
    public function delete_group($id);
    public function submit_kpi(array $data);
    public function generate_kpi_row($data);
    #####
    public function get_position_by_position_type($position_type);
    public function get_positions_by_group_id($id);
    public function get_kpi_position_type($data);
    public function get_kpi_unit_type_by_group_unit_type_id($data);
    public function get_kpi_by_id($id);
    public function get_kpi_options_by_year_period_id($search = '', $page = 1, $year_period_id);
    public function get_group_by_id($id);
    public function get_kpi_position_type_groups_options($search = '', $page = 1);
    public function get_kpi_unit_type_groups_options($search = '', $page = 1);
    public function get_year_period_options($search = '', $page = 1);
    public function get_position_type_options($search = '', $page = 1);
    public function get_position_options($search = '', $page = 1);
    public function get_perspective_options_by_year_period_id($search = '', $page = 1, $year_period_id);
    public function get_objective_options_by_year_period_id($search = '', $page = 1, $year_period_id);
}