<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Kpi_polarization_model extends CI_Model {
    protected $table = 'npm_kpi_polarizations';
    protected $column_order = [null, 'polarization', null, 'npm_year_periods.year_period', 'created_at'];
    protected $column_search = ['polarization'];
    protected $order = ['npm_year_periods.year_period' => 'desc', 'polarization' => 'asc'];

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
                    ->where("LOWER({$this->table}.polarization)", strtolower($data['polarization']))
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
                    ->where("LOWER({$this->table}.polarization)", strtolower($data['polarization']))
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

    public function get_options_by_year_period_id($search, $page, $year_period_id) {
        $search = strtolower($search);
        $this->db->like("LOWER(CAST(polarization AS TEXT))", $search);
        $this->db->where('year_period_id', $year_period_id);
        $this->db->limit(10, ($page - 1) * 10);
        $query = $this->db->get($this->table);

        $total_count = $this->db->like("LOWER(CAST(polarization AS TEXT))", $search)->count_all_results($this->table);

        return [
            'data' => $query->result(),
            'total' => $total_count
        ];
    }
}