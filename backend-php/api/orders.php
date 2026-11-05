<?php
require __DIR__ . '/../config.php';
$u = require_login();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $in = body();
    $items = $in['items'] ?? [];
    $address = trim($in['address'] ?? '');
    if (!$items || $address === '') respond(['error' => 'Add items and a delivery address'], 422);

    $pdo->beginTransaction();
    try {
        $total = 0; $rows = [];
        foreach ($items as $it) {
            $q = $pdo->prepare('SELECT id,name,price,stock FROM plants WHERE id=? FOR UPDATE');
            $q->execute([(int)$it['id']]);
            $p = $q->fetch(); $qty = max(1, (int)$it['quantity']);
            if (!$p) throw new Exception('A plant in your cart no longer exists');
            if ($p['stock'] < $qty) throw new Exception($p['name'] . ' has only ' . $p['stock'] . ' left in stock');
            $total += $p['price'] * $qty; $rows[] = [$p, $qty];
        }
        $q = $pdo->prepare('INSERT INTO orders (user_id,total,address,payment_method) VALUES (?,?,?,?)');
        $q->execute([$u['id'], $total, $address, $in['payment_method'] ?? 'Cash on Delivery']);
        $oid = $pdo->lastInsertId();
        foreach ($rows as [$p, $qty]) {
            $pdo->prepare('INSERT INTO order_items (order_id,plant_id,quantity,price) VALUES (?,?,?,?)')->execute([$oid, $p['id'], $qty, $p['price']]);
            $pdo->prepare('UPDATE plants SET stock=stock-? WHERE id=?')->execute([$qty, $p['id']]);
        }
        $pdo->commit();
        respond(['order_id' => (int)$oid, 'total' => $total], 201);
    } catch (Exception $e) {
        $pdo->rollBack();
        respond(['error' => $e->getMessage()], 409);
    }
}

// my orders
$q = $pdo->prepare('SELECT * FROM orders WHERE user_id=? ORDER BY id DESC');
$q->execute([$u['id']]);
$orders = $q->fetchAll();
foreach ($orders as &$o) {
    $i = $pdo->prepare('SELECT oi.quantity, oi.price, p.name, p.image FROM order_items oi JOIN plants p ON p.id=oi.plant_id WHERE oi.order_id=?');
    $i->execute([$o['id']]);
    $o['items'] = $i->fetchAll();
}
respond($orders);
