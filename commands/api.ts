import { Command, EnumType } from "../deps.ts";
import { act, chooseTemplate, settings } from "../act.ts";

export const apiTemplate = new EnumType(["opine", "restful_oak"]);

/**
 * `deno-init api` --> prompts template select mode.
 *
 * `deno-init api --template opine` --> creates project with the provided template.
 */
export const api = new Command()
  .name("api")
  .description(
    "Initialize a RESTful Application Programming Interface (API).",
  )
  .type("template", apiTemplate)
  .option<{ template: typeof apiTemplate }>(
    "-t, --template [method:template]",
    "Initialize the RESTful API from a template.",
  )
  .action(async ({ editor, force, name, template }) => {
    settings.force = force;
    settings.path = name ?? ".";

    if (!template) {
      template = await chooseTemplate(template, apiTemplate.values());
    }

    await act(editor, name, template);
  });
