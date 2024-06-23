<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Year_period_model extends CI_Model {
    protected $table = 'npm_year_periods';
    protected $column_order = array(null, 'year_period', 'status_appraisal', 'created_at');
    protected $column_search = array('year_period');
    protected $order = array('year_period' => 'desc');


    public function get_datatables() {
        $this->_get_datatables_query();
        if ($_POST['length'] != -1) {
            $this->db->limit($_POST['length'], $_POST['start']);
        }
        return $this->db->get()->result();
    }
    
    private function _get_datatables_query() {
        $this->db->from($this->table);

        $status_appraisal = $this->input->post('status_appraisal');

        if ($status_appraisal !== 'all' && ($status_appraisal === '0' || !empty($status_appraisal))) {
            $this->db->where("status_appraisal", $status_appraisal);
        }

        $search_value = strtolower($_POST['search']['value'] ?? '');
        if ($search_value) {
            $this->db->group_start();
            foreach ($this->column_search as $i => $item) {
                $method = $i === 0 ? 'like' : 'or_like';
                $field = "LOWER({$this->table}.$item)";
                $this->db->$method($field, $search_value);
            }
            $this->db->group_end();
        }
        
        $order_column = $_POST['order'][0]['column'] ?? null;
        $order_dir = $_POST['order'][0]['dir'] ?? null;

        if (!is_null($order_column) && !is_null($order_dir) && isset($this->column_order[$order_column])) {
            $this->db->order_by($this->column_order[$order_column], $order_dir);
        } else {
            foreach ($this->order as $key => $value) {
                $this->db->order_by($key, $value);
            }
        }
    }

    public function count_all() {
        return $this->db->from($this->table)->count_all_results();
    }

    public function count_filtered() {
        $this->_get_datatables_query();
        return $this->db->get()->num_rows();
    }

    #####
    
    public function exists(array $data) {
        $this->db->from($this->table)
                    ->where('year_period', $data['year_period']);
        
        $result = $this->db->get();
        return [
            'is_exists' => $result->num_rows() > 0,
            'data' => $result->row()
        ];
    }

    public function unique(array $data) {
        $this->db->from($this->table)
                    ->where("{$this->table}.id !=", $data['id'])
                    ->where('year_period', $data['year_period']);
              
        $result = $this->db->get();
        
        return [
            'is_unique' => $result->num_rows() > 0,
            'data' => $result->row()
        ];
    }

    #####

    public function store($data) {
        $this->db->trans_start();
        if ($data['status_appraisal'] == 1) {
            $this->reset_status_appraisal();
        }

        $result = $this->db->insert($this->table, $data);
        $this->db->trans_complete();
        return $result;
    }

    public function update(array $data) {
        $this->db->trans_start();
        if ($data['status_appraisal'] == 1) {
            $this->reset_status_appraisal();
        }
        $result = $this->db->update($this->table, $data, ['id' => $data['id']]);
        $this->db->trans_complete();
        return $result;
    }

    public function delete($id) {
        return $this->db->delete($this->table, ['id' => $id]);
    }
    
    public function reset_status_appraisal() {
        $this->db->set('status_appraisal', 0)->update($this->table);
    }

    #####

    public function get_active_year_period() {
        $this->db->from($this->table)
                 ->where('status_appraisal', 1)
                 ->order_by('year_period', 'DESC')
                 ->limit(1);
        return $this->db->get()->row();
    }

    public function get_by_id($id) {
        $this->db->from($this->table)
                 ->where("{$this->table}.id", $id);
        return $this->db->get()->row_array();
    }

    #####

    public function get_options($search = '', $page = 1) {
        $search = strtolower($search);
        $this->db->like("LOWER(CAST(year_period AS TEXT))", $search);
        $this->db->limit(10, ($page - 1) * 10);
        $query = $this->db->get($this->table);

        $total_count = $this->db->like("LOWER(CAST(year_period AS TEXT))", $search)->count_all_results($this->table);

        return [
            'data' => $query->result(),
            'total' => $total_count
        ];
    }
}