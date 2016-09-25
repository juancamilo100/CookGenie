<?php
/*
 * Copyright (c) 2015 RF Digital Corp. All Rights Reserved.
 *
 * The source code contained in this file and all intellectual property embodied in
 * or covering the source code is the property of RF Digital Corp. or its licensors.
 * Your right to use this source code and intellectual property is non-transferable,
 * non-sub licensable, revocable, and subject to terms and conditions of the
 * SIMBLEE SOFTWARE LICENSE AGREEMENT.
 * http://www.simblee.com/licenses/SimbleeSoftwareLicenseAgreement.txt
 *
 * THE SOURCE CODE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND.
 *
 * This heading must NOT be removed from this file.
 */

function hex($ch, $len)
{
    if (is_string($ch))
        $ch = ord($ch);
    return str_pad(dechex($ch), $len, "0", STR_PAD_LEFT);
}

class SimbleeCloud
{
    const MCS_FUNCTION_CALL = 0xffffffff;

    const MCS_FUNCTION_NONE = 0;
    const MCS_FUNCTION_PING = 1;
    const MCS_FUNCTION_PONG = 2;
    const MCS_FUNCTION_COUNT = 3;
    const MCS_FUNCTION_INITIAL = 4;

    public $userID;
    public $destESN;
    public $originESN;
    public $myESN;
    public $payload;

    public $isCountResult = false;
    public $countResult;

    public $isInitial = false;
    public $initialESN;

    public function begin() {
        ob_start();

        $input = fopen("php://input", "r");

        $in = fread($input, 1);

        $msg_len = ord($in);

        while (true) {
            $n = $msg_len - strlen($in);
            if ($n == 0)
                break;
            $in .= fread($input, $n);
        }

        fclose($input);

        // $msg_len = ord($in[0]);
        $header = substr($in, 1, 12);
        $this->payload = substr($in, 13);

        $assoc_array = unpack("VuserID/VdestESN/VoriginESN", $header);
        list($this->userID, $this->destESN, $this->originESN) = array_values($assoc_array);

        // $my_esn
        $this->myESN = $this->destESN;

        if ($this->originESN == self::MCS_FUNCTION_CALL) {
            $this->mcs_function_call();
        }
    }

    public function mcs_function_call() {
        $funct = ord($this->payload[0]);

        if ($funct == self::MCS_FUNCTION_PING) {
            // retain conv area
            $this->payload[0] = chr(self::MCS_FUNCTION_PONG);
            $this->send(self::MCS_FUNCTION_CALL, $this->payload);
        } else if ($funct == self::MCS_FUNCTION_PONG) {
            // process pong
        } else if ($funct == self::MCS_FUNCTION_COUNT) {
            $this->isCountResult = true;
            $this->countResult = unpack("Vcount", substr($this->payload, 1, 4));
            return;  // continue processing
        } else if ($funct == self::MCS_FUNCTION_INITIAL) {
            $this->isInitial = true;
            $this->initialESN = unpack("Vesn", substr($this->payload, 1, 4));
            return;  // continue processing
        }

        // ignore unknown mcs function calls

        $this->end();
        exit();
    }

    public function send($destESN, $payload) {
        $msg_len = 1 + 8 + strlen($payload);

        echo chr($msg_len);
        echo pack("VV", $destESN, $this->myESN);
        echo $payload;
    }

    public function end() {
        header("Content-Length: " . ob_get_length());
        ob_end_flush();
    }
}
?>
