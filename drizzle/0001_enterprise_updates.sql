ALTER TABLE `entreprise`
ADD COLUMN `location` varchar(255) NOT NULL DEFAULT 'Chaville, Île-de-France',
ADD COLUMN `status` varchar(50) NOT NULL DEFAULT 'Auto-entrepreneur',
ADD COLUMN `business_hours` json;

CREATE TABLE `reviews` (
  `id` varchar(255) PRIMARY KEY NOT NULL,
  `rating` int NOT NULL,
  `comment` text,
  `entreprise_id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`entreprise_id`) REFERENCES `entreprise`(`id`),
  FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
); 