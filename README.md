translation-ai-cli
=================

A new CLI generated with oclif


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/translation-ai-cli.svg)](https://npmjs.org/package/translation-ai-cli)
[![Downloads/week](https://img.shields.io/npm/dw/translation-ai-cli.svg)](https://npmjs.org/package/translation-ai-cli)


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g translation-ai-cli
$ translation-ai-cli COMMAND
running command...
$ translation-ai-cli (--version)
translation-ai-cli/0.0.0 darwin-arm64 node-v22.20.0
$ translation-ai-cli --help [COMMAND]
USAGE
  $ translation-ai-cli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`translation-ai-cli hello PERSON`](#translation-ai-cli-hello-person)
* [`translation-ai-cli hello world`](#translation-ai-cli-hello-world)
* [`translation-ai-cli help [COMMAND]`](#translation-ai-cli-help-command)
* [`translation-ai-cli plugins`](#translation-ai-cli-plugins)
* [`translation-ai-cli plugins add PLUGIN`](#translation-ai-cli-plugins-add-plugin)
* [`translation-ai-cli plugins:inspect PLUGIN...`](#translation-ai-cli-pluginsinspect-plugin)
* [`translation-ai-cli plugins install PLUGIN`](#translation-ai-cli-plugins-install-plugin)
* [`translation-ai-cli plugins link PATH`](#translation-ai-cli-plugins-link-path)
* [`translation-ai-cli plugins remove [PLUGIN]`](#translation-ai-cli-plugins-remove-plugin)
* [`translation-ai-cli plugins reset`](#translation-ai-cli-plugins-reset)
* [`translation-ai-cli plugins uninstall [PLUGIN]`](#translation-ai-cli-plugins-uninstall-plugin)
* [`translation-ai-cli plugins unlink [PLUGIN]`](#translation-ai-cli-plugins-unlink-plugin)
* [`translation-ai-cli plugins update`](#translation-ai-cli-plugins-update)

## `translation-ai-cli hello PERSON`

Say hello

```
USAGE
  $ translation-ai-cli hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ translation-ai-cli hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [src/commands/hello/index.ts](https://github.com/ibm-skills-network/translation-ai-cli/blob/v0.0.0/src/commands/hello/index.ts)_

## `translation-ai-cli hello world`

Say hello world

```
USAGE
  $ translation-ai-cli hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ translation-ai-cli hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [src/commands/hello/world.ts](https://github.com/ibm-skills-network/translation-ai-cli/blob/v0.0.0/src/commands/hello/world.ts)_

## `translation-ai-cli help [COMMAND]`

Display help for translation-ai-cli.

```
USAGE
  $ translation-ai-cli help [COMMAND...] [-n]

ARGUMENTS
  [COMMAND...]  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for translation-ai-cli.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.33/src/commands/help.ts)_

## `translation-ai-cli plugins`

List installed plugins.

```
USAGE
  $ translation-ai-cli plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ translation-ai-cli plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.50/src/commands/plugins/index.ts)_

## `translation-ai-cli plugins add PLUGIN`

Installs a plugin into translation-ai-cli.

```
USAGE
  $ translation-ai-cli plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into translation-ai-cli.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the TRANSLATION_AI_CLI_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the TRANSLATION_AI_CLI_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ translation-ai-cli plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ translation-ai-cli plugins add myplugin

  Install a plugin from a github url.

    $ translation-ai-cli plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ translation-ai-cli plugins add someuser/someplugin
```

## `translation-ai-cli plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ translation-ai-cli plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ translation-ai-cli plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.50/src/commands/plugins/inspect.ts)_

## `translation-ai-cli plugins install PLUGIN`

Installs a plugin into translation-ai-cli.

```
USAGE
  $ translation-ai-cli plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into translation-ai-cli.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the TRANSLATION_AI_CLI_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the TRANSLATION_AI_CLI_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ translation-ai-cli plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ translation-ai-cli plugins install myplugin

  Install a plugin from a github url.

    $ translation-ai-cli plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ translation-ai-cli plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.50/src/commands/plugins/install.ts)_

## `translation-ai-cli plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ translation-ai-cli plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ translation-ai-cli plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.50/src/commands/plugins/link.ts)_

## `translation-ai-cli plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ translation-ai-cli plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ translation-ai-cli plugins unlink
  $ translation-ai-cli plugins remove

EXAMPLES
  $ translation-ai-cli plugins remove myplugin
```

## `translation-ai-cli plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ translation-ai-cli plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.50/src/commands/plugins/reset.ts)_

## `translation-ai-cli plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ translation-ai-cli plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ translation-ai-cli plugins unlink
  $ translation-ai-cli plugins remove

EXAMPLES
  $ translation-ai-cli plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.50/src/commands/plugins/uninstall.ts)_

## `translation-ai-cli plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ translation-ai-cli plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ translation-ai-cli plugins unlink
  $ translation-ai-cli plugins remove

EXAMPLES
  $ translation-ai-cli plugins unlink myplugin
```

## `translation-ai-cli plugins update`

Update installed plugins.

```
USAGE
  $ translation-ai-cli plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.50/src/commands/plugins/update.ts)_
<!-- commandsstop -->
