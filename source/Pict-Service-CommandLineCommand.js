const libPict = require('pict');

const defaultCommandOptions = (
	{
		"CommandKeyword": "default",
		"Description": "Default command",

		"Aliases": [],

		"CommandOptions": [],
		"CommandArguments": []
	});

class CommandLineCommand extends libPict.ServiceProviderBase
{
	constructor(pFable, pOptions, pServiceHash)
	{
		// Object.assign is recursive and pollutes middle objects in some environments.  UGH
		let tmpOptions = Object.assign({}, JSON.parse(JSON.stringify(defaultCommandOptions)), pOptions);
		super(pFable, tmpOptions, pServiceHash);

		this.AppData = this.fable.AppData;

		this.serviceType = 'CommandLineCommand';
	}

	addCommand()
	{
		if (!this.options.CommandAdded)
		{
			// Find the default CommandLineUtility service, or make one if it isn't there yet
			let tmpCommandLineUtility = this.services.CommandLineUtility
			if (typeof (tmpCommandLineUtility) === 'undefined')
			{
				tmpCommandLineUtility = this.fable.ServiceManager.instantiateService('CommandLineUtility');
			}

			//_Command.command('command_keyword')
			//  .description('The description of the command_keyword [abc] command')
			// Now add the command
			let tmpCommand = tmpCommandLineUtility.createCommand(this.options.CommandKeyword, this.options.Description);
			//  .alias('conf')
			for (let i = 0; i < this.options.Aliases.length; i++)
			{
				let tmpAlias = this.options.Aliases[i];
				tmpCommand.alias(tmpAlias);
			}


			//  .argument('[config]', 'optional hash of the configuration you want to run -- otherwise all are built', "ALL")
			for (let i = 0; i < this.options.CommandArguments.length; i++)
			{
				let tmpArgument = this.options.CommandArguments[i];
				tmpCommand.argument(tmpArgument.Name, tmpArgument.Description, tmpArgument.Default);
			}
			//  .option('-f, --force', 'force')
			//  .option('-s, --separator <char>', 'separator character', ',')
			for (let i = 0; i < this.options.CommandOptions.length; i++)
			{
				let tmpOption = this.options.CommandOptions[i];
				tmpCommand.option(tmpOption.Name, tmpOption.Description, tmpOption.Default);
			}
			//  .action((pString, pOptions) => { });
			tmpCommand.action(this.runAsync.bind(this));
		}
		else
		{
			this.log.error(`Command ${this.options.CommandKeyword} already added to the command line utility!`);
		}
	}

	onBeforeRun(pArgumentString, pCommandOptions)
	{
		if (this.pict.LogNoisiness > 3)
		{
			this.log.trace(`PictCLI [${this.UUID}]::[${this.Hash}] ${this.options.Name} onBeforeRun...`);
		}
	}

	onRun(pArgumentString, pCommandOptions)
	{
		if (this.pict.LogNoisiness > 3)
		{
			this.log.trace(`PictCLI [${this.UUID}]::[${this.Hash}] ${this.options.Name} onRun...`);
		}
	}

	onAfterRun(pArgumentString, pCommandOptions)
	{
		if (this.pict.LogNoisiness > 3)
		{
			this.log.trace(`PictCLI [${this.UUID}]::[${this.Hash}] ${this.options.Name} onAfterRun...`);
		}
	}

	onBeforeRunAsync(pArgumentString, pCommandOptions, fCallback)
	{
		try
		{
			let tmpResult = this.onBeforeRun(pArgumentString, pCommandOptions);
			return fCallback(null, tmpResult);
		}
		catch(pError)
		{
			return fCallback(pError)
		}
	}

	onRunAsync(pArgumentString, pCommandOptions, fCallback)
	{
		try
		{
			let tmpResult = this.onRun(pArgumentString, pCommandOptions);
			return fCallback(null, tmpResult);
		}
		catch(pError)
		{
			return fCallback(pError)
		}
	}

	onAfterRunAsync(pArgumentString, pCommandOptions, fCallback)
	{
		try
		{
			let tmpResult = this.onAfterRun(pArgumentString, pCommandOptions);
			return fCallback(null, tmpResult);
		}
		catch(pError)
		{
			return fCallback(pError)
		}
	}

	async runAsync(pArgumentString, pCommandOptions, fCallback)
	{
		let tmpAnticipate = this.fable.serviceManager.instantiateServiceProviderWithoutRegistration('Anticipate');

		if (this.pict.LogNoisiness > 2)
		{
			this.log.trace(`PictCLI [${this.UUID}]::[${this.Hash}] ${this.options.Name} beginning async run...`);
		}

		tmpAnticipate.anticipate(this.onBeforeRun.bind(this));
		tmpAnticipate.anticipate(this.onRun.bind(this));
		tmpAnticipate.anticipate(this.onAfterRun.bind(this));

		tmpAnticipate.wait(
			(pError) =>
			{
				if (this.pict.LogNoisiness > 2)
				{
					this.log.trace(`PictCLI [${this.UUID}]::[${this.Hash}] ${this.options.Name} async run completed.`);
				}
				return fCallback(pError);
			});
	}

	async runPromise(pArgumentString, pCommandOptions)
	{
		// Build an async function to wrap the non-async behavior by default
		return new Promise(
			(pResolve, pReject) =>
			{
				this.runAsync(pArgumentString, pCommandOptions,
					(pError, pResult) =>
					{
						if (pError)
						{
							return pReject(pError);
						}
						return pResolve(pResult)
					});
			});		
	}
}

module.exports = CommandLineCommand;