<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class MY_Loader extends CI_Loader {

    public function repository($repository_file)
    {
        $CI =& get_instance();
        require_once(APPPATH . 'repositories/' . $repository_file . '.php');
        $repository_name = basename($repository_file);
        $CI->$repository_name = new $repository_name();
    }
}