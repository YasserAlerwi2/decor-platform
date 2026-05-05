<?php
require_once __DIR__ . '/../config.php';

header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $username = trim($input['username'] ?? '');
    $password = $input['password'] ?? '';

    if (!$username || !$password) {
        jsonResponse(['error' => 'اسم المستخدم وكلمة المرور مطلوبان'], 400);
    }

    $db = getDB();
    $stmt = $db->prepare('SELECT * FROM admin_users WHERE username = ?');
    $stmt->execute([$username]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        jsonResponse(['error' => 'بيانات الدخول غير صحيحة'], 401);
    }

    $token = jwtEncode(['uid' => $user['id'], 'username' => $user['username']]);

    setcookie(SESSION_COOKIE, $token, [
        'expires' => time() + 7 * 24 * 3600,
        'path' => '/',
        'httponly' => true,
        'secure' => isset($_SERVER['HTTPS']),
        'samesite' => 'Lax',
    ]);

    // تحديث آخر دخول
    $db->prepare('UPDATE admin_users SET last_login = NOW() WHERE id = ?')->execute([$user['id']]);

    jsonResponse(['success' => true, 'username' => $user['username']]);
}

if ($method === 'GET') {
    // التحقق من الجلسة
    $user = getAuthUser();
    if ($user) {
        jsonResponse(['authenticated' => true, 'user' => $user]);
    } else {
        jsonResponse(['authenticated' => false], 401);
    }
}

if ($method === 'DELETE' || ($method === 'POST' && ($_GET['action'] ?? '') === 'logout')) {
    setcookie(SESSION_COOKIE, '', [
        'expires' => time() - 3600,
        'path' => '/',
        'httponly' => true,
    ]);
    jsonResponse(['success' => true]);
}
