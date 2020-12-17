module.exports =
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 453:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const os = __importStar(__webpack_require__(87));
const utils_1 = __webpack_require__(375);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 115:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const command_1 = __webpack_require__(453);
const file_command_1 = __webpack_require__(403);
const utils_1 = __webpack_require__(375);
const os = __importStar(__webpack_require__(87));
const path = __importStar(__webpack_require__(622));
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        const delimiter = '_GitHubActionsFileCommandDelimeter_';
        const commandValue = `${name}<<${delimiter}${os.EOL}${convertedVal}${os.EOL}${delimiter}`;
        file_command_1.issueCommand('ENV', commandValue);
    }
    else {
        command_1.issueCommand('set-env', { name }, convertedVal);
    }
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.  The value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 */
function error(message) {
    command_1.issue('error', message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 */
function warning(message) {
    command_1.issue('warning', message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 403:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// For internal use, subject to change.
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__webpack_require__(747));
const os = __importStar(__webpack_require__(87));
const utils_1 = __webpack_require__(375);
function issueCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueCommand = issueCommand;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 375:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 28:
/***/ ((module) => {

module.exports = class Action
{
    constructor(core, execFileSync)
    {
        this._executors = new Array();
        this._core = core
        this._execFileSync = execFileSync
    }

    run()
    {
        try 
        {
            for(const executor of this._executors)
            {
                executor.execute(this._execFileSync);
            }
        } 
        catch (error)
        {
            this._core.setFailed(error.message);
            this._core.info(error.stdout);
        }
    }

    addExecutor(executor)
    {
        this._executors.push(executor);  
    }
}

/***/ }),

/***/ 29:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const os = __webpack_require__(87);
const process = __webpack_require__(765);
const path = __webpack_require__(622);
const { execFileSync } = __webpack_require__(129);

const core = __webpack_require__(115);

const Action = __webpack_require__(28);
const git_utils = __webpack_require__(739);
const cmake_utils = __webpack_require__(552);
const GroupExecutor = __webpack_require__(207);

const submoduleUpdate = 'submodule_update';
const cmakeArgs = 'cmake_args';
const runTests = 'run_tests';
const unitTestBuild = 'unit_test_build';
const config = 'config';
const createPackage = 'create_package';
const packageGenerator = 'package_generator';

const submoduleDescription = 'Submodule update';
const startBuildDescription = 'Start build';
const runTestsDescription = 'Run unit tests';
const createPackageDescriptor = 'Create package';

const dirName = 'build';

module.exports = class Builder
{
    constructor()
    {
        const submoduleUpdateInput = core.getInput(submoduleUpdate, { required: false });
        this._submoduleUpdate = submoduleUpdateInput === 'ON';

        const runTestsInput = core.getInput(runTests, { required: false });
        this._runTests = runTestsInput === 'ON';

        const createPackageInput = core.getInput(createPackage, { required: false });
        this._createPackage = createPackageInput === 'ON';

        if(this._createPackage)
        {
            this._packageGenerator = core.getInput(packageGenerator, { required: true });
        }

        this._unitTestBuild = core.getInput(unitTestBuild, { required: false });
        this._cmakeArgs = core.getInput(cmakeArgs, { required: false });        
        this._config = core.getInput(config, { required: false });

        this._cpus = os.cpus().length;
        this._cmakeVersion = cmake_utils.getCmakeVersion();

        this._sourceDir = process.cwd();
        this._buildDir = path.join(this._sourceDir, dirName);

        this._action = new Action(core, execFileSync);
    }

    build()
    {
        if(this._submoduleUpdate)
        {
            let gitExec = git_utils.gitSubmoduleUpdateExecutor();
            this._action.addExecutor(new GroupExecutor(submoduleDescription, [gitExec], core));
        }

        let cmakeBuildExecutors = [];

        if(this._cmakeVersion < 312)
        {
            let cmakeMakeDirectory = cmake_utils.cmakeMakeDirectory(this._buildDir);
            cmakeBuildExecutors.push(cmakeMakeDirectory);
        }

        let cmakeConfigure = 
                cmake_utils.cmakeConfigureExecutor(
                    this._cmakeVersion,
                    this._buildDir,
                    this._sourceDir,
                    this._cmakeArgs,
                    this._unitTestBuild);
        cmakeBuildExecutors.push(cmakeConfigure);

        let cmakeBuild = 
                cmake_utils.cmakeBuildExecutor(
                    this._cpus,
                    this._cmakeVersion,
                    this._buildDir,
                    this._config
                );
        cmakeBuildExecutors.push(cmakeBuild);

        this._action.addExecutor(new GroupExecutor(startBuildDescription, cmakeBuildExecutors, core));

        if(this._runTests)
        {
            let ctestExecutor = cmake_utils.cmakeRunTestsExecutor(this._cpus, this._buildDir);
            this._action.addExecutor(new GroupExecutor(runTestsDescription, [ctestExecutor], core));
        }

        if(this._createPackage)
        {
            let cpackageExecutor = cmake_utils.cmakePackageExecutor(this._packageGenerator, this._buildDir, this._config);
            this._action.addExecutor(new GroupExecutor(createPackageDescriptor, [cpackageExecutor], core));
        }
    }
    
    action()
    {
        return this._action;
    }
}

/***/ }),

/***/ 552:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { execFileSync } = __webpack_require__(129);
const core = __webpack_require__(115);

const Executor = __webpack_require__(811);

const cmakeApp = 'cmake';
const cmakeVersionParam = '--version';
const cmakeBuildParam = '--build';
const cmakeConfigParam = '--config';
const cmakeParallelParam = '--parallel';

const cmakeFlagE = '-E';
const cmakeFlagB = '-B';
const cmakeFlagS = '-S';
const cmakeFlagG = '-G';
const cmakeFlagC = '-C';

const cmakeChdirCommand = 'chdir';
const cmakeMakedirectoryComand = 'make_directory';

const ctestApp = 'ctest';
const ctestOutputOnFailure = '--output-on-failure';

const cpackApp = 'cpack';

function getCmakeVersion()
{
    const versionTemplate = /(?:\d{1,})/gm;
    let cmakeVers = new Executor(cmakeApp, [cmakeVersionParam]);
    
    core.info(cmakeVers);
    
    let result = cmakeVers.execute(execFileSync).toString();
    let version = result.match(versionTemplate);

    return version.length >= 2 ? 
                version[0] * 100 + version[1] * 1 :
                undefined;
}

function parallelBuildArgs(cmakeVersion, cpus)
{
    return cmakeVersion  > 311 ?
                [cmakeParallelParam, `${cpus}`] : ['--', `-j${cpus}`];
}

function cmakeMakeDirectory(cmakeBuildDir)
{
    return new Executor(cmakeApp, [cmakeFlagE, cmakeMakedirectoryComand, cmakeBuildDir]);
}

function cmakeConfigureExecutor(cmakeVersion, cmakeBuildDir, cmakeSourceDir, cmakeArgs, buildUnitTest)
{   
    let configureArgs = cmakeVersion  > 311 ? 
                [cmakeFlagB, cmakeBuildDir, cmakeFlagS, cmakeSourceDir] :
                [cmakeFlagE, cmakeChdirCommand, cmakeBuildDir, cmakeApp, cmakeSourceDir];
    
    if(buildUnitTest.length > 0)
    {
        configureArgs.push(buildUnitTest);
    }
    
    for(const arg of cmakeArgs.split(';'))
    {
        if(arg.length > 0)
        {
            configureArgs.push(arg);
        }
    }

    return new Executor(cmakeApp, configureArgs);
}

function cmakeBuildExecutor(cpus, cmakeVersion, cmakeBuildDir, config)
{
    let buildParameters = [cmakeBuildParam, cmakeBuildDir, cmakeConfigParam, config];

    if(cpus > 1)
    {
        for(const arg of parallelBuildArgs(cmakeVersion, cpus))
        {
            buildParameters.push(arg);
        }
    }
    
    return new Executor(cmakeApp, buildParameters);
}

function cmakeRunTestsExecutor(cpus, cmakeBuildDir)
{
    let args = [cmakeFlagE, cmakeChdirCommand, cmakeBuildDir, ctestApp, ctestOutputOnFailure];
    if(cpus > 1)
    {
        args.push(cmakeParallelParam);
        args.push(`${cpus}`);
    }

    return new Executor(cmakeApp, args);
}

function cmakePackageExecutor(cpakgGenerator, cmakeBuildDir, config)
{
    let args = [cmakeFlagE, cmakeChdirCommand, cmakeBuildDir, cpackApp, cmakeFlagG, cpakgGenerator, cmakeFlagC, config];
    return new Executor(cmakeApp, args);
}

module.exports.getCmakeVersion = getCmakeVersion;
module.exports.cmakeMakeDirectory = cmakeMakeDirectory;
module.exports.cmakeConfigureExecutor = cmakeConfigureExecutor;
module.exports.cmakeBuildExecutor = cmakeBuildExecutor;
module.exports.cmakeRunTestsExecutor = cmakeRunTestsExecutor;
module.exports.cmakePackageExecutor = cmakePackageExecutor;
module.exports.parallelBuildArgs = parallelBuildArgs;


/***/ }),

