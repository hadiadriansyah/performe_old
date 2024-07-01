<?php
interface Kpi_individual_repository_interface {
    public function get_temp_position_hist_by_employee_id($employee_id);
    public function get_position_hist_by_employee_id($employee_id);
    #####
    public function get_year_period_options($search, $page);
    public function get_employee_options($search, $page);
    public function get_position_by_id($id);
    public function get_unit_by_id($id);
    public function get_pa_individual($year_period_id, $employee_id);
}