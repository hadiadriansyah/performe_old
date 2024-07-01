<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Unit_kpi_unit_type_group_model extends CI_Model {
    protected $table = 'npm_unit_kpi_unit_type_group';

    public function get_units_by_group_unit_type($data) {
        $this->db->select("{$this->table}.unit_id, md_unit_kerja.*");
        $this->db->from($this->table);
        $this->db->join('md_unit_kerja', "md_unit_kerja.id = {$this->table}.unit_id");
        $this->db->join('md_jenis_unit_kerja', "md_jenis_unit_kerja.id = md_unit_kerja.id_jenis_unit_kerja");
        $this->db->where('md_jenis_unit_kerja.kode_surat', $data['unit_type']);
        $this->db->where('group_unit_type_id', $data['group_unit_type_id']);
        return $this->db->get()->result();
    }

    public function get_units_by_group_unit_type_id($id) {
        $this->db->select("{$this->table}.unit_id, md_unit_kerja.*");
        $this->db->from($this->table);
        $this->db->join('md_unit_kerja', "md_unit_kerja.id = {$this->table}.unit_id");
        $this->db->where('group_unit_type_id', $id);
        return $this->db->get()->result();
    }

    public function delete_units($group_unit_type_id, $unit_ids) {
        $chunk_size = 1000;
        $unit_id_chunks = array_chunk($unit_ids, $chunk_size);

        foreach ($unit_id_chunks as $chunk) {
            $this->db->where('group_unit_type_id', $group_unit_type_id);
            $this->db->where_in('unit_id', $chunk);
            $this->db->delete($this->table);
        }
    }

    public function store_units($units) {
        $chunk_size = 1000;
        $unit_chunks = array_chunk($units, $chunk_size);

        foreach ($unit_chunks as $chunk) {
            $this->db->insert_batch($this->table, $chunk);
        }
    }
}