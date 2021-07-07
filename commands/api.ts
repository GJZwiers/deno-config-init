import { Command, EnumType } from "../deps.ts";
import { act, chooseTemplate } from "./act.ts";

export const apiTemplate = new EnumType(["opine", "restful_oak", "drash"]);

export const api = new Command()
    .name("api")
    .description("Initialize a Deno RESTful Application Programming Interface (API).")
    .type("template", apiTemplate)
    .option<{ template: typeof apiTemplate }>(
    "-t, --template [method:template]",
    "Initialize the RESTful API from a template."
    )
    .action(async ({ editor, force, name, template }) => {
        const choice = await chooseTemplate(template, apiTemplate.values());
        await act(editor, force, name, choice ?? template);
    });
