# Pict-Service-CommandLineUtility

> Build command-line applications with Pict and Commander.js

Pict-Service-CommandLineUtility provides a framework for building command-line applications using Pict. It wraps the Commander.js library and integrates it with Pict's service architecture, giving you access to logging, configuration, data generation, and all other Pict services in your CLI commands.

## Features

- **Simple Command Definition** - Create commands as Pict services with lifecycle hooks
- **Cascading Configuration** - Automatically gather configuration from multiple sources
- **Commander.js Integration** - Built on the robust Commander.js argument parsing library
- **Full Pict Access** - Use logging, templates, data generation, and all Pict services
- **Async Support** - Both synchronous and asynchronous command execution
- **Configuration Explanation** - Built-in command to explain where configuration came from

## Quick Start

```javascript
const libCLIProgram = require('pict-service-commandlineutility');

// Create your CLI program
const myCLI = new libCLIProgram(
    {
        Product: 'my-cli-tool',
        Version: '1.0.0',
        Command: 'mytool',
        Description: 'My awesome CLI tool'
    },
    [
        require('./commands/MyCommand.js')
    ]);

// Run the program
myCLI.run();
```

## Installation

```bash
npm install pict-service-commandlineutility
```

## Creating a Command

Commands are Pict services that define their behavior through lifecycle hooks:

```javascript
const libCommandLineCommand = require('pict-service-commandlineutility').ServiceCommandLineCommand;

class HelloCommand extends libCommandLineCommand
{
    constructor(pFable, pOptions, pServiceHash)
    {
        super(pFable, pOptions, pServiceHash);
        this.options.CommandKeyword = 'hello';
        this.options.Description = 'Say hello';
        this.addCommand();
    }

    onRun()
    {
        console.log('Hello, World!');
    }
}

module.exports = HelloCommand;
```

## Documentation

- [Creating Commands](creating-commands.md) - Guide to building CLI commands
- [Program Configuration](configuration.md) - Configuration options and cascading
- [API Reference](api-reference.md) - Complete API documentation

## Related Packages

- [pict](https://github.com/stevenvelozo/pict) - Core Pict framework
- [pict-serviceproviderbase](https://github.com/stevenvelozo/pict-serviceproviderbase) - Service provider base class
- [fable](https://github.com/stevenvelozo/fable) - Service provider framework
- [commander](https://github.com/tj/commander.js) - Command-line argument parsing
