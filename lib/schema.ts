import {
  mysqlTable,
  varchar,
  boolean,
  timestamp,
  int,
  decimal,
  primaryKey,
  text,
} from "drizzle-orm/mysql-core";

import { user } from "@/auth-schema";

export * from "@/auth-schema";

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

export const blog = mysqlTable("blog", {
  id: varchar("id", { length: 255 }).primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  isWrittenByAdmin: boolean("is_written_by_admin").notNull().default(false),
  entrepriseId: varchar("entreprise_id", { length: 255 }).references(
    () => entreprise.id
  ),
});
