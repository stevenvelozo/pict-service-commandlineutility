const libCommandLineCommand = require('./Pict-Service-CommandLineCommand.js');

class ExplainConfigCommand extends libCommandLineCommand
{
	constructor(pFable, pSettings, pServiceHash)
	{
		super(pFable, pSettings, pServiceHash);
		this.options.CommandKeyword = 'explain-config';
		this.options.Description = 'Explain the current configuration';
		this.addCommand();
	}

	run(pOptions, pCommand, fCallback)
	{
		// Execute the command
		this.log.info(`Gathering and explaining configuration...`);

		// By passing in false, it doesn't apply the config and just explains it.
		let tmpConfigurationExplanation = this.fable.gatherProgramConfiguration(false);

		this.log.info(`Explanation`, tmpConfigurationExplanation);

		if (typeof (fCallback) == 'function')
		{
			return fCallback();
		}
	};
}

module.exports = ExplainConfigCommand;