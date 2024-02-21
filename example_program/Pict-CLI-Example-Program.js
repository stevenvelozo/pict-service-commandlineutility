const libCLIProgram = require('./Pict-Service-CommandLineUtility-Abstraction.js');

const _PictCLIProgram = new libCLIProgram(
	{
		Product: 'pict-example-program',
		Version: '0.0.1',

		Command: 'pict-example',
		Description: "Provide examples of a Command-Line utility program.",

		// This object is passed into the program's command as the prototype for the command's configuration.
		DefaultProgramConfiguration: { "GeneratedDataCount": 10 },

		// The following lines are optional, but allow a program to have "cascading" configurations and command-line explanations for this cascading.
		ProgramConfigurationFileName: '.example.json',
		AutoGatherProgramConfiguration: true,
		AutoAddConfigurationExplanationCommand: true
	},
	[
		// Each of these require statements provide a single isolated "command" to the CLI program.
		require('./Pict-CLI-Example-Command-GenerateNames.js'),
		require('./Pict-CLI-Example-Command-GenerateNumbers.js'),
		require('./Pict-CLI-Example-Command-CountSymbols.js')
	]);