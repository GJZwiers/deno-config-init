import { Command, EnumType } from "../deps.ts";
import { act } from "./act.ts";

export const template = new EnumType(["deno", "rhum"]);

export const tdd = new Command()
    .name("tdd")
    .description("Initialize a test-driven project.")
    .type("template", template)
    .option<{ template: typeof template }>(
        "-t, --template [method:template]",
        "Initialize the test-driven project from a template."
    )
    .action(async ({ editor, force, name, template }) => {
        await act(editor,force, name, template, template.values());
    });