/***/ 811:
/***/ ((module) => {

module.exports = class Executor
{
    constructor(name, args)
    {
        this._name = name;
        this._generalArgs = args;
    }

    execute(exec)
    {
        return exec(this._name, this._generalArgs);
    }

    setAdditionalArg(arg)
    {
        this._generalArgs.push(arg);
    }
}

/***/ }),

/***/ 739:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Executor = __webpack_require__(811);

const gitApp = 'git';
const gitParams = ['submodule', 'update', '--init', '--recursive'];

function gitSubmoduleUpdateExecutor()
{
    return new Executor(gitApp, gitParams);
}

module.exports.gitSubmoduleUpdateExecutor = gitSubmoduleUpdateExecutor;

/***/ }),

/***/ 207:
/***/ ((module) => {

module.exports = class GroupExecutor
{
    constructor(groupName, executors, core)
    {
        this._groupName = groupName;
        this._executors = executors;
        this._core = core
    }

    execute(exec)
    {
        this._core.startGroup(this._groupName);
        for(const executor of this._executors)
        {
            let result = executor.execute(exec);
            this._core.info(result);
        }
        this._core.endGroup();
    }

    addExecutor(executor)
    {
        this._executors.push(executor)
    }
}


/***/ }),

/***/ 900:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

const Builder = __webpack_require__(29);

let builder = new Builder();
builder.build();
builder.action().run();
    





/***/ }),

/***/ 129:
/***/ ((module) => {

"use strict";
module.exports = require("child_process");;

/***/ }),

/***/ 747:
/***/ ((module) => {

"use strict";
module.exports = require("fs");;

/***/ }),

/***/ 87:
/***/ ((module) => {

"use strict";
module.exports = require("os");;

/***/ }),

/***/ 622:
/***/ ((module) => {

"use strict";
module.exports = require("path");;

/***/ }),

/***/ 765:
/***/ ((module) => {

"use strict";
module.exports = require("process");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	__webpack_require__.ab = __dirname + "/";/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(900);
/******/ })()
;