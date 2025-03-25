import {
  mysqlTable,
  varchar,
  boolean,
  timestamp,
  int,
  decimal,
  primaryKey,
  text,
  json,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

import { user } from "@/auth-schema";

export * from "@/auth-schema";

export const entreprise = mysqlTable("entreprise", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: varchar("description", { length: 1000 }).notNull(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => user.id),
  siret: varchar("siret", { length: 14 }).notNull(),
  sector: varchar("sector", { length: 255 }).notNull(),
  logo: varchar("logo", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 })
    .notNull()
    .default("Chaville, Île-de-France"),
  status: varchar("status", { length: 50 })
    .notNull()
    .default("Auto-entrepreneur"),
  businessHours: json("business_hours").$type<{
    monday?: { open: string; close: string };
    tuesday?: { open: string; close: string };
    wednesday?: { open: string; close: string };
    thursday?: { open: string; close: string };
    friday?: { open: string; close: string };
    saturday?: { open: string; close: string };
    sunday?: { open: string; close: string };
  }>(),
  isValidated: boolean("is_validated").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  date: timestamp("date").defaultNow(),
});

export const entrepriseRelations = relations(entreprise, ({ one }) => ({
  user: one(user, {
    fields: [entreprise.userId],
    references: [user.id],
  }),
}));

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

export const reviews = mysqlTable("reviews", {
  id: varchar("id", { length: 255 }).primaryKey(),
  rating: int("rating").notNull(),
  comment: text("comment"),
  entrepriseId: varchar("entreprise_id", { length: 255 })
    .notNull()
    .references(() => entreprise.id),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => user.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const blog = mysqlTable("blog", {
  id: int("id").primaryKey().autoincrement(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  isWrittenByAdmin: boolean("is_written_by_admin").notNull().default(false),
  isValidated: boolean("is_validated").notNull().default(false),
  entrepriseId: varchar("entreprise_id", { length: 36 }),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});
