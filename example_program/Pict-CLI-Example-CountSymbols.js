const libCommandLineCommand = require('./Pict-Service-CommandLineUtility-Abstraction.js').ServiceCommandLineCommand;

class QuackageCommandLint extends libCommandLineCommand
{
	constructor(pFable, pManifest, pServiceHash)
	{
		super(pFable, pManifest, pServiceHash);

		// This is what the command uses to register itself with the base utility app
		this.options.CommandKeyword = 'count';

		this.options.Description = 'Count the symbols (in this case, words) in a given file or string.';

		this.addCommand();
	}

	onAfterRun()
	{
		this.fable.log('info', 'QuackageCommandLint.onAfterRun');
	}

}

module.exports = QuackageCommandLint;