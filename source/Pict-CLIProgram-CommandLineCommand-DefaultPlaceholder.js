const libCommandLineCommand = require('./Pict-Service-CommandLineCommand.js');

class PlaceholderCommand extends libCommandLineCommand
{
	/**
	 * @param {import('pict')|Record<string, any>} [pFable] - (optional) The fable instance, or the options object if there is no fable
	 * @param {Record<string, any>|string} [pManifest] - (optional) The options object, or the service hash if there is no fable
	 * @param {string} [pServiceHash] - (optional) The service hash to identify this service instance
	 */
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
