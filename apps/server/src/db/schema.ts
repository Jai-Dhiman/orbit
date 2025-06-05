import { sqliteTable, text, integer, numeric, index, foreignKey, real } from "drizzle-orm/sqlite-core";

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

// Notes and Knowledge Management
export const notes = sqliteTable("notes", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title"),
  content: text("content").notNull(),
  contentType: text("content_type").default("markdown").notNull(), // 'markdown', 'plain', 'rich'
  isPinned: integer("is_pinned").default(0).notNull(),
  isArchived: integer("is_archived").default(0).notNull(),
  aiSummary: text("ai_summary"), // AI-generated summary
  aiKeywords: text("ai_keywords"), // JSON array of AI-extracted keywords
  linkToCalendar: text("link_to_calendar"), // calendar event ID if linked
  sourceType: text("source_type"), // 'manual', 'voice', 'ai_suggestion'
  parentNoteId: text("parent_note_id"), // For note threads/replies
  createdAt: numeric("created_at").default(new Date().toISOString()).notNull(),
  updatedAt: numeric("updated_at").default(new Date().toISOString()).notNull(),
}, (table) => ({
  userIdIdx: index("notes_user_id_idx").on(table.userId),
  createdAtIdx: index("notes_created_at_idx").on(table.createdAt),
  pinnedIdx: index("notes_pinned_idx").on(table.isPinned, table.userId),
}));

// Tags and Categories
export const tags = sqliteTable("tags", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  color: text("color"), // hex color for UI
  description: text("description"),
  isSystemTag: integer("is_system_tag").default(0).notNull(), // AI-created vs user-created
  createdAt: numeric("created_at").default(new Date().toISOString()).notNull(),
}, (table) => ({
  userIdNameIdx: index("tags_user_id_name_idx").on(table.userId, table.name),
}));

// Many-to-many relationship between notes and tags
export const noteTags = sqliteTable("note_tags", {
  id: text("id").primaryKey(),
  noteId: text("note_id").notNull().references(() => notes.id, { onDelete: "cascade" }),
  tagId: text("tag_id").notNull().references(() => tags.id, { onDelete: "cascade" }),
  createdAt: numeric("created_at").default(new Date().toISOString()).notNull(),
}, (table) => ({
  noteIdTagIdIdx: index("note_tags_note_id_tag_id_idx").on(table.noteId, table.tagId),
}));

// Calendar and Events
export const calendarEvents = sqliteTable("calendar_events", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  location: text("location"),
  startTime: numeric("start_time").notNull(), // ISO string
  endTime: numeric("end_time").notNull(), // ISO string
  isAllDay: integer("is_all_day").default(0).notNull(),
  recurrenceRule: text("recurrence_rule"), // RRULE string
  calendarSource: text("calendar_source"), // 'local', 'google', 'apple'
  externalId: text("external_id"), // ID from external calendar
  reminderMinutes: integer("reminder_minutes"), // minutes before event
  linkedNoteId: text("linked_note_id").references(() => notes.id),
  aiGeneratedDescription: text("ai_generated_description"),
  createdAt: numeric("created_at").default(new Date().toISOString()).notNull(),
  updatedAt: numeric("updated_at").default(new Date().toISOString()).notNull(),
}, (table) => ({
  userIdIdx: index("calendar_events_user_id_idx").on(table.userId),
  startTimeIdx: index("calendar_events_start_time_idx").on(table.startTime),
  externalIdIdx: index("calendar_events_external_id_idx").on(table.externalId),
}));

// Tasks and Reminders
export const tasks = sqliteTable("tasks", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  isCompleted: integer("is_completed").default(0).notNull(),
  priority: text("priority").default("medium").notNull(), // 'low', 'medium', 'high', 'urgent'
  dueDate: numeric("due_date"), // ISO string
  completedAt: numeric("completed_at"), // ISO string
  parentTaskId: text("parent_task_id"), // For subtasks
  linkedNoteId: text("linked_note_id").references(() => notes.id),
  linkedEventId: text("linked_event_id").references(() => calendarEvents.id),
  estimatedDurationMinutes: integer("estimated_duration_minutes"),
  actualDurationMinutes: integer("actual_duration_minutes"),
  recurrenceRule: text("recurrence_rule"), // For recurring tasks
  createdAt: numeric("created_at").default(new Date().toISOString()).notNull(),
  updatedAt: numeric("updated_at").default(new Date().toISOString()).notNull(),
}, (table) => ({
  userIdIdx: index("tasks_user_id_idx").on(table.userId),
  dueDateIdx: index("tasks_due_date_idx").on(table.dueDate),
  completedIdx: index("tasks_completed_idx").on(table.isCompleted, table.userId),
}));

// Goals and Objectives
export const goals = sqliteTable("goals", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category"), // 'health', 'career', 'personal', 'financial', etc.
  status: text("status").default("active").notNull(), // 'active', 'completed', 'paused', 'archived'
  targetDate: numeric("target_date"), // ISO string
  priority: text("priority").default("medium").notNull(),
  progressPercentage: integer("progress_percentage").default(0).notNull(),
  aiCoachingNotes: text("ai_coaching_notes"), // AI-generated insights
  parentGoalId: text("parent_goal_id"), // For goal hierarchy
  createdAt: numeric("created_at").default(new Date().toISOString()).notNull(),
  updatedAt: numeric("updated_at").default(new Date().toISOString()).notNull(),
}, (table) => ({
  userIdIdx: index("goals_user_id_idx").on(table.userId),
  statusIdx: index("goals_status_idx").on(table.status, table.userId),
  categoryIdx: index("goals_category_idx").on(table.category, table.userId),
}));

