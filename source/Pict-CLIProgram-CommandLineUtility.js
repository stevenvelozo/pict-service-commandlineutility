const libPict = require('pict');

const libOS = require('os');

// The command line utility class is a service that wraps the commander framework
const libServiceCommandLineUtility = require('./Pict-Service-CommandLineUtility.js');
// The command line command class is a service that wraps specific commands for the commander framework
const libServiceCommandLineCommand = require('./Pict-Service-CommandLineCommand.js');

const defaultCommandLineUtilityOptions = (
	{
		"Product": "Pict CLI Utility",
		"Version": "0.0.1",

		"Command": "DEFAULT_COMMAND",

		"Description": "Default Command-line Utility",

		"AutoGatherProgramConfiguration": false,
		"AutoAddConfigurationExplanationCommand": false
	});

class CLIProgram extends libPict
{
	constructor(pSettings, pCommands)
	{
		let tmpSettings = Object.assign({}, JSON.parse(JSON.stringify(defaultCommandLineUtilityOptions)), pSettings);
		super(pSettings);

		// The CLI Program requires file persistence functionality to load configurations
		this.serviceManager.instantiateServiceProvider('FilePersistence');

		this.serviceManager.addServiceType('CommandLineUtility', libServiceCommandLineUtility);

		if (!this.settings.hasOwnProperty('ProgramConfigurationFileName'))
		{
			this.settings.ProgramConfigurationFileName = `.${this.settings.Command}-config.json`;
		}

		// Instantiate the Command Line Utility service
		this.serviceManager.instantiateServiceProvider('CommandLineUtility',
		{
			"Command": this.settings.Command,
			"Description": this.settings.Description,
			"Version": this.settings.Version
		});

		if (this.settings.AutoGatherProgramConfiguration)
		{
			this.gatherProgramConfiguration();
		}
		else
		{
			if (!this.settings.hasOwnProperty('ProgramConfiguration'))
			{
				this.settings.ProgramConfiguration = {};
			}
		}

		if (this.settings.AutoAddConfigurationExplanationCommand)
		{
			this.addConfigurationExplanationCommand();
		}

		// Add the Commands.  If none were passed in, put in a default placeholder
		if (Array.isArray(pCommands) && pCommands.length > 0)
		{
			// pCommands is expected to be an array that is a list of prototypes for commands, which are self-contained services!
			for (let i = 0; i < pCommands.length; i++)
			{
				this.CommandLineUtility.addCommandFromClass(pCommands[i]);
			}
		}
		else
		{
			this.CommandLineUtility.addCommandFromClass(require('./Pict-CLIProgram-CommandLineCommand-DefaultPlaceholder.js'));
		}
	}

	addConfigurationExplanationCommand()
	{
		this.CommandLineUtility.addCommandFromClass(require('./Pict-CLIProgram-CommandLineCommand-ExplainConfig.js'));
	}

