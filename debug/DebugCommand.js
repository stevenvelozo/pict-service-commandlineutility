const libCLICommandLineCommand = require('../source/Pict-CLIProgram-CommandLineUtility.js').ServiceCommandLineCommand;

class HarnessDebugCommand extends libCLICommandLineCommand
{
	constructor(pFable, pSettings, pServiceHash)
	{
		super(pFable, pSettings, pServiceHash);

		this.options.CommandKeyword = 'kobayashi';
		this.options.Description = 'Perform the kobayashi maru from a command-line command.';

		this.addCommand();
	}

	onRun()
	{
		this.log.info(`Executing the kobayashi maru.`);
	};
}

module.exports = HarnessDebugCommand;
