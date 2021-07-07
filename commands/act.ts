import { Select } from "../deps.ts";
import { fetchTemplate, addEntryPoints, addEditorConfig } from "../init.ts";
import { mkdirOrWarn } from "../utils.ts";

type CLIOption = string | undefined;

export async function chooseTemplate(template: CLIOption, options: string[]) {
    let choice: string | undefined = undefined;
    if (!template) {
        choice = await Select.prompt({
            message: "Choose your template",
            options: options
            });
    }
    return choice;
}

export async function act(editor: string, force: boolean | undefined, name: CLIOption, template: CLIOption) {
    await fetchTemplate(template);

    if (name) {
        await mkdirOrWarn(name, force);
        Deno.chdir(name);
    }      

    await addEntryPoints(undefined, undefined, force);
    
    await addEditorConfig(editor, force);
}
