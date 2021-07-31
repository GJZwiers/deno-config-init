import { mkdirSec, writeFileSec } from "./utils.ts";
import { Replacer, replacers } from "./replacers.ts";
import { settings } from "./settings.ts";

export async function act() {
  if (settings.path !== ".") {
    await mkdirSec(settings.path, { force: settings.force });
  }

  const base = `./${settings.templateDir}/${settings.template}`;

  const source = await Deno.realPath(base);

  const target = await Deno.realPath(settings.path);

  await processTemplateDir(source, target);

  if (settings.map === true) {
    await writeFileSec(
      settings.path + "/import_map.json",
      new TextEncoder().encode("{}"),
    );
  }

  if (settings.git === true) {
    await initGit(settings.path);
  }

  // await initProjectSettings();

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

      await writeFileSec(validateFile(entry, targetPath), data);
    }
  }
}

function validateFile(entry: Deno.DirEntry, targetPath: string): string {
  const mod = /mod$/;
  const deps = /(?<!dev_)deps$/;
  const devDeps = /dev_deps$/;
  const fileExtension = /\.(?:js|ts)$/;

  if (mod.test(entry.name)) {
    targetPath = targetPath.replace(mod, settings.entrypoint);
  } else if (deps.test(entry.name)) {
    targetPath = targetPath.replace(deps, settings.depsEntrypoint);
  } else if (devDeps.test(entry.name)) {
    targetPath = targetPath.replace(devDeps, settings.devDepsEntrypoint);
  }

  if (!fileExtension.test(targetPath)) {
    targetPath = targetPath + "." + settings.extension;
  }

  return targetPath;
}

function processTemplateFile(file: string, replacers: Replacer[]): string {
  for (const replacer of replacers) {
    file = file.replace(replacer.pattern, replacer.fn);
  }

  return file;
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
    new TextEncoder().encode(".vscode/"),
  );
}

// deno-lint-ignore no-explicit-any
export async function runCommand(cmd: any): Promise<boolean> {
  const status = await cmd.status();

  cmd.close();

  return (status.code === 0) ? true : false;
}
