import { ArgumentsParser } from './deps.ts';

export const parser = new ArgumentsParser({
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

export interface Args {
    force: boolean | undefined;
    name: string | undefined;
    template: string | undefined;
    yes: boolean | undefined;
}

export const args: Args = parser.parseArgs();
