<?php
session_start();
if (!isset($_SESSION['history'])) {
    $_SESSION['history'] = array();
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $path =  parse_url($_SERVER['REQUEST_URI'])['path'];
    if ($path == '/~s336704/handler.php/hit') { // TODO: change path
        if (validate($_GET['x'], $_GET['y'], $_GET['r'])) {
            $hit = hitted($_GET['x'], $_GET['y'], $_GET['r']) ? 'hit' : 'miss';
            $result = array(
                'datetime' => time(),
                'delay' => round((microtime(true) - $_SERVER['REQUEST_TIME_FLOAT']) * 1000, 2),
                'x' => $_GET['x'],
                'y' => $_GET['y'],
                'r' => $_GET['r'],
                'result' => $hit
            );
            echo json_encode($result);
            save($result);
        } else {
            http_response_code(400);
            echo 'Bad request';
            exit(400);
        }
    } elseif ($path == '/~s336704/handler.php/history') {
        echo json_encode($_SESSION['history']);
    } else {
        http_response_code(404);
        echo 'Not found', $path;
        exit(404);
    }
}

function save($element) {
    array_push($_SESSION['history'], $element);
}

function validate($x, $y, $r) {
    if (
        (isset($x) && isset($y) && isset($r)) &&
        is_numeric($x) &&
        is_numeric($y) &&
        is_numeric($r) && 
        ($x >= -5 && $x <= 3) &&
        ($y >= -5 && $y <= 5) &&
        ($r >= 1 && $r <= 5)
        ) {
        return true;
    } else {
        return false;
    }
}

function hitted($x, $y, $r) {
    if ($x <= 0 && $y >= 0) {
        if (sqrt(pow($x, 2) + pow($y, 2)) < $r / 2) {
            return true;
        } else {
            return false;
        }
    } elseif ($y <= 0 && $x <= 0) {
        if (($x > (-$r / 2)) && ($y > -$r)) {
            return true;
        } else {
            return false;
        }
    } elseif ($x >= 0 && $y <= 0) {
        if ($y >= ($x - $r)) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}
