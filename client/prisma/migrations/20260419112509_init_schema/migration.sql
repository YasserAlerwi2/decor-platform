-- CreateTable
CREATE TABLE `admin_users` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(50) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(100) NULL,
    `role` ENUM('super_admin', 'admin') NOT NULL DEFAULT 'admin',
    `last_login` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `admin_users_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `site_settings` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `site_name` VARCHAR(100) NOT NULL DEFAULT 'العروي للديكورات',
    `logo_url` TEXT NULL,
    `phone` VARCHAR(20) NULL,
    `whatsapp_url` TEXT NULL,
    `address` VARCHAR(255) NULL,
    `years_experience` TINYINT UNSIGNED NOT NULL DEFAULT 7,
    `total_projects` SMALLINT UNSIGNED NOT NULL DEFAULT 1200,
    `satisfaction_rate` TINYINT UNSIGNED NOT NULL DEFAULT 98,
    `instagram_url` VARCHAR(255) NULL,
    `tiktok_url` VARCHAR(255) NULL,
    `snapchat_url` VARCHAR(255) NULL,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `site_seo` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `site_settings_id` INTEGER UNSIGNED NOT NULL,
    `meta_title` VARCHAR(60) NULL,
    `meta_description` VARCHAR(160) NULL,
    `meta_keywords` TEXT NULL,
    `og_title` VARCHAR(60) NULL,
    `og_description` VARCHAR(200) NULL,
    `og_image_url` TEXT NULL,
    `canonical_url` VARCHAR(255) NULL,
    `robots_directive` VARCHAR(50) NOT NULL DEFAULT 'index, follow',
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `site_seo_site_settings_id_key`(`site_settings_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `analytics_integrations` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `site_settings_id` INTEGER UNSIGNED NOT NULL,
    `google_analytics_id` VARCHAR(30) NULL,
    `google_ads_tag` VARCHAR(30) NULL,
    `search_console_code` VARCHAR(255) NULL,
    `meta_pixel_id` VARCHAR(30) NULL,
    `snap_pixel_id` VARCHAR(30) NULL,
    `header_scripts` TEXT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `analytics_integrations_site_settings_id_key`(`site_settings_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `services` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `hero_image_url` TEXT NULL,
    `status` ENUM('published', 'draft') NOT NULL DEFAULT 'draft',
    `sort_order` TINYINT UNSIGNED NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `services_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `service_seo` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `service_id` INTEGER UNSIGNED NOT NULL,
    `meta_title` VARCHAR(60) NULL,
    `meta_description` VARCHAR(160) NULL,
    `keywords` TEXT NULL,
    `og_title` VARCHAR(60) NULL,
    `og_description` VARCHAR(200) NULL,
    `image_alt_text` VARCHAR(255) NULL,
    `image_title_tag` VARCHAR(255) NULL,
    `schema_type` VARCHAR(50) NOT NULL DEFAULT 'Service',
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `service_seo_service_id_key`(`service_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gallery_images` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `service_id` INTEGER UNSIGNED NULL,
    `image_url` TEXT NOT NULL,
    `title` VARCHAR(150) NULL,
    `category` VARCHAR(100) NULL,
    `sort_order` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `image_seo` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `image_id` INTEGER UNSIGNED NOT NULL,
    `alt_text` VARCHAR(255) NOT NULL DEFAULT '',
    `title_tag` VARCHAR(255) NULL,
    `caption` TEXT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `image_seo_image_id_key`(`image_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contact_clicks` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `click_type` ENUM('whatsapp', 'phone') NOT NULL,
    `source_page` VARCHAR(255) NULL,
    `source_label` VARCHAR(100) NULL,
    `device_type` ENUM('mobile', 'tablet', 'desktop') NULL DEFAULT 'mobile',
    `referrer` VARCHAR(500) NULL,
    `clicked_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `contact_clicks_click_type_idx`(`click_type`),
    INDEX `contact_clicks_clicked_at_idx`(`clicked_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `site_seo` ADD CONSTRAINT `site_seo_site_settings_id_fkey` FOREIGN KEY (`site_settings_id`) REFERENCES `site_settings`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `analytics_integrations` ADD CONSTRAINT `analytics_integrations_site_settings_id_fkey` FOREIGN KEY (`site_settings_id`) REFERENCES `site_settings`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service_seo` ADD CONSTRAINT `service_seo_service_id_fkey` FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `gallery_images` ADD CONSTRAINT `gallery_images_service_id_fkey` FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `image_seo` ADD CONSTRAINT `image_seo_image_id_fkey` FOREIGN KEY (`image_id`) REFERENCES `gallery_images`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
