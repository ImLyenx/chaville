import {
  mysqlTable,
  varchar,
  boolean,
  timestamp,
  int,
  decimal,
  primaryKey,
} from "drizzle-orm/mysql-core";

export const user = mysqlTable("user", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const session = mysqlTable("session", {
  id: varchar("id", { length: 255 }).primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: varchar("ip_address", { length: 255 }),
  userAgent: varchar("user_agent", { length: 255 }),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => user.id),
});

export const account = mysqlTable("account", {
  id: varchar("id", { length: 255 }).primaryKey(),
  accountId: varchar("account_id", { length: 255 }).notNull(),
  providerId: varchar("provider_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => user.id),
  accessToken: varchar("access_token", { length: 2000 }),
  refreshToken: varchar("refresh_token", { length: 2000 }),
  idToken: varchar("id_token", { length: 2000 }),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: varchar("scope", { length: 255 }),
  password: varchar("password", { length: 255 }),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = mysqlTable("verification", {
  id: varchar("id", { length: 255 }).primaryKey(),
  identifier: varchar("identifier", { length: 255 }).notNull(),
  value: varchar("value", { length: 255 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const entreprise = mysqlTable("entreprise", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: varchar("description", { length: 1000 }).notNull(),
  date: timestamp("date"),
  userId: varchar("user_id", { length: 255 }).references(() => user.id),
});

export const images = mysqlTable("images", {
  id: varchar("id", { length: 255 }).primaryKey(),
  url: varchar("url", { length: 255 }).notNull(),
  alternatif: varchar("alternatif", { length: 255 }).notNull(),
  entrepriseId: varchar("entreprise_id", { length: 255 }).references(
    () => entreprise.id
  ),
});

export const prestation = mysqlTable("prestation", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: varchar("description", { length: 1000 }).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  entrepriseId: varchar("entreprise_id", { length: 255 }).references(
    () => entreprise.id
  ),
});

export const coordonnees = mysqlTable("coordonnees", {
  id: varchar("id", { length: 255 }).primaryKey(),
  type: varchar("type", { length: 255 }).notNull(),
  link: varchar("link", { length: 255 }).notNull(),
  entrepriseId: varchar("entreprise_id", { length: 255 }).references(
    () => entreprise.id
  ),
});
