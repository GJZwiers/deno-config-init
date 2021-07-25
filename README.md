# init

[![Build](https://github.com/GJZwiers/deno-init/actions/workflows/build.yaml/badge.svg)](https://github.com/GJZwiers/deno-init/actions/workflows/build.yaml)
[![Coverage Status](https://coveralls.io/repos/github/GJZwiers/deno-init/badge.svg?branch=main)](https://coveralls.io/github/GJZwiers/deno-init?branch=main)
![Deno](https://img.shields.io/static/v1?label=&message=init&color=lightblue&logo=data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAB41BMVEUAAAAAAAABAQECAgIDAwMEBAQFBQUGBgYHBwcICAgJCQkKCgoLCwsMDAwNDQ0ODg4PDw8QEBARERESEhITExMUFBQVFRUWFhYXFxcYGBgZGRkaGhobGxscHBwdHR0eHh4fHx8gICAhISEiIiIjIyMkJCQlJSUmJiYnJycpKSkqKiorKyssLCwuLi4wMDAxMTEyMjIzMzM0NDQ1NTU2NjY3Nzc4ODg5OTk6Ojo7Ozs8PDw9PT0%2BPj4%2FPz9AQEBBQUFCQkJDQ0NERERFRUVGRkZHR0dISEhJSUlKSkpLS0tMTExNTU1OTk5QUFBRUVFSUlJTU1NUVFRVVVVWVlZXV1dYWFhZWVlaWlpbW1tcXFxdXV1eXl5fX19gYGBhYWFiYmJkZGRlZWVmZmZnZ2doaGhqampra2tsbGxtbW1wcHBxcXF0dHR1dXV2dnZ3d3d4eHh5eXl6enp7e3t8fHx%2Bfn5%2Ff3%2BAgICBgYGCgoKDg4OEhISFhYWGhoaHh4eIiIiJiYmKioqLi4uMjIyNjY2Ojo6Pj4%2BQkJCRkZGSkpKTk5OUlJSVlZWWlpaXl5eYmJiZmZmampqbm5ucnJydnZ2enp6fn5%2BgoKChoaGioqKjo6OkpKSlpaWmpqaoqKipqamqqqqrq6u6nz8EAAAAAXRSTlMAQObYZgAAAu1JREFUeNqt0wOXJMkewNH%2FHbttjW3btm3btm175pu%2Bt7uVp7I7u9b7O0rdVETEf9OFCe2BTtOvxV9ok0y7%2FgSMAoxeD9eSnT8AqwCM2QMBsPL3BIqmAIMOQXQAUBBcBldgsqazEF2NB7jTWiwBHkCovQtRLKBjP2zLitWAe%2FBN9WuTxvtcIaDshp6sbSlOAtyH9zqG9Ye8rBZQdN2prpl3%2B0kb4KFRy7wgzDnuYb0B3NTlpn3laE7odxH4ZORhnwkTL3g4FG5od9Kuai3MWLp91Bc%2B6n3ZBMKQmzq3t4qbsK0WZuYJvYSA59qchlCyBb4nZGsdiKR6fggf4HgFEIA3CdlSD4YlBCGcbsS6yS3JZ27B5gYgJzbgq9fWTkVV5inl3IaNjcC65CH7fcCo7Qp2m33WJ0RCrnuNHpcAC%2B58j3i6AeAmn6xtMi1P9nLU0VK8hT6R1h485Z3VPQU4ExENTOk%2FbTI%2BMDRatAM68M7Knr6C4RGBTvO778EK9flnJB0C3lv2G%2BmIHLHGVe35EJURzzQ3M8AXi3v6TKRkvRM%2BSVbEhWgeWGJRLz%2F4mJKe9qgXhfoILOptKu9SwlIWRsGAUTXwJiU1FrOtMDkg7VVKlltJrygcAO2ep6SpYTWu%2Fxnp8CRHSmFWzyENPU2IfMfaa026PaBfRKyH6QbainYbLz5%2BdGQ8SvJ6DIDSmxxM7mIKFqAzQKRtBVBxjUiI8YDtQ7EBx1JyFUDNhYTMxCjTwfBpWIwZKfkB2KHnJslx9DQDgHmojzTAbZ2IXB1gCgBzIdLoCFdQEbm%2BwmSAdoZ3y5J5cI70aBmaqgG7tWufJQvhPE2RD2YBlrcjSxZBHZF2Br2xChP6ZUmJBcCDaNZsYDtqBmbJQAvBumhRf7ANZMl486FfZGqE3QXJPHMxOFo1A0vsrGlNdihSeM2egjHjWpNxuBaFK0NboEv%2B4FKUxe%2F2GkBtbn8p%2BBZ%2F2GCZRsSf92ZhB4COiz%2FFf9H%2FAb6oexxnpBFzAAAAAElFTkSuQmCC)
[![nest badge](https://nest.land/badge.svg)](https://nest.land/package/init)

Start Deno projects faster with `deno-init`, a simple executable that scaffolds
the project structure for you.

> Please note this module's API is not stable yet and there may be breaking
> changes on `0.x` version increments.

## Requirements

- `deno` installed and available on a terminal.

## Installation

Use `deno install` to install the executable. It is recommended to specify a
version number in the URL, if no version is passed the latest will be installed.

To upgrade an existing installation include `-f`.

<details open>
<summary>deno.land</summary>
<p>

```bash
deno install --allow-read --allow-run --allow-write --unstable -n deno-init https://deno.land/x/init@0.13.1/mod.ts
```

</p>
</details>

<details>
<summary>nest.land</summary>
<p>

```bash
deno install --allow-read --allow-run --allow-write --unstable -n deno-init https://x.nest.land/init@0.13.1/mod.ts
```

</p>
</details>

<details>
<summary>github</summary>
<p>

```bash
deno install --allow-read --allow-run --allow-write --unstable -n deno-init https://raw.githubusercontent.com/GJZwiers/deno-init/main/mod.ts
```

</p>
</details>

## Permissions

The program needs the following permissions to run:

- `read`: to load files that are used to initialize projects from templates
- `run`: to run `git init` if the git option is true
- `write`: to make files in order to initialize new projects
- `unstable`: to allow the use of unstable APIs. These mostly originate in the
  module's dependencies.

## Basic Usage

```bash
deno-init
```

This will prompt you for the following:

- TypeScript? (default `y`)
- Entrypoint? (default `mod.ts`)
- Dependency entrypoint? (default `deps.ts`)
- Debug configuration? (default `n`).

Choosing all defaults will create the following structure in the current
directory and run `git init`:

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

`.gitignore` will ignore `.vscode/` and `settings.json` will contain
`"deno.enable": "true"`. If debug is answered with `y/Y` a `launch.json` will be
made with a basic debug configuration.

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

Use `--no-git` if you don't want to run `git init` as part of initializing the
project.

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
