<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Index_score extends CI_Controller {
    
    protected $repository;

    public function __construct() {
        parent::__construct();
        $this->load->repository('master/Index_score_repository');
        $this->repository = new Index_score_repository();

        $this->load->library('Base_controller', null, 'bc');
        $this->bc->is_logged_in();
        $this->bc->is_admin_access();
    }

    public function index() {
        $data = array_merge($this->bc->get_global(), [
            'title' => 'Index Scores',
            'js' => [
                'admin/master/index-score.js'
            ],
        ]);
        $this->template->load('admin', 'admin/master/index_score/index', $data);
    }

    #####

    public function data_server() {
        $list = $this->repository->get_datatables();
        $data = $this->prepare_datatable($list);
        echo json_encode($this->format_output($data));
    }

    private function prepare_datatable($list) {
        $data = [];
        $no = $_POST['start'];
        foreach ($list as $item) {
            $no++;
            $data[] = $this->format_row($no, $item);
        }
        return $data;
    }

    private function format_row($no, $item) {
        return [
            'no' => $no,
            'id' => $item->id,
            'index_value' => $item->index_value,
            'operator_1' => $item->operator_1,
            'value_1' => $item->value_1,
            'operator_2' => $item->operator_2,
            'value_2' => $item->value_2,
            'description' => $item->description,
            'color' => $item->color,
            'order' => $item->order,
            'year_period' => $item->year_period,
            'created_at' => format_date($item->created_at),
            'actions' => ''
        ];
    }

    private function format_output($data) {
        return [
            "draw" => $_POST['draw'],
            "recordsTotal" => $this->repository->count_all(),
            "recordsFiltered" => $this->repository->count_filtered(),
            "data" => $data,
        ];
    }

    #####

    public function store() {
        if (!$this->validate_input()) {
            $this->handle_validation_error();
            return;
        }

        $data = $this->collect_input_data(true);

        $exists = $this->repository->exists($data);
        if ($exists['is_exists']) {
            $this->json_response->error(
                'Data for the ' . $exists['data']->index_value . 
                ' index value and the ' . $exists['data']->year_period . 
                ' period is already available.'
            );
            return;
        }

        $this->save_data($data);
    }

    public function update() {
        $id = $this->input->post('id');

        if (!$id) {
            $this->json_response->error('ID is required.');
            return;
        }

        if (!$this->validate_input()) {
            $this->handle_validation_error();
            return;
        }
        $data = $this->collect_input_data(false, $id);

        $exists = $this->repository->exists($data);
        $unique = $this->repository->unique($data);
        
        if ($exists['is_exists'] && $unique['is_unique']) {
            $this->json_response->error(
                'Data for the ' . $exists['data']->index_value . 
                ' index value and the ' . $exists['data']->year_period . 
                ' period is already available.'
            );
            return;
        }

        $this->update_data($data);
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

    private function validate_input() {
        $this->form_validation->set_rules('index_value', 'Index Value', 'required|trim|in_list[1,2,3,4,5]');
        $this->form_validation->set_rules('operator_1', 'Operator 1', 'trim|in_list[>,>=]');
        $this->form_validation->set_rules('value_1', 'Value 1', 'trim');
        $this->form_validation->set_rules('operator_2', 'Operator 2', 'trim');
        $this->form_validation->set_rules('value_2', 'Value 2', 'trim');
        $this->form_validation->set_rules('order', 'Order', 'required|trim|numeric|greater_than_equal_to[1]');
        $this->form_validation->set_rules('year_period_id', 'Year Period', 'required|trim');
        $this->form_validation->set_error_delimiters('', '');
        return $this->form_validation->run();
    }

    private function collect_input_data($is_store = false, $id = null) {
        $input_data = [
            'index_value' => $this->input->post('index_value'),
            'description' => $this->input->post('description'),
            'color' => $this->input->post('color'),
            'order' => $this->input->post('order'),
            'year_period_id' => $this->input->post('year_period_id')
        ];

        if (!empty($this->input->post('operator_1')) && !empty($this->input->post('value_1'))) {
            $input_data['operator_1'] = $this->input->post('operator_1');
            $input_data['value_1'] = $this->input->post('value_1');
        } else {
            $input_data['operator_1'] = null;
            $input_data['value_1'] = null;
        }

        if (!empty($this->input->post('operator_2')) && !empty($this->input->post('value_2'))) {
            $input_data['operator_2'] = $this->input->post('operator_2');
            $input_data['value_2'] = $this->input->post('value_2');
        } else {
            $input_data['operator_2'] = null;
            $input_data['value_2'] = null;
        }

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

    private function handle_validation_error() {
        $errors = $this->collect_form_errors();
        $this->json_response->error('Failed to save data.', $errors);
    }

    private function collect_form_errors() {
        return [
            'index_value' => form_error('index_value'),
            'operator_1' => form_error('operator_1'),
            'value_1' => form_error('value_1'),
            'operator_2' => form_error('operator_2'),
            'value_2' => form_error('value_2'),
            'order' => form_error('order'),
            'year_period_id' => form_error('year_period_id')
        ];
    }

    private function save_data($data) {
        $store = $this->repository->store($data);
        $message = $store ? 'Data Successfully saved.' : 'Failed to save data.';
        $this->json_response->{$store ? 'success' : 'error'}($message, $store);
    }

    private function update_data($data) {
        $update = $this->repository->update($data);
        $message = $update ? 'Data successfully updated.' : 'Failed to update data.';
        $this->json_response->{$update ? 'success' : 'error'}($message, $update);
    }

    #####

    public function get_by_id($id) {
        if (!isset($id)) {
            $this->json_response->error('ID is required.');
            return;
        }
        
        $data = $this->repository->get_by_id($id);

        $message = $data ? 'Data successfully fetched.' : 'Failed to fetch data.';
        $this->json_response->{$data ? 'success' : 'error'}($message, $data);
    }

    public function get_year_period_options() {
        $search = $this->input->get('q');
        $page = $this->input->get('page');
        $result = $this->repository->get_year_period_options($search, $page);
        $data = [
            'items' => array_merge([['id' => '', 'text' => '- Choose -']], array_map(fn($item) => ['id' => $item->id, 'text' => $item->year_period], $result['data'])),
            'total_count' => $result['total']
        ];
        echo json_encode($data);
    }
}