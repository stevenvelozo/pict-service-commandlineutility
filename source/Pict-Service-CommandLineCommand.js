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

		this.pict = this.fable;
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
			tmpCommand.action(this.runPromise.bind(this));
		}
		else
		{
			this.log.error(`Command ${this.options.CommandKeyword} already added to the command line utility!`);
		}
	}

	onBeforeRun()
	{
		if (this.pict.LogNoisiness > 3)
		{
			this.log.trace(`PictCLI [${this.UUID}]::[${this.Hash}] ${this.options.CommandKeyword} onBeforeRun...`);
		}
	}

	onRun()
	{
		if (this.pict.LogNoisiness > 3)
		{
			this.log.trace(`PictCLI [${this.UUID}]::[${this.Hash}] ${this.options.CommandKeyword} onRun...`);
		}
	}

	onAfterRun()
	{
		if (this.pict.LogNoisiness > 3)
		{
			this.log.trace(`PictCLI [${this.UUID}]::[${this.Hash}] ${this.options.CommandKeyword} onAfterRun...`);
		}
	}

	onBeforeRunAsync(fCallback)
	{
		try
		{
			let tmpResult = this.onBeforeRun(this.ArgumentString, this.CommandOptions);
			return fCallback(null, tmpResult);
		}
		catch(pError)
		{
			return fCallback(pError)
		}
	}

	onRunAsync(fCallback)
	{
		try
		{
			let tmpResult = this.onRun(this.ArgumentString, this.CommandOptions);
			return fCallback(null, tmpResult);
		}
		catch(pError)
		{
			return fCallback(pError)
		}
	}

	onAfterRunAsync(fCallback)
	{
		try
		{
			let tmpResult = this.onAfterRun(this.ArgumentString, this.CommandOptions);
			return fCallback(null, tmpResult);
		}
		catch(pError)
		{
			return fCallback(pError)
		}
	}

	runAsync(pArgumentString, pCommandOptions, fCallback)
	{
		let tmpAnticipate = this.fable.serviceManager.instantiateServiceProviderWithoutRegistration('Anticipate');

		if (this.pict.LogNoisiness > 2)
		{
			this.log.trace(`PictCLI [${this.UUID}]::[${this.Hash}] ${this.options.CommandKeyword} beginning async run...`);
		}

		this.ArgumentString = pArgumentString;
		this.CommandOptions = pCommandOptions;

		tmpAnticipate.anticipate(this.onBeforeRunAsync.bind(this));
		tmpAnticipate.anticipate(this.onRunAsync.bind(this));
		tmpAnticipate.anticipate(this.onAfterRunAsync.bind(this));

		tmpAnticipate.wait(
			(pError) =>
			{
				if (this.pict.LogNoisiness > 2)
				{
					this.log.trace(`PictCLI [${this.UUID}]::[${this.Hash}] ${this.options.CommandKeyword} async run completed.`);
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