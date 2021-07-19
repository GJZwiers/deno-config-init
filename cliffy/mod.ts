import { Command } from "./deps.ts";

await new Command()
    .name("my-cli")
    .version("0.1.0")
    .description("An awesome new CLI made with Deno")
    .parse(Deno.args);
