# init

[![deno module](https://shield.deno.dev/x/init)](https://deno.land/x/init)
![deno compatibility](https://shield.deno.dev/deno/^1.15)
[![Build](https://github.com/GJZwiers/deno-init/actions/workflows/build.yaml/badge.svg)](https://github.com/GJZwiers/deno-init/actions/workflows/build.yaml)
[![Coverage Status](https://coveralls.io/repos/github/GJZwiers/deno-init/badge.svg?branch=main)](https://coveralls.io/github/GJZwiers/deno-init?branch=main)
![Deno](https://img.shields.io/static/v1?label=&message=init&color=lightblue&logo=data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAB41BMVEUAAAAAAAABAQECAgIDAwMEBAQFBQUGBgYHBwcICAgJCQkKCgoLCwsMDAwNDQ0ODg4PDw8QEBARERESEhITExMUFBQVFRUWFhYXFxcYGBgZGRkaGhobGxscHBwdHR0eHh4fHx8gICAhISEiIiIjIyMkJCQlJSUmJiYnJycpKSkqKiorKyssLCwuLi4wMDAxMTEyMjIzMzM0NDQ1NTU2NjY3Nzc4ODg5OTk6Ojo7Ozs8PDw9PT0%2BPj4%2FPz9AQEBBQUFCQkJDQ0NERERFRUVGRkZHR0dISEhJSUlKSkpLS0tMTExNTU1OTk5QUFBRUVFSUlJTU1NUVFRVVVVWVlZXV1dYWFhZWVlaWlpbW1tcXFxdXV1eXl5fX19gYGBhYWFiYmJkZGRlZWVmZmZnZ2doaGhqampra2tsbGxtbW1wcHBxcXF0dHR1dXV2dnZ3d3d4eHh5eXl6enp7e3t8fHx%2Bfn5%2Ff3%2BAgICBgYGCgoKDg4OEhISFhYWGhoaHh4eIiIiJiYmKioqLi4uMjIyNjY2Ojo6Pj4%2BQkJCRkZGSkpKTk5OUlJSVlZWWlpaXl5eYmJiZmZmampqbm5ucnJydnZ2enp6fn5%2BgoKChoaGioqKjo6OkpKSlpaWmpqaoqKipqamqqqqrq6u6nz8EAAAAAXRSTlMAQObYZgAAAu1JREFUeNqt0wOXJMkewNH%2FHbttjW3btm3btm175pu%2Bt7uVp7I7u9b7O0rdVETEf9OFCe2BTtOvxV9ok0y7%2FgSMAoxeD9eSnT8AqwCM2QMBsPL3BIqmAIMOQXQAUBBcBldgsqazEF2NB7jTWiwBHkCovQtRLKBjP2zLitWAe%2FBN9WuTxvtcIaDshp6sbSlOAtyH9zqG9Ye8rBZQdN2prpl3%2B0kb4KFRy7wgzDnuYb0B3NTlpn3laE7odxH4ZORhnwkTL3g4FG5od9Kuai3MWLp91Bc%2B6n3ZBMKQmzq3t4qbsK0WZuYJvYSA59qchlCyBb4nZGsdiKR6fggf4HgFEIA3CdlSD4YlBCGcbsS6yS3JZ27B5gYgJzbgq9fWTkVV5inl3IaNjcC65CH7fcCo7Qp2m33WJ0RCrnuNHpcAC%2B58j3i6AeAmn6xtMi1P9nLU0VK8hT6R1h485Z3VPQU4ExENTOk%2FbTI%2BMDRatAM68M7Knr6C4RGBTvO778EK9flnJB0C3lv2G%2BmIHLHGVe35EJURzzQ3M8AXi3v6TKRkvRM%2BSVbEhWgeWGJRLz%2F4mJKe9qgXhfoILOptKu9SwlIWRsGAUTXwJiU1FrOtMDkg7VVKlltJrygcAO2ep6SpYTWu%2Fxnp8CRHSmFWzyENPU2IfMfaa026PaBfRKyH6QbainYbLz5%2BdGQ8SvJ6DIDSmxxM7mIKFqAzQKRtBVBxjUiI8YDtQ7EBx1JyFUDNhYTMxCjTwfBpWIwZKfkB2KHnJslx9DQDgHmojzTAbZ2IXB1gCgBzIdLoCFdQEbm%2BwmSAdoZ3y5J5cI70aBmaqgG7tWufJQvhPE2RD2YBlrcjSxZBHZF2Br2xChP6ZUmJBcCDaNZsYDtqBmbJQAvBumhRf7ANZMl486FfZGqE3QXJPHMxOFo1A0vsrGlNdihSeM2egjHjWpNxuBaFK0NboEv%2B4FKUxe%2F2GkBtbn8p%2BBZ%2F2GCZRsSf92ZhB4COiz%2FFf9H%2FAb6oexxnpBFzAAAAAElFTkSuQmCC)
[![nest badge](https://nest.land/badge.svg)](https://nest.land/package/init)

`deno-init` initializes a Deno configuration file from the command line.

Previous versions also initialized entrypoints, but that functionality has been
moved to a different [project](https://github.com/GJZwiers/mod). From v2 onwards
this module is purely for generating config.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Options](#options)
- [Contributing](#contributing)

## Installation

```
deno install --allow-read --allow-write -fn deno-init https://deno.land/x/init@v2.1.1/mod.ts
```

## Usage

```
deno-init
```

## Options

`--help` or `-h` will print the CLI documentation to the terminal.

`--yes` or `-y` will skip the prompts and initialize the file in the current
working directory with default values:

```
deno-init --yes
```

`--fmt` or `-m` will set up `fmt` options only.

```
deno-init --fmt
```

`--lint` or `-l` will set up `lint` options only.

```
deno-init --lint
```

`--tsconfig` or `-t` will add `compilerOptions` only.

```
deno-init --tsconfig
```

`--name` or `-n` will use a non-default name for the config file. The default
name is `deno.json`.

```
deno-init --name config.json
```

## Contributing

Bug reports, other issues or feature requests are welcome!
