CREATE TABLE `authorization_code` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` char(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_at` datetime NOT NULL,
  `redirect_uri` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `client_id` char(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` char(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `create_datetime` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_datetime` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code_UNIQUE` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `oauth_app` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `client_id` char(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `client_secret` char(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `access_token_lifetime` int(11) DEFAULT NULL,
  `refresh_token_lifetime` int(11) DEFAULT NULL,
  `grants` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `redirect_uris` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `create_datetime` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_datetime` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_oauth_app_client_id` (`client_id`),
  UNIQUE KEY `idx_oauth_app_client_secret` (`client_secret`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `oauth_token` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `access_token` char(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `access_token_expires_at` datetime NOT NULL,
  `refresh_token` char(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `refresh_token_expires_at` datetime NOT NULL,
  `scope` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `client_id` char(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` char(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `create_datetime` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_datetime` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_oauth_token_access_token` (`access_token`),
  UNIQUE KEY `idx_oauth_token_refresh_token` (`refresh_token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `user` (
  `user_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `group_id` int(11) NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pin` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quit_datetime` datetime DEFAULT NULL,
  `create_datetime` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
