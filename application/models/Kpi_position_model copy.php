<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Kpi_position_model extends CI_Model {
    protected $table = 'npm_kpi_positions';

    public function get_kpi_position($data)
    {
        $this->db->select($this->table . '.*, npm_perspectives.perspective, npm_objectives.objective, npm_kpi_position_target.id as target_id, npm_kpi_position_actual.id as actual_id');
        $this->db->from($this->table);
        $this->db->join('npm_perspectives', 'npm_perspectives.id = ' . $this->table . '.perspective_id', 'left');
        $this->db->join('npm_objectives', 'npm_objectives.id = ' . $this->table . '.objective_id', 'left');
        $this->db->join('npm_kpi_position_target', 'npm_kpi_position_target.kpi_position_id = ' . $this->table . '.id', 'left');
        $this->db->join('npm_kpi_position_actual', 'npm_kpi_position_actual.kpi_position_id = ' . $this->table . '.id', 'left');
        $this->db->where($this->table . '.position_id', $data['position_id']);
        $this->db->where($this->table . '.year_period_id', $data['year_period_id']);
        return $this->db->get()->result();
    }

    public function store($data) {
        $query = $this->db->query("INSERT INTO {$this->table} (".implode(", ", array_keys($data)).") VALUES (".implode(", ", array_map(array($this->db, 'escape'), array_values($data))).") RETURNING *");
        return $query->row_array();
    }

    public function update(array $data) {
        $query = $this->db->query("UPDATE {$this->table} SET ".implode(", ", array_map(function($key, $value) {
            return "$key = ".$this->db->escape($value);
        }, array_keys($data), $data))." WHERE id = ".$this->db->escape($data['id'])." RETURNING *");
        return $query->row_array();
    }

    public function delete($id) {
        return $this->db->delete($this->table, ['id' => $id]);
    }

    public function submit_kpi_target(array $data)
    {
        $this->db->set('is_submit_target', $data['is_submit']);

        $this->db->where('position_id', $data['position_id']);
        $this->db->where('year_period_id', $data['year_period_id']);
        
        return $this->db->update($this->table);
    }

    public function submit_kpi_actual(array $data)
    {
        $this->db->set('is_submit_actual', $data['is_submit']);

        $this->db->where('position_id', $data['position_id']);
        $this->db->where('year_period_id', $data['year_period_id']);
        
        return $this->db->update($this->table);
    }
}