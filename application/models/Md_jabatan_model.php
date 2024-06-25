<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Md_jabatan_model extends CI_Model {
    protected $table = 'md_jabatan';

    public function get_position_type_options($search = '', $page = 1) {
        $search = strtolower($search);
        $this->db->select('orchart_label');
        $this->db->like("LOWER(CAST(orchart_label AS TEXT))", $search);
        $this->db->where("status", 1);
        $this->db->where("orchart_label != ''");
        $this->db->group_by('orchart_label');
        $this->db->order_by('orchart_label', 'asc');
        // $this->db->limit(100, ($page - 1) * 100);
        $query = $this->db->get($this->table);

        $this->db->reset_query();
        $this->db->select('orchart_label');
        $this->db->like("LOWER(CAST(orchart_label AS TEXT))", $search);
        $this->db->where("status", 1);
        $this->db->where("orchart_label != ''");
        $this->db->group_by('orchart_label');
        $this->db->order_by('orchart_label', 'asc');
        $total_count = $this->db->count_all_results($this->table);

        return [
            'data' => $query->result(),
            'total' => $total_count
        ];
    }

    public function get_by_position_type($position_type) {
        $this->db->select("{$this->table}.*")
                ->from($this->table)
                ->where("status", 1)
                ->where("orchart_label", $position_type);
        return $this->db->get()->result();
    }
}