	// Check a chain of locations for a configuration file, to be used in the app (e.g. for passwords, etc.):
	// 5. Constructor settings for a "DefaultProgramConfiguration"
	// 4. Constructor settings for a "ProgramConfiguration"
	// 3. Home folder for a settings.ProgramConfigurationFileName configuration file
	// 2. CWD/.config/ for a settings.ProgramConfigurationFileName configuration file
	// 1. CWD for a settings.ProgramConfigurationFileName configuration file
	// And merge them....
	// TODO: Check if this should be a merge or a pick the highest in chain.
	gatherProgramConfiguration(pAutoApplyConfiguration)
	{
		let tmpAutoApplyConfiguration = typeof(pAutoApplyConfiguration) == 'undefined' ? true : pAutoApplyConfiguration;
		let tmpNewConfiguration = {};
		let tmpConfigurationExplanation = (
			{
				ConfigurationOutcome: false,
				GatherPhases: []
			});

		// Add a configuration phase to the "explain" object
		let fAddConfigurationPhase = (pConfigurationGatherPhase, pConfigurationPath, pConfiguration) =>
			{
				tmpConfigurationExplanation.GatherPhases.push(
					{
						Phase: pConfigurationGatherPhase,
						Path: pConfigurationPath,
						Configuration: pConfiguration
					});
			};

		if (this.settings.hasOwnProperty('DefaultProgramConfiguration'))
		{
			// Constructor settings for a "DefaultProgramConfiguration"
			tmpNewConfiguration = Object.assign(tmpNewConfiguration, this.settings.DefaultProgramConfiguration);
			fAddConfigurationPhase('Default Program Configuration', 'this.settings.DefaultProgramConfiguration', this.settings.DefaultProgramConfiguration);
		}
		if (this.settings.hasOwnProperty('ProgramConfiguration'))
		{
			// Constructor settings for a "ProgramConfiguration"
			let tmpCurrentProgramConfiguration = typeof(this.settings.ProgramConfiguration) == 'undefined' ? {} : this.settings.ProgramConfiguration;
			tmpNewConfiguration = Object.assign(tmpNewConfiguration, tmpCurrentProgramConfiguration);
			fAddConfigurationPhase('Program Configuration', 'this.settings.ProgramConfiguration', tmpCurrentProgramConfiguration);
		}
		try
		{
			let tmpHomeFolder = libOS.homedir();
			try
			{
				// Home folder for a settings.ProgramConfigurationFileName configuration file
				let tmpHomeConfigurationFilePath = `${tmpHomeFolder}/${this.settings.ProgramConfigurationFileName}`;
				if (this.services.FilePersistence.existsSync(tmpHomeConfigurationFilePath))
				{
					let tmpHomeConfiguration = require(tmpHomeConfigurationFilePath);
					tmpNewConfiguration = Object.assign(tmpNewConfiguration, tmpHomeConfiguration);
					fAddConfigurationPhase('Home Folder', tmpHomeConfigurationFilePath, tmpHomeConfiguration);
				}
			}
			catch(pError)
			{
				this.log.error(`Error loading configuration file from home folder [${tmpHomeFolder}]: ${pError.message}`);
			}
		}
		catch(pHomeError)
		{
			this.log.error(`Error getting home folder: ${pHomeError.message}`);
		}
		try
		{
			let tmpCWD = process.cwd();
			try
			{
				// CWD for a settings.ProgramConfigurationFileName configuration file
				let tmpCWDConfigurationFilePath = `${tmpCWD}/${this.settings.ProgramConfigurationFileName}`;
				if (this.services.FilePersistence.existsSync(tmpCWDConfigurationFilePath))
				{
					let tmpCWDConfiguration = require(tmpCWDConfigurationFilePath);
					tmpNewConfiguration = Object.assign(tmpNewConfiguration, require(tmpCWDConfigurationFilePath));
					fAddConfigurationPhase('CWD Configuration', tmpCWDConfigurationFilePath, tmpCWDConfiguration);
				}
			}
			catch(pError)
			{
				this.log.error(`Error loading configuration file from CWD [${tmpCWD}]: ${pError.message}`);
			}
			// TODO: If someone has configs everywhere (e.g. cwd and cwd/.config), which one comes first?
			try
			{
				// CWD/.config/ for a settings.ProgramConfigurationFileName configuration file
				let tmpCWDConfigFolder = `${tmpCWD}/.config`
				let tmpCWDConfigurationFileName = `${tmpCWDConfigFolder}/${this.settings.ProgramConfigurationFileName}`;
				if (this.services.FilePersistence.existsSync(tmpCWDConfigFolder) && this.services.FilePersistence.existsSync(tmpCWDConfigurationFileName))
				{
					let tmpCWDConfigFolderConfiguration = require(tmpCWDConfigurationFileName);
					tmpNewConfiguration = Object.assign(tmpNewConfiguration, tmpCWDConfigFolderConfiguration);
					fAddConfigurationPhase('CWD Config Folder Configuration', tmpCWDConfigurationFileName, tmpCWDConfigFolderConfiguration);
				}
			}
			catch(pError)
			{
				this.log.error(`Error loading configuration file from CWD/.config [${tmpCWD}/.config]: ${pError.message}`);
			}
		}
		catch(pCWDError)
		{
			this.log.error(`Error getting CWD: ${pCWDError.message}`);
		}

		tmpConfigurationExplanation.ConfigurationOutcome = tmpNewConfiguration

		if (tmpAutoApplyConfiguration)
		{
			this.ProgramConfiguration = tmpNewConfiguration;
		}

		return tmpConfigurationExplanation;
	}

	run(pArgumentString)
	{
		this.CommandLineUtility.run(pArgumentString);
	}
}

module.exports = CLIProgram;

module.exports.ServiceCommandLineUtility = libServiceCommandLineUtility;
module.exports.ServiceCommandLineCommand = libServiceCommandLineCommand;