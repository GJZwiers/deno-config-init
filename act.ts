import { mkdirSec, writeFileSec } from "./utils.ts";
import { editorConfigs } from "./configs.ts";
import { Replacer, replacers } from "./replacers.ts";
import { settings } from "./settings.ts";

export async function act() {
  if (settings.path !== ".") {
    await mkdirSec(settings.path, { force: settings.force });
  }

  if (settings.template) {
    const base = `./${settings.templateDir}/${settings.template}`;

    const source = await Deno.realPath(base);

    const target = await Deno.realPath(settings.path);

    await processTemplateDir(source, target);
  } else {
    await writeFileSec(
      settings.path + "/" + settings.entrypoint,
      settings.module,
    );

    await writeFileSec(
      settings.path + "/" + settings.depsEntrypoint,
      settings.depsModule,
    );
  }

  if (settings.git) {
    await initGit(settings.path);
  }

  await initProjectSettings();

  if (settings.cache === true) {
    console.log(settings.path + "/" + settings.depsEntrypoint);

    await runCommand(Deno.run({
      cmd: [
        "deno",
        "cache",
        "--quiet",
        settings.path + "/" + settings.depsEntrypoint,
      ],
    }));
  }
}

/** Recursively replace all template syntax into valid JavaScript/TypeScript in all template files. */
export async function processTemplateDir(dir: string, target: string) {
  for await (const entry of Deno.readDir(dir)) {
    const sourcePath = `${dir}/${entry.name}`;
    const targetPath = `${target}/${entry.name}`;

    if (entry.isDirectory) {
      await mkdirSec(targetPath, { recursive: true, force: settings.force });

      await processTemplateDir(sourcePath, targetPath);
    } else if (entry.isFile) {
      const file = new TextDecoder().decode(
        await Deno.readFile(sourcePath),
      );

      const data = new TextEncoder().encode(
        processTemplateFile(file, replacers),
      );

      await writeFileSec(targetPath + ".ts", data);
    }
  }
}

function processTemplateFile(file: string, replacers: Replacer[]): string {
  for (const replacer of replacers) {
    file = file.replace(replacer.pattern, replacer.fn);
  }

  return file;
}

export async function initProjectSettings() {
  const settingsDir = settings.path + "/" +
    editorConfigs[settings.editor].settingsDir;

  await mkdirSec(settingsDir, { recursive: true });

  await writeFileSec(
    settingsDir + "/" + editorConfigs[settings.editor].settingsFile,
    editorConfigs[settings.editor].settings,
  );

  if (settings.debug === "y" || settings.debug === "Y") {
    await writeFileSec(
      settingsDir + "/" + editorConfigs[settings.editor].debugFile,
      editorConfigs[settings.editor].debugFileContent,
    );
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

  await writeFileSec(
    settings.path + "/" + settings.gitignore,
    editorConfigs[settings.editor]["gitignoreContent"],
  );
}

// deno-lint-ignore no-explicit-any
export async function runCommand(cmd: any): Promise<boolean> {
  const status = await cmd.status();

  cmd.close();

  return (status.code === 0) ? true : false;
}
