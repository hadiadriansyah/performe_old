<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Kpi_unit_model extends CI_Model {
    protected $table = 'npm_kpi_units';

    public function get_kpi_unit($data)
    {
        $this->db->select($this->table . '.*, npm_perspectives.perspective, npm_objectives.objective, npm_kpi_unit_target.id as target_id, npm_kpi_unit_actual.id as actual_id');
        $this->db->from($this->table);
        $this->db->join('npm_perspectives', 'npm_perspectives.id = ' . $this->table . '.perspective_id', 'left');
        $this->db->join('npm_objectives', 'npm_objectives.id = ' . $this->table . '.objective_id', 'left');
        $this->db->join('npm_kpi_unit_target', 'npm_kpi_unit_target.kpi_unit_id = ' . $this->table . '.id', 'left');
        $this->db->join('npm_kpi_unit_actual', 'npm_kpi_unit_actual.kpi_unit_id = ' . $this->table . '.id', 'left');
        $this->db->where($this->table . '.unit_id', $data['unit_id']);
        $this->db->where($this->table . '.year_period_id', $data['year_period_id']);
        return $this->db->get()->result();
    }

    public function get_kpi_unit_target_by_unit_id($data) {
        $this->db->select($this->table . '.*');
        $this->db->from($this->table);
        $this->db->join('npm_kpi_unit_target', 'npm_kpi_unit_target.kpi_unit_id = ' . $this->table . '.id', 'inner');
        $this->db->where($this->table . '.unit_id', $data['unit_id']);
        $this->db->where($this->table . '.year_period_id', $data['year_period_id']);
        return $this->db->get()->result();
    }

    #####

    public function exists(array $data) {
        $this->db->select("{$this->table}.*, npm_kpis.kpi, npm_year_periods.year_period")
                    ->from($this->table)
                    ->join('npm_year_periods', "{$this->table}.year_period_id = npm_year_periods.id", 'left')
                    ->join('npm_kpis', 'npm_kpis.id = ' . $this->table . '.kpi_id', 'left')
                    ->where("{$this->table}.kpi_id", $data['kpi_id'])
                    ->where("{$this->table}.unit_id", $data['unit_id'])
                    ->where("{$this->table}.year_period_id", $data['year_period_id']);
        $result = $this->db->get();
        return [
            'is_exists' => $result->num_rows() > 0,
            'data' => $result->row()
        ];
    }

    public function unique(array $data) {
        $this->db->select("{$this->table}.*, npm_kpis.kpi, npm_year_periods.year_period")
                    ->from($this->table)
                    ->join('npm_year_periods', "{$this->table}.year_period_id = npm_year_periods.id", 'left')
                    ->join('npm_kpis', 'npm_kpis.id = ' . $this->table . '.kpi_id', 'left')
                    ->where("{$this->table}.id !=", $data['id'])
                    ->where("{$this->table}.kpi_id", $data['kpi_id'])
                    ->where("{$this->table}.unit_id", $data['unit_id'])
                    ->where("{$this->table}.year_period_id", $data['year_period_id']);
        $result = $this->db->get();
        return [
            'is_unique' => $result->num_rows() > 0,
            'data' => $result->row()
        ];
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

        $this->db->where('unit_id', $data['unit_id']);
        $this->db->where('year_period_id', $data['year_period_id']);
        
        return $this->db->update($this->table);
    }

    public function submit_kpi_actual(array $data)
    {
        $this->db->set('is_submit_actual', $data['is_submit']);

        $this->db->where('unit_id', $data['unit_id']);
        $this->db->where('year_period_id', $data['year_period_id']);
        
        return $this->db->update($this->table);
    }
}