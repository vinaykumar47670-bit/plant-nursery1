<?php
require __DIR__ . '/../config.php';
$action = $_GET['action'] ?? '';
$in = body();

if ($action === 'register') {
    $name = trim($in['name'] ?? ''); $email = strtolower(trim($in['email'] ?? '')); $pass = $in['password'] ?? '';
    if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($pass) < 6)
        respond(['error' => 'Enter a name, a valid email and a password of at least 6 characters'], 422);
    $q = $pdo->prepare('SELECT id FROM users WHERE email=?'); $q->execute([$email]);
    if ($q->fetch()) respond(['error' => 'This email is already registered'], 409);
    $q = $pdo->prepare('INSERT INTO users (name,email,password,phone) VALUES (?,?,?,?)');
    $q->execute([$name, $email, password_hash($pass, PASSWORD_DEFAULT), $in['phone'] ?? null]);
    $_SESSION['user'] = ['id' => (int)$pdo->lastInsertId(), 'name' => $name, 'email' => $email, 'role' => 'customer'];
    respond($_SESSION['user'], 201);
}

if ($action === 'login') {
    $q = $pdo->prepare('SELECT * FROM users WHERE email=?');
    $q->execute([strtolower(trim($in['email'] ?? ''))]);
    $u = $q->fetch();
    if (!$u || !password_verify($in['password'] ?? '', $u['password']))
        respond(['error' => 'Email or password is incorrect'], 401);
    $_SESSION['user'] = ['id' => (int)$u['id'], 'name' => $u['name'], 'email' => $u['email'], 'role' => $u['role']];
    respond($_SESSION['user']);
}

if ($action === 'logout') { session_destroy(); respond(['ok' => true]); }

if ($action === 'me') { respond($_SESSION['user'] ?? null); }

respond(['error' => 'Unknown action'], 404);
