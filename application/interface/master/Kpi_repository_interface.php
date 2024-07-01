<?php
interface Kpi_repository_interface
{
    public function get_datatables();
    public function count_all();
    public function count_filtered();
    #####
    public function exists(array $data);
    public function unique(array $data);
    #####
    public function store(array $data);
    public function update(array $data);
    public function delete($id);
    #####
    public function get_by_id($id);
    public function get_year_period_options($search, $page);
    public function get_kpi_counter_options_by_year_period_id($search, $page, $year_period_id);
    public function get_kpi_polarization_options_by_year_period_id($search, $page, $year_period_id);
}