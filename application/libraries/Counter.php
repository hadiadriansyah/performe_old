<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Counter {
    public function calculate_counter($counter, $counter_data) { 
        if (strpos($counter, 'SUM') !== false) {
            #Rule of SUM
            # $UM value from month x to month y
            if (isset($counter_data['month'])) {
                return array_sum($counter_data['month']);
            } else {
                return "Error 404";
            }
        } elseif (strpos($counter, 'AVG') !== false) {
            #Rule of AVG
            # Average value from month x to month y
            if (isset($counter_data['month'])) {
                return array_sum($counter_data['month']) / count($counter_data['month']);
            } else {
                return "Error 404";
            }
        } elseif (strpos($counter, 'LAST') !== false) {
            #Rule of LAST
            #Last value of period
            if (isset($counter_data['month'])) {
                return end($counter_data['month']);
            } else {
                return "Error 404";
            }
        } else {
            return "Error 404";
        }
    }
}