import { sqliteTable,text,integer } from 'drizzle-orm/sqlite-core';
export const records=sqliteTable('guitar_records',{id:text('id').primaryKey(),userId:text('user_id').notNull(),kind:text('kind').notNull(),payload:text('payload').notNull(),createdAt:integer('created_at').notNull()});
