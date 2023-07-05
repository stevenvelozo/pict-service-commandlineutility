const libCLIProgram = require('../source/Pict-CLIProgram-CommandLineUtility.js');

const _ProgramConfiguration = (
	{
		Product: 'Pict CLI Utility',
		Version: '0.0.1',
		
		Command: 'Harness',
		Description: 'Pict CLI Program Debug Harness',

		ProgramConfigurationFileName: '.pict-cli-debugharness-config.json',

		DefaultProgramConfiguration:
			{
				UserID: 'TestUser',
				Password: 'TestPassword'
			},

		AutoGatherProgramConfiguration: true,
		AutoAddConfigurationExplanationCommand: true
	});

let _Program = new libCLIProgram(_ProgramConfiguration,
	[
		require('./DebugCommand.js')
	]);

_Program.LogNoisiness = 4;

_Program.run();