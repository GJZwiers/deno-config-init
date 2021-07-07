import { Command, EnumType } from "../deps.ts";
import { act, chooseTemplate } from "./act.ts";

export const tddTemplate = new EnumType(["deno", "rhum"]);

export const tdd = new Command()
    .name("tdd")
    .description("Initialize a test-driven project.")
    .type("template", tddTemplate)
    .option<{ template: typeof tddTemplate }>(
        "-t, --template [method:template]",
        "Initialize the test-driven project from a template."
    )
    .action(async ({ editor, force, name, template }) => {
        const choice = await chooseTemplate(template, tddTemplate.values());
        await act(editor, force, name, choice ?? template);
    });
