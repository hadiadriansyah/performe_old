<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Adm_user_model extends CI_Model {
    protected $table = 'adm_user';

    public function check_credentials($nrik, $password) {
        $this->db->select("{$this->table}.*, emp_data_peg.nama as emp_name, emp_data_peg.status_peg, hist_jabatan.id_jabatan, hist_jabatan.id_unit_kerja");
        $this->db->from($this->table);
        $this->db->join('emp_data_peg', 'emp_data_peg.id_peg = ' . $this->table . '.id_peg');
        $this->db->join('hist_jabatan', 'hist_jabatan.id_peg = ' . $this->table . '.id_peg');
        $this->db->where("$this->table.nama_login", $nrik);
        $this->db->where('hist_jabatan.status', 1);
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