import { Elysia } from "elysia";
import { userControllers } from "./controllers/user";

const port = process.env.PORT || 3000;
const app = new Elysia()

.get("/", () => "Hello, Elysia!")
.use(userControllers)

.listen(port);

console.log(`Elysia server is running on port ${app.server?.port}`);