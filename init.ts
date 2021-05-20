import { ArgumentsParser } from './deps.ts';
import { writeFileOrWarn, mkDirOrWarn } from './utils.ts';

const parser = new ArgumentsParser({
    force: {
        names: ["-f", "--force"],
        parser: Boolean,
        isFlag: true,
    },
    name: {
        names: ["-n", "--name"],
        parser: String,
    },
    yes: {
        names: ["-y", "--yes"],
        parser: Boolean,
        isFlag: true,
    },
});

const encoder = new TextEncoder();

export const args = parser.parseArgs();

const defaultDebugConfig = `{
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
}`;

const defaults = {
    entrypoint: "mod.ts",
    debug_config: encoder.encode(defaultDebugConfig),
    deps_entrypoint: "deps.ts",
    deno_settings: encoder.encode(`{\n\t"deno.enable": true\n}`),
    gitignore: ".gitignore",
    gitignore_content: encoder.encode(".vscode/"),
    module: encoder.encode("export {};"),
    settings_dir: ".vscode",
};

if (args.name) {
    await mkDirOrWarn(args.name);
    Deno.chdir(args.name);
}

if (args.yes === true) {
    await writeFileOrWarn(defaults.entrypoint, defaults.module);
    await writeFileOrWarn(defaults.deps_entrypoint, defaults.module);
    await writeFileOrWarn(defaults.gitignore, defaults.gitignore_content);

    await mkDirOrWarn(defaults.settings_dir);

    Deno.chdir(defaults.settings_dir);

    await writeFileOrWarn("settings.json", defaults.deno_settings);
    await writeFileOrWarn("launch.json", defaults.debug_config);
} 
else {
    const ts = prompt("Use TypeScript? (y/n)", 'y');
    const ext = (ts !== 'y' && ts !== 'Y') ? "js" : "ts";
    let entrypoint = prompt(`Entrypoint:`, `mod.${ext}`);
    const debug = prompt("Add debug configuration? (y/n)", 'y');
    const deps = prompt("Add entrypoint for project dependencies? (y/n)", `y`);

    if (!entrypoint) {
        throw new Error("Invalid entrypoint");
    }

    const hasExtension = new RegExp(`\.${ext}$`).test(entrypoint);

    if (!hasExtension) {
        entrypoint = `${entrypoint}.${ext}`;
    }

    const encoder = new TextEncoder();
    const module = encoder.encode("export {};");

    await writeFileOrWarn(entrypoint, module);
    if (deps === 'y' || deps === 'Y') {
        await writeFileOrWarn(`deps.${ext}`, module);
    }
    
    await mkDirOrWarn(defaults.settings_dir);
    await writeFileOrWarn(defaults.gitignore, defaults.gitignore_content);

    Deno.chdir(defaults.settings_dir);

    await writeFileOrWarn("settings.json", defaults.deno_settings);
    
    if (debug === 'y' || debug === 'Y') {
        await writeFileOrWarn("launch.json", defaults.debug_config);
    }

}
