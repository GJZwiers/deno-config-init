import { Command, EnumType } from "../deps.ts";
import { act } from "../act.ts";
import { settings } from "../settings.ts";
import { selectTemplate } from "../utils.ts";

export const tddTemplate = new EnumType(["deno", "rhum", "rhum_integration"]);

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
  .action(async ({ cache, editor, force, name, template }) => {
    settings.cache = cache;
    settings.force = force;
    settings.path = name ?? ".";
    settings.template = (template) ??
      await selectTemplate(tddTemplate.values());
    settings.editor = editor;

    await act();
  });
