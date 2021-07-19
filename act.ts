import { Select } from "./deps.ts";
import { vsCodeDebugConfig } from "./configs/debugconfig_vscode.ts";
import { mkdirOrWarn, writeFileOrWarn } from "./utils.ts";
import type { CLIOption, EditorConfigs } from "./types/types.ts";
import { Replacer, replacers } from "./replacers.ts";

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

export async function act(editor: string, name: CLIOption, template?: CLIOption) {
  if (settings.path) {
    Deno.mkdir(settings.path);
  }

  if (template) {
    await fetchTemplate(template);
  }

  if (name) {
    //await mkdirOrWarn(name);
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

async function traverse(currentPath: string, base: string) {
  for await (const entry of Deno.readDir(currentPath)) {
    const templatePath = `${currentPath}/${entry.name}`;
    
    const target = settings.path + currentPath.replace(base, "") + "/" + entry.name;
    
    if (entry.isDirectory) {
      await Deno.mkdir(target, { recursive: true });

      await traverse(templatePath, base);
    }
    else if (entry.isFile) {
      const file = new TextDecoder().decode(await Deno.readFile(templatePath));
      const data = new TextEncoder().encode(
        processTemplateFile(file, replacers));

      await Deno.writeFile(target + ".ts", data);
    }
  }
}

export async function fetchTemplate(template: string) {
  const base = `./templates/${template}`;

  await traverse(base, base);
}

function processTemplateFile(file: string, replacers: Replacer[]): string {
  for (const replacer of replacers) {
    file = file.replace(replacer.pattern, replacer.fn);
  }

  return file;
}
