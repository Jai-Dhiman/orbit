import { sqliteTable, text, integer, numeric, index } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").unique(),
  name: text("name"),
  picture: text("picture"),
  emailVerified: integer("email_verified").default(0).notNull(),
  phone: text("phone"),
  createdAt: numeric("created_at").default(new Date().toISOString()).notNull(),
  updatedAt: numeric("updated_at").default(new Date().toISOString()).notNull(),
});

export const oauthAccounts = sqliteTable("oauth_accounts", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  provider: text("provider").notNull(), // 'google' | 'apple'
  providerAccountId: text("provider_account_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  expiresAt: integer("expires_at"),
  createdAt: numeric("created_at").default(new Date().toISOString()).notNull(),
  updatedAt: numeric("updated_at").default(new Date().toISOString()).notNull(),
}, (table) => ({
  providerProviderAccountIdIdx: index("provider_provider_account_id_idx").on(table.provider, table.providerAccountId),
}));

export const profile = sqliteTable("profile", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  firstName: text("first_name"),
  lastName: text("last_name"),
  bio: text("bio"),
  location: text("location"),
  website: text("website"),
  timezone: text("timezone"),
  preferences: text("preferences"), // JSON string
  createdAt: numeric("created_at").default(new Date().toISOString()).notNull(),
  updatedAt: numeric("updated_at").default(new Date().toISOString()).notNull(),
});

export const userActivity = sqliteTable("user_activity", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  eventType: text("event_type").notNull(), // 'login', 'logout', 'profile_update', etc.
  metadata: text("metadata"), // JSON string for additional data
  createdAt: numeric("created_at").default(new Date().toISOString()).notNull(),
});

export const notes = sqliteTable("notes", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  tags: text("tags"), // JSON array of strings
  archived: integer("archived").default(0).notNull(), // 0 = false, 1 = true
  favorite: integer("favorite").default(0).notNull(), // 0 = false, 1 = true
  createdAt: numeric("created_at").default(new Date().toISOString()).notNull(),
  updatedAt: numeric("updated_at").default(new Date().toISOString()).notNull(),
}, (table) => ({
  userIdIdx: index("notes_user_id_idx").on(table.userId),
  createdAtIdx: index("notes_created_at_idx").on(table.createdAt),
  archivedIdx: index("notes_archived_idx").on(table.archived),
  favoriteIdx: index("notes_favorite_idx").on(table.favorite),
}));

export const calendarEvents = sqliteTable("calendar_events", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  startTime: numeric("start_time").notNull(),
  endTime: numeric("end_time").notNull(),
  isAllDay: integer("is_all_day").default(0).notNull(),
  rrule: text("rrule"),
  createdAt: numeric("created_at").default(new Date().toISOString()).notNull(),
  updatedAt: numeric("updated_at").default(new Date().toISOString()).notNull(),
}, (table) => ({
  userIdIdx: index("calendar_events_user_id_idx").on(table.userId),
  startTimeIdx: index("calendar_events_start_time_idx").on(table.startTime),
}));