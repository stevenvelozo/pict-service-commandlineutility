const libCommandLineCommand = require('./Pict-Service-CommandLineCommand.js');

class PlaceholderCommand extends libCommandLineCommand
{
	constructor(pFable, pManifest, pServiceHash)
	{
		super(pFable, pManifest, pServiceHash);

		this.options.CommandKeyword = 'placeholder';
		this.options.Description = 'Default placeholder command when a CLI utility has not been passed prototypes.';

		// Auto add the command on initialization
		this.addCommand();
	}

	onRun()
	{
		// Execute the command
		this.log.info(`Running placeholder command...`);
		this.log.info(`...placeholder command succesfully executed!`);
	};
}

module.exports = PlaceholderCommand;