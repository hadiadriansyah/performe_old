<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Emp_data_peg_model extends CI_Model {
    protected $table = 'emp_data_peg';

    public function get_options($search = '', $page = 1) {
        $search = strtolower($search);
        $this->db->like("LOWER(CAST(nama AS TEXT))", $search);
        $this->db->where_in("{$this->table}.status_peg", [1, 11]);
        $this->db->order_by("nama", "asc");
        $this->db->limit(10, ($page - 1) * 10);
        $query = $this->db->get($this->table);

        $total_count = $this->db->like("LOWER(CAST(nama AS TEXT))", $search)->where_in("{$this->table}.status_peg", [1, 11])->count_all_results($this->table);

        return [
            'data' => $query->result(),
            'total' => $total_count
        ];
    }
}