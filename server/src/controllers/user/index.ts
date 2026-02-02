import Elysia from "elysia";
import { db } from "../../database/db";
import { user } from "../../database/schema";
import { eq } from "drizzle-orm";
import { createUserBody } from "../../types/userController";

export const userControllers = new Elysia({ prefix: "/users" })

.get("/", async ({ set }) => {
  try {
    const result = await db
      .select({
        user_id: user.user_id,
        username: user.username,
        email: user.email
      })
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

.post("/", async ({ body, set }) => {
  try {
    if (!body.username.trim()) {
      set.status = 400;
      return {
        message: "Username is required"
      }
    }

    if (body.password.length < 8) {
      set.status = 400;
      return {
        message: "Password must be at least 8 characters" 
      };
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const normalizedEmail = body.email.trim().toLowerCase();
    if (!emailPattern.test(normalizedEmail)) {
      set.status = 400;
      return {
        message: "Invalid email format"
      }
    }

    const hashedPassword = await Bun.password.hash(body.password);
    await db
      .insert(user)
      .values({
        username: body.username.trim(),
        email: normalizedEmail,
        password: hashedPassword
      })

    set.status = 201;
    return {
      message: "Created user successfully!",
    }
  } catch (error: any) {
    console.error(error);

    if (error?.code === "23505") {
      set.status = 409;
      return {
        message: "Email already exists"
      }
    }

    set.status = 500;
    return {
      message: "Internal server error"
    }
  }
}, {
  body: createUserBody
})