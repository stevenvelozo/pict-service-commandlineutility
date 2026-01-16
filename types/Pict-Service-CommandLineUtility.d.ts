export = CommandLineUtility;
declare const CommandLineUtility_base: typeof import("fable-serviceproviderbase");
declare class CommandLineUtility extends CommandLineUtility_base {
    /**
     * @param {import('pict')|Record<string, any>} [pFable] - (optional) The fable instance, or the options object if there is no fable
     * @param {Record<string, any>|string} [pOptions] - (optional) The options object, or the service hash if there is no fable
     * @param {string} [pServiceHash] - (optional) The service hash to identify this service instance
     */
    constructor(pFable?: import("pict") | Record<string, any>, pOptions?: Record<string, any> | string, pServiceHash?: string);
    _Command: libCommander;
    createCommand(pCommandName: any, pCommandDescription: any): libCommander;
    addCommand(pOptions: any, pHash: any, pPrototype: any): any;
    addCommandFromClass(pPrototype: any, pHash: any): any;
    run(pParameterArray: any): Promise<libCommander>;
    get command(): libCommander;
}
import libCommander_1 = require("commander");
import libCommander = libCommander_1.Command;
//# sourceMappingURL=Pict-Service-CommandLineUtility.d.ts.map