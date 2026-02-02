import Elysia from "elysia";
import { db } from "../../database/db";
import { user } from "../../database/schema";

export const userControllers = new Elysia({ prefix: "/users" })

.get("/", async ({ set }) => {
  try {
    const result = await db
      .select()
      .from(user)

    return result;
  } catch (error) {
    console.error(error);
    set.status = 500;
    return {
      message: "Internal server error"
    }
  }
})