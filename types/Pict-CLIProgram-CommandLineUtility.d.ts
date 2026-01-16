export = CLIProgram;
declare class CLIProgram extends libPict {
    /**
     * @param {Record<string, any>|string} [pSettings] - (optional) The options object, or the service hash if there is no fable
     * @param {Array<import('./Pict-Service-CommandLineCommand.js')>} [pCommands] - (optional) An array of command prototypes to add to the command line utility
     */
    constructor(pSettings?: Record<string, any> | string, pCommands?: Array<import("./Pict-Service-CommandLineCommand.js")>);
    /** @type {libServiceCommandLineUtility} */
    CommandLineUtility: libServiceCommandLineUtility;
    addConfigurationExplanationCommand(): void;
    gatherProgramConfiguration(pAutoApplyConfiguration: any): {
        ConfigurationOutcome: any;
        GatherPhases: any[];
    };
    ProgramConfiguration: {};
    run(pArgumentString: any): void;
}
declare namespace CLIProgram {
    export { libServiceCommandLineUtility as ServiceCommandLineUtility, libServiceCommandLineCommand as ServiceCommandLineCommand };
}
import libPict = require("pict");
import libServiceCommandLineUtility = require("./Pict-Service-CommandLineUtility.js");
import libServiceCommandLineCommand = require("./Pict-Service-CommandLineCommand.js");
//# sourceMappingURL=Pict-CLIProgram-CommandLineUtility.d.ts.map