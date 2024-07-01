<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Hist_pelaksana_jabatan_model extends CI_Model {
    protected $table = 'hist_pelaksana_jabatan';

    public function get_by_employee_id($employee_id) {
        $this->db->from($this->table);
        $this->db->where('id_peg', $employee_id);
        $this->db->where('status', 1);
        $this->db->where('tgl_selesai >', 'CURRENT_DATE', FALSE);
        $query = $this->db->get();

        if ($query->num_rows() === 1) {
            return $query->row();
        } else {
            return null;
        }   
    }
}