import { mkdirSec, writeFileSec } from "./utils.ts";
import {
  defaultModuleContent,
  defaultTestModuleContent,
  settings,
} from "./settings.ts";
import * as path from "https://deno.land/std@0.112.0/path/mod.ts";

async function addProjectFile(path: string, content: Uint8Array) {
  await writeFileSec(
    settings.path + "/" + path,
    content,
  );
}

export async function act() {
  if (settings.path !== ".") {
    console.log(import.meta.url);
    const dirs = new URL(settings.path, import.meta.url).href;

    await mkdirSec(dirs, { force: settings.force, recursive: true });
  }

  if (settings.map === true) {
    await addProjectFile("import_map.json", settings.mapContent);
  }

  if (settings.config === true || settings.configOnly === true) {
    await addProjectFile("deno.json", settings.configContent);
  }

  if (!settings.configOnly) {
    await addProjectFile(settings.entrypoint, defaultModuleContent);

    await addProjectFile(settings.depsEntrypoint, defaultModuleContent);

    await addProjectFile(settings.devDepsEntrypoint, defaultModuleContent);

    if (settings.testdriven === true) {
      const testFileName = settings.entrypoint.replace(
        /^(.*)\.ts$/,
        function (_fullmatch: string, p1: string): string {
          return p1 + ".test." + settings.extension;
        },
      );
      await addProjectFile(testFileName, defaultTestModuleContent);
    }

    if (settings.git === true) {
      await initGit(settings.path);
    }

    await addProjectFile(settings.gitignore, settings.gitignoreContent);
  }
}

async function initGit(path: string) {
  try {
    await runCommand(Deno.run({
      cmd: ["git", "init", path],
    }));
  } catch (error) {
    console.warn(
      "Warning: Could not initialize Git repository. Error:" + error,
    );
  }
}

// deno-lint-ignore no-explicit-any
export async function runCommand(cmd: any): Promise<boolean> {
  const status = await cmd.status();

  cmd.close();

  return (status.code === 0) ? true : false;
}
