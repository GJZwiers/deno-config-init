export const entrypoint = 
`import { Application } from "./deps.\${extension}";

const app = new Application();

app.use((context: any) => {
  context.response.body = "Hello world!";
});

await app.listen("127.0.0.1:8000");
`;

export const deps = `export { Application } from "https://deno.land/x/oak/mod.ts";\n`;