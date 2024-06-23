<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Unit_kpi_unit_type_group_model extends CI_Model {
    protected $table = 'npm_unit_kpi_unit_type_group';

    public function get_units_by_group_id($id) {
        $this->db->select("{$this->table}.unit_id, md_unit_kerja.*");
        $this->db->from($this->table);
        $this->db->join('md_unit_kerja', "md_unit_kerja.id = {$this->table}.unit_id");
        $this->db->where('group_id', $id);
        return $this->db->get()->result();
    }

    public function delete_units($group_id, $unit_ids) {
        $chunk_size = 1000;
        $unit_id_chunks = array_chunk($unit_ids, $chunk_size);

        foreach ($unit_id_chunks as $chunk) {
            $this->db->where('group_id', $group_id);
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