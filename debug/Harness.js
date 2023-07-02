const libCLIProgram = require('../source/Pict-CLIProgram-CommandLineUtility.js');

class HarnessDebugCommand extends libCLIProgram.ServiceCommandLineCommand
{
	constructor(pFable, pManifest, pServiceHash)
	{
		super(pFable, pManifest, pServiceHash);

		this.options.CommandKeyword = 'kobayashi';
		this.options.Description = 'Perform the kobayashi maru from a command-line command.';

		this.addCommand();
	}

	run(pOptions, pCommand, fCallback)
	{
		this.log.info(`Executing the kobayashi maru.`);

		if (typeof(fCallback) == 'function')
		{
			return fCallback();
		}
	};
}

let _Program = new libCLIProgram(
	{
		Product: 'Pict CLI Utility',
		Version: '0.0.1',
		
		Command: 'Harness',
		Description: 'Pict CLI Program Debug Harness'
	},
	[
		HarnessDebugCommand
	]);

_Program.run();