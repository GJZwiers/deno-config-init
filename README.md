# init

[![Build](https://github.com/GJZwiers/deno-init/actions/workflows/build.yaml/badge.svg)](https://github.com/GJZwiers/deno-init/actions/workflows/build.yaml)
[![Coverage Status](https://coveralls.io/repos/github/GJZwiers/deno-init/badge.svg?branch=main)](https://coveralls.io/github/GJZwiers/deno-init?branch=main)
[![nest badge](https://nest.land/badge.svg)](https://nest.land/package/init)

Start Deno projects faster with `deno-init`, a simple executable that scaffolds
the project structure for you.

> Please note this module's API is not stable yet and there may be breaking
> changes on `0.x` version increments.

## Requirements

- `deno` installed and available on a terminal.

## Installation

Use the `deno install` command to install the executable. It is recommended to specify the version in the URL, if no version is passed the latest will be installed.

To upgrade an existing installation include `-f`.

<details open>
<summary>deno.land</summary>
<p>

```bash
deno install --allow-read --allow-write --unstable -n deno-init https://deno.land/x/init@0.12.2/mod.ts
```

</p>
</details>  

<details>
<summary>nest.land</summary>
<p>

```bash
deno install --allow-read --allow-write --unstable -n deno-init https://x.nest.land/init@0.12.2/mod.ts
```

</p>
</details>  

<details>
<summary>github</summary>
<p>

```bash
deno install --allow-read --allow-write --unstable -n deno-init https://raw.githubusercontent.com/GJZwiers/deno-init/main/mod.ts
```

</p>
</details>  

## Permissions

The program needs the following permissions to run:

- `read`: to load files that are used to initialize projects from templates
- `write`: to make files in order to initialize new projects
- `unstable`: to allow the use of unstable APIs. These mostly originate in the module's dependencies.

## Basic Usage

```bash
deno-init
```

This will prompt you for the following:

- TypeScript? (default `y`)
- Entrypoint? (default `mod.ts`)
- Dependency entrypoint? (default `deps.ts`)
- Debug configuration? (default `y`).

Choosing all defaults will create the following structure in the current
directory:

```
.
│   .gitignore
│   deps.ts  
│   mod.ts
│
└───.vscode
│   │   launch.json
│   │   settings.json
```

The created `.gitignore` will ignore `.vscode/` and `settings.json` will contain
`"deno.enable": "true"`, while `launch.json` will contain a basic debug
configuration.

## Available Options

Use `--help` to print all available options. In addition, they are listed below:

Use `--yes` or `-y` if you simply want to use all the default values without
being prompted:

```bash
deno-init -y
```

`deno-init` will not overwrite files or directories unless `--force` is passed.

Use `--editor` or `-e` to generate editor-specific configuration for a project.
At this moment only the option `vscode` is supported and it is also set as the
default.

```bash
deno-init --editor vscode
```

Use `--force` or `-f` in case you explicitly want to overwrite existing files.
This can be helpful to re-initialize but use with caution.

```bash
deno-init -f
```

Use `--name` or `-n` to make a new directory in the current directory where the
files will be placed.

```bash
deno-init --name my_deno_project
```

Use `--no-git` if you don't want to run `git init` as part of initializing the project.

```bash
deno-init --no-git
```

## Subcommands

Use `--help` to get more detailed information on any of the subcommands. The
`--template` or `-t` option can be used with any subcommand in addition to the
other options to select a project template. If no template is passed the program
will prompt you with a list of choices.

### `api`

Use to initialize a Deno RESTful API from a template.

```bash
deno-init api --template opine
```

Available templates: `opine`, `restful_oak`.

### `cli`

Use to initialize a Deno Command Line Interface (CLI) from a template.

```bash
deno-init cli --template cliffy
```

Available templates: `cliffy`.

### `server`

Use to initialize a Deno HTTP server from a template.

```bash
deno-init server --template oak
```

Available templates: `deno_http`, `drash`, `oak`.

### `tdd`

Use to initialize a Deno Test-Driven Development project from a template.

```bash
deno-init tdd --template rhum
```

Available templates: `deno`, `rhum`.

## Roadmap

- Support more editor/IDE setups
- Add more project templates
