import { defaults } from "./settings.ts";

/**
 * Attempts to write to a file, but warns instead of overwriting if it exists already.
 */
async function writeFileSec(
  path: string | URL,
  data: Uint8Array,
  options?: Deno.WriteFileOptions,
): Promise<void> {
  if (defaults.force) {
    return await Deno.writeFile(path, data, options);
  }

  try {
    const file = await Deno.readFile(path);
    if (file) {
      console.warn(
        `Warning: file ${path} already exists. Pass --force to overwrite.`,
      );
    }
  } catch (_error) {
    await Deno.writeFile(path, data, options);
  }
}

function hasFileExtension(filename: string, extension: string): boolean {
  return new RegExp(`\.${extension}$`).test(filename);
}

export { hasFileExtension, writeFileSec };
