<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Kpi_position_type_group_model extends CI_Model {
    protected $table = 'npm_kpi_position_type_groups';
    
    public function get_options($search = '', $page = 1) {
        $search = strtolower($search);
        $this->db->like("LOWER(CAST(group_type AS TEXT))", $search);
        $this->db->order_by('group_type', 'asc');
        $this->db->limit(10, ($page - 1) * 10);
        $query = $this->db->get($this->table);

        $total_count = $this->db->like("LOWER(CAST(group_type AS TEXT))", $search)->count_all_results($this->table);

        return [
            'data' => $query->result(),
            'total' => $total_count
        ];
    }

    #####
    
    public function exists(array $data) {
        $this->db->from($this->table)
                    ->where("LOWER(group_type)", strtolower($data['group_type']));
        $result = $this->db->get();
        return [
            'is_exists' => $result->num_rows() > 0,
            'data' => $result->row()
        ];
    }

    public function unique(array $data) {
        $this->db->from($this->table)
                    ->where("id !=", $data['id'])
                    ->where("LOWER(group_type)", strtolower($data['group_type']));
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
    
    public function get_by_id($id) {
        $this->db->from($this->table)
                 ->where("id", $id);
        return $this->db->get()->row_array();
    }
}