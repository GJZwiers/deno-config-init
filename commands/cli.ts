import { Command, EnumType } from "../deps.ts";
import { act } from "../init.ts";

export const cliTemplate = new EnumType(["cliffy"]);

export const cli = new Command()
    .name("cli")
    .description("Initialize a Deno Command Line Interface (CLI).")
    .type("template", cliTemplate)
    .option<{ template: typeof cliTemplate }>(
    "-t, --template [method:template]",
    "Initialize the CLI from a template."
    )
    .action(async ({ editor, force, name, template }) => {
        await act(editor,force, name, template, cliTemplate.values());
    });
