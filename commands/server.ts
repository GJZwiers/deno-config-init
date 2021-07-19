import { Command, EnumType } from "../deps.ts";
import { act, chooseTemplate, settings } from "../act.ts";

export const httpServerTemplate = new EnumType(["deno_http", "drash", "oak"]);

/**
 * `deno-init server` --> prompts template select mode.
 *
 * `deno-init server --template oak` --> creates project with the provided template.
 */
export const server = new Command()
  .name("server")
  .description(
    "Initialize an HTTP Server.",
  )
  .type("template", httpServerTemplate)
  .option<{ template: typeof httpServerTemplate }>(
    "-t, --template [method:template]",
    "Initialize the HTTP server from a template.",
  )
  .action(async ({ editor, force, name, template }) => {
    settings.force = force;
    settings.path = name ?? ".";

    if (!template) {
      template = await chooseTemplate(template, httpServerTemplate.values());
    }

    await act(editor, name, template);
  });
