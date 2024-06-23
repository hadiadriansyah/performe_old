<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Kpi_polarization extends CI_Controller {
    
    protected $repository;

    public function __construct() {
        parent::__construct();
        $this->load->repository('master/Kpi_polarization_repository');
        $this->repository = new Kpi_polarization_repository();

        $this->load->library('Base_controller', null, 'bc');
        $this->bc->is_logged_in();
        $this->bc->is_admin_access();
    }

    public function index() {
        $data = array_merge($this->bc->get_global(), [
            'title' => 'Polarizations',
            'filePath' => APPPATH . 'libraries/Polarization.php',
            'startLine' => 3,
            'endLine' => 69,
            'js' => [
                'admin/master/kpi-polarization.js'
            ],
        ]);
        $this->template->load('admin', 'admin/master/kpi/polarization', $data);
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
            'polarization' => $item->polarization,
            'formula' => $item->formula,
            'description' => $item->description,
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
                'Data for the ' . $exists['data']->polarization . 
                ' polarization and the ' . $exists['data']->year_period . 
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
                'Data for the ' . $exists['data']->polarization . 
                ' polarization and the ' . $exists['data']->year_period . 
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
        $this->form_validation->set_rules('polarization_type', 'Polarization', 'required');
        $this->form_validation->set_rules('year_period_id', 'Year Period', 'required|trim');
        $this->form_validation->set_error_delimiters('', '');
        return $this->form_validation->run();
    }

    private function collect_input_data($is_store = false, $id = null) {
        $formula_data = $this->getFormulaData();
        $formula = json_encode($formula_data);

        $input_data = [
            'polarization' => $this->input->post('polarization_type') . '_' . $this->input->post('polarization_text'),
            'formula' => $formula,
            'description' => $this->input->post('description'),
            'year_period_id' => $this->input->post('year_period_id'),
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

    private function handle_validation_error() {
        $errors = $this->collect_form_errors();
        $this->json_response->error('Failed to save data.', $errors);
    }

    private function collect_form_errors() {
        return [
            'polarization_type' => form_error('polarization_type'),
            'year_period_id' => form_error('year_period_id'),
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

    private function getFormulaData() {
        if (preg_match('/^Minimize/', $this->input->post('polarization_type'))) {
            return $this->getMinimizeFormulaData();
        } elseif (preg_match('/^Absolute/', $this->input->post('polarization_type'))) {
            return $this->getAbsoluteFormulaData();
        } elseif (preg_match('/^Stabilize/', $this->input->post('polarization_type'))) {
            return $this->getStabilizeFormulaData();
        } else {
            return [];
        }
    }

    private function getMinimizeFormulaData() {
        return [
            'min_opr_1' => $this->input->post('min_opr_1'),
            'min_opr_2' => $this->input->post('min_opr_2'),
            'value_min_1' => $this->input->post('value_min_1'),
            'value_min_2' => $this->input->post('value_min_2'),
            'value_min_3' => $this->input->post('value_min_3'),
            'value_min_4' => $this->input->post('value_min_4'),
            'value_min_5' => $this->input->post('value_min_5'),
            'pol_min_index_1' => $this->input->post('pol_min_index_1'),
            'pol_min_index_2' => $this->input->post('pol_min_index_2'),
            'pol_min_index_3' => $this->input->post('pol_min_index_3'),
            'pol_min_index_4' => $this->input->post('pol_min_index_4'),
            'pol_min_index_5' => $this->input->post('pol_min_index_5'),
        ];
    }

    private function getAbsoluteFormulaData() {
        return [
            'abs_opr_1' => $this->input->post('abs_opr_1'),
            'abs_opr_2' => $this->input->post('abs_opr_2'),
            'pol_abs_index_1' => $this->input->post('pol_abs_index_1'),
            'pol_abs_index_2' => $this->input->post('pol_abs_index_2'),
        ];
    }

    private function getStabilizeFormulaData() {
        return [
            'stab_opr_1_target' => $this->input->post('stab_opr_1_target'),
            'stab_opr_2_target' => $this->input->post('stab_opr_2_target'),
            'pol_stab_index_1' => $this->input->post('pol_stab_index_1'),
            'pol_stab_index_2' => $this->input->post('pol_stab_index_2'),
            'pol_stab_index_3' => $this->input->post('pol_stab_index_3'),
            'pol_stab_index_4' => $this->input->post('pol_stab_index_4'),
            'pol_stab_index_5' => $this->input->post('pol_stab_index_5')
        ];
    }

    #####

    public function get_by_id($id) {
        if (!isset($id)) {
            $this->json_response->error('ID is required.');
            return;
        }
        
        $data = $this->repository->get_by_id($id);
        $data['formula'] = json_decode($data['formula'], true);

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