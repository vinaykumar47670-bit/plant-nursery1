<?php
require __DIR__ . '/../config.php';
require_admin();
$action = $_GET['action'] ?? '';
$in = body();

if ($action === 'stats') {
    respond([
        'plants'    => (int)$pdo->query('SELECT COUNT(*) FROM plants')->fetchColumn(),
        'orders'    => (int)$pdo->query('SELECT COUNT(*) FROM orders')->fetchColumn(),
        'customers' => (int)$pdo->query("SELECT COUNT(*) FROM users WHERE role='customer'")->fetchColumn(),
        'revenue'   => (float)$pdo->query("SELECT COALESCE(SUM(total),0) FROM orders WHERE status<>'Cancelled'")->fetchColumn(),
        'low_stock' => $pdo->query('SELECT id,name,stock FROM plants WHERE stock<=10 ORDER BY stock')->fetchAll(),
        'recent'    => $pdo->query('SELECT o.id,o.total,o.status,u.name FROM orders o JOIN users u ON u.id=o.user_id ORDER BY o.id DESC LIMIT 5')->fetchAll(),
    ]);
}

if ($action === 'plant_save') {
    $f = [$in['category_id'], trim($in['name']), $in['scientific_name'] ?? '', $in['description'] ?? '', $in['price'], $in['stock'],
          $in['light'] ?? 'Medium', $in['water'] ?? 'Medium', $in['care_tips'] ?? '', $in['image'] ?? ''];
    if (!empty($in['id'])) {
        $pdo->prepare('UPDATE plants SET category_id=?,name=?,scientific_name=?,description=?,price=?,stock=?,light=?,water=?,care_tips=?,image=? WHERE id=?')
            ->execute([...$f, (int)$in['id']]);
        respond(['ok' => true]);
    }
    $pdo->prepare('INSERT INTO plants (category_id,name,scientific_name,description,price,stock,light,water,care_tips,image) VALUES (?,?,?,?,?,?,?,?,?,?)')->execute($f);
    respond(['id' => (int)$pdo->lastInsertId()], 201);
}

if ($action === 'plant_delete') {
    try { $pdo->prepare('DELETE FROM plants WHERE id=?')->execute([(int)$_GET['id']]); respond(['ok' => true]); }
    catch (PDOException $e) { respond(['error' => 'This plant has orders, so set its stock to 0 instead of deleting it'], 409); }
}

if ($action === 'orders') {
    respond($pdo->query('SELECT o.*, u.name, u.email FROM orders o JOIN users u ON u.id=o.user_id ORDER BY o.id DESC')->fetchAll());
}

if ($action === 'order_status') {
    $allowed = ['Placed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];
    if (!in_array($in['status'] ?? '', $allowed)) respond(['error' => 'Invalid status'], 422);
    $pdo->prepare('UPDATE orders SET status=? WHERE id=?')->execute([$in['status'], (int)$in['id']]);
    respond(['ok' => true]);
}

respond(['error' => 'Unknown action'], 404);
