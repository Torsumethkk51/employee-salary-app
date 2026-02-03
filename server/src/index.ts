import { Elysia } from "elysia";
import { userControllers } from "./controllers/user";
import { employeeController } from "./controllers/employee";

const port = process.env.PORT || 3000;
const app = new Elysia()

.get("/", () => "Hello, Elysia!")
.use(userControllers)
.use(employeeController)

.listen(port);

console.log(`Elysia server is running on port ${app.server?.port}`);