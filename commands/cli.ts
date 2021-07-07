import { Command, EnumType } from "../deps.ts";
import { act } from "./act.ts";

export const template = new EnumType(["cliffy"]);

export const cli = new Command()
    .name("cli")
    .description("Initialize a Deno Command Line Interface (CLI).")
    .type("template", template)
    .option<{ template: typeof template }>(
    "-t, --template [method:template]",
    "Initialize the CLI from a template."
    )
    .action(async ({ editor, force, name, template }) => {
        await act(editor,force, name, template, template.values());
    });
