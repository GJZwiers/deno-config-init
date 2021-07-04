export const entrypoint = 
`import { opine } from "./deps.\${extension}";
import type { Response, Request } from "./deps.\${extension}";

const app = opine();

app.get("/", function(req: Request, res: Response) {
  res.send("Hello World");
});

app.listen(3000, () => console.log("server has started on http://localhost:3000 🚀"));`

export const deps = 
`export { opine } from "https://deno.land/x/opine@1.5.4/mod.ts";
export type { Request, Response } from "https://deno.land/x/opine@1.5.4/mod.ts";`
