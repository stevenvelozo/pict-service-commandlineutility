/*
	Unit tests for Pict-Service-CommandLineUtility
*/

const Chai = require('chai');
const Expect = Chai.expect;

const libPictCommandLineUtility = require(`../source/Pict-CLIProgram-CommandLineUtility.js`);
const libCommandLineCommand = require(`../source/Pict-Service-CommandLineCommand.js`);

// Shared capture for the command-invocation tests. A test command records what it
// received into _Captured and signals completion via _OnRun, because the program's
// run() dispatches the (async) command action without returning a promise.
let _Captured = null;
let _OnRun = null;

class TwoPositionalTestCommand extends libCommandLineCommand
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);

		this.options.CommandKeyword = 'twopos';
		this.options.Description = 'Two positional argument test command.';

		this.options.CommandArguments.push({ Name: '[alpha]', Description: 'first positional', Default: '' });
		this.options.CommandArguments.push({ Name: '[beta]', Description: 'second positional', Default: '' });

		this.addCommand();
	}

	onRunAsync(fCallback)
	{
		let tmpArguments = (typeof (this.ArgumentString) === 'string') ? this.ArgumentString.trim().split(/\s+/) : [];
		_Captured = { ArgumentString: this.ArgumentString, First: tmpArguments[0] || '', Second: tmpArguments[1] || '' };
		if (typeof (_OnRun) === 'function') { _OnRun(); }
		return fCallback();
	}
}

class OnePositionalTestCommand extends libCommandLineCommand
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);

		this.options.CommandKeyword = 'onepos';
		this.options.Description = 'One positional argument test command.';

		this.options.CommandArguments.push({ Name: '[alpha]', Description: 'the positional', Default: '' });
		this.options.CommandOptions.push({ Name: '-f, --flag <flag>', Description: 'an option', Default: '' });

		this.addCommand();
	}

	onRunAsync(fCallback)
	{
		_Captured = { ArgumentString: this.ArgumentString, Flag: (this.CommandOptions && this.CommandOptions.flag) || '' };
		if (typeof (_OnRun) === 'function') { _OnRun(); }
		return fCallback();
	}
}

suite
(
	`Basic Command-line Utility Tests`,
	() =>
	{
		setup(() => { });

		suite
			(
				'Basic Basic Tests',
				() =>
				{
					test(
							'Constructor properly crafts an object',
							(fDone) =>
							{
								let _TestUtility = new libPictCommandLineUtility({Product:'UnitTestUtility', Version:'0.0.2'});
								_TestUtility.log.trace(`---------- (now running placeholder) ---------`);
								_TestUtility.run(['node', 'testutility', 'placeholder']);
								return fDone();
							}
						);
				}
			);

		suite
			(
				'Multi-positional argument handling',
				() =>
				{
					test(
							'a two-positional command receives both positional arguments',
							(fDone) =>
							{
								_Captured = null;
								_OnRun = () =>
								{
									try
									{
										Expect(_Captured).to.not.equal(null);
										Expect(_Captured.ArgumentString).to.equal('alpha beta');
										Expect(_Captured.First).to.equal('alpha');
										Expect(_Captured.Second).to.equal('beta');
										return fDone();
									}
									catch (pError) { return fDone(pError); }
								};
								let _Program = new libPictCommandLineUtility({ Product: 'TwoPosTest', Version: '0.0.1', Command: 'twopostest' }, [ TwoPositionalTestCommand ]);
								_Program.run(['node', 'twopostest', 'twopos', 'alpha', 'beta']);
							}
						);

					test(
							'a single-positional command still receives its positional and options',
							(fDone) =>
							{
								_Captured = null;
								_OnRun = () =>
								{
									try
									{
										Expect(_Captured).to.not.equal(null);
										Expect(_Captured.ArgumentString).to.equal('alpha');
										Expect(_Captured.Flag).to.equal('yes');
										return fDone();
									}
									catch (pError) { return fDone(pError); }
								};
								let _Program = new libPictCommandLineUtility({ Product: 'OnePosTest', Version: '0.0.1', Command: 'onepostest' }, [ OnePositionalTestCommand ]);
								_Program.run(['node', 'onepostest', 'onepos', 'alpha', '--flag', 'yes']);
							}
						);
				}
			);
	}
);
