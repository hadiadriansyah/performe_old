<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Kpi_position_type extends CI_Controller {

    protected $repository;
    protected $secretPass;

    public function __construct() {
        parent::__construct();
        $this->load->repository('mapping/Kpi_position_type_repository');
        $this->repository = new Kpi_position_type_repository();
        $this->secretPass = 'Secret Passphrase';

        $this->load->library('Base_controller', null, 'bc');
        $this->bc->is_logged_in();
        $this->bc->is_employee_access();
    }

    public function index() {
        $data = array_merge($this->bc->get_global(), [
            'title' => 'KPI Position Types',
            'js' => [
                'admin/mapping/position_type.js',
            ],
        ]);
        $this->template->load('admin', 'admin/mapping/kpi/position_type/index', $data);
    }

    public function kpi() {
        $data = $this->input->get('data');
        $decryptedData = $this->decryptData($data, $this->secretPass);
        if (!$decryptedData) {
            redirect('goals_settings/position_kpi/index');
        }
        $data = array_merge($this->bc->get_global(), json_decode($decryptedData, true), [
            'title' => 'KPI Position Types',
            'js' => [
                'admin/mapping/kpi_position_type.js'
            ],
        ]);
        $this->template->load('admin', 'admin/mapping/kpi/position_type/kpi', $data);
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
        $this->form_validation->set_rules('position_type', 'Position Type', 'required|trim');
        $this->form_validation->set_rules('group_position_type_id', 'Group', 'required|trim');
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
            'position_type' => form_error('position_type'),
            'group_position_type_id' => form_error('group_position_type_id'),
        ];
    }

    private function collect_input_mapping_data() {
        $input_data = [
            'position_type' => $this->input->post('position_type'),
            'position_type_name' => $this->input->post('position_type_name'),
            'year_period_id' => $this->input->post('year_period_id'),
            'year_period_name' => $this->input->post('year_period_name'),
            'group_position_type_id' => $this->input->post('group_position_type_id'),
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

    public function update_kpi_position_type() {
        if (!$this->validate_input_kpi_position_type()) {
            $this->handle_validation_error_kpi_position_type();
            return;
        }

        $data = $this->collect_input_kpi_position_type();
        $this->update_kpi($data);
    }

    private function validate_input_kpi_position_type() {
        $this->form_validation->set_rules('weight', 'Weight', 'required|trim');
        return $this->form_validation->run();
    }

    private function handle_validation_error_kpi_position_type() {
        $errors = $this->collect_form_errors_kpi_position_type();
        $this->json_response->error('Failed to collect data.', $errors);
    }

    private function collect_form_errors_kpi_position_type() {
        return [
            'weight' => form_error('weight')
        ];
    }

    private function collect_input_kpi_position_type() {
        $input_data = [
            'id' => $this->input->post('id'),
            'year_period_id' => $this->input->post('year_period_id'),
            'position_type' => $this->input->post('position_type'),
            'group_position_type_id' => $this->input->post('group_position_type_id'),
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

    public function update_selected_positions() {
        $group_position_type_id = $this->input->post('group_position_type_id');
        $added_positions = json_decode($this->input->post('added_positions'), true);
        $removed_positions = json_decode($this->input->post('removed_positions'), true);
    
        $this->db->trans_begin();
    
        try {
            if (!empty($removed_positions)) {
                $this->repository->delete_positions($group_position_type_id, $removed_positions);
            }
    
            if (!empty($added_positions)) {
                $positionsToInsert = array_map(function($position_id) use ($group_position_type_id) {
                    return [
                        'group_position_type_id' => $group_position_type_id,
                        'position_id' => $position_id
                    ];
                }, $added_positions);
                $this->repository->store_positions($positionsToInsert);
            }
    
            if ($this->db->trans_status() === FALSE) {
                $this->db->trans_rollback();
                $this->json_response->error('Failed to update selected positions.');
            } else {
                $this->db->trans_commit();
                $this->json_response->success('Selected positions updated successfully.', [
                    'added_positions' => $added_positions,
                    'removed_positions' => $removed_positions
                ]);
            }
        } catch (Exception $e) {
            $this->db->trans_rollback();
            $this->json_response->error('Failed to update selected positions.', ['error' => $e->getMessage()]);
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
            'position_type' => $this->input->post('position_type'),
            'year_period_id' => $this->input->post('year_period_id'),
            'group_position_type_id' => $this->input->post('group_position_type_id'),
            'is_submit' => $this->input->post('is_submit'),
        ];
        if (!isset($input_data['position_type']) || !isset($input_data['year_period_id']) || !isset($input_data['group_position_type_id'])) {
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
    
    public function create_kpi() {
        $data = $this->input->post();
        $kpi = $this->repository->get_kpi_unit_type_by_group_unit_type_id($data);
        if ($kpi) {
            $this->db->trans_begin();
            try {
                foreach ($kpi as $item) {
                    $store = [
                        'position_type' => $data['position_type'],
                        'year_period_id' => $data['year_period_id'],
                        'perspective_id' => $item->perspective_id,
                        'objective_id' => $item->objective_id,
                        'kpi_id' => $item->kpi_id,
                        'weight' => 0,
                        'score' => $item->score,
                        'description' => $item->description,
                        'is_submit' => 0,
                        'created_by' => $this->bc->get_global()['vendor_id'],
                        'updated_by' => $this->bc->get_global()['vendor_id'],
                        'group_position_type_id' => $data['group_position_type_id'],
                        'group_unit_type_id' => $data['group_unit_type_id']
                    ];
                    $this->repository->store($store);
                }
                if ($this->db->trans_status() === FALSE) {
                    $this->db->trans_rollback();
                    $this->json_response->error('Failed to insert KPI data.');
                } else {
                    $this->db->trans_commit();
                    $this->json_response->success('KPI data successfully inserted.');
                }
            } catch (Exception $e) {
                $this->db->trans_rollback();
                $this->json_response->error('Failed to insert KPI data.', ['error' => $e->getMessage()]);
            }
        } else {
            $this->json_response->error('KPI for this unit is not available. Please check again and try submitting.', $kpi);
        }
    }

    public function insert_kpi_position_type() {
        $input_data = $this->input->post();
        $store = [
            'id' => $input_data['id'],
            'position_type' => $input_data['position_type'],
            'year_period_id' => $input_data['year_period_id'],
            'perspective_id' => $input_data['perspective_id'],
            'objective_id' => $input_data['objective_id'],
            'kpi_id' => $input_data['kpi_id'],
            'weight' => 0,
            'is_submit' => 0,
            'created_by' => $this->bc->get_global()['vendor_id'],
            'updated_by' => $this->bc->get_global()['vendor_id'],
            'group_position_type_id' => $input_data['group_position_type_id'],
            'group_unit_type_id' => $input_data['group_unit_type_id'],
        ];
        $store = $this->repository->store($store);
        $message = $store ? 'KPI successfully added.' : 'Failed to add KPI.';
        
        $this->json_response->{$store ? 'success' : 'error'}($message, $store);
    }

    public function delete_kpi_position_type() {
        $data = $this->input->post();
        $delete = $this->repository->delete_by_data($data);
        $message = $delete ? 'KPI successfully deleted.' : 'Failed to delete KPI.';
        $this->json_response->{$delete ? 'success' : 'error'}($message, $delete);
    }
    
    #####

    public function get_position_by_position_type() {
        $position_type = $this->input->post('position_type');
        $positions = $this->repository->get_position_by_position_type($position_type);
        $this->json_response->success('Data successfully fetched.', $positions);
    }

    public function get_kpi_position_type() {
        $data = $this->input->post();
        $kpi = $this->repository->get_kpi_position_type($data);
        $this->json_response->success('Data successfully fetched.', $kpi);
    }

    public function get_kpi_unit_type_by_group_unit_type_id() {
        $data = $this->input->post();
        $kpi = $this->repository->get_kpi_unit_type_by_group_unit_type_id($data);
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

    public function get_positions_by_group_position_type_id($id) {
        $data = $this->repository->get_positions_by_group_position_type_id($id);
        $this->json_response->success('Data successfully fetched.', $data);
    }

    public function get_kpi_position_type_groups_options() {
        $search = $this->input->get('q');
        $page = $this->input->get('page');
        $result = $this->repository->get_kpi_position_type_groups_options($search, $page);
        $data = [
            'items' => array_map(fn($item) => ['id' => $item->id, 'text' => $item->group_type], $result['data']),
            'total_count' => $result['total']
        ];
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

    public function get_position_type_options() {
        $search = $this->input->get('q');
        $page = $this->input->get('page');
        $result = $this->repository->get_position_type_options($search, $page);
        $data = [
            'items' => array_map(fn($item) => ['id' => $item->orchart_label, 'text' => $item->orchart_label], $result['data']),
            'total_count' => $result['total']
        ];
        $this->json_response->success('Data successfully fetched.', $data);
    }

    public function get_position_options() {
        $data = $this->bc->get_global();
        $search = $this->input->get('q');
        $page = $this->input->get('page');

        $result = $this->repository->get_position_options($search, $page);
        $data = [
            'items' => array_map(fn($item) => ['id' => $item->id, 'text' => $item->nm_position_kerja], $result['data']),
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