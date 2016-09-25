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

require("SimbleeCloud.php");

// crash php (for testing)
// call_undefined_function();

function output($text)
{
    $fp = fopen("out/out.txt", "a");
    fprintf($fp, $text);
    fclose($fp);
}

function dump($payload)
{
    $result = "";

    for ($i = 0; $i < strlen($payload); $i++) {
        $byte = ord($payload[$i]);
        if ($result)
            $result .= " ";
        $result .= $byte."/".hex($byte,2)."/".(ctype_print($byte) ? chr($byte) : "?");
    }

    return strlen($payload).":".$result; 
}

$cloud = new SimbleeCloud();
$cloud->begin();

output("REQUEST: userID=".hex($cloud->userID,8).", destESN=".hex($cloud->destESN,8).", originESN=".hex($cloud->originESN,8).", payload=".dump($cloud->payload)."\n");

$cloud->destESN = 0x00000002;
$cloud->send($cloud->destESN, $cloud->payload);

output("RESPONSE: userID=".hex($cloud->userID,8).", destESN=".hex($cloud->destESN,8).", originESN=".hex($cloud->originESN,8).", payload=".dump($cloud->payload)."\n");

$cloud->end();
?>
