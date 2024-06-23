<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Kpi_unit_target_model extends CI_Model {
    protected $table = 'npm_kpi_unit_target';
    
    public function exists(array $data) {
        $this->db->from($this->table)
                    ->where('kpi_unit_id', $data['kpi_unit_id']);

        $result = $this->db->get();
        return [
            'is_exists' => $result->num_rows() > 0,
            'data' => $result->row()
        ];
    }

    public function unique(array $data) {
        $this->db->from($this->table)
                    ->where('kpi_unit_id', $data['kpi_unit_id'])
                    ->where("{$this->table}.id !=", $data['id']);
        
        $result = $this->db->get();
        return [
            'is_unique' => $result->num_rows() > 0,
            'data' => $result->row()
        ];
    }

    #####

    public function store($data) {
        $query = $this->db->query("INSERT INTO {$this->table} (".implode(", ", array_keys($data)).") VALUES (".implode(", ", array_map(array($this->db, 'escape'), array_values($data))).") RETURNING *");
        $inserted_data = $query->row_array();

        return $inserted_data;
    }

    public function update(array $data) {
        $id = $data['id'];
        unset($data['id']); 

        $set_clause = [];
        foreach ($data as $key => $value) {
            $set_clause[] = "{$key} = " . $this->db->escape($value);
        }
        $set_clause = implode(", ", $set_clause);

        $query = $this->db->query("UPDATE {$this->table} SET {$set_clause} WHERE id = " . $this->db->escape($id) . " RETURNING *");
        $updated_data = $query->row_array();

        return $updated_data;
    }

    public function delete_by_kpi_unit_id($id) {
        return $this->db->delete($this->table, ['kpi_unit_id' => $id]);
    }


    #####

    public function get_by_id($id)
    {
        $this->db->from($this->table)
                 ->where("{$this->table}.id", $id);
        return $this->db->get()->row_array();
    }

    public function get_by_kpi_unit_id($id)
    {
        $this->db->from($this->table)
                 ->where("{$this->table}.kpi_unit_id", $id);
        return $this->db->get()->row_array();
    }
}