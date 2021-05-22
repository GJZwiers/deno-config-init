import { ArgumentsParser } from './deps.ts';
import { write_file_or_warn, mkdir_or_warn, validate_filename } from './utils.ts';

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
    template: {
        names: ["-t", "--template"],
        parser: String,
        choices: ["oak", "restful_oak"],
    },
    yes: {
        names: ["-y", "--yes"],
        parser: Boolean,
        isFlag: true,
    },
});

const encoder = new TextEncoder();

export const args = parser.parseArgs();

const default_debug_config = `{
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

const encoded_module = encoder.encode("export {};\n");

const defaults = {
    entrypoint: "mod.ts",
    debug_config: encoder.encode(default_debug_config),
    deps_entrypoint: "deps.ts",
    deno_settings: encoder.encode(`{\n\t"deno.enable": true\n}`),
    gitignore: ".gitignore",
    gitignore_content: encoder.encode(".vscode/\n"),
    module: encoded_module,
    deps_module: encoded_module,
    settings_dir: ".vscode",
};

if (args.name) {
    await mkdir_or_warn(args.name);
    Deno.chdir(args.name);
}

if (args.yes === true) {
    if (args.template) {
        const template = await import(`./templates/${args.template}.ts`);
        defaults.module = encoder.encode(template.entrypoint.replace(/\$\{extension\}/g, "ts"));
        defaults.deps_module = encoder.encode(template.deps);
    }

    await write_file_or_warn(defaults.entrypoint, defaults.module);
    await write_file_or_warn(defaults.deps_entrypoint, defaults.deps_module);

    await write_file_or_warn(defaults.gitignore, defaults.gitignore_content);

    await mkdir_or_warn(defaults.settings_dir);

    Deno.chdir(defaults.settings_dir);

    await write_file_or_warn("settings.json", defaults.deno_settings);
    await write_file_or_warn("launch.json", defaults.debug_config);
} 
else {
    const ts = prompt("Use TypeScript? (y/n)", 'y');
    const ext = (ts === 'y' || ts === 'Y') ? "ts" : "js";
    let entrypoint = prompt(`Entrypoint:`, `mod.${ext}`);
    let deps_entrypoint = prompt("Dependency entrypoint", `deps.${ext}`);
    const debug = prompt("Add debug configuration? (y/n)", 'y');

    if (!entrypoint) {
        throw new Error("Invalid entrypoint");
    }

    if (!deps_entrypoint) {
        throw new Error("Invalid dependency entrypoint");
    }

    // Allow user to input file without extension
    const valid_entrypoint = validate_filename(entrypoint, ext);
    const valid_deps_entrypoint = validate_filename(deps_entrypoint, ext);

    if (!valid_entrypoint) {
        entrypoint = `${entrypoint}.${ext}`;
    }

    if (!valid_deps_entrypoint) {
        deps_entrypoint = `${deps_entrypoint}.${ext}`;
    }

    // TODO: DRY
    if (args.template) {
        const template = await import(`./templates/${args.template}.ts`);
        defaults.module = encoder.encode(template.entrypoint.replace(/\$\{extension\}/g, "ts"));
        defaults.deps_module = encoder.encode(template.deps);
    }

    await write_file_or_warn(entrypoint, defaults.module);
    await write_file_or_warn(`deps.${ext}`, defaults.deps_module);
    
    await mkdir_or_warn(defaults.settings_dir);
    await write_file_or_warn(defaults.gitignore, defaults.gitignore_content);

    Deno.chdir(defaults.settings_dir);

    await write_file_or_warn("settings.json", defaults.deno_settings);
    
    if (debug === 'y' || debug === 'Y') {
        await write_file_or_warn("launch.json", defaults.debug_config);
    }

}
