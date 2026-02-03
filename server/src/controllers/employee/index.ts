import Elysia from "elysia";
import { db } from "../../database/db";
import { employee } from "../../database/schema";

export const employeeController = new Elysia({ prefix: "/employee" })

.get("/", async ({ set }) => {
  try {
    const result = await db
      .select()
      .from(employee);

    return result;
  } catch (error) {
    console.log(error)
    set.status = 500;
    return {
      message: "Internal server error"
    }
  }
})