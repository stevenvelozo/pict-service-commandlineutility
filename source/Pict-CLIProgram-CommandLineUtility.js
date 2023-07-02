const libPict = require('pict');

// The command line utility class is a service that wraps the commander framework
const libServiceCommandLineUtility = require('./Pict-Service-CommandLineUtility.js');
// The command line command class is a service that wraps specific commands for the commander framework
const libServiceCommandLineCommand = require('./Pict-Service-CommandLineCommand.js');

const defaultCommandLineUtilityOptions = (
	{
		"Product": "Pict CLI Utility",
		"Version": "0.0.1",

		"Command": "DEFAULT_COMMAND",

		"Description": "Default Command-line Utility",
	});

class CLIProgram extends libPict
{
	constructor(pSettings, pCommands)
	{
		let tmpSettings = Object.assign({}, JSON.parse(JSON.stringify(defaultCommandLineUtilityOptions)), pSettings);
		super(pSettings);

		this.serviceManager.addServiceType('CommandLineUtility', libServiceCommandLineUtility);

		// Instantiate the Command Line Utility service
		this.serviceManager.instantiateServiceProvider('CommandLineUtility',
		{
			"Command": this.settings.Command,
			"Description": this.settings.Description,
			"Version": this.settings.Version
		});

		// Add the Commands.  If none were passed in, put in a default placeholder
		if (Array.isArray(pCommands) && pCommands.length > 0)
		{
			// pCommands is expected to be an array that is a list of prototypes for commands, which are self-contained services!
			for (let i = 0; i < pCommands.length; i++)
			{
				this.CommandLineUtility.addCommandFromClass(pCommands[i]);
			}
		}
		else
		{
			this.CommandLineUtility.addCommandFromClass(require('./Pict-CLIProgram-CommandLineCommand-DefaultPlaceholder.js'));
		}
	}

	run(pArgumentString)
	{
		this.CommandLineUtility.run(pArgumentString);
	}
}

module.exports = CLIProgram;

module.exports.ServiceCommandLineUtility = libServiceCommandLineUtility;
module.exports.ServiceCommandLineCommand = libServiceCommandLineCommand;