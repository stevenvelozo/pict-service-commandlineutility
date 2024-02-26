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
				tmpCommandLineUtility = this.fable.instantiateService('CommandLineUtility');
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
		let tmpAnticipate = this.fable.instantiateServiceProviderWithoutRegistration('Anticipate');
		let tmpCallback = fCallback;

		if (this.pict.LogNoisiness > 2)
		{
			this.log.trace(`PictCLI [${this.UUID}]::[${this.Hash}] ${this.options.CommandKeyword} beginning async run...`);
		}

		// This is the most annoying thing about the commander library.
		// NOTE:
		// The parameters that are passed to this function vary based on the following:
		// 1. If the command has an argument or not
		// 2. If the command has options or not
		// 3. If the command has defaults for the argument
		// 4. If the command has defaults for the options
		// 5. If the user passed values in for any of the options
		// Because of that, we look for the callback function (the API is consistent with only a single function no matter what) and then we deal with the type for the argument string and the options.
		if (typeof(pArgumentString) == 'function')
		{
			this.ArgumentString = '';
			this.CommandOptions = { "ArgumentObject": {} };
			tmpCallback = pArgumentString;
		}
		else if (typeof(pCommandOptions) == 'function')
		{
			if (typeof(pArgumentString) == 'string')
			{
				this.ArgumentString = pArgumentString;
				this.CommandOptions = { "ArgumentObject": {} };
			}
			else if (typeof(pArgumentString) == 'object')
			{
				this.ArgumentString = '';
				this.CommandOptions = pArgumentString;
				if (!pArgumentString.hasOwnProperty('ArgumentObject'))
				{
					this.CommandOptions.ArgumentObject = {};
				}
			}
			else
			{
				// Not sure what to do -- it should be a string or an object?
				this.ArgumentString = '';
				this.CommandOptions = { "ArgumentObject": {} };
			}
			tmpCallback = pCommandOptions;
		}
		else if (typeof(fCallback) == 'function')
		{
			if (typeof(pArgumentString) == 'string')
			{
				this.ArgumentString = pArgumentString;
				this.CommandOptions = pCommandOptions;
			}
			else if (typeof(pArgumentString) == 'object')
			{
				this.ArgumentString = '';
				this.CommandOptions = pArgumentString;
				this.RawCommand = pCommandOptions;
			}
			else
			{
				this.ArgumentString = '';
				this.CommandOptions = pCommandOptions;
			}
		}
		else
		{
			let tmpErrorMessage = `Could not synthesize command parameters; pArgumentString is ${typeof(pArgumentString)}, pCommandOptions is ${typeof(pCommandOptions)} and fCallback is ${typeof(fCallback)}`;
			this.pict.log.error(tmpErrorMessage, {ArgumentString:pArgumentString, CommandOptions:pCommandOptions });
			throw new Error(tmpErrorMessage);
		}

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
				return tmpCallback(pError);
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