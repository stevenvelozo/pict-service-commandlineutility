const libCommander = require('commander').Command;
const libPict = require('pict');

const defaultCommandLineUtilityOptions = (
	{
		"Command": "default",
		"Description": "Default command",
		"Version": "0.0.0"
	});

class CommandLineUtility extends libPict.ServiceProviderBase
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, JSON.parse(JSON.stringify(defaultCommandLineUtilityOptions)), pOptions);
		super(pFable, tmpOptions, pServiceHash);

		this.serviceType = 'CommandLineUtility';

		// Add the CommandLineCommand service
		this.fable.addServiceType('CommandLineCommand', require('./Pict-Service-CommandLineCommand.js'));

		this._Command = new libCommander();

		this._Command.name(this.options.Command);
		this._Command.description(this.options.Description)
		this._Command.version(this.options.Version, '-v, --version', 'output the current version');
	}

	createCommand(pCommandName, pCommandDescription)
	{
		return this._Command.command(pCommandName).description(pCommandDescription);
	}

	// Just passing an options will construct one for us.
	// Passing a hash will set the hash.
	// Passing a prototype will use that!
	addCommand(pOptions, pHash, pPrototype)
	{
		let tmpOptions = (typeof(pOptions) == 'object') ? pOptions : {};
		let tmpViewHash = (typeof(pHash) == 'string') ? pHash : this.fable.getUUID();

		if (typeof(pPrototype) != 'undefined')
		{
			return this.fable.instantiateServiceProviderFromPrototype('CommandLineCommand', tmpOptions, tmpViewHash, pPrototype);
		}
		else
		{
			return this.fable.instantiateServiceProvider('CommandLineCommand', tmpOptions, tmpViewHash);
		}
	}

	// Take a prototype command and just add it as a service.
	addCommandFromClass(pPrototype, pHash)
	{
		let tmpHash = (typeof(pHash) == 'string') ? pHash : this.fable.getUUID();
		return this.fable.instantiateServiceProviderFromPrototype('CommandLineCommand', {}, tmpHash, pPrototype);
	}

	run (pParameterArray)
	{
		return this._Command.parseAsync(pParameterArray);
	}

	get command()
	{
		return this._Command;
	}
}

module.exports = CommandLineUtility;