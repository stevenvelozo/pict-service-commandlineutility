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

	onRun()
	{
		// Execute the command
		this.log.info(`Gathering and explaining configuration...`);
		// By passing in false, it doesn't apply the config and just explains it and returns the explanation object.
		let tmpConfigurationExplanation = this.fable.gatherProgramConfiguration(false);
		this.log.info(`Explanation`, tmpConfigurationExplanation);
	};
}

module.exports = ExplainConfigCommand;