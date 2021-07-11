import { Select } from "./deps.ts";
import { vsCodeDebugConfig } from "./configs/debugconfig_vscode.ts";
import { mkdirOrWarn, writeFileOrWarn } from "./utils.ts";
import type { CLIOption, EditorConfigs } from "./types/types.ts";

const encoder = new TextEncoder();
export const defaultModuleContent = encoder.encode("export {};\n");

export const settings = {
  debug: "n",
  depsEntrypoint: "deps.ts",
  depsModule: defaultModuleContent,
  entrypoint: "mod.ts",
  extension: "ts",
  gitignore: ".gitignore",
  module: defaultModuleContent,
  force: false,
  git: true,
};

const editorConfigs: EditorConfigs = {
  "vscode": {
    debugFileContent: encoder.encode(vsCodeDebugConfig),
    debugFile: "launch.json",
    gitignoreContent: encoder.encode(".vscode/\n"),
    settingsDir: ".vscode",
    settingsFile: "settings.json",
    settings: encoder.encode(`{\n\t"deno.enable": true\n}`),
  },
};

export async function chooseTemplate(template: CLIOption, options: string[]) {
  let choice: string | undefined = undefined;
  if (!template) {
    choice = await Select.prompt({
      message: "Choose your template",
      options: options,
    });
  }
  return choice;
}

export async function act(
  editor: string,
  name: CLIOption,
  template?: CLIOption,
) {
  if (template) {
    await fetchTemplate(template);
  }

  if (name) {
    await mkdirOrWarn(name);
    Deno.chdir(name);
  }

  if (settings.git) {
    try {
      const gitinit = Deno.run({
        cmd: ["git", "init"]
      });
    
      await gitinit.status();
      gitinit.close();
    } catch (error) {
      console.warn("Warning: Could not initialize Git repository. Error:" + error);
    }
  }

  // create the entry points
  await writeFileOrWarn(settings.entrypoint, settings.module);
  await writeFileOrWarn(settings.depsEntrypoint, settings.depsModule);

  // create .gitignore
  await writeFileOrWarn(
    settings.gitignore,
    editorConfigs[editor].gitignoreContent,
  );

  // create project settings
  await mkdirOrWarn(editorConfigs[editor].settingsDir);
  Deno.chdir(editorConfigs[editor].settingsDir);

  await writeFileOrWarn(
    editorConfigs[editor].settingsFile,
    editorConfigs[editor].settings,
  );

  // create debug config
  if (settings.debug === "y" || settings.debug === "Y") {
    await writeFileOrWarn(
      editorConfigs[editor].debugFile,
      editorConfigs[editor].debugFileContent,
    );
  }
}

export async function fetchTemplate(template: string) {
  const deps = await Deno.readFile(`./templates/${template}_deps.txt`);
  const entrypoint = await Deno.readFile(
    `./templates/${template}_entrypoint.txt`,
  );

  const decoder = new TextDecoder();

  const placeholderNotEscaped = /(?<!\\)\{\{extension\}\}/g;

  const classModifier = /(?<!\\)\{\{mod:(public|private|protected)\}\}/g;

  const typeAnnotation = /\{\{type(:)([A-Za-z0-9_]*?)\}\}/g;

  settings.module = encoder.encode(
    decoder
      .decode(entrypoint)
      .replace(placeholderNotEscaped, settings.extension)
      .replace(
        typeAnnotation,
        function (_match: string, group1: string, type: string): string {
          return (settings.extension === "ts") ? group1 + " " + type : "";
        },
      )
      .replace(
        classModifier,
        function (_match: string, modifier: string): string {
          return (settings.extension === "ts") ? modifier : "";
        },
      ),
  );
  settings.depsModule = encoder.encode(decoder.decode(deps));
}
