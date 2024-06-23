<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Unit_model extends CI_Model {
    protected $table = 'md_unit_kerja';

    public function get_options($search = '', $page = 1) {
        $search = strtolower($search);
        $this->db->like("LOWER(CAST(nm_unit_kerja AS TEXT))", $search);
        $this->db->where("{$this->table}.status", 1);
        $this->db->limit(10, ($page - 1) * 10);
        $query = $this->db->get($this->table);

        $total_count = $this->db->like("LOWER(CAST(nm_unit_kerja AS TEXT))", $search)->where("{$this->table}.status", 1)->count_all_results($this->table);

        return [
            'data' => $query->result(),
            'total' => $total_count
        ];
    }

    public function get_options_by_unit_id($data) {
        $this->db->select('ditempatkan_di');
        $this->db->from('hist_unit_kerja');
        $this->db->where("id_peg", $data['employee_id']);
        $this->db->where("id_unit_kerja", $data['employee_unit_id']);
        $unit_id = $this->db->get()->row_array()['ditempatkan_di'];
        
        $this->db->where("{$this->table}.status", 1);
        $this->db->where("{$this->table}.id", $unit_id);
        $query = $this->db->get($this->table);

        $total_count = $this->db->where("{$this->table}.status", 1)->count_all_results($this->table);

        return [
            'data' => $query->result(),
            'total' => $total_count
        ];
    }

    public function get_by_unit_type($unit_type) {
        $this->db->select("{$this->table}.*")
                ->from($this->table)
                ->join('md_jenis_unit_kerja', "md_jenis_unit_kerja.id = {$this->table}.id_jenis_unit_kerja")
                ->where("md_jenis_unit_kerja.status", 1)
                ->where("md_jenis_unit_kerja.kode_surat", $unit_type);
        return $this->db->get()->result();
    }
}