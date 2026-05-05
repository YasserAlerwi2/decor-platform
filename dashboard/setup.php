<?php
require_once __DIR__ . '/config.php';
header('Content-Type: application/json; charset=utf-8');

$db = getDB();

// عرض جداول قاعدة البيانات
$tables = $db->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);

$result = [];
foreach ($tables as $table) {
    $cols = $db->query("SHOW COLUMNS FROM `$table`")->fetchAll();
    $result[$table] = array_column($cols, 'Field');
}

echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
