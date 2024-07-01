<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Kpi_unit_type extends CI_Controller {

    protected $repository;
    protected $secretPass;

    public function __construct() {
        parent::__construct();
        $this->load->repository('mapping/Kpi_unit_type_repository');
        $this->repository = new Kpi_unit_type_repository();
        $this->secretPass = 'Secret Passphrase';

        $this->load->library('Base_controller', null, 'bc');
        $this->bc->is_logged_in();
        $this->bc->is_employee_access();
    }

    public function index() {
        $data = array_merge($this->bc->get_global(), [
            'title' => 'KPI Unit Types',
            'js' => [
                'admin/mapping/unit_type.js',
            ],
        ]);
        $this->template->load('admin', 'admin/mapping/kpi/unit_type/index', $data);
    }

    public function kpi() {
        $data = $this->input->get('data');
        $decryptedData = $this->decryptData($data, $this->secretPass);
        if (!$decryptedData) {
            redirect('goals_settings/unit_kpi/index');
        }
        $data = array_merge($this->bc->get_global(), json_decode($decryptedData, true), [
            'title' => 'KPI Unit Types',
            'js' => [
                'admin/mapping/kpi_unit_type.js'
            ],
        ]);
        $this->template->load('admin', 'admin/mapping/kpi/unit_type/kpi', $data);
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
        $this->form_validation->set_rules('unit_type', 'Unit Type', 'required|trim');
        $this->form_validation->set_rules('group_unit_type_id', 'Group', 'required|trim');
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
            'unit_type' => form_error('unit_type'),
            'group_unit_type_id' => form_error('group_unit_type_id'),
        ];
    }

    private function collect_input_mapping_data() {
        $input_data = [
            'unit_type' => $this->input->post('unit_type'),
            'unit_type_name' => $this->input->post('unit_type_name'),
            'year_period_id' => $this->input->post('year_period_id'),
            'year_period_name' => $this->input->post('year_period_name'),
            'group_unit_type_id' => $this->input->post('group_unit_type_id'),
            'group_name' => $this->input->post('group_name'),
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
            $exists = $this->repository->exists($data);
            
            if ($exists['is_exists']) {
                $this->json_response->error(
                    'Data for the ' . $exists['data']->kpi . 
                    ' KPI is already in use.'
                );
                return;
            }
            $this->save_kpi($data);
        } else {
            $exists = $this->repository->exists($data);
            $unique = $this->repository->unique($data);
            
            if ($exists['is_exists'] && $unique['is_unique']) {
                $this->json_response->error(
                    'Data for the ' . $exists['data']->kpi . 
                    ' KPI is already in use.'
                );
                return;
            }
            $this->update_kpi($data);
        }
    }

    private function validate_input_store_update_kpi() {
        $this->form_validation->set_rules('kpi_id', 'KPI', 'required|trim');
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
            'weight' => form_error('weight')
        ];
    }

    private function collect_input_store_update_kpi() {
        $input_data = [
            'id' => $this->input->post('id'),
            'year_period_id' => $this->input->post('year_period_id'),
            'unit_type' => $this->input->post('unit_type'),
            'group_unit_type_id' => $this->input->post('group_unit_type_id'),
            'kpi_id' => $this->input->post('kpi_id'),
            'weight' => $this->input->post('weight'),
            'perspective_id' => $this->input->post('perspective_id'),
            'objective_id' => $this->input->post('objective_id'),
        ];

        return $input_data;
    }

    public function store_group() {
        if (!$this->validate_input_group()) {
            $this->handle_validation_error_group();
            return;
        }

        $data = $this->collect_input_data_group(true);

        $exists = $this->repository->exists_group($data);
        if ($exists['is_exists']) {
            $this->json_response->error(
                'Data for the ' . $exists['data']->group_type . 
                ' group type is already available.'
            );
            return;
        }

        $this->save_data_group($data);
    }

    public function update_group() {
        $id = $this->input->post('id');

        if (!$id) {
            $this->json_response->error('ID is required.');
            return;
        }

        if (!$this->validate_input_group()) {
            $this->handle_validation_error_group();
            return;
        }
        $data = $this->collect_input_data_group(false, $id);

        $exists = $this->repository->exists_group($data);
        $unique = $this->repository->unique_group($data);
        
        if ($exists['is_exists'] && $unique['is_unique']) {
            $this->json_response->error(
                'Data for the ' . $exists['data']->group_type . 
                ' group type is already available.'
            );
            return;
        }

        $this->update_data_group($data);
    }

    private function validate_input_group() {
        $this->form_validation->set_rules('group_type', 'Group Type', 'required|trim');
        $this->form_validation->set_error_delimiters('', '');
        return $this->form_validation->run();
    }

    private function collect_input_data_group($is_store = false, $id = null) {
        $input_data = [
            'group_type' => $this->input->post('group_type'),
            'description' => $this->input->post('description'),
        ];

        if ($is_store) {
            if ($this->bc->get_global()['vendor_id']) {
                $input_data['created_by'] = $this->bc->get_global()['vendor_id'];
                $input_data['updated_by'] = $this->bc->get_global()['vendor_id'];
            }
        } else {
            $input_data['id'] = $id;
            if ($this->bc->get_global()['vendor_id']) {
                $input_data['updated_by'] = $this->bc->get_global()['vendor_id'];
            }
        }

        return $input_data;
    }

    private function handle_validation_error_group() {
        $errors = $this->collect_form_errors_group();
        $this->json_response->error('Failed to save data.', $errors);
    }

    private function collect_form_errors_group() {
        return [
            'group_type' => form_error('group_type'),
        ];
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

    private function save_data_group($data) {
        $store = $this->repository->store_group($data);
        $message = $store ? 'Data Successfully Saved.' : 'Failed to save data.';
        
        $this->json_response->{$store ? 'success' : 'error'}($message, $store);
    }

    private function update_data_group($data) {
        $store = $this->repository->update_group($data);
        $message = $store ? 'Data Successfully Updated.' : 'Failed to update data.';
        
        $this->json_response->{$store ? 'success' : 'error'}($message, $store);
    }

    public function update_selected_units() {
        $group_unit_type_id = $this->input->post('group_unit_type_id');
        $added_units = json_decode($this->input->post('added_units'), true);
        $removed_units = json_decode($this->input->post('removed_units'), true);
    
        $this->db->trans_begin();
    
        try {
            if (!empty($removed_units)) {
                $this->repository->delete_units($group_unit_type_id, $removed_units);
            }
    
            if (!empty($added_units)) {
                $unitsToInsert = array_map(function($unit_id) use ($group_unit_type_id) {
                    return [
                        'group_unit_type_id' => $group_unit_type_id,
                        'unit_id' => $unit_id
                    ];
                }, $added_units);
                $this->repository->store_units($unitsToInsert);
            }
    
            if ($this->db->trans_status() === FALSE) {
                $this->db->trans_rollback();
                $this->json_response->error('Failed to update selected units.');
            } else {
                $this->db->trans_commit();
                $this->json_response->success('Selected units updated successfully.', [
                    'added_units' => $added_units,
                    'removed_units' => $removed_units
                ]);
            }
        } catch (Exception $e) {
            $this->db->trans_rollback();
            $this->json_response->error('Failed to update selected units.', ['error' => $e->getMessage()]);
        }
    }
    
    public function delete_group() {
        $id = $this->input->post('id');
        if (!isset($id)) {
            $this->json_response->error('ID is required.');
            return;
        }
    
        $delete = $this->repository->delete_group($id);
        $message = $delete ? 'Data successfully deleted.' : 'Failed to delete data.';
        $this->json_response->{$delete ? 'success' : 'error'}($message, $delete);
    }

    #####

    public function submit_kpi() {
        $input_data = [
            'unit_type' => $this->input->post('unit_type'),
            'year_period_id' => $this->input->post('year_period_id'),
            'group_unit_type_id' => $this->input->post('group_unit_type_id'),
            'is_submit' => $this->input->post('is_submit'),
        ];
        if (!isset($input_data['unit_type']) || !isset($input_data['year_period_id']) || !isset($input_data['group_unit_type_id'])) {
            $this->json_response->error('Unit or Year Period or Group is required.');
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

    #####

    public function generate_kpi() {
        $data = $this->input->post();

        // $units = $this->repository->get_unit_by_unit_type($data['unit_type']);
        $units = $this->repository->get_units_by_group_unit_type($data);
        $kpis = $this->repository->get_kpi_unit_type($data);

        $result = [
            'units' => $units ?? [],
            'kpis' => $kpis ?? []
        ];

        $message = $result ? 'Data successfully fetched.' : 'Failed to fetch data.';
        $this->json_response->{$result ? 'success' : 'error'}($message, $result);
    }

    public function generate_kpi_row() {
        $data = $this->input->post();

        $result = $this->repository->generate_kpi_row($data);

        if ($result['status']) {
            $this->json_response->success($result['message'], $result);
        } else {
            $this->json_response->error($result['message'], $result);
        }
    }

    #####

    public function get_unit_by_unit_type() {
        $unit_type = $this->input->post('unit_type');
        $units = $this->repository->get_unit_by_unit_type($unit_type);
        $this->json_response->success('Data successfully fetched.', $units);
    }

    public function get_kpi_unit_type() {
        $data = $this->input->post();
        $kpi = $this->repository->get_kpi_unit_type($data);
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

    public function get_group_by_id($id) {
        if (!isset($id)) {
            $this->json_response->error('ID is required.');
            return;
        }
        
        $data = $this->repository->get_group_by_id($id);

        $message = $data ? 'Data successfully fetched.' : 'Failed to fetch data.';
        $this->json_response->{$data ? 'success' : 'error'}($message, $data);
    }

    public function get_units_by_group_unit_type_id($id) {
        $data = $this->repository->get_units_by_group_unit_type_id($id);
        $this->json_response->success('Data successfully fetched.', $data);
    }

    public function get_kpi_unit_type_groups_options() {
        $search = $this->input->get('q');
        $page = $this->input->get('page');
        $result = $this->repository->get_kpi_unit_type_groups_options($search, $page);
        $data = [
            'items' => array_map(fn($item) => ['id' => $item->id, 'text' => $item->group_type], $result['data']),
            'total_count' => $result['total']
        ];
        $this->json_response->success('Data successfully fetched.', $data);
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
        $data = $this->bc->get_global();
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