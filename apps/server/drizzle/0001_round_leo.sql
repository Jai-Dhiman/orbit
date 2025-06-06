CREATE TABLE `notes` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`tags` text,
	`archived` integer DEFAULT 0 NOT NULL,
	`favorite` integer DEFAULT 0 NOT NULL,
	`created_at` numeric DEFAULT '2025-06-06T16:57:11.565Z' NOT NULL,
	`updated_at` numeric DEFAULT '2025-06-06T16:57:11.565Z' NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `notes_user_id_idx` ON `notes` (`user_id`);--> statement-breakpoint
CREATE INDEX `notes_created_at_idx` ON `notes` (`created_at`);--> statement-breakpoint
CREATE INDEX `notes_archived_idx` ON `notes` (`archived`);--> statement-breakpoint
CREATE INDEX `notes_favorite_idx` ON `notes` (`favorite`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_oauth_accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`provider` text NOT NULL,
	`provider_account_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`expires_at` integer,
	`created_at` numeric DEFAULT '2025-06-06T16:57:11.564Z' NOT NULL,
	`updated_at` numeric DEFAULT '2025-06-06T16:57:11.564Z' NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_oauth_accounts`("id", "user_id", "provider", "provider_account_id", "access_token", "refresh_token", "id_token", "expires_at", "created_at", "updated_at") SELECT "id", "user_id", "provider", "provider_account_id", "access_token", "refresh_token", "id_token", "expires_at", "created_at", "updated_at" FROM `oauth_accounts`;--> statement-breakpoint
DROP TABLE `oauth_accounts`;--> statement-breakpoint
ALTER TABLE `__new_oauth_accounts` RENAME TO `oauth_accounts`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `provider_provider_account_id_idx` ON `oauth_accounts` (`provider`,`provider_account_id`);--> statement-breakpoint
CREATE TABLE `__new_profile` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`first_name` text,
	`last_name` text,
	`bio` text,
	`location` text,
	`website` text,
	`timezone` text,
	`preferences` text,
	`created_at` numeric DEFAULT '2025-06-06T16:57:11.564Z' NOT NULL,
	`updated_at` numeric DEFAULT '2025-06-06T16:57:11.564Z' NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_profile`("id", "user_id", "first_name", "last_name", "bio", "location", "website", "timezone", "preferences", "created_at", "updated_at") SELECT "id", "user_id", "first_name", "last_name", "bio", "location", "website", "timezone", "preferences", "created_at", "updated_at" FROM `profile`;--> statement-breakpoint
DROP TABLE `profile`;--> statement-breakpoint
ALTER TABLE `__new_profile` RENAME TO `profile`;--> statement-breakpoint
CREATE TABLE `__new_user_activity` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`event_type` text NOT NULL,
	`metadata` text,
	`created_at` numeric DEFAULT '2025-06-06T16:57:11.565Z' NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_user_activity`("id", "user_id", "event_type", "metadata", "created_at") SELECT "id", "user_id", "event_type", "metadata", "created_at" FROM `user_activity`;--> statement-breakpoint
DROP TABLE `user_activity`;--> statement-breakpoint
ALTER TABLE `__new_user_activity` RENAME TO `user_activity`;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text,
	`name` text,
	`picture` text,
	`email_verified` integer DEFAULT 0 NOT NULL,
	`phone` text,
	`created_at` numeric DEFAULT '2025-06-06T16:57:11.553Z' NOT NULL,
	`updated_at` numeric DEFAULT '2025-06-06T16:57:11.562Z' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "email", "name", "picture", "email_verified", "phone", "created_at", "updated_at") SELECT "id", "email", "name", "picture", "email_verified", "phone", "created_at", "updated_at" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);