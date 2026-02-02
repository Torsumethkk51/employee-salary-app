import Elysia from "elysia";
import { db } from "../../database/db";
import { user } from "../../database/schema";
import { eq } from "drizzle-orm";

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

.get("/:id", async ({ params, set }) => {
  try {
    const userId = Number(params.id);
    if (Number.isNaN(userId)) {
      set.status = 404;
      return {
        message: "Invalid user id"
      }
    }

    const result = await db
      .select()
      .from(user)
      .where(eq(user.user_id, userId))

    if (result.length === 0) {
      set.status = 404;
      return {
        message: "User not found"
      }
    }

    return result;
  } catch (error) {
    console.error(error);
    set.status = 500;
    return {
      message: "Internal server error"
    }
  }
})