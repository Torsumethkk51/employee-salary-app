import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  user_id: serial("user_id").primaryKey(),
  username: text("username").notNull(),
  email: text("email").unique().notNull(),
  password: text("password").notNull()
});

export const employee = pgTable("employee", {
  employee_id: serial("employee_id").primaryKey(),
  firstname: text("firstname").notNull(),
  lastname: text("lastname").notNull(),
  nickname: text("nickname"),
  job_titles: text("job_titles"),
  deleted_at: timestamp("deleted_at")
});

export const record = pgTable("record", {
  record_id: serial("record_id").primaryKey(),
  amount: integer("amount").notNull(),
  employee_id: integer("employee_id").notNull()
});