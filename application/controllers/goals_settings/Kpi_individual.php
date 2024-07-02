<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Kpi_individual extends CI_Controller {

    protected $repository;

    public function __construct() {
        parent::__construct();
        $this->load->repository('goals_settings/Kpi_individual_repository');
        $this->repository = new Kpi_individual_repository();

        $this->load->library('Base_controller', null, 'bc');
        $this->bc->is_logged_in();
        $this->bc->is_employee_access();
    }

    public function index() {
        $data = array_merge($this->bc->get_global(), [
            'title' => 'KPI Individual',
            'js' => [
                'admin/goals_settings/kpi-individual.js',
            ],
        ]);
        $this->template->load('admin', 'admin/goals_settings/kpi_individual/index', $data);
    }

    public function get_year_period_options() {
        $search = $this->input->get('q');
        $page = $this->input->get('page');
        $result = $this->repository->get_year_period_options($search, $page);
        $data = [
            'items' => array_map(fn($item) => ['id' => $item->id, 'text' => $item->year_period], $result['data']),
            'total_count' => $result['total']
        ];
        $this->json_response->success('Data successfully fetched.', $data);
    }

    public function get_employee_options() {
        $search = $this->input->get('q');
        $page = $this->input->get('page');
        $result = $this->repository->get_employee_options($search, $page);
        $data = [
            'items' => array_map(fn($item) => ['id' => $item->id_peg, 'text' => $item->nama], $result['data']),
            'total_count' => $result['total']
        ];
        $this->json_response->success('Data successfully fetched.', $data);
    }

    public function get_position_unit_placement_unit_by_employee_id($employee_id) {
        $data = $this->get_position_unit_placement_unit_employee($employee_id);
        $position = $this->repository->get_position_by_id($data['position_id']);
        $unit = $this->repository->get_unit_by_id($data['unit_id']);
        $placement_unit = $this->repository->get_unit_by_id($data['placement_unit_id']);
        $this->json_response->success('Data successfully fetched.', [
            'position' => $position,
            'unit' => $unit,
            'placement_unit' => $placement_unit
        ]);
    }

    private function get_position_unit_placement_unit_employee($employee_id) {
        $position_id = NULL;
        $unit_id = NULL;
        $placement_unit_id = NULL;

        $temp_position_hist = $this->repository->get_temp_position_hist_by_employee_id($employee_id);

        if (!$temp_position_hist) {
            $position_hist = $this->repository->get_position_hist_by_employee_id($employee_id);
            if ($position_hist) {
                $position_id = $position_hist->id_jabatan;
                $unit_id = $position_hist->id_unit_kerja;
                $placement_unit_id = $position_hist->ditempatkan_di;
            }
        } else {
            $position_id = $temp_position_hist->id_jabatan_diganti;
            $unit_id = $temp_position_hist->id_unit_kerja;
            $placement_unit_id = $temp_position_hist->ditempatkan_diganti;
        }

        return [
            'position_id' => $position_id,
            'unit_id' => $unit_id,
            'placement_unit_id' => $placement_unit_id
        ];
    }

    public function get_goals_settings() {
        $year_period_id = $this->input->post('year_period_id');
        $employee_id = $this->input->post('employee_id');
        $data = $this->repository->get_pa_individual($year_period_id, $employee_id);

        $message = $data ? 'Data successfully fetched.' : 'Failed to fetch data.';
        $this->json_response->{$data ? 'success' : 'error'}($message, $data);
    }

    public function get_kpi_unit() {
        $data = $this->input->post();
        $kpi = $this->repository->get_kpi_unit($data);
        $message = $kpi ? 'Data successfully fetched.' : 'Failed to fetch data.';
        $this->json_response->{$kpi ? 'success' : 'error'}($message, $kpi);
    }

    public function get_kpi_individual_by_pa_id() {
        $id = $this->input->post('id');
        $kpi = $this->repository->get_kpi_individual_by_pa_id($id);
        $message = $kpi ? 'Data successfully fetched.' : 'Failed to fetch data.';
        $this->json_response->{$kpi ? 'success' : 'error'}($message, $kpi);
    }
}