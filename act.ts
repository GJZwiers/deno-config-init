import { Select } from "./deps.ts";
import { vsCodeDebugConfig } from "./configs/debugconfig_vscode.ts";
import { mkdirOrWarn, writeFileOrWarn } from "./utils.ts";
import type { CLIOption, EditorConfigs } from "./types/types.ts";
import { copy } from "https://deno.land/std@0.101.0/io/util.ts";

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
  path: ".",
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
  if (settings.path) {
    Deno.mkdir(settings.path);
  }

  if (template) {
    await fetchTemplate(template);
  }

  // if (name) {
  //   await mkdirOrWarn(name);
  //   Deno.chdir(name);
  // }

  // if (settings.git) {
  //   try {
  //     const gitinit = Deno.run({
  //       cmd: ["git", "init"]
  //     });

  //     await gitinit.status();
  //     gitinit.close();
  //   } catch (error) {
  //     console.warn("Warning: Could not initialize Git repository. Error:" + error);
  //   }
  // }

  // create the entry points
  // await writeFileOrWarn(settings.entrypoint, settings.module);
  // await writeFileOrWarn(settings.depsEntrypoint, settings.depsModule);

  // // create .gitignore
  // await writeFileOrWarn(
  //   settings.gitignore,
  //   editorConfigs[editor].gitignoreContent,
  // );

  // // create project settings
  // await mkdirOrWarn(editorConfigs[editor].settingsDir);
  // Deno.chdir(editorConfigs[editor].settingsDir);

  // await writeFileOrWarn(
  //   editorConfigs[editor].settingsFile,
  //   editorConfigs[editor].settings,
  // );

  // // create debug config
  // if (settings.debug === "y" || settings.debug === "Y") {
  //   await writeFileOrWarn(
  //     editorConfigs[editor].debugFile,
  //     editorConfigs[editor].debugFileContent,
  //   );
  // }
}
// ./templates/cliffy
async function traverse(
  currentPath: string,
  decoder: TextDecoder,
  base: string,
) {
  for await (const entry of Deno.readDir(currentPath)) {
    const entryPath = `${currentPath}/${entry.name}`;
    const target = currentPath.replace("./templates/", "./") + "/" + entry.name;

    if (entry.isDirectory) {
      await Deno.mkdir(target, { recursive: true });

      await traverse(entryPath, decoder, base);
    }
    else if (entry.isFile) {
      const file = decoder.decode(await Deno.readFile(entryPath));
      const data = new TextEncoder().encode(
        replacePlaceholders(file));

      await Deno.writeFile(target + ".ts", data);
    }
  }
}

export async function fetchTemplate(template: string) {
  // const deps = await Deno.readFile(`./templates/${template}_deps.txt`);
  // const entrypoint = await Deno.readFile(
  //   `./templates/${template}_entrypoint.txt`,
  // );

  const decoder = new TextDecoder();

  const base = `./templates/${template}`;

  await traverse(base, decoder, base);

  // settings.module = encoder.encode(
  //   replacePlaceholders(decoder.decode(entrypoint))
  // );
  // settings.depsModule = encoder.encode(decoder.decode(deps));
}

function replacePlaceholders(file: string): string {
  const placeholderNotEscaped = /(?<!\\)\{\{extension\}\}/g;

  const multilinePlaceholderNotEscaped = /``ts\n(.*?)\n``ts/gs;

  const classModifier = /(?<!\\)\{\{mod:(public|private|protected)\}\}/g;

  const typeAnnotation = /\{\{type(:)([A-Za-z0-9_]*?)\}\}/g;

  return file
    .replace(placeholderNotEscaped, settings.extension)
    .replace(
      typeAnnotation,
      function (_match: string, group1: string, type: string): string {
        return (settings.extension === "ts") ? group1 + " " + type : "";
      },
    )
    .replace(
      multilinePlaceholderNotEscaped,
      function (_match: string, content: string): string {
        return (settings.extension === "ts") ? content : "";
      },
    )
    .replace(
      classModifier,
      function (_match: string, modifier: string): string {
        return (settings.extension === "ts") ? modifier : "";
      },
    );
}

// custom template
