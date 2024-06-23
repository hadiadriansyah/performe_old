<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Index_score_model extends CI_Model {
    protected $table = 'npm_index_scores';
    protected $column_order = array(null, 'index_value', 'operator_1', 'value_1', 'operator_2', 'value_2', 'description', 'color', 'order', 'npm_year_periods.year_period', 'created_at');
    protected $column_search = array('index_value', 'value_1', 'value_2', 'order');
    protected $order = array('npm_year_periods.year_period' => 'desc', 'index_value' => 'asc');


    public function get_datatables() {
        $this->_get_datatables_query();
        if ($_POST['length'] != -1) {
            $this->db->limit($_POST['length'], $_POST['start']);
        }
        return $this->db->get()->result();
    }
    
    private function _get_datatables_query() {
        $this->db->select("{$this->table}.*, npm_year_periods.year_period")
                 ->from($this->table)
                 ->join('npm_year_periods', "{$this->table}.year_period_id = npm_year_periods.id", 'left');

        $year_period_id = $this->input->post('year_period_id');
        if (!empty($year_period_id) && ($year_period_id != 'all')) {
            $this->db->where("{$this->table}.year_period_id", $year_period_id);
        }

        $search_value = strtolower($_POST['search']['value'] ?? '');
        if ($search_value) {
            $this->db->group_start();
            foreach ($this->column_search as $i => $item) {
                $method = $i === 0 ? 'like' : 'or_like';
                $field = "LOWER(CAST({$this->table}.$item AS TEXT))";
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
        $this->db->select("{$this->table}.*, npm_year_periods.year_period")
                    ->from($this->table)
                    ->join('npm_year_periods', "{$this->table}.year_period_id = npm_year_periods.id", 'left')
                    ->where("{$this->table}.index_value", $data['index_value'])
                    ->where('year_period_id', $data['year_period_id']);
        $result = $this->db->get();
        return [
            'is_exists' => $result->num_rows() > 0,
            'data' => $result->row()
        ];
    }

    public function unique(array $data) {
        $this->db->select("{$this->table}.*, npm_year_periods.year_period")
                    ->from($this->table)
                    ->join('npm_year_periods', "{$this->table}.year_period_id = npm_year_periods.id", 'left')
                    ->where("{$this->table}.id !=", $data['id'])
                    ->where("{$this->table}.index_value", $data['index_value'])
                    ->where('year_period_id', $data['year_period_id']);
        $result = $this->db->get();
        return [
            'is_unique' => $result->num_rows() > 0,
            'data' => $result->row()
        ];
    }

    #####

    public function store($data) {
        return $this->db->insert($this->table, $data);
    }

    public function update(array $data) {
        return $this->db->update($this->table, $data, ['id' => $data['id']]);
    }

    public function delete($id) {
        return $this->db->delete($this->table, ['id' => $id]);
    }

    #####

    public function get_by_id($id)
    {
        $this->db->select("{$this->table}.*, npm_year_periods.year_period")
                 ->from($this->table)
                 ->join('npm_year_periods', "{$this->table}.year_period_id = npm_year_periods.id", 'left')
                 ->where("{$this->table}.id", $id);
        return $this->db->get()->row_array();
    }

    public function get_by_year_period_id($year_period_id)
    {
        $this->db->from($this->table)
                 ->where("year_period_id", $year_period_id);
        return $this->db->get()->result_array();
    }
}