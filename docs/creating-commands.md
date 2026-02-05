# Creating Commands

This guide covers how to create commands for your CLI application.

## Basic Command

Create a command by extending `ServiceCommandLineCommand`:

```javascript
const libCommandLineCommand = require('pict-service-commandlineutility').ServiceCommandLineCommand;

class MyCommand extends libCommandLineCommand
{
    constructor(pFable, pOptions, pServiceHash)
    {
        super(pFable, pOptions, pServiceHash);

        // Set command keyword and description
        this.options.CommandKeyword = 'mycommand';
        this.options.Description = 'Does something useful';

        // Register the command
        this.addCommand();
    }

    onRun()
    {
        // Your command logic here
        console.log('Command executed!');
    }
}

module.exports = MyCommand;
```

## Command Options

Commands can have options that users pass via flags:

```javascript
class CommandWithOptions extends libCommandLineCommand
{
    constructor(pFable, pOptions, pServiceHash)
    {
        super(pFable, pOptions, pServiceHash);

        this.options.CommandKeyword = 'generate';
        this.options.Description = 'Generate some output';

        // Define command options
        this.options.CommandOptions = [
            {
                Name: '-c, --count <number>',
                Description: 'Number of items to generate',
                Default: '10'
            },
            {
                Name: '-f, --format <type>',
                Description: 'Output format (json, text)',
                Default: 'text'
            }
        ];

        this.addCommand();
    }

    onRun()
    {
        const count = parseInt(this.CommandOptions.count);
        const format = this.CommandOptions.format;

        this.pict.log.info(`Generating ${count} items in ${format} format`);
    }
}
```

## Command Arguments

Commands can also accept positional arguments:

```javascript
class CommandWithArguments extends libCommandLineCommand
{
    constructor(pFable, pOptions, pServiceHash)
    {
        super(pFable, pOptions, pServiceHash);

        this.options.CommandKeyword = 'process';
        this.options.Description = 'Process a file';

        // Define command arguments
        this.options.CommandArguments = [
            {
                Name: '<filename>',
                Description: 'File to process'
            },
            {
                Name: '[output]',
                Description: 'Optional output file',
                Default: 'output.txt'
            }
        ];

        this.addCommand();
    }

    onRun()
    {
        console.log(`Processing: ${this.ArgumentString}`);
    }
}
```

## Command Aliases

Add aliases for your command:

```javascript
this.options.Aliases = ['mc', 'my'];  // Users can type 'mc' or 'my' instead of 'mycommand'
```

## Lifecycle Hooks

Commands support three lifecycle hooks:

| Hook | Description |
|------|-------------|
| `onBeforeRun()` | Called before main execution |
| `onRun()` | Main command execution |
| `onAfterRun()` | Called after main execution |

Each hook has an async variant:

```javascript
onBeforeRunAsync(fCallback)
{
    // Do async setup
    this.loadDataAsync((err, data) => {
        this.data = data;
        fCallback(err);
    });
}

onRunAsync(fCallback)
{
    // Do async work
    this.processDataAsync(this.data, fCallback);
}

onAfterRunAsync(fCallback)
{
    // Do async cleanup
    this.saveResultsAsync(fCallback);
}
```

## Using Pict Services

Commands have full access to Pict services:

```javascript
onRun()
{
    // Logging
    this.pict.log.info('Starting command');

    // Data generation
    const dataGen = this.pict.instantiateServiceProvider('DataGeneration');
    const name = dataGen.randomName();

    // Program configuration
    const config = this.pict.ProgramConfiguration;

    // App data
    this.pict.AppData.result = 'success';
}
```

## Complete Example

```javascript
const libCommandLineCommand = require('pict-service-commandlineutility').ServiceCommandLineCommand;

class GenerateNamesCommand extends libCommandLineCommand
{
    constructor(pFable, pOptions, pServiceHash)
    {
        super(pFable, pOptions, pServiceHash);

        this.options.CommandKeyword = 'names';
        this.options.Description = 'Generate random names';
        this.options.Aliases = ['n'];

        this.options.CommandOptions = [
            {
                Name: '-c, --count <number>',
                Description: 'Number of names to generate',
                Default: '5'
            }
        ];

        this.addCommand();
    }

    onRun()
    {
        const count = parseInt(this.CommandOptions.count);
        const dataGen = this.pict.instantiateServiceProvider('DataGeneration');

        this.pict.log.info(`Generating ${count} names...`);

        for (let i = 0; i < count; i++)
        {
            console.log(`${dataGen.randomName()} ${dataGen.randomSurname()}`);
        }
    }
}

module.exports = GenerateNamesCommand;
```
