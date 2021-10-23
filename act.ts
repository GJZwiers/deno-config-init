import { writeFileSec } from "./utils.ts";
import {
  defaultModuleContent,
  defaultTestModuleContent,
  Settings,
} from "./settings.ts";

async function addProjectFile(filename: string, content: Uint8Array) {
  await writeFileSec(
    filename,
    content,
  );
}

export async function act(settings: Settings) {
  if (settings.path !== ".") {
    await Deno.mkdir(settings.path, { recursive: true });
  }

  if (settings.map === true) {
    await addProjectFile(settings.path + "/import_map.json", settings.mapContent);
  }

  if (settings.config === true || settings.configOnly === true) {
    await addProjectFile(settings.path + "/deno.json", settings.configContent);
  }

  if (!settings.configOnly) {
    await addProjectFile(settings.path + "/" + settings.entrypoint, defaultModuleContent);

    await addProjectFile(settings.path + "/" + settings.depsEntrypoint, defaultModuleContent);

    await addProjectFile(settings.path + "/" + settings.devDepsEntrypoint, defaultModuleContent);

    if (settings.testdriven === true) {
      const testFileName = settings.entrypoint.replace(
        /^(.*)\.ts$/,
        function (_fullmatch: string, p1: string): string {
          return p1 + ".test." + settings.extension;
        },
      );
      await addProjectFile(settings.path + "/" + testFileName, defaultTestModuleContent);
    }

    if (settings.git === true) {
      await initGit(settings.path);
    }

    await addProjectFile(settings.path + "/" + settings.gitignore, settings.gitignoreContent);
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