// Habits and Streaks
export const habits = sqliteTable("habits", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  frequency: text("frequency").notNull(), // 'daily', 'weekly', 'monthly'
  frequencyCount: integer("frequency_count").default(1).notNull(), // e.g., 3 times per week
  isActive: integer("is_active").default(1).notNull(),
  currentStreak: integer("current_streak").default(0).notNull(),
  longestStreak: integer("longest_streak").default(0).notNull(),
  totalCompletions: integer("total_completions").default(0).notNull(),
  reminderTime: text("reminder_time"), // Time of day for reminder
  linkedGoalId: text("linked_goal_id").references(() => goals.id),
  createdAt: numeric("created_at").default(new Date().toISOString()).notNull(),
  updatedAt: numeric("updated_at").default(new Date().toISOString()).notNull(),
}, (table) => ({
  userIdIdx: index("habits_user_id_idx").on(table.userId),
  activeIdx: index("habits_active_idx").on(table.isActive, table.userId),
}));

// Habit Completions (for tracking streaks)
export const habitCompletions = sqliteTable("habit_completions", {
  id: text("id").primaryKey(),
  habitId: text("habit_id").notNull().references(() => habits.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  completedDate: numeric("completed_date").notNull(), // ISO string (date only)
  notes: text("notes"), // Optional completion notes
  mood: text("mood"), // Optional mood tracking
  createdAt: numeric("created_at").default(new Date().toISOString()).notNull(),
}, (table) => ({
  habitIdDateIdx: index("habit_completions_habit_id_date_idx").on(table.habitId, table.completedDate),
  userIdDateIdx: index("habit_completions_user_id_date_idx").on(table.userId, table.completedDate),
}));

// AI Conversations and Chat History
export const conversations = sqliteTable("conversations", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title"), // Auto-generated or user-defined
  context: text("context"), // JSON string with conversation context
  isArchived: integer("is_archived").default(0).notNull(),
  createdAt: numeric("created_at").default(new Date().toISOString()).notNull(),
  updatedAt: numeric("updated_at").default(new Date().toISOString()).notNull(),
}, (table) => ({
  userIdIdx: index("conversations_user_id_idx").on(table.userId),
  createdAtIdx: index("conversations_created_at_idx").on(table.createdAt),
}));

export const messages = sqliteTable("messages", {
  id: text("id").primaryKey(),
  conversationId: text("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  role: text("role").notNull(), // 'user', 'assistant', 'system'
  content: text("content").notNull(),
  messageType: text("message_type").default("text").notNull(), // 'text', 'voice', 'suggestion'
  metadata: text("metadata"), // JSON string for additional data
  actionTaken: text("action_taken"), // JSON string for actions performed
  createdAt: numeric("created_at").default(new Date().toISOString()).notNull(),
}, (table) => ({
  conversationIdIdx: index("messages_conversation_id_idx").on(table.conversationId),
  createdAtIdx: index("messages_created_at_idx").on(table.createdAt),
}));

// AI Suggestions
export const aiSuggestions = sqliteTable("ai_suggestions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  suggestionType: text("suggestion_type").notNull(), // 'note_creation', 'task_reminder', 'goal_check', 'habit_nudge'
  title: text("title").notNull(),
  description: text("description"),
  actionData: text("action_data"), // JSON string with action details
  isApplied: integer("is_applied").default(0).notNull(),
  isDismissed: integer("is_dismissed").default(0).notNull(),
  appliedAt: numeric("applied_at"),
  dismissedAt: numeric("dismissed_at"),
  expiresAt: numeric("expires_at"), // When suggestion becomes irrelevant
  priority: integer("priority").default(5).notNull(), // 1-10 scale
  createdAt: numeric("created_at").default(new Date().toISOString()).notNull(),
}, (table) => ({
  userIdIdx: index("ai_suggestions_user_id_idx").on(table.userId),
  typeIdx: index("ai_suggestions_type_idx").on(table.suggestionType, table.userId),
  statusIdx: index("ai_suggestions_status_idx").on(table.isApplied, table.isDismissed, table.userId),
}));

// Vector Embeddings for Semantic Search
export const embeddings = sqliteTable("embeddings", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  contentType: text("content_type").notNull(), // 'note', 'task', 'goal', 'message'
  contentId: text("content_id").notNull(), // ID of the related content
  embedding: text("embedding").notNull(), // JSON array of embedding vector
  metadata: text("metadata"), // JSON string with additional context
  createdAt: numeric("created_at").default(new Date().toISOString()).notNull(),
  updatedAt: numeric("updated_at").default(new Date().toISOString()).notNull(),
}, (table) => ({
  userIdTypeIdx: index("embeddings_user_id_type_idx").on(table.userId, table.contentType),
  contentIdx: index("embeddings_content_idx").on(table.contentType, table.contentId),
}));

// Sync and Conflict Resolution
export const syncLog = sqliteTable("sync_log", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  entityType: text("entity_type").notNull(), // 'note', 'task', 'goal', etc.
  entityId: text("entity_id").notNull(),
  operation: text("operation").notNull(), // 'create', 'update', 'delete'
  deviceId: text("device_id").notNull(),
  syncVersion: integer("sync_version").notNull(),
  conflictResolved: integer("conflict_resolved").default(0).notNull(),
  createdAt: numeric("created_at").default(new Date().toISOString()).notNull(),
}, (table) => ({
  userIdEntityIdx: index("sync_log_user_id_entity_idx").on(table.userId, table.entityType, table.entityId),
  syncVersionIdx: index("sync_log_sync_version_idx").on(table.syncVersion),
}));