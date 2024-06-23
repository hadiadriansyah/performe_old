<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class User_model extends CI_Model {
    protected $table = 'npm_users';

    public function check_credentials($email, $password) {
        $this->db->from($this->table);
        $this->db->where("$this->table.email", $email);
        $query = $this->db->get();

        if ($query->num_rows() === 1) {
            $hashed_password = $query->row()->password;
            if (password_verify($password, $hashed_password)) {
                return $query->row();
            } else {
                return null;
            }
        } else {
            return null;
        }   
    }
}