import { ArgumentsParser } from './deps.ts';

const parser = new ArgumentsParser({
    yes: {
        names: ["-y", "--yes"],
        parser: String,
        isFlag: true,
    },
});

const args = parser.parseArgs();
console.log(args);

let ext = "ts";
if (!args.yes) {
    const ts = prompt("Use TypeScript? (y/n)", 'y');

    if (ts === 'n' || ts === 'N') {
        ext = "js";
    }

    let entrypoint = prompt(`Entrypoint:`, `mod.${ext}`);

    if (!entrypoint) {
        throw new Error("Invalid entrypoint");
    }

    if (!new RegExp(`\.${ext}$`).test(entrypoint)) {
        entrypoint = entrypoint + '.' + ext;
    }

    const debug = prompt("Add debug configuration?", 'y');

    const encoder = new TextEncoder();
    const module = encoder.encode("export {};");

    await Deno.writeFile(entrypoint, module);

    try {
        await Deno.mkdir(".vscode");
    } catch(error) {

    }

    Deno.chdir(".vscode");

    const settings = encoder.encode(
`{
    "deno.enable": true
}`);

    await Deno.writeFile("settings.json", settings);

    if (debug === 'y' || debug === 'Y') {
        const debug_config = encoder.encode(
`{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Deno",
            "type": "node",
            "request": "launch",
            "cwd": "\${workspaceFolder}",
            "runtimeExecutable": "deno",
            "runtimeArgs": ["run", "--inspect-brk", "-A", "\${file}"],
            "port": 9229
        }
    ]
}`
        );
        await Deno.writeFile("launch.json", debug_config);
    }

    Deno.chdir('..');
    const ignoreData = encoder.encode(".vscode/");
    await Deno.writeFile(".gitignore", ignoreData);
}
