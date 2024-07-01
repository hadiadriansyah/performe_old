<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Position_kpi_position_type_group_model extends CI_Model {
    protected $table = 'npm_position_kpi_position_type_group';

    public function get_positions_by_group_position_type_id($id) {
        $this->db->select("{$this->table}.position_id, md_jabatan.*");
        $this->db->from($this->table);
        $this->db->join('md_jabatan', "md_jabatan.id = {$this->table}.position_id");
        $this->db->where('group_position_type_id', $id);
        return $this->db->get()->result();
    }

    public function delete_positions($group_position_type_id, $position_ids) {
        $chunk_size = 1000;
        $position_id_chunks = array_chunk($position_ids, $chunk_size);

        foreach ($position_id_chunks as $chunk) {
            $this->db->where('group_position_type_id', $group_position_type_id);
            $this->db->where_in('position_id', $chunk);
            $this->db->delete($this->table);
        }
    }

    public function store_positions($positions) {
        $chunk_size = 1000;
        $position_chunks = array_chunk($positions, $chunk_size);

        foreach ($position_chunks as $chunk) {
            $this->db->insert_batch($this->table, $chunk);
        }
    }
}