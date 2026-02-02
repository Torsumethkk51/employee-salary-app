import { t } from "elysia";

export const createUserBody = t.Object({
  username: t.String(),
  email: t.String(),
  password: t.String()
});