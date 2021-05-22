export const entrypoint = 
`import {
  Application,
  Router
} from "./deps.ts";
import type {
  RouterContext
} from "./deps.ts";

const router = new Router();
router
.get("/", (context: RouterContext) => {
  context.response.body = "Hello world!";
});

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener("listen", ({ hostname, port }) => {
  console.log("Listening on " + hostname + ':' + port);
});

await app.listen({ hostname: "127.0.0.1", port: 8000 });`;

export const deps = `export {
Application,
Router,
} from "https://deno.land/x/oak/mod.ts";
export type {
RouterContext,
} from "https://deno.land/x/oak/mod.ts";`;
