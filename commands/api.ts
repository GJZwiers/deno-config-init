import { Command, EnumType } from "../deps.ts";
import { act } from "./act.ts";

export const template = new EnumType(["opine", "restful_oak", "drash"]);

export const api = new Command()
    .name("api")
    .description("Initialize a Deno RESTful Application Programming Interface (API).")
    .type("template", template)
    .option<{ template: typeof template }>(
    "-t, --template [method:template]",
    "Initialize the RESTful API from a template."
    )
    .action(async ({ editor, force, name, template }) => {
        await act(editor,force, name, template, template.values());
    });
