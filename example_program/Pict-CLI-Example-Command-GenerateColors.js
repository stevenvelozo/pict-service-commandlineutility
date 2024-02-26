const libCommandLineCommand = require('./Pict-Service-CommandLineUtility-Abstraction.js').ServiceCommandLineCommand;

class CommandGenerateNames extends libCommandLineCommand
{
	constructor(pFable, pManifest, pServiceHash)
	{
		super(pFable, pManifest, pServiceHash);

		// This is what the command uses to register itself with the base utility app
		this.options.CommandKeyword = 'colors';

		this.options.Description = 'Generate a set of colors.';

		this.options.CommandArguments.push({ Name: '<number_count>', Description: 'How many colors to generate.' });

		this.options.CommandOptions.push({ Name: '-p, --prefix [prefix]', Description: 'Prefix text.', Default: ''});

		this.options.Aliases.push('clr');

		this.addCommand();
	}

	onBeforeRun()
	{
		//this.fable.log.info('GenerateNames.onBeforeRun');
	}

	onRun()
	{
		//this.fable.log.info('Generating names...');
		let tmpDataGeneration = this.pict.instantiateServiceProvider('DataGeneration');
		let tmpPrefix = (this.CommandOptions.prefix) ? this.CommandOptions.prefix : '';

		for (let i = 0; i < this.ArgumentString; i++)
		{
			console.log(`${tmpPrefix}${tmpDataGeneration.randomColor()}`);
		}
		//this.fable.log.info('...names generated.');
	}

	onAfterRun()
	{
		//this.fable.log.info('GenerateNames.onAfterRun');
	}
}

module.exports = CommandGenerateNames;