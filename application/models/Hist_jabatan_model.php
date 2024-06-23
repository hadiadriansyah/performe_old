<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class hist_jabatan_model extends CI_Model {
    protected $table = 'hist_jabatan';

    public function get_position_by_id_employee($id) {
        $this->db->select("{$this->table}.id, emp_data_peg.nama as emp_name");
        $this->db->from($this->table);
        $this->db->join('emp_data_peg', 'emp_data_peg.id_peg = ' . $this->table . '.id_peg');
        $this->db->where("$this->table.nama_login", $nrik);
        $query = $this->db->get();

        if ($query->num_rows() === 1) {
            $hashed_password = $query->row()->password;
            if (md5($password) === $hashed_password) {
                return $query->row();
            } else {
                return null;
            }
        } else {
            return null;
        }   
    }
}