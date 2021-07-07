import { Command, EnumType } from "./deps.ts";
import { writeFileOrWarn, mkdirOrWarn, hasFileExtension } from "./utils.ts";
import { vsCodeDebugConfig } from "./configs/debugconfig_vscode.ts";
import { tdd } from "./commands/tdd.ts";
import { api } from "./commands/api.ts";
import { cli } from "./commands/cli.ts";

const encoder = new TextEncoder();
const defaultModuleContent = encoder.encode("export {};\n");

const defaults = {
    debug: "y",
    depsEntrypoint: "deps.ts",
    depsModule: defaultModuleContent,
    entrypoint: "mod.ts",
    extension: "ts",
    gitignore: ".gitignore",
    module: defaultModuleContent,
};

type EditorConfig = {
    debugFile: string,
    debugFileContent: Uint8Array,
    gitignoreContent: Uint8Array,
    settings: Uint8Array
    settingsDir: string,
    settingsFile: string,
}

type EditorConfigs = {
    [key: string]: EditorConfig
}

const editorConfigs: EditorConfigs = {
    "vscode": {
        debugFileContent: encoder.encode(vsCodeDebugConfig),
        debugFile: "launch.json",
        gitignoreContent: encoder.encode(".vscode/\n"),
        settingsDir: ".vscode",
        settingsFile: "settings.json",
        settings: encoder.encode(`{\n\t"deno.enable": true\n}`)
    }
}

const editor = new EnumType(["vscode"]);

const template = new EnumType(["oak"]);

await new Command()
    .name("deno-init")
    .version("0.9.0")
    .description("Start a new Deno project with a single command")
    .type("editor", editor)
    .type("template", template)
    .option<{ editor: typeof editor }>("-e, --editor [method:editor]", "Choose the editor to configure for.", { 
        default: "vscode",
        global: true
    })
    .option(
        "-f, --force [force:boolean]",
        "Force overwrite of existing files/directories. Helpful to re-initialize a project but use with caution!",
        { global: true })
    .option("-n, --name [name:string]", "Create the project in a new directory.", { global: true })
    .option<{ template: typeof template }>(
        "-t, --template [method:template]",
        "Initialize the project with a basic template. For more specific application templates use one of the subcommands."
    )
    .option("-y, --yes [yes:boolean]", "Answer 'y' to all prompts")
    .action(async ({ editor, force, name, template, yes }) => { 
        if (yes === true) {
            await fetchTemplate(template);

            if (name) {
                await mkdirOrWarn(name, force);
                Deno.chdir(name);
            }

            await addEntryPoints(undefined, undefined, force);

            await addEditorConfig(editor, force);
        } 
        else {
            const ts = prompt("TypeScript? (y/n)", "y");
            const isTypeScript = (ts === "y" || ts === "Y");
        
            if (!isTypeScript && template) {
                console.warn("Warning: Selected JavaScript with a TypeScript template.");
            }
        
            const extension = isTypeScript ? defaults.extension : "js";
        
            let entrypoint = prompt(`Entrypoint:`, `mod.${extension}`);

            if (entrypoint === null) {
                entrypoint = "mod.ts";
            }
        
            if (!hasFileExtension(entrypoint, extension)) {
                entrypoint = `${entrypoint}.${extension}`;
            }
        
            let depsEntrypoint = <string> prompt("Dependency entrypoint:", `deps.${extension}`);

            if (depsEntrypoint === null) {
                depsEntrypoint = "deps.ts";
            }
        
            if (!hasFileExtension(depsEntrypoint, extension)) {
                depsEntrypoint = `${depsEntrypoint}.${extension}`;
            }
        
            const addDebug = <string> prompt("Add debug configuration? (y/n)", defaults.debug);
            
            if (addDebug !== "y" && addDebug !== "Y") {
                defaults.debug = addDebug;
            }

            await fetchTemplate(template);

            if (name) {
                await mkdirOrWarn(name, force);
                Deno.chdir(name);
            }

            await addEntryPoints(entrypoint, depsEntrypoint, force);
            
            await addEditorConfig(editor, force);
        }
    })
    .command("api", api)
    .command("cli", cli)
    .command("tdd", tdd)
    .parse(Deno.args);

export async function addEntryPoints(entrypoint?: string, depsEntrypoint?: string, force = false) {  
    await writeFileOrWarn(entrypoint ?? defaults.entrypoint, defaults.module, force);

    await writeFileOrWarn(depsEntrypoint ?? defaults.depsEntrypoint, defaults.depsModule, force);
}

export async function addEditorConfig(editor: string, force = false) {  
    await writeFileOrWarn(defaults.gitignore, editorConfigs[editor].gitignoreContent, force);

    await mkdirOrWarn(editorConfigs[editor].settingsDir, force);
    Deno.chdir(editorConfigs[editor].settingsDir);

    await writeFileOrWarn(editorConfigs[editor].settingsFile, editorConfigs[editor].settings, force);
    
    if (defaults.debug === "y" || defaults.debug === "Y") {
        await writeFileOrWarn(editorConfigs[editor].debugFile, editorConfigs[editor].debugFileContent, force);
    }
}

export async function fetchTemplate(template: string | undefined) { 
    if (template) {
        const deps = await Deno.readFile(`./templates/${template}_deps.txt`);
        const entrypoint = await Deno.readFile(`./templates/${template}_entrypoint.txt`);
        
        const decoder = new TextDecoder();

        const placeholderNotEscaped = /(?<!\\)\{\{extension\}\}/g;
        
        defaults.module = encoder.encode(decoder
            .decode(entrypoint)
            .replace(placeholderNotEscaped, defaults.extension)
        );
        defaults.depsModule = encoder.encode(decoder.decode(deps));
    }
}

export { defaults }
