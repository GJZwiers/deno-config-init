import { args } from './init.ts';

export async function writeFileOrWarn(path: string | URL, data: Uint8Array, options?: Deno.WriteFileOptions | undefined)
    : Promise<void> {

    if (args.force) {
        return await Deno.writeFile(path, data, options);
    }

    try {
        const file = await Deno.readFile(path);
        if (file) {
            console.warn(`Warning: file ${path} already exists. Pass --force to overwrite`);
        }
    } catch(_error) {
        await Deno.writeFile(path, data, options);
    }
}

export async function mkdirOrWarn(path: string | URL, options?: Deno.WriteFileOptions | undefined)
    : Promise<void> {
    try {
        await Deno.mkdir(path, options);
    } catch(_error) {
        if (args.force) return;
        console.warn(`Warning: Directory ${path} already exists.`);
    }
}

export function validateFilename(filename: string, extension: string): boolean {
    return new RegExp(`^[_A-Za-z-]+\.${extension}$`).test(filename);
}
