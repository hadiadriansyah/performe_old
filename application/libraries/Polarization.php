<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Polarization {

    private function compare($a, $operator, $b) {
        switch ($operator) {
            case '<=':
                return $a <= $b;
            case '>':
                return $a > $b;
            case '==':
                return $a == $b;
            case '<':
                return $a < $b;
            case '>=':
                return $a >= $b;
            default:
                throw new Exception("Operator tidak valid");
        }
    }

    public function calculateIndex($actual, $target, $polarization, $polarization_data) {
        $valueapp = ($actual / $target) * 100;
       
        if (strpos($polarization, 'Minimize') !== false) {
            if ($this->compare($valueapp, $polarization_data['min_opr_1'], $polarization_data['value_min_1'])) {
                return $polarization_data['pol_min_index1'];
            } elseif ($this->compare($valueapp, $polarization_data['min_opr_2'], $polarization_data['value_min_1']) && $this->compare($valueapp, $polarization_data['min_opr_1'], $polarization_data['value_min_2'])) {
                return $polarization_data['pol_min_index2'];
            } elseif ($this->compare($valueapp, $polarization_data['min_opr_2'], $polarization_data['value_min_2']) && $this->compare($valueapp, $polarization_data['min_opr_1'], $polarization_data['value_min_3'])) {
                return $polarization_data['pol_min_index3'];
            } elseif ($this->compare($valueapp, $polarization_data['min_opr_2'], $polarization_data['value_min_3']) && $this->compare($valueapp, $polarization_data['min_opr_1'], $polarization_data['value_min_4'])) {
                return $polarization_data['pol_min_index4'];
            } elseif ($this->compare($valueapp, $polarization_data['min_opr_2'], $polarization_data['value_min_5'])) {
                return $polarization_data['pol_min_index5'];
            } else {
                return "Error";
            }
        } elseif (strpos($polarization, 'Absolute') !== false) {
            if ($this->compare($valueapp, $polarization_data['abs_opr_1'], $target)) {
                return $polarization_data['pol_abs_index_1'];
            } elseif ($this->compare($valueapp, $polarization_data['abs_opr_2'], $target)) {
                return $polarization_data['pol_abs_index_2'];
            } else {
                return "Error";
            }
        } elseif (strpos($polarization, 'Stabilize') !== false) {
            $valueapp = $actual - $target;
            if ($this->compare($valueapp, $polarization_data['stab_opr_1'], $target)) {
                return $polarization_data['pol_stab_index_1'];
            } elseif ($this->compare($valueapp, $polarization_data['stab_opr_2'], $target)) {
                return $polarization_data['pol_stab_index_2'];
            } elseif ($this->compare($valueapp, $polarization_data['stab_opr_2'], $target)) {
                return $polarization_data['pol_stab_index_3'];
            } elseif ($this->compare($valueapp, $polarization_data['stab_opr_2'], $target)) {
                return $polarization_data['pol_stab_index_4'];
            } elseif ($this->compare($valueapp, $polarization_data['stab_opr_2'], $target)) {
                return $polarization_data['pol_stab_index_5'];
            } else {
                return "Error";
            }
        } elseif (strpos($polarization, 'Maximize') !== false) {
            return "Can't process Maximize polarization for temporary";
        } else {
            return "Error";
        }
    }
}