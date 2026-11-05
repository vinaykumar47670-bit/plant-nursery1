<?php
// Shared config + helpers for every API file
session_start();

define('DB_HOST', '127.0.0.1');
define('DB_PORT', '3307');
define('DB_NAME', 'plant_nursery');
define('DB_USER', 'root');
define('DB_PASS', '');

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

try {
    $pdo = new PDO(
        'mysql:host=' . DB_HOST . ';port=' . DB_PORT . ';dbname=' . DB_NAME . ';charset=utf8mb4',
        DB_USER, DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
    );
} catch (PDOException $e) {
    respond(['error' => 'Database connection failed. Check config.php'], 500);
}

function respond($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data);
    exit;
}

function body() {
    $raw = file_get_contents('php://input');
    return json_decode($raw, true) ?: [];
}

function require_login() {
    if (empty($_SESSION['user'])) respond(['error' => 'Please log in first'], 401);
    return $_SESSION['user'];
}

function require_admin() {
    $u = require_login();
    if ($u['role'] !== 'admin') respond(['error' => 'Admin access only'], 403);
    return $u;
}
