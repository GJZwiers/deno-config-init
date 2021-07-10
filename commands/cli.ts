import { Command, EnumType } from "../deps.ts";
import { act, chooseTemplate, settings } from "../act.ts";

export const cliTemplate = new EnumType(["cliffy"]);

/**
 * `deno-init cli` --> prompts template select mode.  
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
    
    if (!template) {
      template = await chooseTemplate(template, cliTemplate.values());
    }
    
    await act(editor, name, template);
  });
