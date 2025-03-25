ALTER TABLE `entreprise`
ADD COLUMN `slug` varchar(255) NOT NULL,
ADD UNIQUE INDEX `entreprise_slug_unique` (`slug`); 