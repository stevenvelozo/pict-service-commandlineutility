# Program Configuration

Pict-Service-CommandLineUtility supports cascading configuration from multiple sources.

## Configuration Sources

Configuration is gathered from these locations (in order of precedence):

1. **DefaultProgramConfiguration** - Defaults set in constructor
2. **ProgramConfiguration** - Configuration set in constructor
3. **Home folder** - `~/.{command}-config.json`
4. **CWD** - `./{command}-config.json`
5. **CWD/.config** - `./.config/{command}-config.json`

Later sources override earlier ones, allowing users to customize behavior at different levels.

## Enabling Configuration Gathering

```javascript
const libCLIProgram = require('pict-service-commandlineutility');

const myCLI = new libCLIProgram({
    Product: 'my-tool',
    Version: '1.0.0',
    Command: 'mytool',
    Description: 'My CLI tool',

    // Default configuration values
    DefaultProgramConfiguration: {
        outputFormat: 'json',
        maxItems: 100
    },

    // Custom config file name (default: .{Command}-config.json)
    ProgramConfigurationFileName: '.mytool-config.json',

    // Enable automatic configuration gathering
    AutoGatherProgramConfiguration: true,

    // Add built-in 'explain-config' command
    AutoAddConfigurationExplanationCommand: true
});
```

## Accessing Configuration

In your commands, access configuration via `this.pict.ProgramConfiguration`:

```javascript
onRun()
{
    const config = this.pict.ProgramConfiguration;

    console.log(`Output format: ${config.outputFormat}`);
    console.log(`Max items: ${config.maxItems}`);
}
```

## Configuration File Format

Configuration files are JSON:

```json
{
    "outputFormat": "text",
    "maxItems": 50,
    "apiKey": "your-api-key",
    "endpoints": {
        "production": "https://api.example.com",
        "staging": "https://staging.example.com"
    }
}
```

## Configuration Explanation Command

When `AutoAddConfigurationExplanationCommand` is enabled, users can run:

```bash
mytool explain-config
```

This shows where each configuration value came from, helpful for debugging configuration issues.

## Manual Configuration Gathering

You can also gather configuration manually:

```javascript
// Gather and apply configuration
const explanation = myCLI.gatherProgramConfiguration();

// Gather without applying (just return the explanation)
const explanation = myCLI.gatherProgramConfiguration(false);

// The explanation object contains:
// {
//     ConfigurationOutcome: { ... merged config ... },
//     GatherPhases: [
//         { Phase: 'Default Program Configuration', Path: '...', Configuration: {...} },
//         { Phase: 'Home Folder', Path: '/home/user/.mytool-config.json', Configuration: {...} },
//         ...
//     ]
// }
```

## Program Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `Product` | string | 'Pict CLI Utility' | Product name for logging |
| `Version` | string | '0.0.1' | Program version |
| `Command` | string | 'DEFAULT_COMMAND' | Command keyword |
| `Description` | string | 'Default Command-line Utility' | Program description |
| `DefaultProgramConfiguration` | object | `{}` | Default configuration values |
| `ProgramConfiguration` | object | `{}` | Initial configuration values |
| `ProgramConfigurationFileName` | string | `.{Command}-config.json` | Config file name |
| `AutoGatherProgramConfiguration` | boolean | `false` | Auto-gather configuration on start |
| `AutoAddConfigurationExplanationCommand` | boolean | `false` | Add explain-config command |
