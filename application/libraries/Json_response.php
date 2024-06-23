<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Json_response {
    public function success($message, $additionalData = []) {
        if (!is_array($additionalData)) {
            $additionalData = [];
        }
        $response = [
            'status' => 'success',
            'message' => $message,
            'data' => $additionalData
        ];
        echo json_encode($response);
    }

    public function error($message, $errors = []) {
        if (!is_array($errors)) {
            $errors = [];
        }
        $response = [
            'status' => 'error',
            'message' => $message,
            'errors' => $errors
        ];
        echo json_encode($response);
    }
}
