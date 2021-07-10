import { Command, EnumType } from "../deps.ts";
import { act, chooseTemplate, settings } from "../act.ts";

export const tddTemplate = new EnumType(["deno", "rhum"]);

/**
 * `deno-init tdd` --> prompts template select mode.
 *
 * `deno-init tdd --template rhum` --> creates project with the provided template.
 */
export const tdd = new Command()
  .name("tdd")
  .description("Initialize a test-driven project.")
  .type("template", tddTemplate)
  .option<{ template: typeof tddTemplate }>(
    "-t, --template [method:template]",
    "Initialize the test-driven project from a template.",
  )
  .action(async ({ editor, force, name, template }) => {
    settings.force = force;

    if (!template) {
      template = await chooseTemplate(template, tddTemplate.values());
    }

    await act(editor, name, template);
  });
