const libCommandLineCommand = require('./Pict-Service-CommandLineCommand.js');

class ExplainConfigCommand extends libCommandLineCommand
{
	/**
	 * @param {import('pict')|Record<string, any>} [pFable] - (optional) The fable instance, or the options object if there is no fable
	 * @param {Record<string, any>|string} [pOptions] - (optional) The options object, or the service hash if there is no fable
	 * @param {string} [pServiceHash] - (optional) The service hash to identify this service instance
	 */
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);

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
		// Generatee an explanation string
		let tmpExplanationString = JSON.stringify(tmpConfigurationExplanation, null, 4);

		const tmpExplanationLines = tmpExplanationString.split('\n');
		for (let i = 0; i < tmpExplanationLines.length; i++)
		{
			if (tmpExplanationLines[i].toLowerCase().includes('"password":'))
			{
				const tmpParts = tmpExplanationLines[i].split(':');
				if (tmpParts.length >= 2)
				{
					tmpExplanationLines[i] = `${tmpParts[0]}: "***REDACTED***"`;
				}
			}
		}
		tmpExplanationString = tmpExplanationLines.join('\n');

		console.log(tmpExplanationString);
	};
}

module.exports = ExplainConfigCommand;
