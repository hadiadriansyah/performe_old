<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Last_login_model extends CI_Model {
    protected $table = 'npm_last_login';

    public function last_login($login_info) {
        $result = $this->db->insert('npm_last_login', $login_info);
        return $result;
    }

    public function last_login_info($user_id) {
        $this->db->select('created_at');
        $this->db->from('npm_last_login');
        $this->db->where('user_id', $user_id);
        $this->db->limit(1);
        $query = $this->db->get();
        return $query->row();
    }
}