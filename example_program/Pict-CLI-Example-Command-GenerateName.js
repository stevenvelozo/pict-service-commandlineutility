const libCommandLineCommand = require('./Pict-Service-CommandLineUtility-Abstraction.js').ServiceCommandLineCommand;

class CommandGenerateName extends libCommandLineCommand
{
	constructor(pFable, pManifest, pServiceHash)
	{
		super(pFable, pManifest, pServiceHash);
		this.options.CommandKeyword = 'name';
		this.options.Description = 'Generate a name.';
		this.addCommand();
	}

	onRun()
	{
		let tmpDataGeneration = this.pict.instantiateServiceProvider('DataGeneration');
		console.log(`${tmpDataGeneration.randomName()} ${tmpDataGeneration.randomSurname()}`);
	}
}

module.exports = CommandGenerateName;