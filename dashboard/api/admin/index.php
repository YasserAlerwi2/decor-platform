<?php
require_once __DIR__ . '/../../config.php';
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$path = $_GET['path'] ?? '';
$db = getDB();

// ── الإعدادات ──
if ($path === 'settings') {
    $user = requireAuth();

    if ($method === 'GET') {
        $settings = $db->query('SELECT * FROM site_settings LIMIT 1')->fetch();
        if (!$settings) {
            $db->exec("INSERT INTO site_settings (site_name) VALUES ('العروي للديكورات')");
            $settings = $db->query('SELECT * FROM site_settings LIMIT 1')->fetch();
        }
        $seo = $db->prepare('SELECT * FROM site_seo WHERE site_settings_id = ?');
        $seo->execute([$settings['id']]);
        $settings['seo'] = $seo->fetch() ?: null;

        $analytics = $db->prepare('SELECT * FROM analytics_integrations WHERE site_settings_id = ?');
        $analytics->execute([$settings['id']]);
        $settings['analytics'] = $analytics->fetch() ?: null;

        jsonResponse($settings);
    }

    if ($method === 'POST') {
        $user = requireAuth();
        $input = json_decode(file_get_contents('php://input'), true);
        $seo = $input['seo'] ?? null;
        $analytics = $input['analytics'] ?? null;
        unset($input['seo'], $input['analytics'], $input['id'], $input['updatedAt'], $input['updated_at']);

        $existing = $db->query('SELECT id FROM site_settings LIMIT 1')->fetch();
        $settingsId = $existing ? $existing['id'] : null;

        if (!$settingsId) {
            $cols = implode(', ', array_keys($input));
            $vals = implode(', ', array_fill(0, count($input), '?'));
            $db->prepare("INSERT INTO site_settings ($cols) VALUES ($vals)")->execute(array_values($input));
            $settingsId = $db->lastInsertId();
        } else {
            $sets = implode(', ', array_map(fn($k) => "$k = ?", array_keys($input)));
            $db->prepare("UPDATE site_settings SET $sets WHERE id = $settingsId")->execute(array_values($input));
        }

        // SEO upsert
        if ($seo) {
            unset($seo['id'], $seo['updatedAt'], $seo['updated_at'], $seo['site_settings_id']);
            $existingSeo = $db->prepare('SELECT id FROM site_seo WHERE site_settings_id = ?');
            $existingSeo->execute([$settingsId]);
            if ($existingSeo->fetch()) {
                $sets = implode(', ', array_map(fn($k) => "$k = ?", array_keys($seo)));
                $db->prepare("UPDATE site_seo SET $sets WHERE site_settings_id = $settingsId")->execute(array_values($seo));
            } else {
                $seo['site_settings_id'] = $settingsId;
                $cols = implode(', ', array_keys($seo));
                $vals = implode(', ', array_fill(0, count($seo), '?'));
                $db->prepare("INSERT INTO site_seo ($cols) VALUES ($vals)")->execute(array_values($seo));
            }
        }

        // Analytics upsert
        if ($analytics) {
            unset($analytics['id'], $analytics['updatedAt'], $analytics['updated_at'], $analytics['site_settings_id']);
            $existingAn = $db->prepare('SELECT id FROM analytics_integrations WHERE site_settings_id = ?');
            $existingAn->execute([$settingsId]);
            if ($existingAn->fetch()) {
                $sets = implode(', ', array_map(fn($k) => "$k = ?", array_keys($analytics)));
                $db->prepare("UPDATE analytics_integrations SET $sets WHERE site_settings_id = $settingsId")->execute(array_values($analytics));
            } else {
                $analytics['site_settings_id'] = $settingsId;
                $cols = implode(', ', array_keys($analytics));
                $vals = implode(', ', array_fill(0, count($analytics), '?'));
                $db->prepare("INSERT INTO analytics_integrations ($cols) VALUES ($vals)")->execute(array_values($analytics));
            }
        }

        jsonResponse(['success' => true]);
    }
}

