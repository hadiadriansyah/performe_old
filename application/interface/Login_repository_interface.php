<?php
interface Login_repository_interface {
    public function check_credentials($email, $password);
    public function check_credentials_emp($nrik, $password);
    public function last_login($login_info);
    public function last_login_info($user_id);
}