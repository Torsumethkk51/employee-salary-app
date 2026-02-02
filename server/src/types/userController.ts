import { t } from "elysia";

export const createUserBody = t.Object({
  username: t.String(),
  email: t.String(),
  password: t.String()
});

export const updateUserBody = t.Object({
  username: t.Optional(t.String()),
  email: t.Optional(t.String()),
  password: t.Optional(t.String())
});