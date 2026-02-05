# API Reference

Complete API documentation for Pict-Service-CommandLineUtility.

## CLIProgram

The main class for creating CLI applications. Extends Pict.

### Constructor

```javascript
new CLIProgram(pSettings, pCommands)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `pSettings` | object | Program configuration |
| `pCommands` | array | Array of command classes |

### Methods

#### run(pArgumentString)

Runs the CLI program.

```javascript
myCLI.run();              // Parse process.argv
myCLI.run('help');        // Run specific command
```

#### gatherProgramConfiguration(pAutoApplyConfiguration)

Gathers configuration from all sources.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `pAutoApplyConfiguration` | boolean | `true` | Whether to apply the gathered config |

**Returns:** Configuration explanation object

#### addConfigurationExplanationCommand()

Adds the `explain-config` command to the program.

---

## ServiceCommandLineCommand

Base class for creating commands.

### Constructor

```javascript
constructor(pFable, pOptions, pServiceHash)
```

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `pict` | object | Reference to Pict instance |
| `options` | object | Command configuration |
| `ArgumentString` | string | The argument string passed to the command |
| `CommandOptions` | object | Parsed command options |

### Command Options

Set these in the constructor before calling `addCommand()`:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `CommandKeyword` | string | 'default' | The command name |
| `Description` | string | 'Default command' | Command description |
| `Aliases` | array | `[]` | Alternative command names |
| `CommandOptions` | array | `[]` | Command-line options |
| `CommandArguments` | array | `[]` | Positional arguments |

### Lifecycle Methods

#### onBeforeRun()

Called before the main command execution. Override for setup logic.

#### onRun()

Main command execution. Override with your command logic.

#### onAfterRun()

Called after the main command execution. Override for cleanup logic.

### Async Lifecycle Methods

#### onBeforeRunAsync(fCallback)

Async version of `onBeforeRun`.

#### onRunAsync(fCallback)

Async version of `onRun`.

#### onAfterRunAsync(fCallback)

Async version of `onAfterRun`.

### Methods

#### addCommand()

Registers the command with the CLI program. Call in constructor after setting options.

#### runAsync(pArgumentString, pCommandOptions, fCallback)

Runs the command asynchronously.

#### runPromise(pArgumentString, pCommandOptions)

Returns a Promise that resolves when the command completes.

---

## ServiceCommandLineUtility

Internal service that wraps Commander.js. Usually accessed via `this.CommandLineUtility`.

### Methods

#### addCommandFromClass(pCommandClass)

Adds a command from a class definition.

#### createCommand(pKeyword, pDescription)

Creates a new Commander command object.

#### run(pArgumentString)

Parses arguments and runs the appropriate command.

---

## Example: Complete CLI Application

```javascript
// index.js
const libCLIProgram = require('pict-service-commandlineutility');

const myCLI = new libCLIProgram(
    {
        Product: 'data-tool',
        Version: '1.0.0',
        Command: 'datatool',
        Description: 'Data manipulation tool',
        AutoGatherProgramConfiguration: true,
        AutoAddConfigurationExplanationCommand: true,
        DefaultProgramConfiguration: {
            outputFormat: 'json'
        }
    },
    [
        require('./commands/ExportCommand'),
        require('./commands/ImportCommand'),
        require('./commands/TransformCommand')
    ]);

myCLI.run();
```

```javascript
// commands/ExportCommand.js
const libCommand = require('pict-service-commandlineutility').ServiceCommandLineCommand;

class ExportCommand extends libCommand
{
    constructor(pFable, pOptions, pServiceHash)
    {
        super(pFable, pOptions, pServiceHash);

        this.options.CommandKeyword = 'export';
        this.options.Description = 'Export data to a file';
        this.options.Aliases = ['e', 'exp'];

        this.options.CommandArguments = [
            { Name: '<source>', Description: 'Data source to export' }
        ];

        this.options.CommandOptions = [
            { Name: '-o, --output <file>', Description: 'Output file', Default: 'export.json' },
            { Name: '-f, --format <type>', Description: 'Output format', Default: 'json' }
        ];

        this.addCommand();
    }

    onRun()
    {
        const source = this.ArgumentString;
        const output = this.CommandOptions.output;
        const format = this.CommandOptions.format;

        this.pict.log.info(`Exporting ${source} to ${output} as ${format}`);
        // Export logic here
    }
}

module.exports = ExportCommand;
```

Usage:

```bash
datatool export mydata -o output.csv -f csv
datatool e mydata --output=result.json
datatool explain-config
datatool --help
```
