<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Template {
    protected $CI;

    public function __construct() {
        $this->CI =& get_instance();
    }

    public function load($tpl_view, $body_view = null, $data = null) {
        if (!is_null($body_view)) {
            $path = APPPATH . 'views/' . $body_view . '.php';
            if (file_exists($path)) {
                $body = $this->CI->load->view($body_view, $data, TRUE);
                $data['body'] = $body;
            } else {
                $data['body'] = 'Unable to load the requessted file: ' . $body_view . '.php';
            }
        }
    
        $this->CI->load->view('template/' . $tpl_view, $data);
    }
}
