export = CommandLineCommand;
declare const CommandLineCommand_base: typeof import("fable-serviceproviderbase");
declare class CommandLineCommand extends CommandLineCommand_base {
    /**
     * @param {import('pict')|Record<string, any>} [pFable] - (optional) The fable instance, or the options object if there is no fable
     * @param {Record<string, any>|string} [pOptions] - (optional) The options object, or the service hash if there is no fable
     * @param {string} [pServiceHash] - (optional) The service hash to identify this service instance
     */
    constructor(pFable?: import("pict") | Record<string, any>, pOptions?: Record<string, any> | string, pServiceHash?: string);
    pict: any;
    AppData: any;
    addCommand(): void;
    /**
     * @param {string} [pArgumentString] - The raw argument string passed to the command
     * @param {object} [pCommandOptions] - The command options object passed to the command
     */
    onBeforeRun(pArgumentString?: string, pCommandOptions?: object): void;
    /**
     * @param {string} [pArgumentString] - The raw argument string passed to the command
     * @param {object} [pCommandOptions] - The command options object passed to the command
     */
    onRun(pArgumentString?: string, pCommandOptions?: object): void;
    /**
     * @param {string} [pArgumentString] - The raw argument string passed to the command
     * @param {object} [pCommandOptions] - The command options object passed to the command
     */
    onAfterRun(pArgumentString?: string, pCommandOptions?: object): void;
    onBeforeRunAsync(fCallback: any): any;
    onRunAsync(fCallback: any): any;
    onAfterRunAsync(fCallback: any): any;
    runAsync(pArgumentString: any, pCommandOptions: any, fCallback: any): void;
    ArgumentString: string;
    CommandOptions: any;
    RawCommand: any;
    runPromise(pArgumentString: any, pCommandOptions: any): Promise<any>;
}
//# sourceMappingURL=Pict-Service-CommandLineCommand.d.ts.map