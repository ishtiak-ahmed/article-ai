import {pgTable, text, varchar, timestamp, jsonb, uuid} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { sql } from "drizzle-orm";

// User Schema
export const users = pgTable('users', {
    id: uuid('id').notNull().primaryKey().defaultRandom().unique(),
    firstName: varchar('first_name', { length: 255 }).notNull(),
    lastName: varchar('last_name', { length: 255 }).notNull(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    avatar: text('avatar'),
    role: text('role').default('USER'),
    createdAt: timestamp('created_at', {
        withTimezone: true,
    }).defaultNow(),
    updatedAt: timestamp('updated_at', {
        withTimezone: true,
    }).defaultNow().$onUpdate(() => sql`now()`),
});

// Article Schema
export const articles = pgTable('articles', {
    id: uuid('id').notNull().primaryKey().defaultRandom().unique(),
    title: varchar('title', { length: 255 }).notNull(),
    content: text('content').notNull(),
    images: jsonb('images').notNull().default([]),
    summary: text('summary').notNull(),
    tags: jsonb('tags').notNull().default([]),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', {
        withTimezone: true,
    }).defaultNow(),
    updatedAt: timestamp('updated_at', {
        withTimezone: true,
    }).defaultNow().$onUpdate(() => sql`now()`),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
    articles: many(articles),
}));

export const articlesRelations = relations(articles, ({ one }) => ({
    user: one(users, {
        fields: [articles.userId],
        references: [users.id],
    }),
}));