<?php
// إعدادات قاعدة البيانات والاتصال
define('DB_HOST', 'localhost');
define('DB_NAME', 'u465218223_alorwi');
define('DB_USER', 'u465218223_decor');
define('DB_PASS', '6fIAM4mPq9');

define('JWT_SECRET', '88dac86042ebd3a500db12f16b7e2514');
define('SESSION_COOKIE', 'admin_session');
define('UPLOAD_DIR', __DIR__ . '/uploads');
define('MAX_UPLOAD_SIZE', 10 * 1024 * 1024); // 10MB

// اتصال PDO
function getDB(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    }
    return $pdo;
}

// JWT بسيط باستخدام HMAC-SHA256
function jwtEncode(array $payload): string {
    $header = base64url_encode(json_encode(['typ' => 'JWT', 'alg' => 'HS256']));
    $payload['iat'] = time();
    $payload['exp'] = time() + 7 * 24 * 3600; // 7 أيام
    $payloadEncoded = base64url_encode(json_encode($payload));
    $signature = base64url_encode(hash_hmac('sha256', "$header.$payloadEncoded", JWT_SECRET, true));
    return "$header.$payloadEncoded.$signature";
}

function jwtDecode(string $token): ?array {
    $parts = explode('.', $token);
    if (count($parts) !== 3) return null;
    [$header, $payload, $signature] = $parts;
    $expectedSig = base64url_encode(hash_hmac('sha256', "$header.$payload", JWT_SECRET, true));
    if (!hash_equals($expectedSig, $signature)) return null;
    $data = json_decode(base64url_decode($payload), true);
    if (!$data || !isset($data['exp']) || $data['exp'] < time()) return null;
    return $data;
}

function base64url_encode(string $data): string {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64url_decode(string $data): string {
    return base64_decode(strtr($data, '-_', '+/'));
}

// التحقق من الجلسة
function getAuthUser(): ?array {
    $token = $_COOKIE[SESSION_COOKIE] ?? '';
    if (!$token) return null;
    $session = jwtDecode($token);
    if (!$session) return null;
    return ['id' => $session['uid'], 'username' => $session['username']];
}

// إرجاع JSON
function jsonResponse($data, int $status = 200): void {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

// التحقق من المصادقة
function requireAuth(): array {
    $user = getAuthUser();
    if (!$user) {
        jsonResponse(['error' => 'غير مصادق'], 401);
    }
    return $user;
}

// توليد slug
function generateSlug(string $text): string {
    $text = preg_replace('/[^\w\s\u0600-\u06FF]/u', '', $text);
    $text = preg_replace('/\s+/', '-', $text);
    $text = preg_replace('/-+/', '-', $text);
    $text = trim($text, '-');
    return mb_substr($text, 0, 100);
}
