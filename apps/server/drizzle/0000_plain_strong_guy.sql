CREATE TABLE `oauth_accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`provider` text NOT NULL,
	`provider_account_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`expires_at` integer,
	`created_at` numeric DEFAULT '2025-06-05T02:53:20.866Z' NOT NULL,
	`updated_at` numeric DEFAULT '2025-06-05T02:53:20.866Z' NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `provider_provider_account_id_idx` ON `oauth_accounts` (`provider`,`provider_account_id`);--> statement-breakpoint
CREATE TABLE `profile` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`first_name` text,
	`last_name` text,
	`bio` text,
	`location` text,
	`website` text,
	`timezone` text,
	`preferences` text,
	`created_at` numeric DEFAULT '2025-06-05T02:53:20.867Z' NOT NULL,
	`updated_at` numeric DEFAULT '2025-06-05T02:53:20.867Z' NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user_activity` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`event_type` text NOT NULL,
	`metadata` text,
	`created_at` numeric DEFAULT '2025-06-05T02:53:20.867Z' NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text,
	`name` text,
	`picture` text,
	`email_verified` integer DEFAULT 0 NOT NULL,
	`phone` text,
	`created_at` numeric DEFAULT '2025-06-05T02:53:20.854Z' NOT NULL,
	`updated_at` numeric DEFAULT '2025-06-05T02:53:20.865Z' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);