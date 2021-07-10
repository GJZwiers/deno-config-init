import { settings } from "./act.ts";

/**
 * Writes data to a file in the local filesystem. If the file already exists and
 * --force is not true, it will not write but warn the user instead.
 */
async function writeFileOrWarn(
  path: string | URL,
  data: Uint8Array,
): Promise<void> {
  if (settings.force) {
    return await Deno.writeFile(path, data);
  }

  try {
    const file = await Deno.readFile(path);
    if (file) {
      console.warn(
        `Warning: file ${path} already exists. Pass --force to overwrite.`,
      );
    }
  } catch (_error) {
    await Deno.writeFile(path, data);
  }
}

async function mkdirOrWarn(path: string | URL): Promise<void> {
  try {
    await Deno.mkdir(path);
  } catch (_error) {
    if (settings.force) return;
    console.warn(
      `Warning: Directory ${path} already exists. Pass --force to overwrite.`,
    );
  }
}

function hasFileExtension(filename: string, extension: string): boolean {
  return new RegExp(`^[_A-Za-z-]+\.${extension}$`).test(filename);
}

export { hasFileExtension, mkdirOrWarn, writeFileOrWarn };
