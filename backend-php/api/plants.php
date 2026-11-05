<?php
require __DIR__ . '/../config.php';
$action = $_GET['action'] ?? 'list';

if ($action === 'categories') {
    respond($pdo->query('SELECT * FROM categories ORDER BY name')->fetchAll());
}

if ($action === 'detail') {
    $id = (int)($_GET['id'] ?? 0);
    $q = $pdo->prepare('SELECT p.*, c.name AS category FROM plants p JOIN categories c ON c.id=p.category_id WHERE p.id=?');
    $q->execute([$id]);
    $plant = $q->fetch();
    if (!$plant) respond(['error' => 'Plant not found'], 404);
    $r = $pdo->prepare('SELECT r.rating, r.comment, r.created_at, u.name FROM reviews r JOIN users u ON u.id=r.user_id WHERE r.plant_id=? ORDER BY r.id DESC');
    $r->execute([$id]);
    $plant['reviews'] = $r->fetchAll();
    respond($plant);
}

if ($action === 'review' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $u = require_login(); $in = body();
    $rating = max(1, min(5, (int)($in['rating'] ?? 5)));
    $q = $pdo->prepare('INSERT INTO reviews (plant_id,user_id,rating,comment) VALUES (?,?,?,?)');
    $q->execute([(int)$in['plant_id'], $u['id'], $rating, trim($in['comment'] ?? '')]);
    respond(['ok' => true], 201);
}

// list with search, category, light, price range and sorting
$sql = 'SELECT p.*, c.name AS category,
        (SELECT ROUND(AVG(rating),1) FROM reviews WHERE plant_id=p.id) AS avg_rating
        FROM plants p JOIN categories c ON c.id=p.category_id WHERE 1=1';
$args = [];
if (!empty($_GET['q']))        { $sql .= ' AND (p.name LIKE ? OR p.scientific_name LIKE ?)'; $args[] = '%'.$_GET['q'].'%'; $args[] = '%'.$_GET['q'].'%'; }
if (!empty($_GET['category'])) { $sql .= ' AND p.category_id=?'; $args[] = (int)$_GET['category']; }
if (!empty($_GET['light']))    { $sql .= ' AND p.light=?'; $args[] = $_GET['light']; }
if (!empty($_GET['max']))      { $sql .= ' AND p.price<=?'; $args[] = (float)$_GET['max']; }
$sort = ['price_asc' => 'p.price ASC', 'price_desc' => 'p.price DESC', 'new' => 'p.id DESC'];
$sql .= ' ORDER BY ' . ($sort[$_GET['sort'] ?? ''] ?? 'p.name ASC');
$q = $pdo->prepare($sql); $q->execute($args);
respond($q->fetchAll());