// ── الخدمات ──
if ($path === 'services') {
    if ($method === 'GET') {
        $user = requireAuth();
        $services = $db->query('
            SELECT s.*, ss.meta_title, ss.meta_description, ss.keywords, ss.og_title, ss.og_description, ss.image_alt_text, ss.image_title_tag, ss.schema_type as seo_schema_type,
                   c.name as category_name, c.slug as category_slug
            FROM services s
            LEFT JOIN service_seo ss ON ss.service_id = s.id
            LEFT JOIN categories c ON c.id = s.category_id
            ORDER BY s.sort_order ASC
        ')->fetchAll();
        jsonResponse($services);
    }

    if ($method === 'POST') {
        $user = requireAuth();
        $input = json_decode(file_get_contents('php://input'), true);
        $seo = $input['seo'] ?? null;
        $categoryIds = $input['categoryIds'] ?? null;
        unset($input['seo'], $input['categoryIds'], $input['id'], $input['createdAt'], $input['created_at'], $input['updatedAt'], $input['updated_at']);
        if (isset($input['categoryId']) && $input['categoryId'] === '') $input['categoryId'] = null;

        $cols = implode(', ', array_keys($input));
        $vals = implode(', ', array_fill(0, count($input), '?'));
        $db->prepare("INSERT INTO services ($cols) VALUES ($vals)")->execute(array_values($input));
        $serviceId = $db->lastInsertId();

        if ($seo) {
            unset($seo['id'], $seo['updatedAt'], $seo['updated_at']);
            $seo['service_id'] = $serviceId;
            $cols = implode(', ', array_keys($seo));
            $vals = implode(', ', array_fill(0, count($seo), '?'));
            $db->prepare("INSERT INTO service_seo ($cols) VALUES ($vals)")->execute(array_values($seo));
        }

        jsonResponse(['success' => true, 'id' => $serviceId], 201);
    }
}

// خدمة واحدة
if (preg_match('/^services\/(\d+)$/', $path, $m)) {
    $id = (int)$m[1];

    if ($method === 'GET') {
        $user = requireAuth();
        $service = $db->prepare('
            SELECT s.*, ss.meta_title, ss.meta_description, ss.keywords, ss.og_title, ss.og_description, ss.image_alt_text, ss.image_title_tag, ss.schema_type as seo_schema_type,
                   c.name as category_name
            FROM services s
            LEFT JOIN service_seo ss ON ss.service_id = s.id
            LEFT JOIN categories c ON c.id = s.category_id
            WHERE s.id = ?
        ');
        $service->execute([$id]);
        $svc = $service->fetch();
        if (!$svc) jsonResponse(['error' => 'غير موجود'], 404);

        $imgs = $db->prepare('SELECT g.*, ise.alt_text, ise.title_tag, ise.caption FROM gallery_images g LEFT JOIN image_seo ise ON ise.image_id = g.id WHERE g.service_id = ? ORDER BY g.sort_order ASC');
        $imgs->execute([$id]);
        $svc['images'] = $imgs->fetchAll();
        jsonResponse($svc);
    }

    if ($method === 'PATCH') {
        $user = requireAuth();
        $input = json_decode(file_get_contents('php://input'), true);
        $seo = $input['seo'] ?? null;
        unset($input['seo'], $input['id'], $input['createdAt'], $input['created_at'], $input['updatedAt'], $input['updated_at']);
        if (isset($input['categoryId']) && $input['categoryId'] === '') $input['categoryId'] = null;

        if (!empty($input)) {
            $sets = implode(', ', array_map(fn($k) => "$k = ?", array_keys($input)));
            $db->prepare("UPDATE services SET $sets WHERE id = $id")->execute(array_values($input));
        }

        if ($seo) {
            unset($seo['id'], $seo['updatedAt'], $seo['updated_at']);
            $existing = $db->prepare('SELECT id FROM service_seo WHERE service_id = ?');
            $existing->execute([$id]);
            if ($existing->fetch()) {
                unset($seo['service_id']);
                $sets = implode(', ', array_map(fn($k) => "$k = ?", array_keys($seo)));
                $db->prepare("UPDATE service_seo SET $sets WHERE service_id = $id")->execute(array_values($seo));
            } else {
                $seo['service_id'] = $id;
                $cols = implode(', ', array_keys($seo));
                $vals = implode(', ', array_fill(0, count($seo), '?'));
                $db->prepare("INSERT INTO service_seo ($cols) VALUES ($vals)")->execute(array_values($seo));
            }
        }

        jsonResponse(['success' => true]);
    }

    if ($method === 'DELETE') {
        $user = requireAuth();
        $db->prepare('DELETE FROM services WHERE id = ?')->execute([$id]);
        jsonResponse(['success' => true]);
    }
}

// ── الفئات ──
if ($path === 'categories') {
    if ($method === 'GET') {
        $user = requireAuth();
        $categories = $db->query('
            SELECT c.*, 
                   (SELECT COUNT(*) FROM services WHERE category_id = c.id) as service_count,
                   (SELECT COUNT(*) FROM _GalleryImageToCategory WHERE category_id = c.id) as image_count
            FROM categories c ORDER BY c.sort_order ASC
        ')->fetchAll();
        jsonResponse($categories);
    }

    if ($method === 'POST') {
        $user = requireAuth();
        $input = json_decode(file_get_contents('php://input'), true);
        $name = $input['name'] ?? '';
        $slug = $input['slug'] ?? '';
        if (!$name || !$slug) jsonResponse(['error' => 'الاسم والـ slug مطلوبان'], 400);

        try {
            $db->prepare('INSERT INTO categories (name, slug, description, image_url, sort_order) VALUES (?, ?, ?, ?, ?)')
               ->execute([$name, $slug, $input['description'] ?? null, $input['imageUrl'] ?? null, $input['sortOrder'] ?? 0]);
            jsonResponse(['success' => true, 'id' => $db->lastInsertId()], 201);
        } catch (PDOException $e) {
            if ($e->getCode() == 23000) jsonResponse(['error' => 'Slug موجود مسبقاً'], 409);
            jsonResponse(['error' => 'فشل إنشاء الفئة'], 500);
        }
    }

    if ($method === 'PUT') {
        $user = requireAuth();
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $input['id'] ?? 0;
        if (!$id) jsonResponse(['error' => 'معرف الفئة مطلوب'], 400);

        try {
            $db->prepare('UPDATE categories SET name=?, slug=?, description=?, image_url=?, sort_order=? WHERE id=?')
               ->execute([$input['name'], $input['slug'], $input['description'] ?? null, $input['imageUrl'] ?? null, $input['sortOrder'] ?? 0, $id]);
            jsonResponse(['success' => true]);
        } catch (PDOException $e) {
            if ($e->getCode() == 23000) jsonResponse(['error' => 'Slug موجود مسبقاً'], 409);
            jsonResponse(['error' => 'فشل تحديث الفئة'], 500);
        }
    }

    if ($method === 'DELETE') {
        $user = requireAuth();
        $id = (int)($_GET['id'] ?? 0);
        if (!$id) jsonResponse(['error' => 'معرف الفئة مطلوب'], 400);
        $db->prepare('DELETE FROM categories WHERE id = ?')->execute([$id]);
        jsonResponse(['success' => true]);
    }
}

// ── المعرض ──
if ($path === 'gallery') {
    if ($method === 'GET') {
        $user = requireAuth();
        $images = $db->query('
            SELECT g.*, ise.alt_text, ise.title_tag, ise.caption
            FROM gallery_images g
            LEFT JOIN image_seo ise ON ise.image_id = g.id
            ORDER BY g.created_at DESC
        ')->fetchAll();

        // إضافة الفئات لكل صورة
        foreach ($images as &$img) {
            $cats = $db->prepare('SELECT category_id FROM _GalleryImageToCategory WHERE gallery_image_id = ?');
            $cats->execute([$img['id']]);
            $img['categoryIds'] = array_column($cats->fetchAll(), 'category_id');
        }

        jsonResponse($images);
    }

    if ($method === 'POST') {
        $user = requireAuth();
        $input = json_decode(file_get_contents('php://input'), true);
        $images = is_array($input) && isset($input[0]) ? $input : [$input];

        $created = [];
        foreach ($images as $img) {
            $seo = $img['seo'] ?? null;
            $categoryIds = $img['categoryIds'] ?? [];
            unset($img['seo'], $img['categoryIds'], $img['id'], $img['createdAt'], $img['created_at']);
            if (isset($img['serviceId']) && $img['serviceId'] === '') $img['serviceId'] = null;

            $cols = implode(', ', array_keys($img));
            $vals = implode(', ', array_fill(0, count($img), '?'));
            $db->prepare("INSERT INTO gallery_images ($cols) VALUES ($vals)")->execute(array_values($img));
            $imageId = $db->lastInsertId();

            if ($categoryIds) {
                $stmt = $db->prepare('INSERT INTO _GalleryImageToCategory (gallery_image_id, category_id) VALUES (?, ?)');
                foreach ($categoryIds as $catId) {
                    $stmt->execute([$imageId, $catId]);
                }
            }

            if ($seo) {
                unset($seo['id'], $seo['updatedAt'], $seo['updated_at']);
                $seo['image_id'] = $imageId;
                $cols = implode(', ', array_keys($seo));
                $vals = implode(', ', array_fill(0, count($seo), '?'));
                $db->prepare("INSERT INTO image_seo ($cols) VALUES ($vals)")->execute(array_values($seo));
            }

            $created[] = ['id' => $imageId];
        }

        jsonResponse($created, 201);
    }
}

// صورة واحدة
if (preg_match('/^gallery\/(\d+)$/', $path, $m)) {
    $id = (int)$m[1];

    if ($method === 'PATCH') {
        $user = requireAuth();
        $input = json_decode(file_get_contents('php://input'), true);
        $seo = $input['seo'] ?? null;
        $categoryIds = $input['categoryIds'] ?? null;
        unset($input['seo'], $input['categoryIds'], $input['id'], $input['createdAt'], $input['created_at']);

        if (!empty($input)) {
            $sets = implode(', ', array_map(fn($k) => "$k = ?", array_keys($input)));
            $db->prepare("UPDATE gallery_images SET $sets WHERE id = $id")->execute(array_values($input));
        }

        if ($categoryIds !== null) {
            $db->prepare('DELETE FROM _GalleryImageToCategory WHERE gallery_image_id = ?')->execute([$id]);
            $stmt = $db->prepare('INSERT INTO _GalleryImageToCategory (gallery_image_id, category_id) VALUES (?, ?)');
            foreach ($categoryIds as $catId) {
                $stmt->execute([$id, $catId]);
            }
        }

        if ($seo) {
            unset($seo['id'], $seo['updatedAt'], $seo['updated_at']);
            $existing = $db->prepare('SELECT id FROM image_seo WHERE image_id = ?');
            $existing->execute([$id]);
            if ($existing->fetch()) {
                unset($seo['image_id']);
                $sets = implode(', ', array_map(fn($k) => "$k = ?", array_keys($seo)));
                $db->prepare("UPDATE image_seo SET $sets WHERE image_id = $id")->execute(array_values($seo));
            } else {
                $seo['image_id'] = $id;
                $cols = implode(', ', array_keys($seo));
                $vals = implode(', ', array_fill(0, count($seo), '?'));
                $db->prepare("INSERT INTO image_seo ($cols) VALUES ($vals)")->execute(array_values($seo));
            }
        }

        jsonResponse(['success' => true]);
    }

    if ($method === 'DELETE') {
        $user = requireAuth();
        // حذف ملف الصورة
        $img = $db->prepare('SELECT image_url FROM gallery_images WHERE id = ?');
        $img->execute([$id]);
        $row = $img->fetch();
        if ($row && $row['image_url']) {
            $filepath = __DIR__ . '/../..' . $row['image_url'];
            if (file_exists($filepath)) unlink($filepath);
        }
        $db->prepare('DELETE FROM gallery_images WHERE id = ?')->execute([$id]);
        jsonResponse(['success' => true]);
    }
}

// ── الإحصائيات ──
if ($path === 'stats') {
    $user = requireAuth();
    $galleryCount = $db->query('SELECT COUNT(*) FROM gallery_images')->fetchColumn();
    $publishedServices = $db->query("SELECT COUNT(*) FROM services WHERE status = 'published'")->fetchColumn();
    $totalServices = $db->query('SELECT COUNT(*) FROM services')->fetchColumn();
    $contactClicks = $db->query('SELECT COUNT(*) FROM contact_clicks')->fetchColumn();
    $whatsappClicks = $db->query("SELECT COUNT(*) FROM contact_clicks WHERE click_type = 'whatsapp'")->fetchColumn();
    $recentClicks = $db->query("SELECT COUNT(*) FROM contact_clicks WHERE clicked_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)")->fetchColumn();
    $settings = $db->query('SELECT site_name, total_projects FROM site_settings LIMIT 1')->fetch();

    jsonResponse([
        'galleryCount' => (int)$galleryCount,
        'servicesCount' => (int)$publishedServices,
        'totalServicesCount' => (int)$totalServices,
        'contactClicksCount' => (int)$contactClicks,
        'whatsappClicksCount' => (int)$whatsappClicks,
        'recentClicks' => (int)$recentClicks,
        'visitsCount' => (int)($settings['total_projects'] ?? 0),
        'siteName' => $settings['site_name'] ?? 'الخدمات المقدمة',
    ]);
}

// ── رفع الصور ──
if ($path === 'upload') {
    if ($method === 'POST') {
        $user = requireAuth();
        if (empty($_FILES['file'])) {
            jsonResponse(['error' => 'لم يتم إرسال ملف'], 400);
        }

        $file = $_FILES['file'];
        $folder = $_POST['folder'] ?? 'general';
        $allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!in_array($file['type'], $allowed)) {
            jsonResponse(['error' => 'نوع ملف غير مسموح'], 400);
        }

        if ($file['size'] > MAX_UPLOAD_SIZE) {
            jsonResponse(['error' => 'حجم الملف كبير جداً'], 400);
        }

        $uploadDir = UPLOAD_DIR . '/' . $folder;
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

        $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
        $timestamp = time();
        $randomStr = substr(bin2hex(random_bytes(3)), 0, 6);
        $filename = "$timestamp-$randomStr.webp";
        $filepath = "$uploadDir/$filename";

        // تحويل إلى WebP باستخدام GD
        $srcImg = null;
        switch ($file['type']) {
            case 'image/jpeg': $srcImg = imagecreatefromjpeg($file['tmp_name']); break;
            case 'image/png': $srcImg = imagecreatefrompng($file['tmp_name']); break;
            case 'image/webp': $srcImg = imagecreatefromwebp($file['tmp_name']); break;
            case 'image/gif': $srcImg = imagecreatefromgif($file['tmp_name']); break;
        }

        if ($srcImg) {
            // تصغير إذا أكبر من 1920x1080
            $w = imagesx($srcImg);
            $h = imagesy($srcImg);
            if ($w > 1920 || $h > 1080) {
                $ratio = min(1920 / $w, 1080 / $h);
                $newW = (int)($w * $ratio);
                $newH = (int)($h * $ratio);
                $resized = imagecreatetruecolor($newW, $newH);
                imagecopyresampled($resized, $srcImg, 0, 0, 0, 0, $newW, $newH, $w, $h);
                imagewebp($resized, $filepath, 85);
                imagedestroy($resized);
            } else {
                imagewebp($srcImg, $filepath, 85);
            }
            imagedestroy($srcImg);
        } else {
            move_uploaded_file($file['tmp_name'], $filepath);
        }

        $publicUrl = "/uploads/$folder/$filename";
        jsonResponse(['success' => true, 'url' => $publicUrl, 'filename' => $filename, 'format' => 'webp']);
    }

    if ($method === 'DELETE') {
        $user = requireAuth();
        $url = $_GET['url'] ?? '';
        if (!$url) jsonResponse(['error' => 'لم يتم تحديد ملف'], 400);
        $filepath = __DIR__ . '/../..' . $url;
        if (file_exists($filepath) && strpos(realpath($filepath), realpath(UPLOAD_DIR)) === 0) {
            unlink($filepath);
        }
        jsonResponse(['success' => true]);
    }
}

jsonResponse(['error' => 'مسار غير معروف'], 404);
