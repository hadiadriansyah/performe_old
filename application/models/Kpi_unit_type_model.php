<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Kpi_unit_type_model extends CI_Model {
    protected $table = 'npm_kpi_unit_types';

    public function get_kpi_unit_type($data)
    {
        $this->db->select($this->table . '.*, npm_perspectives.perspective, npm_objectives.objective');
        $this->db->from($this->table);
        $this->db->join('npm_perspectives', 'npm_perspectives.id = ' . $this->table . '.perspective_id', 'left');
        $this->db->join('npm_objectives', 'npm_objectives.id = ' . $this->table . '.objective_id', 'left');
        $this->db->where($this->table . '.unit_type', $data['unit_type']);
        $this->db->where($this->table . '.year_period_id', $data['year_period_id']);
        $this->db->where($this->table . '.group_id', $data['group_id']);
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

    public function submit_kpi(array $data)
    {
        $this->db->set('is_submit', $data['is_submit']);

        $this->db->where('unit_type', $data['unit_type']);
        $this->db->where('year_period_id', $data['year_period_id']);
        
        return $this->db->update($this->table);
    }

    public function generate_kpi_row($data) {
        $year_period_id = $data['year_period_id'];
        $unit = json_decode($data['unit'], true);
        $kpis = json_decode($data['kpi'], true);

        $this->db->where([
            'unit_id' => $unit['id'],
            'perspective_id' => $kpis[0]['perspective_id'],
            'objective_id' => $kpis[0]['objective_id'],
            'kpi_id' => $kpis[0]['kpi_id'],
            'measurement' => $kpis[0]['measurement'],
            'weight' => $kpis[0]['weight'],
            'year_period_id' => $year_period_id
        ]);

        $existing_data = $this->db->get('npm_kpi_units')->row_array();

        if ($existing_data) {
            return ['status' => true, 'mode' => 'warning', 'message' => 'already exist'];
        }

        foreach ($kpis as $kpi) {
            $data = [
                'unit_id' => $unit['id'],
                'year_period_id' => $year_period_id,
                'perspective_id' => $kpi['perspective_id'],
                'objective_id' => $kpi['objective_id'],
                'kpi_id' => $kpi['kpi_id'],
                'measurement' => $kpi['measurement'],
                'weight' => $kpi['weight'],
                'score' => $kpi['score'],
            ];

            if (!$this->db->insert('npm_kpi_units', $data)) {
                return ['status' => false, 'mode' => 'danger', 'message' => 'Failed to create data'];
            }
        }

        return ['status' => true, 'mode' => 'success', 'message' => 'successfully generated'];
    }
}