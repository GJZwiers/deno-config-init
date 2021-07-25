import { Command, EnumType } from "../deps.ts";
import { act, settings } from "../act.ts";
import { selectTemplate } from "../utils.ts";

export const cliTemplate = new EnumType(["cliffy"]);

/**
 * `deno-init cli` --> prompts template select mode.
 *
 * `deno-init cli --template cliffy` --> creates project with the provided template.
 */
export const cli = new Command()
  .name("cli")
  .description("Initialize a Command Line Interface (CLI).")
  .type("template", cliTemplate)
  .option<{ template: typeof cliTemplate }>(
    "-t, --template [method:template]",
    "Initialize the CLI from a template.",
  )
  .action(async ({ editor, force, name, template }) => {
    settings.force = force;
    settings.path = name ?? ".";
    settings.template = (template) ?? await selectTemplate(cliTemplate.values());
    settings.editor = editor;
    
    await act();
  });
