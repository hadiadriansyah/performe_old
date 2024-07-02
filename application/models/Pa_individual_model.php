<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Pa_individual_model extends CI_Model {
    protected $table = 'npm_pa_individuals';

    public function get_by_year_period_id_employee_id($year_period_id, $employee_id) {
        $this->db->select("{$this->table}.*, mj.nm_jabatan as position_name, muku.nm_unit_kerja as unit_name, mukp.nm_unit_kerja as placement_unit_name")
                    ->from($this->table)
                    ->join('md_jabatan mj', "{$this->table}.position_id = mj.id", 'left')
                    ->join('md_unit_kerja muku', "{$this->table}.unit_id = muku.id", 'left')
                    ->join('md_unit_kerja mukp', "{$this->table}.placement_unit_id = mukp.id", 'left')
                    ->where('year_period_id', $year_period_id)
                    ->where('employee_id', $employee_id);
        return $this->db->get()->result();
    }

    #####
    
    public function exists(array $data) {
        $this->db->select("{$this->table}.*, emp_data_peg.nama as employee_name, npm_year_periods.year_period")
                    ->from($this->table)
                    ->join('emp_data_peg', "{$this->table}.employee_id = emp_data_peg.id_peg", 'left')
                    ->join('npm_year_periods', "{$this->table}.year_period_id = npm_year_periods.id", 'left')
                    ->where('employee_id', $data['employee_id'])
                    ->where('year_period_id', $data['year_period_id']);
        $result = $this->db->get();
        return [
            'is_exists' => $result->num_rows() > 0,
            'data' => $result->row()
        ];
    }

    #####

    public function store($data) {
        return $this->db->insert($this->table, $data);
    }

    public function delete($id) {
        return $this->db->delete($this->table, ['id' => $id]);
    }
}