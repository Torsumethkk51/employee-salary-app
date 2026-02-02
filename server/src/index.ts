import { Elysia } from "elysia";

const port = process.env.PORT || 3000;
const app = new Elysia()

.get("/", () => "Hello, Elysia!")

.listen(port);

console.log(`Elysia server is running on port ${app.server?.port}`);