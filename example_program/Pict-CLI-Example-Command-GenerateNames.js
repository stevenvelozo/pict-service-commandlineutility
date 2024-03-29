const libCommandLineCommand = require('./Pict-Service-CommandLineUtility-Abstraction.js').ServiceCommandLineCommand;

class CommandGenerateNames extends libCommandLineCommand
{
	constructor(pFable, pManifest, pServiceHash)
	{
		super(pFable, pManifest, pServiceHash);

		// This is what the command uses to register itself with the base utility app
		this.options.CommandKeyword = 'names';

		this.options.Description = 'Generate a set of names.';

		this.options.CommandOptions.push({ Name: '-c, --count [count]', Description: 'How many names to generate', Default: 15});

		this.options.Aliases.push('nms');

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

		for (let i = 0; i < this.CommandOptions.count; i++)
		{
			console.log(`${tmpDataGeneration.randomName()} ${tmpDataGeneration.randomSurname()}`);
		}
		//this.fable.log.info('...names generated.');
	}

	onAfterRun()
	{
		//this.fable.log.info('GenerateNames.onAfterRun');
	}
}

module.exports = CommandGenerateNames;