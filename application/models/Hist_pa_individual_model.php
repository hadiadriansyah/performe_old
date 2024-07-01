<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Hist_pa_individual_model extends CI_Model {
    protected $table = 'npm_hist_pa_individuals';

    public function store($data) {
        return $this->db->insert($this->table, $data);
    }
}