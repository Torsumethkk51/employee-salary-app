import Elysia from "elysia";
import { db } from "../../database/db";
import { employee } from "../../database/schema";
import { eq } from "drizzle-orm";

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

.get("/:id", async ({ params, set }) => {
  try {
    // validate employee id
    const employeeId = Number(params.id);
    if (!Number.isInteger(employeeId) || employeeId <= 0) {
      set.status = 400;
      return {
        message: "Invalid employee id"
      }
    }

    // fetch employee by id
    const [employeeData] = await db
      .select()
      .from(employee)
      .where(eq(employee.employee_id, employeeId))

    // check if employee not found
    if (!employeeData) {
      set.status = 404;
      return {
        message: "Employee not found"
      }
    }

    return employeeData;
  } catch (error) {
    console.log(error)
    set.status = 500;
    return {
      message: "Internal server error"
    }
  }
})