/*
	Unit tests for Pict-Service-CommandLineUtility
*/

const Chai = require('chai');
const Expect = Chai.expect;

const libPictCommandLineUtility = require(`../source/Pict-CLIProgram-CommandLineUtility.js`);

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
	}
);