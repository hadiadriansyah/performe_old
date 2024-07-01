<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Unit_performance_appraisal extends CI_Controller {

    protected $repository;
    protected $secretPass;

    public function __construct() {
        parent::__construct();
        $this->load->repository('performance_appraisal/Unit_performance_appraisal_repository');
        $this->repository = new Unit_performance_appraisal_repository();
        $this->secretPass = 'Secret Passphrase';

        $this->load->library('Base_controller', null, 'bc');
        $this->bc->is_logged_in();
        $this->bc->is_employee_access();
    }

    public function index() {
        $data = array_merge($this->bc->get_global(), [
            'title' => 'Unit Performance Appraisal',
            'js' => [
                'admin/performance_appraisal/unit.js',
            ],
        ]);
        $this->template->load('admin', 'admin/performance_appraisal/unit/index', $data);
    }

    public function kpi() {
        $data = $this->input->get('data');
        $decryptedData = $this->decryptData($data, $this->secretPass);
        if (!$decryptedData) {
            redirect('mapping/unit_kpi/index');
        }
        $data = array_merge($this->bc->get_global(), json_decode($decryptedData, true), [
            'title' => 'Unit Performance Appraisal',
            'js' => [
                'admin/performance_appraisal/kpi_unit.js'
            ],
        ]);
        $this->template->load('admin', 'admin/performance_appraisal/unit/kpi', $data);
    }


    // Mapping Data

    public function mapping_data() {
        if (!$this->validate_input_mapping_data()) {
            $this->handle_validation_error_mapping_data();
            return;
        }

        $data = $this->collect_input_mapping_data();

        $this->save_mapping_data($data);
    }

    private function validate_input_mapping_data() {
        $this->form_validation->set_rules('year_period_id', 'Year Period', 'required|trim');
        $this->form_validation->set_rules('unit_id', 'Unit', 'required|trim');
        $this->form_validation->set_error_delimiters('', '');
        return $this->form_validation->run();
    }

    private function handle_validation_error_mapping_data() {
        $errors = $this->collect_form_errors_mapping_data();
        $this->json_response->error('Failed to collect data.', $errors);
    }

    private function collect_form_errors_mapping_data() {
        return [
            'year_period_id' => form_error('year_period_id'),
            'unit_id' => form_error('unit_id'),
        ];
    }

    private function collect_input_mapping_data() {
        $input_data = [
            'unit_id' => $this->input->post('unit_id'),
            'unit_name' => $this->input->post('unit_name'),
            'year_period_id' => $this->input->post('year_period_id'),
            'year_period_name' => $this->input->post('year_period_name'),
        ];

        return $input_data;
    }

    private function save_mapping_data($data) {
        $store = $data;
        $store['encrypted_data'] = urlencode($this->encryptData(json_encode($data), $this->secretPass));
        $message = $store ? 'Data Successfully Submitted.' : 'Failed to submit data.';
        
        $this->json_response->{$store ? 'success' : 'error'}($message, $store);
    }

    // Store Update KPI

    public function store_update_kpi() {
        $mode = $this->input->post('mode');
        if (!$this->validate_input_store_update_kpi()) {
            $this->handle_validation_error_store_update_kpi();
            return;
        }

        $data = $this->collect_input_store_update_kpi();
        if ($mode == 'add') {
            $this->save_kpi($data);
        } else {
            $this->update_kpi($data);
        }
    }

    private function validate_input_store_update_kpi() {
        $this->form_validation->set_rules('kpi_id', 'KPI', 'required|trim');
        $this->form_validation->set_rules('measurement', 'Measurement', 'required|trim');
        $this->form_validation->set_rules('weight', 'Weight', 'required|trim');
        return $this->form_validation->run();
    }

    private function handle_validation_error_store_update_kpi() {
        $errors = $this->collect_form_errors_store_update_kpi();
        $this->json_response->error('Failed to collect data.', $errors);
    }

    private function collect_form_errors_store_update_kpi() {
        return [
            'kpi_id' => form_error('kpi_id'),
            'measurement' => form_error('measurement'),
            'weight' => form_error('weight')
        ];
    }

    private function collect_input_store_update_kpi() {
        $input_data = [
            'id' => $this->input->post('id'),
            'year_period_id' => $this->input->post('year_period_id'),
            'unit_id' => $this->input->post('unit_id'),
            'kpi_id' => $this->input->post('kpi_id'),
            'measurement' => $this->input->post('measurement'),
            'weight' => $this->input->post('weight'),
            'perspective_id' => $this->input->post('perspective_id'),
            'objective_id' => $this->input->post('objective_id'),
        ];

        return $input_data;
    }

    // Add Edit Target

    public function add_edit_actual() {
        $actual_id = $this->input->post('actual_id');
        if (!$this->validate_input_add_edit_actual()) {
            $this->handle_validation_error_add_edit_actual();
            return;
        }

        $data = $this->collect_input_add_edit_actual();
        if (!$actual_id) {
            $this->save_actual($data);
        } else {
            $this->update_actual($data);
        }
    }

    private function validate_input_add_edit_actual() {
        return true;
    }

    private function handle_validation_error_add_edit_actual() {
        $errors = $this->collect_form_errors_add_edit_actual();
        $this->json_response->error('Failed to collect data.', $errors);
    }

    private function collect_form_errors_add_edit_actual() {
        return [];
    }

    private function collect_input_add_edit_actual() {
        $data_actual = [
            '1' => $this->input->post('month_1'),
            '2' => $this->input->post('month_2'),
            '3' => $this->input->post('month_3'),
            '4' => $this->input->post('month_4'),
            '5' => $this->input->post('month_5'),
            '6' => $this->input->post('month_6'),
            '7' => $this->input->post('month_7'),
            '8' => $this->input->post('month_8'),
            '9' => $this->input->post('month_9'),
            '10' => $this->input->post('month_10'),
            '11' => $this->input->post('month_11'),
            '12' => $this->input->post('month_12')
        ];
        
        $actual = json_encode($data_actual);

        $input_data = [
            'kpi_unit_id' => $this->input->post('kpi_unit_id'),
            'actual' => $actual
        ];

        if (empty($this->input->post('actual_id'))) {
            if ($this->bc->get_global()['vendor_id']) {
                $input_data['created_by'] = $this->bc->get_global()['vendor_id'];
                $input_data['updated_by'] = $this->bc->get_global()['vendor_id'];
            }
        } else {
            $input_data['id'] = $this->input->post('actual_id');
            if ($this->bc->get_global()['vendor_id']) {
                $input_data['updated_by'] = $this->bc->get_global()['vendor_id'];
            }
        }
        return $input_data;
    }

    #####

    private function save_kpi($data) {
        $store = $this->repository->store($data);
        $message = $store ? 'Data Successfully Saved.' : 'Failed to save data.';
        
        $this->json_response->{$store ? 'success' : 'error'}($message, $store);
    }

    private function update_kpi($data) {
        $store = $this->repository->update($data);
        $message = $store ? 'Data Successfully Updated.' : 'Failed to update data.';
        
        $this->json_response->{$store ? 'success' : 'error'}($message, $store);
    }

    #####

    private function save_actual($data) {
        $store = $this->repository->store_actual($data);
        $message = $store ? 'Data Successfully Saved.' : 'Failed to save data.';
        
        $this->json_response->{$store ? 'success' : 'error'}($message, $store);
    }

    private function update_actual($data) {
        $store = $this->repository->update_actual($data);
        $message = $store ? 'Data Successfully Updated.' : 'Failed to update data.';
        
        $this->json_response->{$store ? 'success' : 'error'}($message, $store);
    }

    public function submit_kpi() {
        $input_data = [
            'unit_id' => $this->input->post('unit_id'),
            'year_period_id' => $this->input->post('year_period_id'),
            'is_submit' => $this->input->post('is_submit'),
        ];
        if (!isset($input_data['unit_id']) || !isset($input_data['year_period_id'])) {
            $this->json_response->error('Unit or Year Period is required.');
            return;
        }
    
        $delete = $this->repository->submit_kpi($input_data);
        $message = $delete ? 'Data successfully deleted.' : 'Failed to delete data.';
        $this->json_response->{$delete ? 'success' : 'error'}($message, $delete);
    }

    public function delete() {
        $id = $this->input->post('id');
        if (!isset($id)) {
            $this->json_response->error('ID is required.');
            return;
        }
    
        $delete = $this->repository->delete($id);
        $message = $delete ? 'Data successfully deleted.' : 'Failed to delete data.';
        $this->json_response->{$delete ? 'success' : 'error'}($message, $delete);
    }

    public function delete_target() {
        $id = $this->input->post('id');
        if (!isset($id)) {
            $this->json_response->error('ID is required.');
            return;
        }
    
        $delete = $this->repository->delete_target($id);
        $message = $delete ? 'Data successfully deleted.' : 'Failed to delete data.';
        $this->json_response->{$delete ? 'success' : 'error'}($message, $delete);
    }

    #####

    public function get_kpi_unit() {
        $data = $this->input->post();
        $kpi = $this->repository->get_kpi_unit($data);
        $this->json_response->success('Data successfully fetched.', $kpi);
    }

    public function get_kpi_by_id($id = '') {
        if (!$id) {
            $this->json_response->error('ID is required.');
            return;
        }
        
        $data = $this->repository->get_kpi_by_id($id);

        $message = $data ? 'Data successfully fetched.' : 'Failed to fetch data.';
        $this->json_response->{$data ? 'success' : 'error'}($message, $data);
    }

    public function get_kpi_options_by_year_period_id() {
        $search = $this->input->get('q');
        $page = $this->input->get('page');
        $year_period_id = $this->input->get('year_period_id');
        $result = $this->repository->get_kpi_options_by_year_period_id($search, $page, $year_period_id);
        $data = [
            'items' => array_map(fn($item) => ['id' => $item->id, 'text' => $item->kpi], $result['data']),
            'total_count' => $result['total']
        ];
        $this->json_response->success('Data successfully fetched.', $data);
    }

    public function get_target_by_id($id) {
        if (!isset($id)) {
            $this->json_response->error('ID is required.');
            return;
        }
        
        $data = $this->repository->get_target_by_id($id);

        $message = $data ? 'Data successfully fetched.' : 'Failed to fetch data.';
        $this->json_response->{$data ? 'success' : 'error'}($message, $data);
    }

    public function get_actual_by_id($id) {
        if (!isset($id)) {
            $this->json_response->error('ID is required.');
            return;
        }
        
        $data = $this->repository->get_actual_by_id($id);

        $message = $data ? 'Data successfully fetched.' : 'Failed to fetch data.';
        $this->json_response->{$data ? 'success' : 'error'}($message, $data);
    }

    public function get_index_scores() {
        $year_period_id = $this->input->post('year_period_id');
        $index_score = $this->repository->get_index_scores($year_period_id);
        echo json_encode($index_score);
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

    public function get_unit_options() {
        $search = $this->input->get('q');
        $page = $this->input->get('page');
        $result = $this->repository->get_unit_options($search, $page);
        $data = [
            'items' => array_map(fn($item) => ['id' => $item->id, 'text' => $item->nm_unit_kerja], $result['data']),
            'total_count' => $result['total']
        ];
        $this->json_response->success('Data successfully fetched.', $data);
    }

    public function get_perspective_options_by_year_period_id() {
        $search = $this->input->get('q');
        $page = $this->input->get('page');
        $year_period_id = $this->input->get('year_period_id');
        $result = $this->repository->get_perspective_options_by_year_period_id($search, $page, $year_period_id);
        $data = [
            'items' => array_map(fn($item) => ['id' => $item->id, 'text' => $item->perspective], $result['data']),
            'total_count' => $result['total']
        ];
        $this->json_response->success('Data successfully fetched.', $data);
    }

    public function get_objective_options_by_year_period_id() {
        $search = $this->input->get('q');
        $page = $this->input->get('page');
        $year_period_id = $this->input->get('year_period_id');
        $result = $this->repository->get_objective_options_by_year_period_id($search, $page, $year_period_id);
        $data = [
            'items' => array_map(fn($item) => ['id' => $item->id, 'text' => $item->objective], $result['data']),
            'total_count' => $result['total']
        ];
        $this->json_response->success('Data successfully fetched.', $data);
    }

    private function encryptData($data, $secretKey) {
        $iv = openssl_random_pseudo_bytes(16);
        $encrypted = openssl_encrypt($data, 'aes-128-cbc', $secretKey, OPENSSL_RAW_DATA, $iv);
    
        $encryptedData = base64_encode($iv . $encrypted);
        return $encryptedData;
    }

    private function decryptData($encryptedData, $secretKey) {
        $data = base64_decode($encryptedData);
        $iv = substr($data, 0, 16);
        $encrypted = substr($data, 16);
        return openssl_decrypt($encrypted, 'aes-128-cbc', $secretKey, OPENSSL_RAW_DATA, $iv);
    }
}