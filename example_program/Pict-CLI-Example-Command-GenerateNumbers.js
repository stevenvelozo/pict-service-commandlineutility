const libCommandLineCommand = require('./Pict-Service-CommandLineUtility-Abstraction.js').ServiceCommandLineCommand;

class CommandGenerateNumbers extends libCommandLineCommand
{
	constructor(pFable, pManifest, pServiceHash)
	{
		super(pFable, pManifest, pServiceHash);

		// This is what the command uses to register itself with the base utility app
		this.options.CommandKeyword = 'numbers';

		this.options.CommandArguments.push({ Name: '<number_count>', Description: 'How many numbers to generate.' });

		this.options.Description = 'Generate numbers.';

		this.addCommand();
	}

	onRunAsync(fCallback)
	{
		//this.fable.log.info('Generating names...');
		let tmpDataGeneration = this.pict.instantiateServiceProvider('DataGeneration');

		for (let i = 0; i < this.ArgumentString; i++)
		{
			console.log(`${tmpDataGeneration.randomIntegerBetween(0, 1000000)}`);
		}
		//this.fable.log.info('...names generated.');
		return fCallback();
	}
}

module.exports = CommandGenerateNumbers;