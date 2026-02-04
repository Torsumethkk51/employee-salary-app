import Elysia from "elysia";
import { db } from "../../database/db";
import { employee } from "../../database/schema";
import { eq } from "drizzle-orm";
import { type createBodyValue, createBody, updateBody, updateBodyValue } from "../../types/employeeController";

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

.post("/", async ({ body, set }) => {
  try {
    const firstname = body.firstname.trim();
    const lastname = body.lastname.trim();

    // validate request body
    if (!firstname) {
      set.status = 400;
      return {
        message: "Firstname is required"
      }
    }

    if (!lastname) {
      set.status = 400;
      return {
        message: "Lastname is required"
      }
    }

    // prepare request body
    const bodyValue: createBodyValue = {
      firstname: firstname,
      lastname: lastname
    }

    // handle optional fields
    if (body.nickname) {
      bodyValue.nickname = body.nickname.trim();
    }

    if (body.job_titles) {
      bodyValue.job_titles = body.job_titles.trim();
    }

    // create employee
    await db
      .insert(employee)
      .values(bodyValue);

    set.status = 201;
    return {
      message: "Created employee successfully!"
    }
  } catch (error) {
    console.error(error)
    set.status = 500;
    return {
      message: "Internal server error"
    }
  }
}, {
  body: createBody
})

.patch("/:id", async ({ params, body, set }) => {
  try {
    // validate employee id
    const employeeId = Number(params.id);
    if (!Number.isInteger(employeeId) || employeeId <= 0) {
      set.status = 400;
      return {
        message: "Invalid employee id"
      }
    }

    // handle empty request body
    if (Object.keys(body).length === 0) {
      set.status = 400;
      return {
        message: "No fields to update"
      }
    }

    const firstname = body.firstname;
    const lastname = body.lastname;
    const nickname = body.nickname;
    const jobTitles = body.job_titles;

    // prepare request body
    const bodyValue: updateBodyValue = {}

    // handle optional fields
    if (firstname?.trim()) {
      bodyValue.firstname = firstname.trim();
    }

    if (lastname) {
      bodyValue.lastname = lastname.trim();
    }

    if (nickname) {
      bodyValue.nickname = nickname.trim();
    }

    if (jobTitles) {
      bodyValue.job_titles = jobTitles.trim();
    }

    // handle empty body value
    if (Object.keys(bodyValue).length === 0) {
      set.status = 400;
      return {
        message: "No fields to update"
      }
    }

    // update employee by id
    const updatedEmployee = await db
      .update(employee)
      .set(bodyValue)
      .where(eq(employee.employee_id, employeeId))
      .returning();

    // handle employee not found
    if (updatedEmployee.length === 0) {
      set.status = 404;
      return {
        message: "Employee not found"
      }
    }

    return {
      message: "Updated employee successfully!"
    }
  } catch (error) {
    console.error(error)
    set.status = 500;
    return {
      message: "Internal server error"
    }
  }
}, {
  body: updateBody
})

.delete("/:id", async ({ params, set }) => {
  try {
    // validate employee id
    const employeeId = Number(params.id);
    if (!Number.isInteger(employeeId) || employeeId <= 0) {
      set.status = 400;
      return {
        message: "Invalid employee id"
      }
    }

    // employee soft delete
    const deletedEmployee = await db
      .update(employee)
      .set({ deleted_at: new Date() })
      .where(eq(employee.employee_id, employeeId))
      .returning();

    // handle employee not found
    if (deletedEmployee.length === 0) {
      set.status = 404;
      return {
        message: "Employee not found"
      }
    }

    return {
      message: "Employee is moved to recybin bin"
    }
  } catch (error) {
    console.error(error)
    set.status = 500;
    return {
      message: "Internal server error"
    }
  }
})