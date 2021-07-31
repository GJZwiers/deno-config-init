import { Command, EnumType } from "../deps.ts";
import { act } from "../act.ts";
import { settings } from "../settings.ts";
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
  .action(async ({ cache, force, name, template }) => {
    settings.cache = cache;
    settings.force = force;
    settings.path = name ?? ".";
    settings.template = (template) ??
      await selectTemplate(cliTemplate.values());

    await act();
  });
