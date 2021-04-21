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
const os = __importStar(__webpack_require__(2087));
const utils_1 = __webpack_require__(5375);
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
const file_command_1 = __webpack_require__(4403);
const utils_1 = __webpack_require__(5375);
const os = __importStar(__webpack_require__(2087));
const path = __importStar(__webpack_require__(5622));
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

/***/ 4403:
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
const fs = __importStar(__webpack_require__(5747));
const os = __importStar(__webpack_require__(2087));
const utils_1 = __webpack_require__(5375);
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

/***/ 5375:
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

/***/ 8279:
/***/ ((module, exports, __webpack_require__) => {

"use strict";
/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 * See LICENSE file in root directory for full license.
 */


Object.defineProperty(exports, "__esModule", ({ value: true }));

var eventTargetShim = __webpack_require__(6043);

/**
 * The signal class.
 * @see https://dom.spec.whatwg.org/#abortsignal
 */
class AbortSignal extends eventTargetShim.EventTarget {
    /**
     * AbortSignal cannot be constructed directly.
     */
    constructor() {
        super();
        throw new TypeError("AbortSignal cannot be constructed directly");
    }
    /**
     * Returns `true` if this `AbortSignal`'s `AbortController` has signaled to abort, and `false` otherwise.
     */
    get aborted() {
        const aborted = abortedFlags.get(this);
        if (typeof aborted !== "boolean") {
            throw new TypeError(`Expected 'this' to be an 'AbortSignal' object, but got ${this === null ? "null" : typeof this}`);
        }
        return aborted;
    }
}
eventTargetShim.defineEventAttribute(AbortSignal.prototype, "abort");
/**
 * Create an AbortSignal object.
 */
function createAbortSignal() {
    const signal = Object.create(AbortSignal.prototype);
    eventTargetShim.EventTarget.call(signal);
    abortedFlags.set(signal, false);
    return signal;
}
/**
 * Abort a given signal.
 */
function abortSignal(signal) {
    if (abortedFlags.get(signal) !== false) {
        return;
    }
    abortedFlags.set(signal, true);
    signal.dispatchEvent({ type: "abort" });
}
/**
 * Aborted flag for each instances.
 */
const abortedFlags = new WeakMap();
// Properties should be enumerable.
Object.defineProperties(AbortSignal.prototype, {
    aborted: { enumerable: true },
});
// `toString()` should return `"[object AbortSignal]"`
if (typeof Symbol === "function" && typeof Symbol.toStringTag === "symbol") {
    Object.defineProperty(AbortSignal.prototype, Symbol.toStringTag, {
        configurable: true,
        value: "AbortSignal",
    });
}

/**
 * The AbortController.
 * @see https://dom.spec.whatwg.org/#abortcontroller
 */
class AbortController {
    /**
     * Initialize this controller.
     */
    constructor() {
        signals.set(this, createAbortSignal());
    }
    /**
     * Returns the `AbortSignal` object associated with this object.
     */
    get signal() {
        return getSignal(this);
    }
    /**
     * Abort and signal to any observers that the associated activity is to be aborted.
     */
    abort() {
        abortSignal(getSignal(this));
    }
}
/**
 * Associated signals.
 */
const signals = new WeakMap();
/**
 * Get the associated signal of a given controller.
 */
function getSignal(controller) {
    const signal = signals.get(controller);
    if (signal == null) {
        throw new TypeError(`Expected 'this' to be an 'AbortController' object, but got ${controller === null ? "null" : typeof controller}`);
    }
    return signal;
}
// Properties should be enumerable.
Object.defineProperties(AbortController.prototype, {
    signal: { enumerable: true },
    abort: { enumerable: true },
});
if (typeof Symbol === "function" && typeof Symbol.toStringTag === "symbol") {
    Object.defineProperty(AbortController.prototype, Symbol.toStringTag, {
        configurable: true,
        value: "AbortController",
    });
}

exports.AbortController = AbortController;
exports.AbortSignal = AbortSignal;
exports.default = AbortController;

module.exports = AbortController
module.exports.AbortController = module.exports.default = AbortController
module.exports.AbortSignal = AbortSignal
//# sourceMappingURL=abort-controller.js.map


/***/ }),

/***/ 4701:
/***/ ((module) => {

function allocUnsafe (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  }

  if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }

  if (Buffer.allocUnsafe) {
    return Buffer.allocUnsafe(size)
  } else {
    return new Buffer(size)
  }
}

module.exports = allocUnsafe


/***/ }),

/***/ 1697:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var bufferFill = __webpack_require__(8375)
var allocUnsafe = __webpack_require__(4701)

module.exports = function alloc (size, fill, encoding) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  }

  if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }

  if (Buffer.alloc) {
    return Buffer.alloc(size, fill, encoding)
  }

  var buffer = allocUnsafe(size)

  if (size === 0) {
    return buffer
  }

  if (fill === undefined) {
    return bufferFill(buffer, 0)
  }

  if (typeof encoding !== 'string') {
    encoding = undefined
  }

  return bufferFill(buffer, fill, encoding)
}


/***/ }),

/***/ 8375:
/***/ ((module) => {

/* Node.js 6.4.0 and up has full support */
var hasFullSupport = (function () {
  try {
    if (!Buffer.isEncoding('latin1')) {
      return false
    }

    var buf = Buffer.alloc ? Buffer.alloc(4) : new Buffer(4)

    buf.fill('ab', 'ucs2')

    return (buf.toString('hex') === '61006200')
  } catch (_) {
    return false
  }
}())

function isSingleByte (val) {
  return (val.length === 1 && val.charCodeAt(0) < 256)
}

function fillWithNumber (buffer, val, start, end) {
  if (start < 0 || end > buffer.length) {
    throw new RangeError('Out of range index')
  }

  start = start >>> 0
  end = end === undefined ? buffer.length : end >>> 0

  if (end > start) {
    buffer.fill(val, start, end)
  }

  return buffer
}

function fillWithBuffer (buffer, val, start, end) {
  if (start < 0 || end > buffer.length) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return buffer
  }

  start = start >>> 0
  end = end === undefined ? buffer.length : end >>> 0

  var pos = start
  var len = val.length
  while (pos <= (end - len)) {
    val.copy(buffer, pos)
    pos += len
  }

  if (pos !== end) {
    val.copy(buffer, pos, 0, end - pos)
  }

  return buffer
}

function fill (buffer, val, start, end, encoding) {
  if (hasFullSupport) {
    return buffer.fill(val, start, end, encoding)
  }

  if (typeof val === 'number') {
    return fillWithNumber(buffer, val, start, end)
  }

  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = buffer.length
    } else if (typeof end === 'string') {
      encoding = end
      end = buffer.length
    }

    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }

    if (encoding === 'latin1') {
      encoding = 'binary'
    }

    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }

    if (val === '') {
      return fillWithNumber(buffer, 0, start, end)
    }

    if (isSingleByte(val)) {
      return fillWithNumber(buffer, val.charCodeAt(0), start, end)
    }

    val = new Buffer(val, encoding)
  }

  if (Buffer.isBuffer(val)) {
    return fillWithBuffer(buffer, val, start, end)
  }

  // Other values (e.g. undefined, boolean, object) results in zero-fill
  return fillWithNumber(buffer, 0, start, end)
}

module.exports = fill


/***/ }),

/***/ 6043:
/***/ ((module, exports) => {

"use strict";
/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 * @copyright 2015 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */


Object.defineProperty(exports, "__esModule", ({ value: true }));

/**
 * @typedef {object} PrivateData
 * @property {EventTarget} eventTarget The event target.
 * @property {{type:string}} event The original event object.
 * @property {number} eventPhase The current event phase.
 * @property {EventTarget|null} currentTarget The current event target.
 * @property {boolean} canceled The flag to prevent default.
 * @property {boolean} stopped The flag to stop propagation.
 * @property {boolean} immediateStopped The flag to stop propagation immediately.
 * @property {Function|null} passiveListener The listener if the current listener is passive. Otherwise this is null.
 * @property {number} timeStamp The unix time.
 * @private
 */

/**
 * Private data for event wrappers.
 * @type {WeakMap<Event, PrivateData>}
 * @private
 */
const privateData = new WeakMap();

/**
 * Cache for wrapper classes.
 * @type {WeakMap<Object, Function>}
 * @private
 */
const wrappers = new WeakMap();

/**
 * Get private data.
 * @param {Event} event The event object to get private data.
 * @returns {PrivateData} The private data of the event.
 * @private
 */
function pd(event) {
    const retv = privateData.get(event);
    console.assert(
        retv != null,
        "'this' is expected an Event object, but got",
        event
    );
    return retv
}

/**
 * https://dom.spec.whatwg.org/#set-the-canceled-flag
 * @param data {PrivateData} private data.
 */
function setCancelFlag(data) {
    if (data.passiveListener != null) {
        if (
            typeof console !== "undefined" &&
            typeof console.error === "function"
        ) {
            console.error(
                "Unable to preventDefault inside passive event listener invocation.",
                data.passiveListener
            );
        }
        return
    }
    if (!data.event.cancelable) {
        return
    }

    data.canceled = true;
    if (typeof data.event.preventDefault === "function") {
        data.event.preventDefault();
    }
}

/**
 * @see https://dom.spec.whatwg.org/#interface-event
 * @private
 */
/**
 * The event wrapper.
 * @constructor
 * @param {EventTarget} eventTarget The event target of this dispatching.
 * @param {Event|{type:string}} event The original event to wrap.
 */
function Event(eventTarget, event) {
    privateData.set(this, {
        eventTarget,
        event,
        eventPhase: 2,
        currentTarget: eventTarget,
        canceled: false,
        stopped: false,
        immediateStopped: false,
        passiveListener: null,
        timeStamp: event.timeStamp || Date.now(),
    });

    // https://heycam.github.io/webidl/#Unforgeable
    Object.defineProperty(this, "isTrusted", { value: false, enumerable: true });

    // Define accessors
    const keys = Object.keys(event);
    for (let i = 0; i < keys.length; ++i) {
        const key = keys[i];
        if (!(key in this)) {
            Object.defineProperty(this, key, defineRedirectDescriptor(key));
        }
    }
}

// Should be enumerable, but class methods are not enumerable.
Event.prototype = {
    /**
     * The type of this event.
     * @type {string}
     */
    get type() {
        return pd(this).event.type
    },

    /**
     * The target of this event.
     * @type {EventTarget}
     */
    get target() {
        return pd(this).eventTarget
    },

    /**
     * The target of this event.
     * @type {EventTarget}
     */
    get currentTarget() {
        return pd(this).currentTarget
    },

    /**
     * @returns {EventTarget[]} The composed path of this event.
     */
    composedPath() {
        const currentTarget = pd(this).currentTarget;
        if (currentTarget == null) {
            return []
        }
        return [currentTarget]
    },

    /**
     * Constant of NONE.
     * @type {number}
     */
    get NONE() {
        return 0
    },

    /**
     * Constant of CAPTURING_PHASE.
     * @type {number}
     */
    get CAPTURING_PHASE() {
        return 1
    },

    /**
     * Constant of AT_TARGET.
     * @type {number}
     */
    get AT_TARGET() {
        return 2
    },

    /**
     * Constant of BUBBLING_PHASE.
     * @type {number}
     */
    get BUBBLING_PHASE() {
        return 3
    },

    /**
     * The target of this event.
     * @type {number}
     */
    get eventPhase() {
        return pd(this).eventPhase
    },

    /**
     * Stop event bubbling.
     * @returns {void}
     */
    stopPropagation() {
        const data = pd(this);

        data.stopped = true;
        if (typeof data.event.stopPropagation === "function") {
            data.event.stopPropagation();
        }
    },

    /**
     * Stop event bubbling.
     * @returns {void}
     */
    stopImmediatePropagation() {
        const data = pd(this);

        data.stopped = true;
        data.immediateStopped = true;
        if (typeof data.event.stopImmediatePropagation === "function") {
            data.event.stopImmediatePropagation();
        }
    },

    /**
     * The flag to be bubbling.
     * @type {boolean}
     */
    get bubbles() {
        return Boolean(pd(this).event.bubbles)
    },

    /**
     * The flag to be cancelable.
     * @type {boolean}
     */
    get cancelable() {
        return Boolean(pd(this).event.cancelable)
    },

    /**
     * Cancel this event.
     * @returns {void}
     */
    preventDefault() {
        setCancelFlag(pd(this));
    },

    /**
     * The flag to indicate cancellation state.
     * @type {boolean}
     */
    get defaultPrevented() {
        return pd(this).canceled
    },

    /**
     * The flag to be composed.
     * @type {boolean}
     */
    get composed() {
        return Boolean(pd(this).event.composed)
    },

    /**
     * The unix time of this event.
     * @type {number}
     */
    get timeStamp() {
        return pd(this).timeStamp
    },

    /**
     * The target of this event.
     * @type {EventTarget}
     * @deprecated
     */
    get srcElement() {
        return pd(this).eventTarget
    },

    /**
     * The flag to stop event bubbling.
     * @type {boolean}
     * @deprecated
     */
    get cancelBubble() {
        return pd(this).stopped
    },
    set cancelBubble(value) {
        if (!value) {
            return
        }
        const data = pd(this);

        data.stopped = true;
        if (typeof data.event.cancelBubble === "boolean") {
            data.event.cancelBubble = true;
        }
    },

    /**
     * The flag to indicate cancellation state.
     * @type {boolean}
     * @deprecated
     */
    get returnValue() {
        return !pd(this).canceled
    },
    set returnValue(value) {
        if (!value) {
            setCancelFlag(pd(this));
        }
    },

    /**
     * Initialize this event object. But do nothing under event dispatching.
     * @param {string} type The event type.
     * @param {boolean} [bubbles=false] The flag to be possible to bubble up.
     * @param {boolean} [cancelable=false] The flag to be possible to cancel.
     * @deprecated
     */
    initEvent() {
        // Do nothing.
    },
};

// `constructor` is not enumerable.
Object.defineProperty(Event.prototype, "constructor", {
    value: Event,
    configurable: true,
    writable: true,
});

// Ensure `event instanceof window.Event` is `true`.
if (typeof window !== "undefined" && typeof window.Event !== "undefined") {
    Object.setPrototypeOf(Event.prototype, window.Event.prototype);

    // Make association for wrappers.
    wrappers.set(window.Event.prototype, Event);
}

/**
 * Get the property descriptor to redirect a given property.
 * @param {string} key Property name to define property descriptor.
 * @returns {PropertyDescriptor} The property descriptor to redirect the property.
 * @private
 */
function defineRedirectDescriptor(key) {
    return {
        get() {
            return pd(this).event[key]
        },
        set(value) {
            pd(this).event[key] = value;
        },
        configurable: true,
        enumerable: true,
    }
}

/**
 * Get the property descriptor to call a given method property.
 * @param {string} key Property name to define property descriptor.
 * @returns {PropertyDescriptor} The property descriptor to call the method property.
 * @private
 */
function defineCallDescriptor(key) {
    return {
        value() {
            const event = pd(this).event;
            return event[key].apply(event, arguments)
        },
        configurable: true,
        enumerable: true,
    }
}

/**
 * Define new wrapper class.
 * @param {Function} BaseEvent The base wrapper class.
 * @param {Object} proto The prototype of the original event.
 * @returns {Function} The defined wrapper class.
 * @private
 */
function defineWrapper(BaseEvent, proto) {
    const keys = Object.keys(proto);
    if (keys.length === 0) {
        return BaseEvent
    }

    /** CustomEvent */
    function CustomEvent(eventTarget, event) {
        BaseEvent.call(this, eventTarget, event);
    }

    CustomEvent.prototype = Object.create(BaseEvent.prototype, {
        constructor: { value: CustomEvent, configurable: true, writable: true },
    });

    // Define accessors.
    for (let i = 0; i < keys.length; ++i) {
        const key = keys[i];
        if (!(key in BaseEvent.prototype)) {
            const descriptor = Object.getOwnPropertyDescriptor(proto, key);
            const isFunc = typeof descriptor.value === "function";
            Object.defineProperty(
                CustomEvent.prototype,
                key,
                isFunc
                    ? defineCallDescriptor(key)
                    : defineRedirectDescriptor(key)
            );
        }
    }

    return CustomEvent
}

/**
 * Get the wrapper class of a given prototype.
 * @param {Object} proto The prototype of the original event to get its wrapper.
 * @returns {Function} The wrapper class.
 * @private
 */
function getWrapper(proto) {
    if (proto == null || proto === Object.prototype) {
        return Event
    }

    let wrapper = wrappers.get(proto);
    if (wrapper == null) {
        wrapper = defineWrapper(getWrapper(Object.getPrototypeOf(proto)), proto);
        wrappers.set(proto, wrapper);
    }
    return wrapper
}

/**
 * Wrap a given event to management a dispatching.
 * @param {EventTarget} eventTarget The event target of this dispatching.
 * @param {Object} event The event to wrap.
 * @returns {Event} The wrapper instance.
 * @private
 */
function wrapEvent(eventTarget, event) {
    const Wrapper = getWrapper(Object.getPrototypeOf(event));
    return new Wrapper(eventTarget, event)
}

/**
 * Get the immediateStopped flag of a given event.
 * @param {Event} event The event to get.
 * @returns {boolean} The flag to stop propagation immediately.
 * @private
 */
function isStopped(event) {
    return pd(event).immediateStopped
}

/**
 * Set the current event phase of a given event.
 * @param {Event} event The event to set current target.
 * @param {number} eventPhase New event phase.
 * @returns {void}
 * @private
 */
function setEventPhase(event, eventPhase) {
    pd(event).eventPhase = eventPhase;
}

/**
 * Set the current target of a given event.
 * @param {Event} event The event to set current target.
 * @param {EventTarget|null} currentTarget New current target.
 * @returns {void}
 * @private
 */
function setCurrentTarget(event, currentTarget) {
    pd(event).currentTarget = currentTarget;
}

/**
 * Set a passive listener of a given event.
 * @param {Event} event The event to set current target.
 * @param {Function|null} passiveListener New passive listener.
 * @returns {void}
 * @private
 */
function setPassiveListener(event, passiveListener) {
    pd(event).passiveListener = passiveListener;
}

/**
 * @typedef {object} ListenerNode
 * @property {Function} listener
 * @property {1|2|3} listenerType
 * @property {boolean} passive
 * @property {boolean} once
 * @property {ListenerNode|null} next
 * @private
 */

/**
 * @type {WeakMap<object, Map<string, ListenerNode>>}
 * @private
 */
const listenersMap = new WeakMap();

// Listener types
const CAPTURE = 1;
const BUBBLE = 2;
const ATTRIBUTE = 3;

/**
 * Check whether a given value is an object or not.
 * @param {any} x The value to check.
 * @returns {boolean} `true` if the value is an object.
 */
function isObject(x) {
    return x !== null && typeof x === "object" //eslint-disable-line no-restricted-syntax
}

/**
 * Get listeners.
 * @param {EventTarget} eventTarget The event target to get.
 * @returns {Map<string, ListenerNode>} The listeners.
 * @private
 */
function getListeners(eventTarget) {
    const listeners = listenersMap.get(eventTarget);
    if (listeners == null) {
        throw new TypeError(
            "'this' is expected an EventTarget object, but got another value."
        )
    }
    return listeners
}

/**
 * Get the property descriptor for the event attribute of a given event.
 * @param {string} eventName The event name to get property descriptor.
 * @returns {PropertyDescriptor} The property descriptor.
 * @private
 */
function defineEventAttributeDescriptor(eventName) {
    return {
        get() {
            const listeners = getListeners(this);
            let node = listeners.get(eventName);
            while (node != null) {
                if (node.listenerType === ATTRIBUTE) {
                    return node.listener
                }
                node = node.next;
            }
            return null
        },

        set(listener) {
            if (typeof listener !== "function" && !isObject(listener)) {
                listener = null; // eslint-disable-line no-param-reassign
            }
            const listeners = getListeners(this);

            // Traverse to the tail while removing old value.
            let prev = null;
            let node = listeners.get(eventName);
            while (node != null) {
                if (node.listenerType === ATTRIBUTE) {
                    // Remove old value.
                    if (prev !== null) {
                        prev.next = node.next;
                    } else if (node.next !== null) {
                        listeners.set(eventName, node.next);
                    } else {
                        listeners.delete(eventName);
                    }
                } else {
                    prev = node;
                }

                node = node.next;
            }

            // Add new value.
            if (listener !== null) {
                const newNode = {
                    listener,
                    listenerType: ATTRIBUTE,
                    passive: false,
                    once: false,
                    next: null,
                };
                if (prev === null) {
                    listeners.set(eventName, newNode);
                } else {
                    prev.next = newNode;
                }
            }
        },
        configurable: true,
        enumerable: true,
    }
}

/**
 * Define an event attribute (e.g. `eventTarget.onclick`).
 * @param {Object} eventTargetPrototype The event target prototype to define an event attrbite.
 * @param {string} eventName The event name to define.
 * @returns {void}
 */
function defineEventAttribute(eventTargetPrototype, eventName) {
    Object.defineProperty(
        eventTargetPrototype,
        `on${eventName}`,
        defineEventAttributeDescriptor(eventName)
    );
}

/**
 * Define a custom EventTarget with event attributes.
 * @param {string[]} eventNames Event names for event attributes.
 * @returns {EventTarget} The custom EventTarget.
 * @private
 */
function defineCustomEventTarget(eventNames) {
    /** CustomEventTarget */
    function CustomEventTarget() {
        EventTarget.call(this);
    }

    CustomEventTarget.prototype = Object.create(EventTarget.prototype, {
        constructor: {
            value: CustomEventTarget,
            configurable: true,
            writable: true,
        },
    });

    for (let i = 0; i < eventNames.length; ++i) {
        defineEventAttribute(CustomEventTarget.prototype, eventNames[i]);
    }

    return CustomEventTarget
}

/**
 * EventTarget.
 *
 * - This is constructor if no arguments.
 * - This is a function which returns a CustomEventTarget constructor if there are arguments.
 *
 * For example:
 *
 *     class A extends EventTarget {}
 *     class B extends EventTarget("message") {}
 *     class C extends EventTarget("message", "error") {}
 *     class D extends EventTarget(["message", "error"]) {}
 */
function EventTarget() {
    /*eslint-disable consistent-return */
    if (this instanceof EventTarget) {
        listenersMap.set(this, new Map());
        return
    }
    if (arguments.length === 1 && Array.isArray(arguments[0])) {
        return defineCustomEventTarget(arguments[0])
    }
    if (arguments.length > 0) {
        const types = new Array(arguments.length);
        for (let i = 0; i < arguments.length; ++i) {
            types[i] = arguments[i];
        }
        return defineCustomEventTarget(types)
    }
    throw new TypeError("Cannot call a class as a function")
    /*eslint-enable consistent-return */
}

// Should be enumerable, but class methods are not enumerable.
EventTarget.prototype = {
    /**
     * Add a given listener to this event target.
     * @param {string} eventName The event name to add.
     * @param {Function} listener The listener to add.
     * @param {boolean|{capture?:boolean,passive?:boolean,once?:boolean}} [options] The options for this listener.
     * @returns {void}
     */
    addEventListener(eventName, listener, options) {
        if (listener == null) {
            return
        }
        if (typeof listener !== "function" && !isObject(listener)) {
            throw new TypeError("'listener' should be a function or an object.")
        }

        const listeners = getListeners(this);
        const optionsIsObj = isObject(options);
        const capture = optionsIsObj
            ? Boolean(options.capture)
            : Boolean(options);
        const listenerType = capture ? CAPTURE : BUBBLE;
        const newNode = {
            listener,
            listenerType,
            passive: optionsIsObj && Boolean(options.passive),
            once: optionsIsObj && Boolean(options.once),
            next: null,
        };

        // Set it as the first node if the first node is null.
        let node = listeners.get(eventName);
        if (node === undefined) {
            listeners.set(eventName, newNode);
            return
        }

        // Traverse to the tail while checking duplication..
        let prev = null;
        while (node != null) {
            if (
                node.listener === listener &&
                node.listenerType === listenerType
            ) {
                // Should ignore duplication.
                return
            }
            prev = node;
            node = node.next;
        }

        // Add it.
        prev.next = newNode;
    },

    /**
     * Remove a given listener from this event target.
     * @param {string} eventName The event name to remove.
     * @param {Function} listener The listener to remove.
     * @param {boolean|{capture?:boolean,passive?:boolean,once?:boolean}} [options] The options for this listener.
     * @returns {void}
     */
    removeEventListener(eventName, listener, options) {
        if (listener == null) {
            return
        }

        const listeners = getListeners(this);
        const capture = isObject(options)
            ? Boolean(options.capture)
            : Boolean(options);
        const listenerType = capture ? CAPTURE : BUBBLE;

        let prev = null;
        let node = listeners.get(eventName);
        while (node != null) {
            if (
                node.listener === listener &&
                node.listenerType === listenerType
            ) {
                if (prev !== null) {
                    prev.next = node.next;
                } else if (node.next !== null) {
                    listeners.set(eventName, node.next);
                } else {
                    listeners.delete(eventName);
                }
                return
            }

            prev = node;
            node = node.next;
        }
    },

    /**
     * Dispatch a given event.
     * @param {Event|{type:string}} event The event to dispatch.
     * @returns {boolean} `false` if canceled.
     */
    dispatchEvent(event) {
        if (event == null || typeof event.type !== "string") {
            throw new TypeError('"event.type" should be a string.')
        }

        // If listeners aren't registered, terminate.
        const listeners = getListeners(this);
        const eventName = event.type;
        let node = listeners.get(eventName);
        if (node == null) {
            return true
        }

        // Since we cannot rewrite several properties, so wrap object.
        const wrappedEvent = wrapEvent(this, event);

        // This doesn't process capturing phase and bubbling phase.
        // This isn't participating in a tree.
        let prev = null;
        while (node != null) {
            // Remove this listener if it's once
            if (node.once) {
                if (prev !== null) {
                    prev.next = node.next;
                } else if (node.next !== null) {
                    listeners.set(eventName, node.next);
                } else {
                    listeners.delete(eventName);
                }
            } else {
                prev = node;
            }

            // Call this listener
            setPassiveListener(
                wrappedEvent,
                node.passive ? node.listener : null
            );
            if (typeof node.listener === "function") {
                try {
                    node.listener.call(this, wrappedEvent);
                } catch (err) {
                    if (
                        typeof console !== "undefined" &&
                        typeof console.error === "function"
                    ) {
                        console.error(err);
                    }
                }
            } else if (
                node.listenerType !== ATTRIBUTE &&
                typeof node.listener.handleEvent === "function"
            ) {
                node.listener.handleEvent(wrappedEvent);
            }

            // Break if `event.stopImmediatePropagation` was called.
            if (isStopped(wrappedEvent)) {
                break
            }

            node = node.next;
        }
        setPassiveListener(wrappedEvent, null);
        setEventPhase(wrappedEvent, 0);
        setCurrentTarget(wrappedEvent, null);

        return !wrappedEvent.defaultPrevented
    },
};

// `constructor` is not enumerable.
Object.defineProperty(EventTarget.prototype, "constructor", {
    value: EventTarget,
    configurable: true,
    writable: true,
});

// Ensure `eventTarget instanceof window.EventTarget` is `true`.
if (
    typeof window !== "undefined" &&
    typeof window.EventTarget !== "undefined"
) {
    Object.setPrototypeOf(EventTarget.prototype, window.EventTarget.prototype);
}

exports.defineEventAttribute = defineEventAttribute;
exports.EventTarget = EventTarget;
exports.default = EventTarget;

module.exports = EventTarget
module.exports.EventTarget = module.exports.default = EventTarget
module.exports.defineEventAttribute = defineEventAttribute
//# sourceMappingURL=event-target-shim.js.map


/***/ }),

/***/ 7013:
/***/ ((module) => {

"use strict";


module.exports = (flag, argv = process.argv) => {
	const prefix = flag.startsWith('-') ? '' : (flag.length === 1 ? '-' : '--');
	const position = argv.indexOf(prefix + flag);
	const terminatorPosition = argv.indexOf('--');
	return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
};


/***/ }),

/***/ 1607:
/***/ ((module) => {

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}


/***/ }),

/***/ 2133:
/***/ ((module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Stream = _interopDefault(__webpack_require__(2413));
var http = _interopDefault(__webpack_require__(8605));
var Url = _interopDefault(__webpack_require__(8835));
var https = _interopDefault(__webpack_require__(7211));
var zlib = _interopDefault(__webpack_require__(8761));

// Based on https://github.com/tmpvar/jsdom/blob/aa85b2abf07766ff7bf5c1f6daafb3726f2f2db5/lib/jsdom/living/blob.js

// fix for "Readable" isn't a named export issue
const Readable = Stream.Readable;

const BUFFER = Symbol('buffer');
const TYPE = Symbol('type');

class Blob {
	constructor() {
		this[TYPE] = '';

		const blobParts = arguments[0];
		const options = arguments[1];

		const buffers = [];
		let size = 0;

		if (blobParts) {
			const a = blobParts;
			const length = Number(a.length);
			for (let i = 0; i < length; i++) {
				const element = a[i];
				let buffer;
				if (element instanceof Buffer) {
					buffer = element;
				} else if (ArrayBuffer.isView(element)) {
					buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
				} else if (element instanceof ArrayBuffer) {
					buffer = Buffer.from(element);
				} else if (element instanceof Blob) {
					buffer = element[BUFFER];
				} else {
					buffer = Buffer.from(typeof element === 'string' ? element : String(element));
				}
				size += buffer.length;
				buffers.push(buffer);
			}
		}

		this[BUFFER] = Buffer.concat(buffers);

		let type = options && options.type !== undefined && String(options.type).toLowerCase();
		if (type && !/[^\u0020-\u007E]/.test(type)) {
			this[TYPE] = type;
		}
	}
	get size() {
		return this[BUFFER].length;
	}
	get type() {
		return this[TYPE];
	}
	text() {
		return Promise.resolve(this[BUFFER].toString());
	}
	arrayBuffer() {
		const buf = this[BUFFER];
		const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		return Promise.resolve(ab);
	}
	stream() {
		const readable = new Readable();
		readable._read = function () {};
		readable.push(this[BUFFER]);
		readable.push(null);
		return readable;
	}
	toString() {
		return '[object Blob]';
	}
	slice() {
		const size = this.size;

		const start = arguments[0];
		const end = arguments[1];
		let relativeStart, relativeEnd;
		if (start === undefined) {
			relativeStart = 0;
		} else if (start < 0) {
			relativeStart = Math.max(size + start, 0);
		} else {
			relativeStart = Math.min(start, size);
		}
		if (end === undefined) {
			relativeEnd = size;
		} else if (end < 0) {
			relativeEnd = Math.max(size + end, 0);
		} else {
			relativeEnd = Math.min(end, size);
		}
		const span = Math.max(relativeEnd - relativeStart, 0);

		const buffer = this[BUFFER];
		const slicedBuffer = buffer.slice(relativeStart, relativeStart + span);
		const blob = new Blob([], { type: arguments[2] });
		blob[BUFFER] = slicedBuffer;
		return blob;
	}
}

Object.defineProperties(Blob.prototype, {
	size: { enumerable: true },
	type: { enumerable: true },
	slice: { enumerable: true }
});

Object.defineProperty(Blob.prototype, Symbol.toStringTag, {
	value: 'Blob',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * fetch-error.js
 *
 * FetchError interface for operational errors
 */

/**
 * Create FetchError instance
 *
 * @param   String      message      Error message for human
 * @param   String      type         Error type for machine
 * @param   String      systemError  For Node.js system error
 * @return  FetchError
 */
function FetchError(message, type, systemError) {
  Error.call(this, message);

  this.message = message;
  this.type = type;

  // when err.type is `system`, err.code contains system error code
  if (systemError) {
    this.code = this.errno = systemError.code;
  }

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

FetchError.prototype = Object.create(Error.prototype);
FetchError.prototype.constructor = FetchError;
FetchError.prototype.name = 'FetchError';

let convert;
try {
	convert = __webpack_require__(7522).convert;
} catch (e) {}

const INTERNALS = Symbol('Body internals');

// fix an issue where "PassThrough" isn't a named export for node <10
const PassThrough = Stream.PassThrough;

/**
 * Body mixin
 *
 * Ref: https://fetch.spec.whatwg.org/#body
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
function Body(body) {
	var _this = this;

	var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	    _ref$size = _ref.size;

	let size = _ref$size === undefined ? 0 : _ref$size;
	var _ref$timeout = _ref.timeout;
	let timeout = _ref$timeout === undefined ? 0 : _ref$timeout;

	if (body == null) {
		// body is undefined or null
		body = null;
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		body = Buffer.from(body.toString());
	} else if (isBlob(body)) ; else if (Buffer.isBuffer(body)) ; else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		body = Buffer.from(body);
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
	} else if (body instanceof Stream) ; else {
		// none of the above
		// coerce to string then buffer
		body = Buffer.from(String(body));
	}
	this[INTERNALS] = {
		body,
		disturbed: false,
		error: null
	};
	this.size = size;
	this.timeout = timeout;

	if (body instanceof Stream) {
		body.on('error', function (err) {
			const error = err.name === 'AbortError' ? err : new FetchError(`Invalid response body while trying to fetch ${_this.url}: ${err.message}`, 'system', err);
			_this[INTERNALS].error = error;
		});
	}
}

Body.prototype = {
	get body() {
		return this[INTERNALS].body;
	},

	get bodyUsed() {
		return this[INTERNALS].disturbed;
	},

	/**
  * Decode response as ArrayBuffer
  *
  * @return  Promise
  */
	arrayBuffer() {
		return consumeBody.call(this).then(function (buf) {
			return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		});
	},

	/**
  * Return raw response as Blob
  *
  * @return Promise
  */
	blob() {
		let ct = this.headers && this.headers.get('content-type') || '';
		return consumeBody.call(this).then(function (buf) {
			return Object.assign(
			// Prevent copying
			new Blob([], {
				type: ct.toLowerCase()
			}), {
				[BUFFER]: buf
			});
		});
	},

	/**
  * Decode response as json
  *
  * @return  Promise
  */
	json() {
		var _this2 = this;

		return consumeBody.call(this).then(function (buffer) {
			try {
				return JSON.parse(buffer.toString());
			} catch (err) {
				return Body.Promise.reject(new FetchError(`invalid json response body at ${_this2.url} reason: ${err.message}`, 'invalid-json'));
			}
		});
	},

	/**
  * Decode response as text
  *
  * @return  Promise
  */
	text() {
		return consumeBody.call(this).then(function (buffer) {
			return buffer.toString();
		});
	},

	/**
  * Decode response as buffer (non-spec api)
  *
  * @return  Promise
  */
	buffer() {
		return consumeBody.call(this);
	},

	/**
  * Decode response as text, while automatically detecting the encoding and
  * trying to decode to UTF-8 (non-spec api)
  *
  * @return  Promise
  */
	textConverted() {
		var _this3 = this;

		return consumeBody.call(this).then(function (buffer) {
			return convertBody(buffer, _this3.headers);
		});
	}
};

// In browsers, all properties are enumerable.
Object.defineProperties(Body.prototype, {
	body: { enumerable: true },
	bodyUsed: { enumerable: true },
	arrayBuffer: { enumerable: true },
	blob: { enumerable: true },
	json: { enumerable: true },
	text: { enumerable: true }
});

Body.mixIn = function (proto) {
	for (const name of Object.getOwnPropertyNames(Body.prototype)) {
		// istanbul ignore else: future proof
		if (!(name in proto)) {
			const desc = Object.getOwnPropertyDescriptor(Body.prototype, name);
			Object.defineProperty(proto, name, desc);
		}
	}
};

/**
 * Consume and convert an entire Body to a Buffer.
 *
 * Ref: https://fetch.spec.whatwg.org/#concept-body-consume-body
 *
 * @return  Promise
 */
function consumeBody() {
	var _this4 = this;

	if (this[INTERNALS].disturbed) {
		return Body.Promise.reject(new TypeError(`body used already for: ${this.url}`));
	}

	this[INTERNALS].disturbed = true;

	if (this[INTERNALS].error) {
		return Body.Promise.reject(this[INTERNALS].error);
	}

	let body = this.body;

	// body is null
	if (body === null) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is blob
	if (isBlob(body)) {
		body = body.stream();
	}

	// body is buffer
	if (Buffer.isBuffer(body)) {
		return Body.Promise.resolve(body);
	}

	// istanbul ignore if: should never happen
	if (!(body instanceof Stream)) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is stream
	// get ready to actually consume the body
	let accum = [];
	let accumBytes = 0;
	let abort = false;

	return new Body.Promise(function (resolve, reject) {
		let resTimeout;

		// allow timeout on slow response body
		if (_this4.timeout) {
			resTimeout = setTimeout(function () {
				abort = true;
				reject(new FetchError(`Response timeout while trying to fetch ${_this4.url} (over ${_this4.timeout}ms)`, 'body-timeout'));
			}, _this4.timeout);
		}

		// handle stream errors
		body.on('error', function (err) {
			if (err.name === 'AbortError') {
				// if the request was aborted, reject with this Error
				abort = true;
				reject(err);
			} else {
				// other errors, such as incorrect content-encoding
				reject(new FetchError(`Invalid response body while trying to fetch ${_this4.url}: ${err.message}`, 'system', err));
			}
		});

		body.on('data', function (chunk) {
			if (abort || chunk === null) {
				return;
			}

			if (_this4.size && accumBytes + chunk.length > _this4.size) {
				abort = true;
				reject(new FetchError(`content size at ${_this4.url} over limit: ${_this4.size}`, 'max-size'));
				return;
			}

			accumBytes += chunk.length;
			accum.push(chunk);
		});

		body.on('end', function () {
			if (abort) {
				return;
			}

			clearTimeout(resTimeout);

			try {
				resolve(Buffer.concat(accum, accumBytes));
			} catch (err) {
				// handle streams that have accumulated too much data (issue #414)
				reject(new FetchError(`Could not create Buffer from response body for ${_this4.url}: ${err.message}`, 'system', err));
			}
		});
	});
}

/**
 * Detect buffer encoding and convert to target encoding
 * ref: http://www.w3.org/TR/2011/WD-html5-20110113/parsing.html#determining-the-character-encoding
 *
 * @param   Buffer  buffer    Incoming buffer
 * @param   String  encoding  Target encoding
 * @return  String
 */
function convertBody(buffer, headers) {
	if (typeof convert !== 'function') {
		throw new Error('The package `encoding` must be installed to use the textConverted() function');
	}

	const ct = headers.get('content-type');
	let charset = 'utf-8';
	let res, str;

	// header
	if (ct) {
		res = /charset=([^;]*)/i.exec(ct);
	}

	// no charset in content type, peek at response body for at most 1024 bytes
	str = buffer.slice(0, 1024).toString();

	// html5
	if (!res && str) {
		res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str);
	}

	// html4
	if (!res && str) {
		res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str);
		if (!res) {
			res = /<meta[\s]+?content=(['"])(.+?)\1[\s]+?http-equiv=(['"])content-type\3/i.exec(str);
			if (res) {
				res.pop(); // drop last quote
			}
		}

		if (res) {
			res = /charset=(.*)/i.exec(res.pop());
		}
	}

	// xml
	if (!res && str) {
		res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str);
	}

	// found charset
	if (res) {
		charset = res.pop();

		// prevent decode issues when sites use incorrect encoding
		// ref: https://hsivonen.fi/encoding-menu/
		if (charset === 'gb2312' || charset === 'gbk') {
			charset = 'gb18030';
		}
	}

	// turn raw buffers into a single utf-8 buffer
	return convert(buffer, 'UTF-8', charset).toString();
}

/**
 * Detect a URLSearchParams object
 * ref: https://github.com/bitinn/node-fetch/issues/296#issuecomment-307598143
 *
 * @param   Object  obj     Object to detect by type or brand
 * @return  String
 */
function isURLSearchParams(obj) {
	// Duck-typing as a necessary condition.
	if (typeof obj !== 'object' || typeof obj.append !== 'function' || typeof obj.delete !== 'function' || typeof obj.get !== 'function' || typeof obj.getAll !== 'function' || typeof obj.has !== 'function' || typeof obj.set !== 'function') {
		return false;
	}

	// Brand-checking and more duck-typing as optional condition.
	return obj.constructor.name === 'URLSearchParams' || Object.prototype.toString.call(obj) === '[object URLSearchParams]' || typeof obj.sort === 'function';
}

/**
 * Check if `obj` is a W3C `Blob` object (which `File` inherits from)
 * @param  {*} obj
 * @return {boolean}
 */
function isBlob(obj) {
	return typeof obj === 'object' && typeof obj.arrayBuffer === 'function' && typeof obj.type === 'string' && typeof obj.stream === 'function' && typeof obj.constructor === 'function' && typeof obj.constructor.name === 'string' && /^(Blob|File)$/.test(obj.constructor.name) && /^(Blob|File)$/.test(obj[Symbol.toStringTag]);
}

/**
 * Clone body given Res/Req instance
 *
 * @param   Mixed  instance  Response or Request instance
 * @return  Mixed
 */
function clone(instance) {
	let p1, p2;
	let body = instance.body;

	// don't allow cloning a used body
	if (instance.bodyUsed) {
		throw new Error('cannot clone body after it is used');
	}

	// check that body is a stream and not form-data object
	// note: we can't clone the form-data object without having it as a dependency
	if (body instanceof Stream && typeof body.getBoundary !== 'function') {
		// tee instance body
		p1 = new PassThrough();
		p2 = new PassThrough();
		body.pipe(p1);
		body.pipe(p2);
		// set instance body to teed body and return the other teed body
		instance[INTERNALS].body = p1;
		body = p2;
	}

	return body;
}

/**
 * Performs the operation "extract a `Content-Type` value from |object|" as
 * specified in the specification:
 * https://fetch.spec.whatwg.org/#concept-bodyinit-extract
 *
 * This function assumes that instance.body is present.
 *
 * @param   Mixed  instance  Any options.body input
 */
function extractContentType(body) {
	if (body === null) {
		// body is null
		return null;
	} else if (typeof body === 'string') {
		// body is string
		return 'text/plain;charset=UTF-8';
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		return 'application/x-www-form-urlencoded;charset=UTF-8';
	} else if (isBlob(body)) {
		// body is blob
		return body.type || null;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return null;
	} else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		return null;
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		return null;
	} else if (typeof body.getBoundary === 'function') {
		// detect form data input from form-data module
		return `multipart/form-data;boundary=${body.getBoundary()}`;
	} else if (body instanceof Stream) {
		// body is stream
		// can't really do much about this
		return null;
	} else {
		// Body constructor defaults other things to string
		return 'text/plain;charset=UTF-8';
	}
}

/**
 * The Fetch Standard treats this as if "total bytes" is a property on the body.
 * For us, we have to explicitly get it with a function.
 *
 * ref: https://fetch.spec.whatwg.org/#concept-body-total-bytes
 *
 * @param   Body    instance   Instance of Body
 * @return  Number?            Number of bytes, or null if not possible
 */
function getTotalBytes(instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		return 0;
	} else if (isBlob(body)) {
		return body.size;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return body.length;
	} else if (body && typeof body.getLengthSync === 'function') {
		// detect form data input from form-data module
		if (body._lengthRetrievers && body._lengthRetrievers.length == 0 || // 1.x
		body.hasKnownLength && body.hasKnownLength()) {
			// 2.x
			return body.getLengthSync();
		}
		return null;
	} else {
		// body is stream
		return null;
	}
}

/**
 * Write a Body to a Node.js WritableStream (e.g. http.Request) object.
 *
 * @param   Body    instance   Instance of Body
 * @return  Void
 */
function writeToStream(dest, instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		dest.end();
	} else if (isBlob(body)) {
		body.stream().pipe(dest);
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		dest.write(body);
		dest.end();
	} else {
		// body is stream
		body.pipe(dest);
	}
}

// expose Promise
Body.Promise = global.Promise;

/**
 * headers.js
 *
 * Headers class offers convenient helpers
 */

const invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
const invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;

function validateName(name) {
	name = `${name}`;
	if (invalidTokenRegex.test(name) || name === '') {
		throw new TypeError(`${name} is not a legal HTTP header name`);
	}
}

function validateValue(value) {
	value = `${value}`;
	if (invalidHeaderCharRegex.test(value)) {
		throw new TypeError(`${value} is not a legal HTTP header value`);
	}
}

/**
 * Find the key in the map object given a header name.
 *
 * Returns undefined if not found.
 *
 * @param   String  name  Header name
 * @return  String|Undefined
 */
function find(map, name) {
	name = name.toLowerCase();
	for (const key in map) {
		if (key.toLowerCase() === name) {
			return key;
		}
	}
	return undefined;
}

const MAP = Symbol('map');
class Headers {
	/**
  * Headers class
  *
  * @param   Object  headers  Response headers
  * @return  Void
  */
	constructor() {
		let init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

		this[MAP] = Object.create(null);

		if (init instanceof Headers) {
			const rawHeaders = init.raw();
			const headerNames = Object.keys(rawHeaders);

			for (const headerName of headerNames) {
				for (const value of rawHeaders[headerName]) {
					this.append(headerName, value);
				}
			}

			return;
		}

		// We don't worry about converting prop to ByteString here as append()
		// will handle it.
		if (init == null) ; else if (typeof init === 'object') {
			const method = init[Symbol.iterator];
			if (method != null) {
				if (typeof method !== 'function') {
					throw new TypeError('Header pairs must be iterable');
				}

				// sequence<sequence<ByteString>>
				// Note: per spec we have to first exhaust the lists then process them
				const pairs = [];
				for (const pair of init) {
					if (typeof pair !== 'object' || typeof pair[Symbol.iterator] !== 'function') {
						throw new TypeError('Each header pair must be iterable');
					}
					pairs.push(Array.from(pair));
				}

				for (const pair of pairs) {
					if (pair.length !== 2) {
						throw new TypeError('Each header pair must be a name/value tuple');
					}
					this.append(pair[0], pair[1]);
				}
			} else {
				// record<ByteString, ByteString>
				for (const key of Object.keys(init)) {
					const value = init[key];
					this.append(key, value);
				}
			}
		} else {
			throw new TypeError('Provided initializer must be an object');
		}
	}

	/**
  * Return combined header value given name
  *
  * @param   String  name  Header name
  * @return  Mixed
  */
	get(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key === undefined) {
			return null;
		}

		return this[MAP][key].join(', ');
	}

	/**
  * Iterate over all headers
  *
  * @param   Function  callback  Executed for each item with parameters (value, name, thisArg)
  * @param   Boolean   thisArg   `this` context for callback function
  * @return  Void
  */
	forEach(callback) {
		let thisArg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

		let pairs = getHeaders(this);
		let i = 0;
		while (i < pairs.length) {
			var _pairs$i = pairs[i];
			const name = _pairs$i[0],
			      value = _pairs$i[1];

			callback.call(thisArg, value, name, this);
			pairs = getHeaders(this);
			i++;
		}
	}

	/**
  * Overwrite header values given name
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	set(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		this[MAP][key !== undefined ? key : name] = [value];
	}

	/**
  * Append a value onto existing header
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	append(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			this[MAP][key].push(value);
		} else {
			this[MAP][name] = [value];
		}
	}

	/**
  * Check for header name existence
  *
  * @param   String   name  Header name
  * @return  Boolean
  */
	has(name) {
		name = `${name}`;
		validateName(name);
		return find(this[MAP], name) !== undefined;
	}

	/**
  * Delete all header values given name
  *
  * @param   String  name  Header name
  * @return  Void
  */
	delete(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			delete this[MAP][key];
		}
	}

	/**
  * Return raw headers (non-spec api)
  *
  * @return  Object
  */
	raw() {
		return this[MAP];
	}

	/**
  * Get an iterator on keys.
  *
  * @return  Iterator
  */
	keys() {
		return createHeadersIterator(this, 'key');
	}

	/**
  * Get an iterator on values.
  *
  * @return  Iterator
  */
	values() {
		return createHeadersIterator(this, 'value');
	}

	/**
  * Get an iterator on entries.
  *
  * This is the default iterator of the Headers object.
  *
  * @return  Iterator
  */
	[Symbol.iterator]() {
		return createHeadersIterator(this, 'key+value');
	}
}
Headers.prototype.entries = Headers.prototype[Symbol.iterator];

Object.defineProperty(Headers.prototype, Symbol.toStringTag, {
	value: 'Headers',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Headers.prototype, {
	get: { enumerable: true },
	forEach: { enumerable: true },
	set: { enumerable: true },
	append: { enumerable: true },
	has: { enumerable: true },
	delete: { enumerable: true },
	keys: { enumerable: true },
	values: { enumerable: true },
	entries: { enumerable: true }
});

function getHeaders(headers) {
	let kind = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'key+value';

	const keys = Object.keys(headers[MAP]).sort();
	return keys.map(kind === 'key' ? function (k) {
		return k.toLowerCase();
	} : kind === 'value' ? function (k) {
		return headers[MAP][k].join(', ');
	} : function (k) {
		return [k.toLowerCase(), headers[MAP][k].join(', ')];
	});
}

const INTERNAL = Symbol('internal');

function createHeadersIterator(target, kind) {
	const iterator = Object.create(HeadersIteratorPrototype);
	iterator[INTERNAL] = {
		target,
		kind,
		index: 0
	};
	return iterator;
}

const HeadersIteratorPrototype = Object.setPrototypeOf({
	next() {
		// istanbul ignore if
		if (!this || Object.getPrototypeOf(this) !== HeadersIteratorPrototype) {
			throw new TypeError('Value of `this` is not a HeadersIterator');
		}

		var _INTERNAL = this[INTERNAL];
		const target = _INTERNAL.target,
		      kind = _INTERNAL.kind,
		      index = _INTERNAL.index;

		const values = getHeaders(target, kind);
		const len = values.length;
		if (index >= len) {
			return {
				value: undefined,
				done: true
			};
		}

		this[INTERNAL].index = index + 1;

		return {
			value: values[index],
			done: false
		};
	}
}, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));

Object.defineProperty(HeadersIteratorPrototype, Symbol.toStringTag, {
	value: 'HeadersIterator',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * Export the Headers object in a form that Node.js can consume.
 *
 * @param   Headers  headers
 * @return  Object
 */
function exportNodeCompatibleHeaders(headers) {
	const obj = Object.assign({ __proto__: null }, headers[MAP]);

	// http.request() only supports string as Host header. This hack makes
	// specifying custom Host header possible.
	const hostHeaderKey = find(headers[MAP], 'Host');
	if (hostHeaderKey !== undefined) {
		obj[hostHeaderKey] = obj[hostHeaderKey][0];
	}

	return obj;
}

/**
 * Create a Headers object from an object of headers, ignoring those that do
 * not conform to HTTP grammar productions.
 *
 * @param   Object  obj  Object of headers
 * @return  Headers
 */
function createHeadersLenient(obj) {
	const headers = new Headers();
	for (const name of Object.keys(obj)) {
		if (invalidTokenRegex.test(name)) {
			continue;
		}
		if (Array.isArray(obj[name])) {
			for (const val of obj[name]) {
				if (invalidHeaderCharRegex.test(val)) {
					continue;
				}
				if (headers[MAP][name] === undefined) {
					headers[MAP][name] = [val];
				} else {
					headers[MAP][name].push(val);
				}
			}
		} else if (!invalidHeaderCharRegex.test(obj[name])) {
			headers[MAP][name] = [obj[name]];
		}
	}
	return headers;
}

const INTERNALS$1 = Symbol('Response internals');

// fix an issue where "STATUS_CODES" aren't a named export for node <10
const STATUS_CODES = http.STATUS_CODES;

/**
 * Response class
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
class Response {
	constructor() {
		let body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
		let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		Body.call(this, body, opts);

		const status = opts.status || 200;
		const headers = new Headers(opts.headers);

		if (body != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(body);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		this[INTERNALS$1] = {
			url: opts.url,
			status,
			statusText: opts.statusText || STATUS_CODES[status],
			headers,
			counter: opts.counter
		};
	}

	get url() {
		return this[INTERNALS$1].url || '';
	}

	get status() {
		return this[INTERNALS$1].status;
	}

	/**
  * Convenience property representing if the request ended normally
  */
	get ok() {
		return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
	}

	get redirected() {
		return this[INTERNALS$1].counter > 0;
	}

	get statusText() {
		return this[INTERNALS$1].statusText;
	}

	get headers() {
		return this[INTERNALS$1].headers;
	}

	/**
  * Clone this response
  *
  * @return  Response
  */
	clone() {
		return new Response(clone(this), {
			url: this.url,
			status: this.status,
			statusText: this.statusText,
			headers: this.headers,
			ok: this.ok,
			redirected: this.redirected
		});
	}
}

Body.mixIn(Response.prototype);

Object.defineProperties(Response.prototype, {
	url: { enumerable: true },
	status: { enumerable: true },
	ok: { enumerable: true },
	redirected: { enumerable: true },
	statusText: { enumerable: true },
	headers: { enumerable: true },
	clone: { enumerable: true }
});

Object.defineProperty(Response.prototype, Symbol.toStringTag, {
	value: 'Response',
	writable: false,
	enumerable: false,
	configurable: true
});

const INTERNALS$2 = Symbol('Request internals');

// fix an issue where "format", "parse" aren't a named export for node <10
const parse_url = Url.parse;
const format_url = Url.format;

const streamDestructionSupported = 'destroy' in Stream.Readable.prototype;

/**
 * Check if a value is an instance of Request.
 *
 * @param   Mixed   input
 * @return  Boolean
 */
function isRequest(input) {
	return typeof input === 'object' && typeof input[INTERNALS$2] === 'object';
}

function isAbortSignal(signal) {
	const proto = signal && typeof signal === 'object' && Object.getPrototypeOf(signal);
	return !!(proto && proto.constructor.name === 'AbortSignal');
}

/**
 * Request class
 *
 * @param   Mixed   input  Url or Request instance
 * @param   Object  init   Custom options
 * @return  Void
 */
class Request {
	constructor(input) {
		let init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		let parsedURL;

		// normalize input
		if (!isRequest(input)) {
			if (input && input.href) {
				// in order to support Node.js' Url objects; though WHATWG's URL objects
				// will fall into this branch also (since their `toString()` will return
				// `href` property anyway)
				parsedURL = parse_url(input.href);
			} else {
				// coerce input to a string before attempting to parse
				parsedURL = parse_url(`${input}`);
			}
			input = {};
		} else {
			parsedURL = parse_url(input.url);
		}

		let method = init.method || input.method || 'GET';
		method = method.toUpperCase();

		if ((init.body != null || isRequest(input) && input.body !== null) && (method === 'GET' || method === 'HEAD')) {
			throw new TypeError('Request with GET/HEAD method cannot have body');
		}

		let inputBody = init.body != null ? init.body : isRequest(input) && input.body !== null ? clone(input) : null;

		Body.call(this, inputBody, {
			timeout: init.timeout || input.timeout || 0,
			size: init.size || input.size || 0
		});

		const headers = new Headers(init.headers || input.headers || {});

		if (inputBody != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(inputBody);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		let signal = isRequest(input) ? input.signal : null;
		if ('signal' in init) signal = init.signal;

		if (signal != null && !isAbortSignal(signal)) {
			throw new TypeError('Expected signal to be an instanceof AbortSignal');
		}

		this[INTERNALS$2] = {
			method,
			redirect: init.redirect || input.redirect || 'follow',
			headers,
			parsedURL,
			signal
		};

		// node-fetch-only options
		this.follow = init.follow !== undefined ? init.follow : input.follow !== undefined ? input.follow : 20;
		this.compress = init.compress !== undefined ? init.compress : input.compress !== undefined ? input.compress : true;
		this.counter = init.counter || input.counter || 0;
		this.agent = init.agent || input.agent;
	}

	get method() {
		return this[INTERNALS$2].method;
	}

	get url() {
		return format_url(this[INTERNALS$2].parsedURL);
	}

	get headers() {
		return this[INTERNALS$2].headers;
	}

	get redirect() {
		return this[INTERNALS$2].redirect;
	}

	get signal() {
		return this[INTERNALS$2].signal;
	}

	/**
  * Clone this request
  *
  * @return  Request
  */
	clone() {
		return new Request(this);
	}
}

Body.mixIn(Request.prototype);

Object.defineProperty(Request.prototype, Symbol.toStringTag, {
	value: 'Request',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Request.prototype, {
	method: { enumerable: true },
	url: { enumerable: true },
	headers: { enumerable: true },
	redirect: { enumerable: true },
	clone: { enumerable: true },
	signal: { enumerable: true }
});

/**
 * Convert a Request to Node.js http request options.
 *
 * @param   Request  A Request instance
 * @return  Object   The options object to be passed to http.request
 */
function getNodeRequestOptions(request) {
	const parsedURL = request[INTERNALS$2].parsedURL;
	const headers = new Headers(request[INTERNALS$2].headers);

	// fetch step 1.3
	if (!headers.has('Accept')) {
		headers.set('Accept', '*/*');
	}

	// Basic fetch
	if (!parsedURL.protocol || !parsedURL.hostname) {
		throw new TypeError('Only absolute URLs are supported');
	}

	if (!/^https?:$/.test(parsedURL.protocol)) {
		throw new TypeError('Only HTTP(S) protocols are supported');
	}

	if (request.signal && request.body instanceof Stream.Readable && !streamDestructionSupported) {
		throw new Error('Cancellation of streamed requests with AbortSignal is not supported in node < 8');
	}

	// HTTP-network-or-cache fetch steps 2.4-2.7
	let contentLengthValue = null;
	if (request.body == null && /^(POST|PUT)$/i.test(request.method)) {
		contentLengthValue = '0';
	}
	if (request.body != null) {
		const totalBytes = getTotalBytes(request);
		if (typeof totalBytes === 'number') {
			contentLengthValue = String(totalBytes);
		}
	}
	if (contentLengthValue) {
		headers.set('Content-Length', contentLengthValue);
	}

	// HTTP-network-or-cache fetch step 2.11
	if (!headers.has('User-Agent')) {
		headers.set('User-Agent', 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)');
	}

	// HTTP-network-or-cache fetch step 2.15
	if (request.compress && !headers.has('Accept-Encoding')) {
		headers.set('Accept-Encoding', 'gzip,deflate');
	}

	let agent = request.agent;
	if (typeof agent === 'function') {
		agent = agent(parsedURL);
	}

	if (!headers.has('Connection') && !agent) {
		headers.set('Connection', 'close');
	}

	// HTTP-network fetch step 4.2
	// chunked encoding is handled by Node.js

	return Object.assign({}, parsedURL, {
		method: request.method,
		headers: exportNodeCompatibleHeaders(headers),
		agent
	});
}

/**
 * abort-error.js
 *
 * AbortError interface for cancelled requests
 */

/**
 * Create AbortError instance
 *
 * @param   String      message      Error message for human
 * @return  AbortError
 */
function AbortError(message) {
  Error.call(this, message);

  this.type = 'aborted';
  this.message = message;

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

AbortError.prototype = Object.create(Error.prototype);
AbortError.prototype.constructor = AbortError;
AbortError.prototype.name = 'AbortError';

// fix an issue where "PassThrough", "resolve" aren't a named export for node <10
const PassThrough$1 = Stream.PassThrough;
const resolve_url = Url.resolve;

/**
 * Fetch function
 *
 * @param   Mixed    url   Absolute url or Request instance
 * @param   Object   opts  Fetch options
 * @return  Promise
 */
function fetch(url, opts) {

	// allow custom promise
	if (!fetch.Promise) {
		throw new Error('native promise missing, set fetch.Promise to your favorite alternative');
	}

	Body.Promise = fetch.Promise;

	// wrap http.request into fetch
	return new fetch.Promise(function (resolve, reject) {
		// build request object
		const request = new Request(url, opts);
		const options = getNodeRequestOptions(request);

		const send = (options.protocol === 'https:' ? https : http).request;
		const signal = request.signal;

		let response = null;

		const abort = function abort() {
			let error = new AbortError('The user aborted a request.');
			reject(error);
			if (request.body && request.body instanceof Stream.Readable) {
				request.body.destroy(error);
			}
			if (!response || !response.body) return;
			response.body.emit('error', error);
		};

		if (signal && signal.aborted) {
			abort();
			return;
		}

		const abortAndFinalize = function abortAndFinalize() {
			abort();
			finalize();
		};

		// send request
		const req = send(options);
		let reqTimeout;

		if (signal) {
			signal.addEventListener('abort', abortAndFinalize);
		}

		function finalize() {
			req.abort();
			if (signal) signal.removeEventListener('abort', abortAndFinalize);
			clearTimeout(reqTimeout);
		}

		if (request.timeout) {
			req.once('socket', function (socket) {
				reqTimeout = setTimeout(function () {
					reject(new FetchError(`network timeout at: ${request.url}`, 'request-timeout'));
					finalize();
				}, request.timeout);
			});
		}

		req.on('error', function (err) {
			reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, 'system', err));
			finalize();
		});

		req.on('response', function (res) {
			clearTimeout(reqTimeout);

			const headers = createHeadersLenient(res.headers);

			// HTTP fetch step 5
			if (fetch.isRedirect(res.statusCode)) {
				// HTTP fetch step 5.2
				const location = headers.get('Location');

				// HTTP fetch step 5.3
				const locationURL = location === null ? null : resolve_url(request.url, location);

				// HTTP fetch step 5.5
				switch (request.redirect) {
					case 'error':
						reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, 'no-redirect'));
						finalize();
						return;
					case 'manual':
						// node-fetch-specific step: make manual redirect a bit easier to use by setting the Location header value to the resolved URL.
						if (locationURL !== null) {
							// handle corrupted header
							try {
								headers.set('Location', locationURL);
							} catch (err) {
								// istanbul ignore next: nodejs server prevent invalid response headers, we can't test this through normal request
								reject(err);
							}
						}
						break;
					case 'follow':
						// HTTP-redirect fetch step 2
						if (locationURL === null) {
							break;
						}

						// HTTP-redirect fetch step 5
						if (request.counter >= request.follow) {
							reject(new FetchError(`maximum redirect reached at: ${request.url}`, 'max-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 6 (counter increment)
						// Create a new Request object.
						const requestOpts = {
							headers: new Headers(request.headers),
							follow: request.follow,
							counter: request.counter + 1,
							agent: request.agent,
							compress: request.compress,
							method: request.method,
							body: request.body,
							signal: request.signal,
							timeout: request.timeout,
							size: request.size
						};

						// HTTP-redirect fetch step 9
						if (res.statusCode !== 303 && request.body && getTotalBytes(request) === null) {
							reject(new FetchError('Cannot follow redirect with body being a readable stream', 'unsupported-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 11
						if (res.statusCode === 303 || (res.statusCode === 301 || res.statusCode === 302) && request.method === 'POST') {
							requestOpts.method = 'GET';
							requestOpts.body = undefined;
							requestOpts.headers.delete('content-length');
						}

						// HTTP-redirect fetch step 15
						resolve(fetch(new Request(locationURL, requestOpts)));
						finalize();
						return;
				}
			}

			// prepare response
			res.once('end', function () {
				if (signal) signal.removeEventListener('abort', abortAndFinalize);
			});
			let body = res.pipe(new PassThrough$1());

			const response_options = {
				url: request.url,
				status: res.statusCode,
				statusText: res.statusMessage,
				headers: headers,
				size: request.size,
				timeout: request.timeout,
				counter: request.counter
			};

			// HTTP-network fetch step 12.1.1.3
			const codings = headers.get('Content-Encoding');

			// HTTP-network fetch step 12.1.1.4: handle content codings

			// in following scenarios we ignore compression support
			// 1. compression support is disabled
			// 2. HEAD request
			// 3. no Content-Encoding header
			// 4. no content response (204)
			// 5. content not modified response (304)
			if (!request.compress || request.method === 'HEAD' || codings === null || res.statusCode === 204 || res.statusCode === 304) {
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// For Node v6+
			// Be less strict when decoding compressed responses, since sometimes
			// servers send slightly invalid responses that are still accepted
			// by common browsers.
			// Always using Z_SYNC_FLUSH is what cURL does.
			const zlibOptions = {
				flush: zlib.Z_SYNC_FLUSH,
				finishFlush: zlib.Z_SYNC_FLUSH
			};

			// for gzip
			if (codings == 'gzip' || codings == 'x-gzip') {
				body = body.pipe(zlib.createGunzip(zlibOptions));
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// for deflate
			if (codings == 'deflate' || codings == 'x-deflate') {
				// handle the infamous raw deflate response from old servers
				// a hack for old IIS and Apache servers
				const raw = res.pipe(new PassThrough$1());
				raw.once('data', function (chunk) {
					// see http://stackoverflow.com/questions/37519828
					if ((chunk[0] & 0x0F) === 0x08) {
						body = body.pipe(zlib.createInflate());
					} else {
						body = body.pipe(zlib.createInflateRaw());
					}
					response = new Response(body, response_options);
					resolve(response);
				});
				return;
			}

			// for br
			if (codings == 'br' && typeof zlib.createBrotliDecompress === 'function') {
				body = body.pipe(zlib.createBrotliDecompress());
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// otherwise, use response as-is
			response = new Response(body, response_options);
			resolve(response);
		});

		writeToStream(req, request);
	});
}
/**
 * Redirect code matching
 *
 * @param   Number   code  Status code
 * @return  Boolean
 */
fetch.isRedirect = function (code) {
	return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
};

// expose Promise
fetch.Promise = global.Promise;

module.exports = exports = fetch;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.default = exports;
exports.Headers = Headers;
exports.Request = Request;
exports.Response = Response;
exports.FetchError = FetchError;


/***/ }),

/***/ 8653:
/***/ ((module) => {

"use strict";


class TimeoutError extends Error {
	constructor(message) {
		super(message);
		this.name = 'TimeoutError';
	}
}

const pTimeout = (promise, milliseconds, fallback, options) => {
	let timer;
	const cancelablePromise = new Promise((resolve, reject) => {
		if (typeof milliseconds !== 'number' || milliseconds < 0) {
			throw new TypeError('Expected `milliseconds` to be a positive number');
		}

		if (milliseconds === Infinity) {
			resolve(promise);
			return;
		}

		options = {
			customTimers: {setTimeout, clearTimeout},
			...options
		};

		timer = options.customTimers.setTimeout.call(undefined, () => {
			if (typeof fallback === 'function') {
				try {
					resolve(fallback());
				} catch (error) {
					reject(error);
				}

				return;
			}

			const message = typeof fallback === 'string' ? fallback : `Promise timed out after ${milliseconds} milliseconds`;
			const timeoutError = fallback instanceof Error ? fallback : new TimeoutError(message);

			if (typeof promise.cancel === 'function') {
				promise.cancel();
			}

			reject(timeoutError);
		}, milliseconds);

		(async () => {
			try {
				resolve(await promise);
			} catch (error) {
				reject(error);
			} finally {
				options.customTimers.clearTimeout.call(undefined, timer);
			}
		})();
	});

	cancelablePromise.clear = () => {
		clearTimeout(timer);
		timer = undefined;
	};

	return cancelablePromise;
};

module.exports = pTimeout;
// TODO: Remove this for the next major release
module.exports.default = pTimeout;

module.exports.TimeoutError = TimeoutError;


/***/ }),

/***/ 8620:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * @author Michael Raith
 * @date   24.02.2016 12:04
 */



var crypto = __webpack_require__(6417);
var bufferAlloc = __webpack_require__(1697);


/**
 * Do a constant time string comparison. Always compare the complete strings
 * against each other to get a constant time. This method does not short-cut
 * if the two string's length differs.
 *
 * @param {string} a
 * @param {string} b
 *
 * @return {boolean}
 */
var safeCompare = function safeCompare(a, b) {
    var strA = String(a);
    var strB = String(b);
    var lenA = strA.length;
    var result = 0;

    if (lenA !== strB.length) {
        strB = strA;
        result = 1;
    }

    for (var i = 0; i < lenA; i++) {
        result |= (strA.charCodeAt(i) ^ strB.charCodeAt(i));
    }

    return result === 0;
};


/**
 * Call native "crypto.timingSafeEqual" methods.
 * All passed values will be converted into strings first.
 *
 * Runtime is always corresponding to the length of the first parameter (string
 * a).
 *
 * @param {string} a
 * @param {string} b
 *
 * @return {boolean}
 */
var nativeTimingSafeEqual = function nativeTimingSafeEqual(a, b) {
    var strA = String(a);
    var strB = String(b);
    var aLen = Buffer.byteLength(strA);
    var bLen = Buffer.byteLength(strB);

    // Always use length of a to avoid leaking the length. Even if this is a
    // false positive because one is a prefix of the other, the explicit length
    // check at the end will catch that.
    var bufA = bufferAlloc(aLen, 0, 'utf8');
    bufA.write(strA);
    var bufB = bufferAlloc(aLen, 0, 'utf8');
    bufB.write(strB);

    return crypto.timingSafeEqual(bufA, bufB) && aLen === bLen;
};


module.exports = (
    typeof crypto.timingSafeEqual !== 'undefined' ?
        nativeTimingSafeEqual :
        safeCompare
);


/***/ }),

/***/ 4560:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

var stream = __webpack_require__(2413);

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
}

/**
 * Handles Readable streams requests as concatenation through data handling as
 * well adding tags it each begin, end and between of the streams
 */
class SandwichStream extends stream.Readable {
    /**
     * Initiates the SandwichStream, you can consider it also passing
     * ReadableOptions to it
     *
     * @param head Pushes this content before all other content
     * @param tail Pushes this content after all other data has been pushed
     * @param separator Pushes this content between each stream
     * @param remaining The other kind of options to be passed to Readable
     * @example
     * const ss = new SandwichStream({
     *     head: 'This at the top\n',
     *     tail: '\nThis at the bottom',
     *     separator: '\n --- \n'
     * });
     */
    constructor(_a) {
        var { head, tail, separator } = _a, remaining = __rest(_a, ["head", "tail", "separator"]);
        super(remaining);
        this.streamsActive = false;
        this.streams = [];
        this.newStreams = [];
        this.currentStream = null;
        this.head = (null !== head && undefined !== head) ? head : null;
        this.tail = (null !== tail && undefined !== tail) ? tail : null;
        this.separator = (null !== separator && undefined !== separator) ? separator : null;
    }
    /**
     * Add a new Readable stream in the queue
     *
     * @param newStream The Readable stream
     * @example
     * sandwichStream.add(streamOne);
     * sandwichStream.add(streamTwo);
     * sandwichStream.add(streamThree);
     * @throws An Error in case that this request was not accepted
     * @returns This instance of Sandwich Stream
     */
    add(newStream) {
        if (false === this.streamsActive) {
            this.streams.push(newStream);
            newStream.on('error', this.subStreamOnError.bind(this));
        }
        else {
            this.newStreams.push(newStream);
        }
        return this;
    }
    /**
     * Works in a similar way from the Readable read, only that this one checks
     * for whether or not a stream is already being handled
     * @returns This instance of Sandwich Stream
     */
    _read() {
        if (false === this.streamsActive) {
            this.streamsActive = true;
            this.pushHead();
            this.streamNextStream();
        }
    }
    /**
     * Binds an error thrown from one of the streams being handled
     *
     * @param err Error to be bind
     * @returns This instance of Sandwich Stream
     */
    subStreamOnError(err) {
        this.emit('error', err);
    }
    /**
     * Fetches the next stream to be handled
     * @returns This instance of Sandwich Stream
     */
    streamNextStream() {
        if (true === this.nextStream()) {
            this.bindCurrentStreamEvents();
        }
        else {
            this.pushTail();
            this.push(null);
        }
    }
    /**
     * Verifies whether or not the stream queue has ended
     * @returns This instance of Sandwich Stream
     */
    nextStream() {
        const tmp = this.streams.shift();
        this.currentStream = (undefined !== tmp) ? tmp : null;
        return null !== this.currentStream;
    }
    /**
     * Once the current stream starts to pass their data, this handles it in a
     * less complicated way
     * @returns This instance of Sandwich Stream
     */
    bindCurrentStreamEvents() {
        this.currentStream.on('readable', this.currentStreamOnReadable.bind(this));
        this.currentStream.on('end', this.currentStreamOnEnd.bind(this));
    }
    /**
     * Handles the data from a current stream once they are being streamed
     * @returns This instance of Sandwich Stream
     */
    currentStreamOnReadable() {
        const tmp = this.currentStream.read();
        const data = (undefined !== tmp && null !== tmp) ? tmp : '';
        this.push(data);
    }
    /**
     * Handles the tagging once a stream is finished
     * @returns This instance of Sandwich Stream
     */
    currentStreamOnEnd() {
        this.pushSeparator();
        this.streams.concat(this.newStreams);
        this.newStreams = [];
        this.streamNextStream();
    }
    /**
     * Adds the head tag to the Sandwich Stream
     * @returns This instance of Sandwich Stream
     */
    pushHead() {
        if (null !== this.head) {
            this.push(this.head);
        }
    }
    /**
     * Adds the separator tag to the Sandwich Stream
     * @returns This instance of Sandwich Stream
     */
    pushSeparator() {
        if (0 < this.streams.length && null !== this.separator) {
            this.push(this.separator);
        }
    }
    /**
     * Adds the tail tag to the Sandwich Stream
     * @returns This instance of Sandwich Stream
     */
    pushTail() {
        if (null !== this.tail) {
            this.push(this.tail);
        }
    }
}

exports.SandwichStream = SandwichStream;
exports.default = SandwichStream;


/***/ }),

/***/ 9158:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const os = __webpack_require__(2087);
const tty = __webpack_require__(3867);
const hasFlag = __webpack_require__(7013);

const {env} = process;

let forceColor;
if (hasFlag('no-color') ||
	hasFlag('no-colors') ||
	hasFlag('color=false') ||
	hasFlag('color=never')) {
	forceColor = 0;
} else if (hasFlag('color') ||
	hasFlag('colors') ||
	hasFlag('color=true') ||
	hasFlag('color=always')) {
	forceColor = 1;
}

if ('FORCE_COLOR' in env) {
	if (env.FORCE_COLOR === 'true') {
		forceColor = 1;
	} else if (env.FORCE_COLOR === 'false') {
		forceColor = 0;
	} else {
		forceColor = env.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
	}
}

function translateLevel(level) {
	if (level === 0) {
		return false;
	}

	return {
		level,
		hasBasic: true,
		has256: level >= 2,
		has16m: level >= 3
	};
}

function supportsColor(haveStream, streamIsTTY) {
	if (forceColor === 0) {
		return 0;
	}

	if (hasFlag('color=16m') ||
		hasFlag('color=full') ||
		hasFlag('color=truecolor')) {
		return 3;
	}

	if (hasFlag('color=256')) {
		return 2;
	}

	if (haveStream && !streamIsTTY && forceColor === undefined) {
		return 0;
	}

	const min = forceColor || 0;

	if (env.TERM === 'dumb') {
		return min;
	}

	if (process.platform === 'win32') {
		// Windows 10 build 10586 is the first Windows release that supports 256 colors.
		// Windows 10 build 14931 is the first release that supports 16m/TrueColor.
		const osRelease = os.release().split('.');
		if (
			Number(osRelease[0]) >= 10 &&
			Number(osRelease[2]) >= 10586
		) {
			return Number(osRelease[2]) >= 14931 ? 3 : 2;
		}

		return 1;
	}

	if ('CI' in env) {
		if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI', 'GITHUB_ACTIONS', 'BUILDKITE'].some(sign => sign in env) || env.CI_NAME === 'codeship') {
			return 1;
		}

		return min;
	}

	if ('TEAMCITY_VERSION' in env) {
		return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
	}

	if (env.COLORTERM === 'truecolor') {
		return 3;
	}

	if ('TERM_PROGRAM' in env) {
		const version = parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

		switch (env.TERM_PROGRAM) {
			case 'iTerm.app':
				return version >= 3 ? 3 : 2;
			case 'Apple_Terminal':
				return 2;
			// No default
		}
	}

	if (/-256(color)?$/i.test(env.TERM)) {
		return 2;
	}

	if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
		return 1;
	}

	if ('COLORTERM' in env) {
		return 1;
	}

	return min;
}

function getSupportLevel(stream) {
	const level = supportsColor(stream, stream && stream.isTTY);
	return translateLevel(level);
}

module.exports = {
	supportsColor: getSupportLevel,
	stdout: translateLevel(supportsColor(true, tty.isatty(1))),
	stderr: translateLevel(supportsColor(true, tty.isatty(2)))
};


/***/ }),

/***/ 9581:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.login = exports.pay = exports.game = exports.switchToCurrentChat = exports.switchToChat = exports.callback = exports.url = exports.pollRequest = exports.locationRequest = exports.contactRequest = exports.text = void 0;
function text(text, hide = false) {
    return { text, hide };
}
exports.text = text;
function contactRequest(text, hide = false) {
    return { text, request_contact: true, hide };
}
exports.contactRequest = contactRequest;
function locationRequest(text, hide = false) {
    return { text, request_location: true, hide };
}
exports.locationRequest = locationRequest;
function pollRequest(text, type, hide = false) {
    return { text, request_poll: { type }, hide };
}
exports.pollRequest = pollRequest;
function url(text, url, hide = false) {
    return { text, url, hide };
}
exports.url = url;
function callback(text, data, hide = false) {
    return { text, callback_data: data, hide };
}
exports.callback = callback;
function switchToChat(text, value, hide = false) {
    return { text, switch_inline_query: value, hide };
}
exports.switchToChat = switchToChat;
function switchToCurrentChat(text, value, hide = false) {
    return { text, switch_inline_query_current_chat: value, hide };
}
exports.switchToCurrentChat = switchToCurrentChat;
function game(text, hide = false) {
    return { text, callback_game: {}, hide };
}
exports.game = game;
function pay(text, hide = false) {
    return { text, pay: true, hide };
}
exports.pay = pay;
function login(text, url, opts = {}, hide = false) {
    return {
        text,
        login_url: { ...opts, url },
        hide,
    };
}
exports.login = login;


/***/ }),

/***/ 9668:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

/** @format */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Composer = void 0;
const context_1 = __webpack_require__(2468);
function always(x) {
    return () => x;
}
const anoop = always(Promise.resolve());
class Composer {
    constructor(...fns) {
        this.handler = Composer.compose(fns);
    }
    /**
     * Registers a middleware.
     */
    use(...fns) {
        this.handler = Composer.compose([this.handler, ...fns]);
        return this;
    }
    /**
     * Registers middleware for handling updates
     * matching given type guard function.
     */
    guard(guardFn, ...fns) {
        return this.use(Composer.guard(guardFn, ...fns));
    }
    /**
     * Registers middleware for handling provided update types.
     */
    on(updateType, ...fns) {
        return this.use(Composer.mount(updateType, ...fns));
    }
    /**
     * Registers middleware for handling matching text messages.
     */
    hears(triggers, ...fns) {
        return this.use(Composer.hears(triggers, ...fns));
    }
    /**
     * Registers middleware for handling specified commands.
     */
    command(command, ...fns) {
        return this.use(Composer.command(command, ...fns));
    }
    /**
     * Registers middleware for handling matching callback queries.
     */
    action(triggers, ...fns) {
        return this.use(Composer.action(triggers, ...fns));
    }
    /**
     * Registers middleware for handling matching inline queries.
     */
    inlineQuery(triggers, ...fns) {
        return this.use(Composer.inlineQuery(triggers, ...fns));
    }
    /**
     * Registers middleware for handling game queries
     */
    gameQuery(...fns) {
        return this.use(Composer.gameQuery(...fns));
    }
    /**
     * Registers middleware for dropping matching updates.
     */
    drop(predicate) {
        return this.use(Composer.drop(predicate));
    }
    filter(predicate) {
        return this.use(Composer.filter(predicate));
    }
    entity(predicate, ...fns) {
        return this.use(Composer.entity(predicate, ...fns));
    }
    email(email, ...fns) {
        return this.use(Composer.email(email, ...fns));
    }
    url(url, ...fns) {
        return this.use(Composer.url(url, ...fns));
    }
    textLink(link, ...fns) {
        return this.use(Composer.textLink(link, ...fns));
    }
    textMention(mention, ...fns) {
        return this.use(Composer.textMention(mention, ...fns));
    }
    mention(mention, ...fns) {
        return this.use(Composer.mention(mention, ...fns));
    }
    phone(number, ...fns) {
        return this.use(Composer.phone(number, ...fns));
    }
    hashtag(hashtag, ...fns) {
        return this.use(Composer.hashtag(hashtag, ...fns));
    }
    cashtag(cashtag, ...fns) {
        return this.use(Composer.cashtag(cashtag, ...fns));
    }
    /**
     * Registers a middleware for handling /start
     */
    start(...fns) {
        const handler = Composer.compose(fns);
        return this.command('start', (ctx, next) => {
            const entity = ctx.message.entities[0];
            const startPayload = ctx.message.text.slice(entity.length + 1);
            return handler(Object.assign(ctx, { startPayload }), next);
        });
    }
    /**
     * Registers a middleware for handling /help
     */
    help(...fns) {
        return this.command('help', ...fns);
    }
    /**
     * Registers a middleware for handling /settings
     */
    settings(...fns) {
        return this.command('settings', ...fns);
    }
    middleware() {
        return this.handler;
    }
    static reply(...args) {
        return (ctx) => ctx.reply(...args);
    }
    static catch(errorHandler, ...fns) {
        const handler = Composer.compose(fns);
        // prettier-ignore
        return (ctx, next) => Promise.resolve(handler(ctx, next))
            .catch((err) => errorHandler(err, ctx));
    }
    /**
     * Generates middleware that runs in the background.
     */
    static fork(middleware) {
        const handler = Composer.unwrap(middleware);
        return async (ctx, next) => {
            await Promise.all([handler(ctx, anoop), next()]);
        };
    }
    static tap(middleware) {
        const handler = Composer.unwrap(middleware);
        return (ctx, next) => Promise.resolve(handler(ctx, anoop)).then(() => next());
    }
    /**
     * Generates middleware that gives up control to the next middleware.
     */
    static passThru() {
        return (ctx, next) => next();
    }
    static lazy(factoryFn) {
        if (typeof factoryFn !== 'function') {
            throw new Error('Argument must be a function');
        }
        return (ctx, next) => Promise.resolve(factoryFn(ctx)).then((middleware) => Composer.unwrap(middleware)(ctx, next));
    }
    static log(logFn = console.log) {
        return (ctx, next) => {
            logFn(JSON.stringify(ctx.update, null, 2));
            return next();
        };
    }
    /**
     * @param trueMiddleware middleware to run if the predicate returns true
     * @param falseMiddleware middleware to run if the predicate returns false
     */
    static branch(predicate, trueMiddleware, falseMiddleware) {
        if (typeof predicate !== 'function') {
            return Composer.unwrap(predicate ? trueMiddleware : falseMiddleware);
        }
        return Composer.lazy((ctx) => Promise.resolve(predicate(ctx)).then((value) => value ? trueMiddleware : falseMiddleware));
    }
    /**
     * Generates optional middleware.
     * @param predicate predicate to decide on a context object whether to run the middleware
     * @param middleware middleware to run if the predicate returns true
     */
    static optional(predicate, ...fns) {
        return Composer.branch(predicate, Composer.compose(fns), Composer.passThru());
    }
    static filter(predicate) {
        return Composer.branch(predicate, Composer.passThru(), anoop);
    }
    /**
     * Generates middleware for dropping matching updates.
     */
    static drop(predicate) {
        return Composer.branch(predicate, anoop, Composer.passThru());
    }
    static dispatch(routeFn, handlers) {
        return Composer.lazy((ctx) => Promise.resolve(routeFn(ctx)).then((value) => handlers[value]));
    }
    // EXPLANATION FOR THE ts-expect-error ANNOTATIONS
    // The annotations around function invocations with `...fns` are there
    // whenever we perform validation logic that the flow analysis of TypeScript
    // cannot comprehend. We always make sure that the middleware functions are
    // only invoked with properly constrained context objects, but this cannot be
    // determined automatically.
    /**
     * Generates optional middleware based on a predicate that only operates on `ctx.update`.
     *
     * Example:
     * ```ts
     * import { Composer, Update } from 'telegraf'
     *
     * const predicate = (u): u is Update.MessageUpdate => 'message' in u
     * const middleware = Composer.guard(predicate, (ctx) => {
     *   const message = ctx.update.message
     * })
     * ```
     *
     * Note that `Composer.mount('message')` is preferred over this.
     *
     * @param guardFn predicate to decide whether to run the middleware based on the `ctx.update` object
     * @param fns middleware to run if the predicate returns true
     * @see `Composer.optional` for a more generic version of this method that allows the predicate to operate on `ctx` itself
     */
    static guard(guardFn, ...fns) {
        return Composer.optional((ctx) => guardFn(ctx.update), 
        // @ts-expect-error see explanation above
        ...fns);
    }
    /**
     * Generates middleware for handling provided update types.
     * @deprecated use `Composer.on`
     */
    static mount(updateType, ...fns) {
        return Composer.on(updateType, ...fns);
    }
    /**
     * Generates middleware for handling provided update types.
     */
    static on(updateType, ...fns) {
        const updateTypes = normalizeTextArguments(updateType);
        const predicate = (update) => updateTypes.some((type) => 
        // Check update type
        type in update ||
            // Check message sub-type
            ('message' in update && type in update.message));
        return Composer.guard(predicate, ...fns);
    }
    static entity(predicate, ...fns) {
        if (typeof predicate !== 'function') {
            const entityTypes = normalizeTextArguments(predicate);
            return Composer.entity(({ type }) => entityTypes.includes(type), ...fns);
        }
        return Composer.optional((ctx) => {
            var _a;
            const msg = (_a = ctx.message) !== null && _a !== void 0 ? _a : ctx.channelPost;
            if (msg === undefined) {
                return false;
            }
            const text = getText(msg);
            const entities = getEntities(msg);
            if (text === undefined)
                return false;
            return entities.some((entity) => predicate(entity, text.substring(entity.offset, entity.offset + entity.length), ctx));
            // @ts-expect-error see explanation above
        }, ...fns);
    }
    static entityText(entityType, predicate, ...fns) {
        if (fns.length === 0) {
            // prettier-ignore
            return Array.isArray(predicate)
                // @ts-expect-error predicate is really the middleware
                ? Composer.entity(entityType, ...predicate)
                // @ts-expect-error predicate is really the middleware
                : Composer.entity(entityType, predicate);
        }
        const triggers = normalizeTriggers(predicate);
        return Composer.entity(({ type }, value, ctx) => {
            if (type !== entityType) {
                return false;
            }
            for (const trigger of triggers) {
                // @ts-expect-error define so far unknown property `match`
                if ((ctx.match = trigger(value, ctx))) {
                    return true;
                }
            }
            return false;
            // @ts-expect-error see explanation above
        }, ...fns);
    }
    static email(email, ...fns) {
        return Composer.entityText('email', email, ...fns);
    }
    static phone(number, ...fns) {
        return Composer.entityText('phone_number', number, ...fns);
    }
    static url(url, ...fns) {
        return Composer.entityText('url', url, ...fns);
    }
    static textLink(link, ...fns) {
        return Composer.entityText('text_link', link, ...fns);
    }
    static textMention(mention, ...fns) {
        return Composer.entityText('text_mention', mention, ...fns);
    }
    static mention(mention, ...fns) {
        return Composer.entityText('mention', normalizeTextArguments(mention, '@'), ...fns);
    }
    static hashtag(hashtag, ...fns) {
        return Composer.entityText('hashtag', normalizeTextArguments(hashtag, '#'), ...fns);
    }
    static cashtag(cashtag, ...fns) {
        return Composer.entityText('cashtag', normalizeTextArguments(cashtag, '$'), ...fns);
    }
    static match(triggers, ...fns) {
        const handler = Composer.compose(fns);
        return (ctx, next) => {
            var _a, _b, _c, _d;
            const text = (_c = (_b = (_a = getText(ctx.message)) !== null && _a !== void 0 ? _a : getText(ctx.channelPost)) !== null && _b !== void 0 ? _b : getText(ctx.callbackQuery)) !== null && _c !== void 0 ? _c : (_d = ctx.inlineQuery) === null || _d === void 0 ? void 0 : _d.query;
            if (text === undefined)
                return next();
            for (const trigger of triggers) {
                // @ts-expect-error
                const match = trigger(text, ctx);
                if (match) {
                    // @ts-expect-error define so far unknown property `match`
                    return handler(Object.assign(ctx, { match }), next);
                }
            }
            return next();
        };
    }
    /**
     * Generates middleware for handling matching text messages.
     */
    static hears(triggers, ...fns) {
        return Composer.mount('text', Composer.match(normalizeTriggers(triggers), ...fns));
    }
    /**
     * Generates middleware for handling specified commands.
     */
    static command(command, ...fns) {
        if (fns.length === 0) {
            // @ts-expect-error command is really the middleware
            return Composer.entity('bot_command', command);
        }
        const commands = normalizeTextArguments(command, '/');
        return Composer.mount('text', Composer.lazy((ctx) => {
            var _a;
            const groupCommands = ctx.me && ((_a = ctx.chat) === null || _a === void 0 ? void 0 : _a.type.endsWith('group'))
                ? commands.map((command) => `${command}@${ctx.me}`)
                : [];
            return Composer.entity(({ offset, type }, value) => offset === 0 &&
                type === 'bot_command' &&
                (commands.includes(value) || groupCommands.includes(value)), 
            // @ts-expect-error see explanation above
            ...fns);
        }));
    }
    /**
     * Generates middleware for handling matching callback queries.
     */
    static action(triggers, ...fns) {
        return Composer.mount('callback_query', Composer.match(normalizeTriggers(triggers), ...fns));
    }
    /**
     * Generates middleware for handling matching inline queries.
     */
    static inlineQuery(triggers, ...fns) {
        return Composer.mount('inline_query', Composer.match(normalizeTriggers(triggers), ...fns));
    }
    /**
     * Generates middleware responding only to specified users.
     */
    static acl(userId, ...fns) {
        if (typeof userId === 'function') {
            return Composer.optional(userId, ...fns);
        }
        const allowed = Array.isArray(userId) ? userId : [userId];
        // prettier-ignore
        return Composer.optional((ctx) => !ctx.from || allowed.includes(ctx.from.id), ...fns);
    }
    static memberStatus(status, ...fns) {
        const statuses = Array.isArray(status) ? status : [status];
        return Composer.optional(async (ctx) => {
            if (ctx.message === undefined)
                return false;
            const member = await ctx.getChatMember(ctx.message.from.id);
            return statuses.includes(member.status);
        }, ...fns);
    }
    /**
     * Generates middleware responding only to chat admins and chat creator.
     */
    static admin(...fns) {
        return Composer.memberStatus(['administrator', 'creator'], ...fns);
    }
    /**
     * Generates middleware responding only to chat creator.
     */
    static creator(...fns) {
        return Composer.memberStatus('creator', ...fns);
    }
    /**
     * Generates middleware running only in specified chat types.
     */
    static chatType(type, ...fns) {
        const types = Array.isArray(type) ? type : [type];
        return Composer.optional((ctx) => {
            const chat = ctx.chat;
            return chat !== undefined && types.includes(chat.type);
        }, ...fns);
    }
    /**
     * Generates middleware running only in private chats.
     */
    static privateChat(...fns) {
        return Composer.chatType('private', ...fns);
    }
    /**
     * Generates middleware running only in groups and supergroups.
     */
    static groupChat(...fns) {
        return Composer.chatType(['group', 'supergroup'], ...fns);
    }
    /**
     * Generates middleware for handling game queries.
     */
    static gameQuery(...fns) {
        return Composer.guard((u) => 'callback_query' in u && 'game_short_name' in u.callback_query, ...fns);
    }
    static unwrap(handler) {
        if (!handler) {
            throw new Error('Handler is undefined');
        }
        return 'middleware' in handler ? handler.middleware() : handler;
    }
    static compose(middlewares) {
        if (!Array.isArray(middlewares)) {
            throw new Error('Middlewares must be an array');
        }
        if (middlewares.length === 0) {
            return Composer.passThru();
        }
        if (middlewares.length === 1) {
            return Composer.unwrap(middlewares[0]);
        }
        return (ctx, next) => {
            let index = -1;
            return execute(0, ctx);
            async function execute(i, context) {
                var _a;
                if (!(context instanceof context_1.default)) {
                    throw new Error('next(ctx) called with invalid context');
                }
                if (i <= index) {
                    throw new Error('next() called multiple times');
                }
                index = i;
                const handler = Composer.unwrap((_a = middlewares[i]) !== null && _a !== void 0 ? _a : next);
                await handler(context, async (ctx = context) => {
                    await execute(i + 1, ctx);
                });
            }
        };
    }
}
exports.Composer = Composer;
function escapeRegExp(s) {
    // $& means the whole matched string
    return s.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
}
function normalizeTriggers(triggers) {
    if (!Array.isArray(triggers)) {
        triggers = [triggers];
    }
    return triggers.map((trigger) => {
        if (!trigger) {
            throw new Error('Invalid trigger');
        }
        if (typeof trigger === 'function') {
            return trigger;
        }
        if (trigger instanceof RegExp) {
            return (value = '') => {
                trigger.lastIndex = 0;
                return trigger.exec(value);
            };
        }
        const regex = new RegExp(`^${escapeRegExp(trigger)}$`);
        return (value) => regex.exec(value);
    });
}
function getEntities(msg) {
    var _a, _b;
    if (msg == null)
        return [];
    if ('caption_entities' in msg)
        return (_a = msg.caption_entities) !== null && _a !== void 0 ? _a : [];
    if ('entities' in msg)
        return (_b = msg.entities) !== null && _b !== void 0 ? _b : [];
    return [];
}
function getText(msg) {
    if (msg == null)
        return undefined;
    if ('caption' in msg)
        return msg.caption;
    if ('text' in msg)
        return msg.text;
    if ('data' in msg)
        return msg.data;
    if ('game_short_name' in msg)
        return msg.game_short_name;
    return undefined;
}
function normalizeTextArguments(argument, prefix = '') {
    const args = Array.isArray(argument) ? argument : [argument];
    // prettier-ignore
    return args
        .filter(Boolean)
        .map((arg) => prefix && typeof arg === 'string' && !arg.startsWith(prefix) ? `${prefix}${arg}` : arg);
}
exports.default = Composer;


/***/ }),

/***/ 2468:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Context = void 0;
class Context {
    constructor(update, tg, botInfo) {
        this.update = update;
        this.tg = tg;
        this.botInfo = botInfo;
        this.state = {};
    }
    get updateType() {
        const types = Object.keys(this.update).filter((k) => typeof this.update[k] === 'object');
        if (types.length !== 1) {
            throw new Error(`Cannot determine \`updateType\` of ${JSON.stringify(this.update)}`);
        }
        return types[0];
    }
    get me() {
        var _a;
        return (_a = this.botInfo) === null || _a === void 0 ? void 0 : _a.username;
    }
    get telegram() {
        return this.tg;
    }
    get message() {
        return this.update.message;
    }
    get editedMessage() {
        return this.update.edited_message;
    }
    get inlineQuery() {
        return this.update.inline_query;
    }
    get shippingQuery() {
        return this.update.shipping_query;
    }
    get preCheckoutQuery() {
        return this.update.pre_checkout_query;
    }
    get chosenInlineResult() {
        return this.update.chosen_inline_result;
    }
    get channelPost() {
        return this.update.channel_post;
    }
    get editedChannelPost() {
        return this.update.edited_channel_post;
    }
    get callbackQuery() {
        return this.update.callback_query;
    }
    get poll() {
        return this.update.poll;
    }
    get pollAnswer() {
        return this.update.poll_answer;
    }
    get myChatMember() {
        return this.update.my_chat_member;
    }
    get chatMember() {
        return this.update.chat_member;
    }
    get chat() {
        var _a, _b, _c;
        return (_c = ((_b = (_a = this.chatMember) !== null && _a !== void 0 ? _a : this.myChatMember) !== null && _b !== void 0 ? _b : getMessageFromAnySource(this))) === null || _c === void 0 ? void 0 : _c.chat;
    }
    get senderChat() {
        var _a;
        return (_a = getMessageFromAnySource(this)) === null || _a === void 0 ? void 0 : _a.sender_chat;
    }
    get from() {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return (_h = ((_g = (_f = (_e = (_d = (_c = (_b = (_a = this.callbackQuery) !== null && _a !== void 0 ? _a : this.inlineQuery) !== null && _b !== void 0 ? _b : this.shippingQuery) !== null && _c !== void 0 ? _c : this.preCheckoutQuery) !== null && _d !== void 0 ? _d : this.chosenInlineResult) !== null && _e !== void 0 ? _e : this.chatMember) !== null && _f !== void 0 ? _f : this.myChatMember) !== null && _g !== void 0 ? _g : getMessageFromAnySource(this))) === null || _h === void 0 ? void 0 : _h.from;
    }
    get inlineMessageId() {
        var _a, _b;
        return (_b = ((_a = this.callbackQuery) !== null && _a !== void 0 ? _a : this.chosenInlineResult)) === null || _b === void 0 ? void 0 : _b.inline_message_id;
    }
    get passportData() {
        var _a;
        if (this.message == null)
            return undefined;
        if (!('passport_data' in this.message))
            return undefined;
        return (_a = this.message) === null || _a === void 0 ? void 0 : _a.passport_data;
    }
    /** @deprecated use `ctx.telegram.webhookReply` */
    get webhookReply() {
        return this.tg.webhookReply;
    }
    set webhookReply(enable) {
        this.tg.webhookReply = enable;
    }
    assert(value, method) {
        if (value === undefined) {
            throw new TypeError(`Telegraf: "${method}" isn't available for "${this.updateType}"`);
        }
    }
    answerInlineQuery(...args) {
        this.assert(this.inlineQuery, 'answerInlineQuery');
        return this.telegram.answerInlineQuery(this.inlineQuery.id, ...args);
    }
    answerCbQuery(...args) {
        this.assert(this.callbackQuery, 'answerCbQuery');
        return this.telegram.answerCbQuery(this.callbackQuery.id, ...args);
    }
    answerGameQuery(...args) {
        this.assert(this.callbackQuery, 'answerGameQuery');
        return this.telegram.answerGameQuery(this.callbackQuery.id, ...args);
    }
    answerShippingQuery(...args) {
        this.assert(this.shippingQuery, 'answerShippingQuery');
        return this.telegram.answerShippingQuery(this.shippingQuery.id, ...args);
    }
    answerPreCheckoutQuery(...args) {
        this.assert(this.preCheckoutQuery, 'answerPreCheckoutQuery');
        return this.telegram.answerPreCheckoutQuery(this.preCheckoutQuery.id, ...args);
    }
    editMessageText(text, extra) {
        var _a, _b, _c, _d;
        this.assert((_a = this.callbackQuery) !== null && _a !== void 0 ? _a : this.inlineMessageId, 'editMessageText');
        return this.telegram.editMessageText((_b = this.chat) === null || _b === void 0 ? void 0 : _b.id, (_d = (_c = this.callbackQuery) === null || _c === void 0 ? void 0 : _c.message) === null || _d === void 0 ? void 0 : _d.message_id, this.inlineMessageId, text, extra);
    }
    editMessageCaption(caption, extra) {
        var _a, _b, _c, _d;
        this.assert((_a = this.callbackQuery) !== null && _a !== void 0 ? _a : this.inlineMessageId, 'editMessageCaption');
        return this.telegram.editMessageCaption((_b = this.chat) === null || _b === void 0 ? void 0 : _b.id, (_d = (_c = this.callbackQuery) === null || _c === void 0 ? void 0 : _c.message) === null || _d === void 0 ? void 0 : _d.message_id, this.inlineMessageId, caption, extra);
    }
    editMessageMedia(media, extra) {
        var _a, _b, _c, _d;
        this.assert((_a = this.callbackQuery) !== null && _a !== void 0 ? _a : this.inlineMessageId, 'editMessageMedia');
        return this.telegram.editMessageMedia((_b = this.chat) === null || _b === void 0 ? void 0 : _b.id, (_d = (_c = this.callbackQuery) === null || _c === void 0 ? void 0 : _c.message) === null || _d === void 0 ? void 0 : _d.message_id, this.inlineMessageId, media, extra);
    }
    editMessageReplyMarkup(markup) {
        var _a, _b, _c, _d;
        this.assert((_a = this.callbackQuery) !== null && _a !== void 0 ? _a : this.inlineMessageId, 'editMessageReplyMarkup');
        return this.telegram.editMessageReplyMarkup((_b = this.chat) === null || _b === void 0 ? void 0 : _b.id, (_d = (_c = this.callbackQuery) === null || _c === void 0 ? void 0 : _c.message) === null || _d === void 0 ? void 0 : _d.message_id, this.inlineMessageId, markup);
    }
    editMessageLiveLocation(latitude, longitude, extra) {
        var _a, _b, _c, _d;
        this.assert((_a = this.callbackQuery) !== null && _a !== void 0 ? _a : this.inlineMessageId, 'editMessageLiveLocation');
        return this.telegram.editMessageLiveLocation((_b = this.chat) === null || _b === void 0 ? void 0 : _b.id, (_d = (_c = this.callbackQuery) === null || _c === void 0 ? void 0 : _c.message) === null || _d === void 0 ? void 0 : _d.message_id, this.inlineMessageId, latitude, longitude, extra);
    }
    stopMessageLiveLocation(markup) {
        var _a, _b, _c, _d;
        this.assert((_a = this.callbackQuery) !== null && _a !== void 0 ? _a : this.inlineMessageId, 'stopMessageLiveLocation');
        return this.telegram.stopMessageLiveLocation((_b = this.chat) === null || _b === void 0 ? void 0 : _b.id, (_d = (_c = this.callbackQuery) === null || _c === void 0 ? void 0 : _c.message) === null || _d === void 0 ? void 0 : _d.message_id, this.inlineMessageId, markup);
    }
    reply(...args) {
        this.assert(this.chat, 'reply');
        return this.telegram.sendMessage(this.chat.id, ...args);
    }
    getChat(...args) {
        this.assert(this.chat, 'getChat');
        return this.telegram.getChat(this.chat.id, ...args);
    }
    exportChatInviteLink(...args) {
        this.assert(this.chat, 'exportChatInviteLink');
        return this.telegram.exportChatInviteLink(this.chat.id, ...args);
    }
    createChatInviteLink(...args) {
        this.assert(this.chat, 'createChatInviteLink');
        return this.telegram.createChatInviteLink(this.chat.id, ...args);
    }
    editChatInviteLink(...args) {
        this.assert(this.chat, 'editChatInviteLink');
        return this.telegram.editChatInviteLink(this.chat.id, ...args);
    }
    revokeChatInviteLink(...args) {
        this.assert(this.chat, 'revokeChatInviteLink');
        return this.telegram.revokeChatInviteLink(this.chat.id, ...args);
    }
    kickChatMember(...args) {
        this.assert(this.chat, 'kickChatMember');
        return this.telegram.kickChatMember(this.chat.id, ...args);
    }
    unbanChatMember(...args) {
        this.assert(this.chat, 'unbanChatMember');
        return this.telegram.unbanChatMember(this.chat.id, ...args);
    }
    restrictChatMember(...args) {
        this.assert(this.chat, 'restrictChatMember');
        return this.telegram.restrictChatMember(this.chat.id, ...args);
    }
    promoteChatMember(...args) {
        this.assert(this.chat, 'promoteChatMember');
        return this.telegram.promoteChatMember(this.chat.id, ...args);
    }
    setChatAdministratorCustomTitle(...args) {
        this.assert(this.chat, 'setChatAdministratorCustomTitle');
        return this.telegram.setChatAdministratorCustomTitle(this.chat.id, ...args);
    }
    setChatPhoto(...args) {
        this.assert(this.chat, 'setChatPhoto');
        return this.telegram.setChatPhoto(this.chat.id, ...args);
    }
    deleteChatPhoto(...args) {
        this.assert(this.chat, 'deleteChatPhoto');
        return this.telegram.deleteChatPhoto(this.chat.id, ...args);
    }
    setChatTitle(...args) {
        this.assert(this.chat, 'setChatTitle');
        return this.telegram.setChatTitle(this.chat.id, ...args);
    }
    setChatDescription(...args) {
        this.assert(this.chat, 'setChatDescription');
        return this.telegram.setChatDescription(this.chat.id, ...args);
    }
    pinChatMessage(...args) {
        this.assert(this.chat, 'pinChatMessage');
        return this.telegram.pinChatMessage(this.chat.id, ...args);
    }
    unpinChatMessage(...args) {
        this.assert(this.chat, 'unpinChatMessage');
        return this.telegram.unpinChatMessage(this.chat.id, ...args);
    }
    unpinAllChatMessages(...args) {
        this.assert(this.chat, 'unpinAllChatMessages');
        return this.telegram.unpinAllChatMessages(this.chat.id, ...args);
    }
    leaveChat(...args) {
        this.assert(this.chat, 'leaveChat');
        return this.telegram.leaveChat(this.chat.id, ...args);
    }
    setChatPermissions(...args) {
        this.assert(this.chat, 'setChatPermissions');
        return this.telegram.setChatPermissions(this.chat.id, ...args);
    }
    getChatAdministrators(...args) {
        this.assert(this.chat, 'getChatAdministrators');
        return this.telegram.getChatAdministrators(this.chat.id, ...args);
    }
    getChatMember(...args) {
        this.assert(this.chat, 'getChatMember');
        return this.telegram.getChatMember(this.chat.id, ...args);
    }
    getChatMembersCount(...args) {
        this.assert(this.chat, 'getChatMembersCount');
        return this.telegram.getChatMembersCount(this.chat.id, ...args);
    }
    setPassportDataErrors(errors) {
        this.assert(this.from, 'setPassportDataErrors');
        return this.telegram.setPassportDataErrors(this.from.id, errors);
    }
    replyWithPhoto(...args) {
        this.assert(this.chat, 'replyWithPhoto');
        return this.telegram.sendPhoto(this.chat.id, ...args);
    }
    replyWithMediaGroup(...args) {
        this.assert(this.chat, 'replyWithMediaGroup');
        return this.telegram.sendMediaGroup(this.chat.id, ...args);
    }
    replyWithAudio(...args) {
        this.assert(this.chat, 'replyWithAudio');
        return this.telegram.sendAudio(this.chat.id, ...args);
    }
    replyWithDice(...args) {
        this.assert(this.chat, 'replyWithDice');
        return this.telegram.sendDice(this.chat.id, ...args);
    }
    replyWithDocument(...args) {
        this.assert(this.chat, 'replyWithDocument');
        return this.telegram.sendDocument(this.chat.id, ...args);
    }
    replyWithSticker(...args) {
        this.assert(this.chat, 'replyWithSticker');
        return this.telegram.sendSticker(this.chat.id, ...args);
    }
    replyWithVideo(...args) {
        this.assert(this.chat, 'replyWithVideo');
        return this.telegram.sendVideo(this.chat.id, ...args);
    }
    replyWithAnimation(...args) {
        this.assert(this.chat, 'replyWithAnimation');
        return this.telegram.sendAnimation(this.chat.id, ...args);
    }
    replyWithVideoNote(...args) {
        this.assert(this.chat, 'replyWithVideoNote');
        return this.telegram.sendVideoNote(this.chat.id, ...args);
    }
    replyWithInvoice(...args) {
        this.assert(this.chat, 'replyWithInvoice');
        return this.telegram.sendInvoice(this.chat.id, ...args);
    }
    replyWithGame(...args) {
        this.assert(this.chat, 'replyWithGame');
        return this.telegram.sendGame(this.chat.id, ...args);
    }
    replyWithVoice(...args) {
        this.assert(this.chat, 'replyWithVoice');
        return this.telegram.sendVoice(this.chat.id, ...args);
    }
    replyWithPoll(...args) {
        this.assert(this.chat, 'replyWithPoll');
        return this.telegram.sendPoll(this.chat.id, ...args);
    }
    replyWithQuiz(...args) {
        this.assert(this.chat, 'replyWithQuiz');
        return this.telegram.sendQuiz(this.chat.id, ...args);
    }
    stopPoll(...args) {
        this.assert(this.chat, 'stopPoll');
        return this.telegram.stopPoll(this.chat.id, ...args);
    }
    replyWithChatAction(...args) {
        this.assert(this.chat, 'replyWithChatAction');
        return this.telegram.sendChatAction(this.chat.id, ...args);
    }
    replyWithLocation(...args) {
        this.assert(this.chat, 'replyWithLocation');
        return this.telegram.sendLocation(this.chat.id, ...args);
    }
    replyWithVenue(...args) {
        this.assert(this.chat, 'replyWithVenue');
        return this.telegram.sendVenue(this.chat.id, ...args);
    }
    replyWithContact(...args) {
        this.assert(this.chat, 'replyWithContact');
        return this.telegram.sendContact(this.chat.id, ...args);
    }
    getStickerSet(setName) {
        return this.telegram.getStickerSet(setName);
    }
    setChatStickerSet(setName) {
        this.assert(this.chat, 'setChatStickerSet');
        return this.telegram.setChatStickerSet(this.chat.id, setName);
    }
    deleteChatStickerSet() {
        this.assert(this.chat, 'deleteChatStickerSet');
        return this.telegram.deleteChatStickerSet(this.chat.id);
    }
    setStickerPositionInSet(sticker, position) {
        return this.telegram.setStickerPositionInSet(sticker, position);
    }
    setStickerSetThumb(...args) {
        return this.telegram.setStickerSetThumb(...args);
    }
    deleteStickerFromSet(sticker) {
        return this.telegram.deleteStickerFromSet(sticker);
    }
    uploadStickerFile(...args) {
        this.assert(this.from, 'uploadStickerFile');
        return this.telegram.uploadStickerFile(this.from.id, ...args);
    }
    createNewStickerSet(...args) {
        this.assert(this.from, 'createNewStickerSet');
        return this.telegram.createNewStickerSet(this.from.id, ...args);
    }
    addStickerToSet(...args) {
        this.assert(this.from, 'addStickerToSet');
        return this.telegram.addStickerToSet(this.from.id, ...args);
    }
    getMyCommands() {
        return this.telegram.getMyCommands();
    }
    setMyCommands(commands) {
        return this.telegram.setMyCommands(commands);
    }
    replyWithMarkdown(markdown, extra) {
        return this.reply(markdown, { parse_mode: 'Markdown', ...extra });
    }
    replyWithMarkdownV2(markdown, extra) {
        return this.reply(markdown, { parse_mode: 'MarkdownV2', ...extra });
    }
    replyWithHTML(html, extra) {
        return this.reply(html, { parse_mode: 'HTML', ...extra });
    }
    deleteMessage(messageId) {
        this.assert(this.chat, 'deleteMessage');
        if (typeof messageId !== 'undefined') {
            return this.telegram.deleteMessage(this.chat.id, messageId);
        }
        const message = getMessageFromAnySource(this);
        this.assert(message, 'deleteMessage');
        return this.telegram.deleteMessage(this.chat.id, message.message_id);
    }
    forwardMessage(chatId, extra) {
        const message = getMessageFromAnySource(this);
        this.assert(message, 'forwardMessage');
        return this.telegram.forwardMessage(chatId, message.chat.id, message.message_id, extra);
    }
    copyMessage(chatId, extra) {
        const message = getMessageFromAnySource(this);
        this.assert(message, 'copyMessage');
        return this.telegram.copyMessage(chatId, message.chat.id, message.message_id, extra);
    }
}
exports.Context = Context;
exports.default = Context;
function getMessageFromAnySource(ctx) {
    var _a, _b, _c, _d, _e;
    return ((_e = (_d = (_b = (_a = ctx.message) !== null && _a !== void 0 ? _a : ctx.editedMessage) !== null && _b !== void 0 ? _b : (_c = ctx.callbackQuery) === null || _c === void 0 ? void 0 : _c.message) !== null && _d !== void 0 ? _d : ctx.channelPost) !== null && _e !== void 0 ? _e : ctx.editedChannelPost);
}


/***/ }),

/***/ 6627:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.is2D = exports.hasPropType = exports.hasProp = void 0;
/**
 * Checks if a given object has a property with a given name.
 *
 * Example invocation:
 * ```js
 * let obj = { 'foo': 'bar', 'baz': () => {} }
 * hasProp(obj, 'foo') // true
 * hasProp(obj, 'baz') // true
 * hasProp(obj, 'abc') // false
 * ```
 *
 * @param obj An object to test
 * @param prop The name of the property
 */
function hasProp(obj, prop) {
    return obj !== undefined && prop in obj;
}
exports.hasProp = hasProp;
/**
 * Checks if a given object has a property with a given name.
 * Furthermore performs a `typeof` check on the property if it exists.
 *
 * Example invocation:
 * ```js
 * let obj = { 'foo': 'bar', 'baz': () => {} }
 * hasPropType(obj, 'foo', 'string') // true
 * hasPropType(obj, 'baz', 'function') // true
 * hasPropType(obj, 'abc', 'number') // false
 * ```
 *
 * @param obj An object to test
 * @param prop The name of the property
 * @param type The type the property is expected to have
 */
function hasPropType(obj, prop, type) {
    // eslint-disable-next-line valid-typeof
    return hasProp(obj, prop) && type === typeof obj[prop];
}
exports.hasPropType = hasPropType;
/**
 * Checks if the supplied array has two dimensions or not.
 *
 * Example invocations:
 * is2D([]) // false
 * is2D([[]]) // true
 * is2D([[], []]) // true
 * is2D([42]) // false
 *
 * @param arr an array with one or two dimensions
 */
function is2D(arr) {
    return Array.isArray(arr[0]);
}
exports.is2D = is2D;


/***/ }),

/***/ 4679:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.compactOptions = void 0;
function compactOptions(options) {
    if (!options) {
        return options;
    }
    const keys = Object.keys(options);
    const compactKeys = keys.filter((key) => options[key] !== undefined);
    const compactEntries = compactKeys.map((key) => [key, options[key]]);
    return Object.fromEntries(compactEntries);
}
exports.compactOptions = compactOptions;


/***/ }),

/***/ 7182:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
/* eslint @typescript-eslint/restrict-template-expressions: [ "error", { "allowNumber": true, "allowBoolean": true } ] */
const crypto = __webpack_require__(6417);
const fs = __webpack_require__(5747);
const https = __webpack_require__(7211);
const path = __webpack_require__(5622);
const node_fetch_1 = __webpack_require__(2133);
const check_1 = __webpack_require__(6627);
const compact_1 = __webpack_require__(4679);
const multipart_stream_1 = __webpack_require__(1782);
const error_1 = __webpack_require__(6228);
const url_1 = __webpack_require__(8835);
// eslint-disable-next-line @typescript-eslint/no-var-requires
const debug = __webpack_require__(2763)('telegraf:client');
const { isStream } = multipart_stream_1.default;
const WEBHOOK_REPLY_METHOD_ALLOWLIST = new Set([
    'answerCallbackQuery',
    'answerInlineQuery',
    'deleteMessage',
    'leaveChat',
    'sendChatAction',
]);
const DEFAULT_EXTENSIONS = {
    audio: 'mp3',
    photo: 'jpg',
    sticker: 'webp',
    video: 'mp4',
    animation: 'mp4',
    video_note: 'mp4',
    voice: 'ogg',
};
const DEFAULT_OPTIONS = {
    apiRoot: 'https://api.telegram.org',
    apiMode: 'bot',
    webhookReply: true,
    agent: new https.Agent({
        keepAlive: true,
        keepAliveMsecs: 10000,
    }),
    attachmentAgent: undefined,
};
function includesMedia(payload) {
    return Object.values(payload).some((value) => {
        if (Array.isArray(value)) {
            return value.some(({ media }) => media && typeof media === 'object' && (media.source || media.url));
        }
        return (value &&
            typeof value === 'object' &&
            ((check_1.hasProp(value, 'source') && value.source) ||
                (check_1.hasProp(value, 'url') && value.url) ||
                (check_1.hasPropType(value, 'media', 'object') &&
                    ((check_1.hasProp(value.media, 'source') && value.media.source) ||
                        (check_1.hasProp(value.media, 'url') && value.media.url)))));
    });
}
function replacer(_, value) {
    if (value == null)
        return undefined;
    return value;
}
function buildJSONConfig(payload) {
    return Promise.resolve({
        method: 'POST',
        compress: true,
        headers: { 'content-type': 'application/json', connection: 'keep-alive' },
        body: JSON.stringify(payload, replacer),
    });
}
const FORM_DATA_JSON_FIELDS = [
    'results',
    'reply_markup',
    'mask_position',
    'shipping_options',
    'errors',
];
async function buildFormDataConfig(payload, agent) {
    for (const field of FORM_DATA_JSON_FIELDS) {
        if (check_1.hasProp(payload, field) && typeof payload[field] !== 'string') {
            payload[field] = JSON.stringify(payload[field]);
        }
    }
    const boundary = crypto.randomBytes(32).toString('hex');
    const formData = new multipart_stream_1.default(boundary);
    const tasks = Object.keys(payload).map((key) => attachFormValue(formData, key, payload[key], agent));
    await Promise.all(tasks);
    return {
        method: 'POST',
        compress: true,
        headers: {
            'content-type': `multipart/form-data; boundary=${boundary}`,
            connection: 'keep-alive',
        },
        body: formData,
    };
}
async function attachFormValue(form, id, value, agent) {
    if (value == null) {
        return;
    }
    if (typeof value === 'string' ||
        typeof value === 'boolean' ||
        typeof value === 'number') {
        form.addPart({
            headers: { 'content-disposition': `form-data; name="${id}"` },
            body: `${value}`,
        });
        return;
    }
    if (id === 'thumb') {
        const attachmentId = crypto.randomBytes(16).toString('hex');
        await attachFormMedia(form, value, attachmentId, agent);
        return form.addPart({
            headers: { 'content-disposition': `form-data; name="${id}"` },
            body: `attach://${attachmentId}`,
        });
    }
    if (Array.isArray(value)) {
        const items = await Promise.all(value.map(async (item) => {
            if (typeof item.media !== 'object') {
                return await Promise.resolve(item);
            }
            const attachmentId = crypto.randomBytes(16).toString('hex');
            await attachFormMedia(form, item.media, attachmentId, agent);
            return { ...item, media: `attach://${attachmentId}` };
        }));
        return form.addPart({
            headers: { 'content-disposition': `form-data; name="${id}"` },
            body: JSON.stringify(items),
        });
    }
    if (value &&
        typeof value === 'object' &&
        check_1.hasProp(value, 'media') &&
        check_1.hasProp(value, 'type') &&
        typeof value.media !== 'undefined' &&
        typeof value.type !== 'undefined') {
        const attachmentId = crypto.randomBytes(16).toString('hex');
        await attachFormMedia(form, value.media, attachmentId, agent);
        return form.addPart({
            headers: { 'content-disposition': `form-data; name="${id}"` },
            body: JSON.stringify({
                ...value,
                media: `attach://${attachmentId}`,
            }),
        });
    }
    return await attachFormMedia(form, value, id, agent);
}
async function attachFormMedia(form, media, id, agent) {
    var _a, _b, _c;
    let fileName = (_a = media.filename) !== null && _a !== void 0 ? _a : `${id}.${(_b = DEFAULT_EXTENSIONS[id]) !== null && _b !== void 0 ? _b : 'dat'}`;
    if (media.url !== undefined) {
        const res = await node_fetch_1.default(media.url, { agent });
        return form.addPart({
            headers: {
                'content-disposition': `form-data; name="${id}"; filename="${fileName}"`,
            },
            body: res.body,
        });
    }
    if (media.source) {
        let mediaSource = media.source;
        if (fs.existsSync(media.source)) {
            fileName = (_c = media.filename) !== null && _c !== void 0 ? _c : path.basename(media.source);
            mediaSource = fs.createReadStream(media.source);
        }
        if (isStream(mediaSource) || Buffer.isBuffer(mediaSource)) {
            form.addPart({
                headers: {
                    'content-disposition': `form-data; name="${id}"; filename="${fileName}"`,
                },
                body: mediaSource,
            });
        }
    }
}
async function answerToWebhook(response, payload, options) {
    if (!includesMedia(payload)) {
        if (!response.headersSent) {
            response.setHeader('content-type', 'application/json');
        }
        response.end(JSON.stringify(payload), 'utf-8');
        return true;
    }
    const { headers, body } = await buildFormDataConfig(payload, options.attachmentAgent);
    if (!response.headersSent) {
        for (const [key, value] of Object.entries(headers)) {
            response.setHeader(key, value);
        }
    }
    await new Promise((resolve) => {
        response.on('finish', resolve);
        body.pipe(response);
    });
    return true;
}
function redactToken(error) {
    error.message = error.message.replace(/:\w+/, ':[REDACTED]');
    throw error;
}
class ApiClient {
    constructor(token, options, response) {
        this.token = token;
        this.response = response;
        this.options = {
            ...DEFAULT_OPTIONS,
            ...compact_1.compactOptions(options),
        };
        if (this.options.apiRoot.startsWith('http://')) {
            this.options.agent = undefined;
        }
    }
    /**
     * If set to `true`, first _eligible_ call will avoid performing a POST request.
     * Note that such a call:
     * 1. cannot report errors or return meaningful values,
     * 2. resolves before bot API has a chance to process it,
     * 3. prematurely confirms the update as processed.
     *
     * https://core.telegram.org/bots/faq#how-can-i-make-requests-in-response-to-updates
     * https://github.com/telegraf/telegraf/pull/1250
     */
    set webhookReply(enable) {
        this.options.webhookReply = enable;
    }
    get webhookReply() {
        return this.options.webhookReply;
    }
    async callApi(method, payload, { signal } = {}) {
        const { token, options, response } = this;
        if (options.webhookReply &&
            (response === null || response === void 0 ? void 0 : response.writableEnded) === false &&
            WEBHOOK_REPLY_METHOD_ALLOWLIST.has(method)) {
            debug('Call via webhook', method, payload);
            // @ts-expect-error
            return await answerToWebhook(response, { method, ...payload }, options);
        }
        if (!token) {
            throw new error_1.default({
                error_code: 401,
                description: 'Bot Token is required',
            });
        }
        debug('HTTP call', method, payload);
        const config = includesMedia(payload)
            ? await buildFormDataConfig(
            // @ts-expect-error cannot assign to Record<string, unknown>
            { method, ...payload }, options.attachmentAgent)
            : await buildJSONConfig(payload);
        const apiUrl = new url_1.URL(`/${options.apiMode}${token}/${method}`, options.apiRoot);
        config.agent = options.agent;
        config.signal = signal;
        const res = await node_fetch_1.default(apiUrl, config).catch(redactToken);
        const data = await res.json();
        if (!data.ok) {
            debug('API call failed', data);
            throw new error_1.default(data, { method, payload });
        }
        return data.result;
    }
}
exports.default = ApiClient;


/***/ }),

/***/ 6228:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TelegramError = void 0;
class TelegramError extends Error {
    constructor(response, on = {}) {
        super(`${response.error_code}: ${response.description}`);
        this.response = response;
        this.on = on;
    }
    get code() {
        return this.response.error_code;
    }
    get description() {
        return this.response.description;
    }
    get parameters() {
        return this.response.parameters;
    }
}
exports.TelegramError = TelegramError;
exports.default = TelegramError;


/***/ }),

/***/ 1782:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const stream = __webpack_require__(2413);
const check_1 = __webpack_require__(6627);
const sandwich_stream_1 = __webpack_require__(4560);
const CRNL = '\r\n';
class MultipartStream extends sandwich_stream_1.default {
    constructor(boundary) {
        super({
            head: `--${boundary}${CRNL}`,
            tail: `${CRNL}--${boundary}--`,
            separator: `${CRNL}--${boundary}${CRNL}`,
        });
    }
    addPart(part) {
        const partStream = new stream.PassThrough();
        for (const [key, header] of Object.entries(part.headers)) {
            partStream.write(`${key}:${header}${CRNL}`);
        }
        partStream.write(CRNL);
        if (MultipartStream.isStream(part.body)) {
            part.body.pipe(partStream);
        }
        else {
            partStream.end(part.body);
        }
        this.add(partStream);
    }
    static isStream(stream) {
        return (typeof stream === 'object' &&
            stream !== null &&
            check_1.hasPropType(stream, 'pipe', 'function'));
    }
}
exports.default = MultipartStream;


/***/ }),

/***/ 1242:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Polling = void 0;
const abort_controller_1 = __webpack_require__(8279);
const debug_1 = __webpack_require__(2763);
const util_1 = __webpack_require__(1669);
const error_1 = __webpack_require__(6228);
const debug = debug_1.default('telegraf:polling');
const wait = util_1.promisify(setTimeout);
function always(x) {
    return () => x;
}
const noop = always(Promise.resolve());
class Polling {
    constructor(telegram, allowedUpdates) {
        this.telegram = telegram;
        this.allowedUpdates = allowedUpdates;
        this.abortController = new abort_controller_1.default();
        this.skipOffsetSync = false;
        this.offset = 0;
    }
    async *[Symbol.asyncIterator]() {
        var _a, _b;
        debug('Starting long polling');
        do {
            try {
                const updates = await this.telegram.callApi('getUpdates', {
                    timeout: 50,
                    offset: this.offset,
                    allowed_updates: this.allowedUpdates,
                }, this.abortController);
                const last = updates[updates.length - 1];
                if (last !== undefined) {
                    this.offset = last.update_id + 1;
                }
                yield updates;
            }
            catch (err) {
                if (err.name === 'AbortError')
                    return;
                if (err.name === 'FetchError' ||
                    (err instanceof error_1.TelegramError && err.code >= 500)) {
                    const retryAfter = (_b = (_a = err.parameters) === null || _a === void 0 ? void 0 : _a.retry_after) !== null && _b !== void 0 ? _b : 5;
                    debug('Failed to fetch updates, retrying after %ds.', retryAfter, err);
                    await wait(retryAfter * 1000);
                    continue;
                }
                if (err instanceof error_1.TelegramError &&
                    // Unauthorized      Conflict
                    (err.code === 401 || err.code === 409)) {
                    this.skipOffsetSync = true;
                    throw err;
                }
                throw err;
            }
        } while (!this.abortController.signal.aborted);
    }
    async syncUpdateOffset() {
        if (this.skipOffsetSync)
            return;
        debug('Syncing update offset...');
        await this.telegram.callApi('getUpdates', { offset: this.offset, limit: 1 });
    }
    async loop(handleUpdates) {
        if (this.abortController.signal.aborted) {
            throw new Error('Polling instances must not be reused!');
        }
        try {
            for await (const updates of this) {
                await handleUpdates(updates);
            }
        }
        finally {
            debug('Long polling stopped');
            // prevent instance reuse
            this.stop();
            await this.syncUpdateOffset().catch(noop);
        }
    }
    stop() {
        this.abortController.abort();
    }
}
exports.Polling = Polling;


/***/ }),

/***/ 7346:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const debug_1 = __webpack_require__(2763);
const safeCompare = __webpack_require__(8620);
const debug = debug_1.default('telegraf:webhook');
function default_1(hookPath, updateHandler) {
    return async (req, res, next = () => {
        res.statusCode = 403;
        debug('Replying with status code', res.statusCode);
        return res.end();
    }) => {
        debug('Incoming request', req.method, req.url);
        if (req.method !== 'POST' || !safeCompare(hookPath, req.url)) {
            return next();
        }
        let body = '';
        for await (const chunk of req) {
            body += String(chunk);
        }
        let update;
        try {
            update = JSON.parse(body);
        }
        catch (error) {
            res.writeHead(415);
            res.end();
            debug('Failed to parse request body:', error);
            return;
        }
        await updateHandler(update, res);
    };
}
exports.default = default_1;


/***/ }),

/***/ 3958:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deunionize = void 0;
/**
 * Expose properties from all union variants.
 * @see https://github.com/telegraf/telegraf/issues/1388#issuecomment-791573609
 * @see https://millsp.github.io/ts-toolbelt/modules/union_strict.html
 */
function deunionize(t) {
    return t;
}
exports.deunionize = deunionize;


/***/ }),

/***/ 1942:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Scenes = exports.MemorySessionStore = exports.session = exports.deunionize = exports.Markup = exports.Types = exports.Telegram = exports.TelegramError = exports.Router = exports.Composer = exports.Context = exports.Telegraf = void 0;
var telegraf_1 = __webpack_require__(9273);
Object.defineProperty(exports, "Telegraf", ({ enumerable: true, get: function () { return telegraf_1.Telegraf; } }));
var context_1 = __webpack_require__(2468);
Object.defineProperty(exports, "Context", ({ enumerable: true, get: function () { return context_1.Context; } }));
var composer_1 = __webpack_require__(9668);
Object.defineProperty(exports, "Composer", ({ enumerable: true, get: function () { return composer_1.Composer; } }));
var router_1 = __webpack_require__(526);
Object.defineProperty(exports, "Router", ({ enumerable: true, get: function () { return router_1.Router; } }));
var error_1 = __webpack_require__(6228);
Object.defineProperty(exports, "TelegramError", ({ enumerable: true, get: function () { return error_1.TelegramError; } }));
var telegram_1 = __webpack_require__(9425);
Object.defineProperty(exports, "Telegram", ({ enumerable: true, get: function () { return telegram_1.Telegram; } }));
exports.Types = __webpack_require__(2622);
exports.Markup = __webpack_require__(4819);
var deunionize_1 = __webpack_require__(3958);
Object.defineProperty(exports, "deunionize", ({ enumerable: true, get: function () { return deunionize_1.deunionize; } }));
var session_1 = __webpack_require__(2129);
Object.defineProperty(exports, "session", ({ enumerable: true, get: function () { return session_1.session; } }));
Object.defineProperty(exports, "MemorySessionStore", ({ enumerable: true, get: function () { return session_1.MemorySessionStore; } }));
exports.Scenes = __webpack_require__(611);


/***/ }),

/***/ 4819:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.inlineKeyboard = exports.keyboard = exports.forceReply = exports.removeKeyboard = exports.button = void 0;
const check_1 = __webpack_require__(6627);
class Markup {
    constructor(reply_markup) {
        this.reply_markup = reply_markup;
    }
    selective(value = true) {
        return new Markup({ ...this.reply_markup, selective: value });
    }
    resize(value = true) {
        return new Markup({
            ...this.reply_markup,
            resize_keyboard: value,
        });
    }
    oneTime(value = true) {
        return new Markup({
            ...this.reply_markup,
            one_time_keyboard: value,
        });
    }
}
exports.button = __webpack_require__(9581);
function removeKeyboard() {
    return new Markup({ remove_keyboard: true });
}
exports.removeKeyboard = removeKeyboard;
function forceReply() {
    return new Markup({ force_reply: true });
}
exports.forceReply = forceReply;
function keyboard(buttons, options) {
    const keyboard = buildKeyboard(buttons, {
        columns: 1,
        ...options,
    });
    return new Markup({ keyboard });
}
exports.keyboard = keyboard;
function inlineKeyboard(buttons, options) {
    const inlineKeyboard = buildKeyboard(buttons, {
        columns: buttons.length,
        ...options,
    });
    return new Markup({ inline_keyboard: inlineKeyboard });
}
exports.inlineKeyboard = inlineKeyboard;
function buildKeyboard(buttons, options) {
    const result = [];
    if (!Array.isArray(buttons)) {
        return result;
    }
    if (check_1.is2D(buttons)) {
        return buttons.map((row) => row.filter((button) => !button.hide));
    }
    const wrapFn = options.wrap !== undefined
        ? options.wrap
        : (_btn, _index, currentRow) => currentRow.length >= options.columns;
    let currentRow = [];
    let index = 0;
    for (const btn of buttons.filter((button) => !button.hide)) {
        if (wrapFn(btn, index, currentRow) && currentRow.length > 0) {
            result.push(currentRow);
            currentRow = [];
        }
        currentRow.push(btn);
        index++;
    }
    if (currentRow.length > 0) {
        result.push(currentRow);
    }
    return result;
}


/***/ }),

/***/ 526:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

/** @format */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Router = void 0;
const composer_1 = __webpack_require__(9668);
class Router {
    constructor(routeFn, handlers = new Map()) {
        this.routeFn = routeFn;
        this.handlers = handlers;
        this.otherwiseHandler = composer_1.default.passThru();
        if (typeof routeFn !== 'function') {
            throw new Error('Missing routing function');
        }
    }
    on(route, ...fns) {
        if (fns.length === 0) {
            throw new TypeError('At least one handler must be provided');
        }
        this.handlers.set(route, composer_1.default.compose(fns));
        return this;
    }
    otherwise(...fns) {
        if (fns.length === 0) {
            throw new TypeError('At least one otherwise handler must be provided');
        }
        this.otherwiseHandler = composer_1.default.compose(fns);
        return this;
    }
    middleware() {
        return composer_1.default.lazy((ctx) => {
            var _a;
            const result = this.routeFn(ctx);
            if (result == null) {
                return this.otherwiseHandler;
            }
            Object.assign(ctx, result.context);
            Object.assign(ctx.state, result.state);
            return (_a = this.handlers.get(result.route)) !== null && _a !== void 0 ? _a : this.otherwiseHandler;
        });
    }
}
exports.Router = Router;


/***/ }),

/***/ 9473:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BaseScene = void 0;
const composer_1 = __webpack_require__(9668);
const { compose } = composer_1.default;
class BaseScene extends composer_1.default {
    constructor(id, options) {
        const opts = {
            handlers: [],
            enterHandlers: [],
            leaveHandlers: [],
            ...options,
        };
        super(...opts.handlers);
        this.id = id;
        this.ttl = opts.ttl;
        this.enterHandler = compose(opts.enterHandlers);
        this.leaveHandler = compose(opts.leaveHandlers);
    }
    enter(...fns) {
        this.enterHandler = compose([this.enterHandler, ...fns]);
        return this;
    }
    leave(...fns) {
        this.leaveHandler = compose([this.leaveHandler, ...fns]);
        return this;
    }
    enterMiddleware() {
        return this.enterHandler;
    }
    leaveMiddleware() {
        return this.leaveHandler;
    }
}
exports.BaseScene = BaseScene;
exports.default = BaseScene;


/***/ }),

/***/ 2733:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const composer_1 = __webpack_require__(9668);
const debug_1 = __webpack_require__(2763);
const debug = debug_1.default('telegraf:scenes:context');
const noop = () => Promise.resolve();
const now = () => Math.floor(Date.now() / 1000);
class SceneContextScene {
    constructor(ctx, scenes, options) {
        this.ctx = ctx;
        this.scenes = scenes;
        this.leaving = false;
        // @ts-expect-error {} might not be assignable to D
        const fallbackSessionDefault = {};
        this.options = { defaultSession: fallbackSessionDefault, ...options };
    }
    get session() {
        var _a, _b;
        const defaultSession = this.options.defaultSession;
        let session = (_b = (_a = this.ctx.session) === null || _a === void 0 ? void 0 : _a.__scenes) !== null && _b !== void 0 ? _b : defaultSession;
        if (session.expires !== undefined && session.expires < now()) {
            session = defaultSession;
        }
        if (this.ctx.session === undefined) {
            this.ctx.session = { __scenes: session };
        }
        else {
            this.ctx.session.__scenes = session;
        }
        return session;
    }
    get state() {
        var _a;
        var _b;
        return ((_a = (_b = this.session).state) !== null && _a !== void 0 ? _a : (_b.state = {}));
    }
    set state(value) {
        this.session.state = { ...value };
    }
    get current() {
        var _a;
        const sceneId = (_a = this.session.current) !== null && _a !== void 0 ? _a : this.options.default;
        return sceneId === undefined || !this.scenes.has(sceneId)
            ? undefined
            : this.scenes.get(sceneId);
    }
    reset() {
        if (this.ctx.session !== undefined)
            this.ctx.session.__scenes = this.options.defaultSession;
    }
    async enter(sceneId, initialState = {}, silent = false) {
        var _a, _b;
        if (!this.scenes.has(sceneId)) {
            throw new Error(`Can't find scene: ${sceneId}`);
        }
        if (!silent) {
            await this.leave();
        }
        debug('Entering scene', sceneId, initialState, silent);
        this.session.current = sceneId;
        this.state = initialState;
        const ttl = (_b = (_a = this.current) === null || _a === void 0 ? void 0 : _a.ttl) !== null && _b !== void 0 ? _b : this.options.ttl;
        if (ttl !== undefined) {
            this.session.expires = now() + ttl;
        }
        if (this.current === undefined || silent) {
            return;
        }
        const handler = 'enterMiddleware' in this.current &&
            typeof this.current.enterMiddleware === 'function'
            ? this.current.enterMiddleware()
            : this.current.middleware();
        return await handler(this.ctx, noop);
    }
    reenter() {
        return this.session.current === undefined
            ? undefined
            : this.enter(this.session.current, this.state);
    }
    async leave() {
        if (this.leaving)
            return;
        debug('Leaving scene');
        try {
            this.leaving = true;
            if (this.current === undefined) {
                return;
            }
            const handler = 'leaveMiddleware' in this.current &&
                typeof this.current.leaveMiddleware === 'function'
                ? this.current.leaveMiddleware()
                : composer_1.default.passThru();
            await handler(this.ctx, noop);
            return this.reset();
        }
        finally {
            this.leaving = false;
        }
    }
}
exports.default = SceneContextScene;


/***/ }),

/***/ 611:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

/**
 * @see https://github.com/telegraf/telegraf/issues/705#issuecomment-549056045
 * @see https://www.npmjs.com/package/telegraf-stateless-question
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WizardContextWizard = exports.WizardScene = exports.BaseScene = exports.SceneContextScene = exports.Stage = void 0;
var stage_1 = __webpack_require__(4568);
Object.defineProperty(exports, "Stage", ({ enumerable: true, get: function () { return stage_1.Stage; } }));
var context_1 = __webpack_require__(2733);
Object.defineProperty(exports, "SceneContextScene", ({ enumerable: true, get: function () { return context_1.default; } }));
var base_1 = __webpack_require__(9473);
Object.defineProperty(exports, "BaseScene", ({ enumerable: true, get: function () { return base_1.BaseScene; } }));
var wizard_1 = __webpack_require__(3018);
Object.defineProperty(exports, "WizardScene", ({ enumerable: true, get: function () { return wizard_1.WizardScene; } }));
var context_2 = __webpack_require__(9364);
Object.defineProperty(exports, "WizardContextWizard", ({ enumerable: true, get: function () { return context_2.default; } }));


/***/ }),

/***/ 4568:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Stage = void 0;
const session_1 = __webpack_require__(2129);
const context_1 = __webpack_require__(2733);
const composer_1 = __webpack_require__(9668);
class Stage extends composer_1.Composer {
    constructor(scenes = [], options) {
        super();
        this.options = { ...options };
        this.scenes = new Map();
        scenes.forEach((scene) => this.register(scene));
    }
    register(...scenes) {
        scenes.forEach((scene) => {
            if ((scene === null || scene === void 0 ? void 0 : scene.id) == null || typeof scene.middleware !== 'function') {
                throw new Error('telegraf: Unsupported scene');
            }
            this.scenes.set(scene.id, scene);
        });
        return this;
    }
    middleware() {
        const handler = composer_1.Composer.compose([
            (ctx, next) => {
                const scenes = this.scenes;
                const scene = new context_1.default(ctx, scenes, this.options);
                ctx.scene = scene;
                return next();
            },
            super.middleware(),
            composer_1.Composer.lazy((ctx) => { var _a; return (_a = ctx.scene.current) !== null && _a !== void 0 ? _a : composer_1.Composer.passThru(); }),
        ]);
        return composer_1.Composer.optional(session_1.isSessionContext, handler);
    }
    static enter(...args) {
        return (ctx) => ctx.scene.enter(...args);
    }
    static reenter(...args) {
        return (ctx) => ctx.scene.reenter(...args);
    }
    static leave(...args) {
        return (ctx) => ctx.scene.leave(...args);
    }
}
exports.Stage = Stage;


/***/ }),

/***/ 9364:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class WizardContextWizard {
    constructor(ctx, steps) {
        var _a;
        this.ctx = ctx;
        this.steps = steps;
        this.state = ctx.scene.state;
        this.cursor = (_a = ctx.scene.session.cursor) !== null && _a !== void 0 ? _a : 0;
    }
    get step() {
        return this.steps[this.cursor];
    }
    get cursor() {
        return this.ctx.scene.session.cursor;
    }
    set cursor(cursor) {
        this.ctx.scene.session.cursor = cursor;
    }
    selectStep(index) {
        this.cursor = index;
        return this;
    }
    next() {
        return this.selectStep(this.cursor + 1);
    }
    back() {
        return this.selectStep(this.cursor - 1);
    }
}
exports.default = WizardContextWizard;


/***/ }),

/***/ 3018:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WizardScene = void 0;
const base_1 = __webpack_require__(9473);
const context_1 = __webpack_require__(9364);
const composer_1 = __webpack_require__(9668);
class WizardScene extends base_1.default {
    constructor(id, options, ...steps) {
        let opts;
        let s;
        if (typeof options === 'function' || 'middleware' in options) {
            opts = undefined;
            s = [options, ...steps];
        }
        else {
            opts = options;
            s = steps;
        }
        super(id, opts);
        this.steps = s;
    }
    middleware() {
        return composer_1.default.compose([
            (ctx, next) => {
                ctx.wizard = new context_1.default(ctx, this.steps);
                return next();
            },
            super.middleware(),
            (ctx, next) => {
                if (ctx.wizard.step === undefined) {
                    ctx.wizard.selectStep(0);
                    return ctx.scene.leave();
                }
                return composer_1.default.unwrap(ctx.wizard.step)(ctx, next);
            },
        ]);
    }
    enterMiddleware() {
        return composer_1.default.compose([this.enterHandler, this.middleware()]);
    }
}
exports.WizardScene = WizardScene;


/***/ }),

/***/ 2129:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isSessionContext = exports.MemorySessionStore = exports.session = void 0;
/**
 * Returns middleware that adds `ctx.session` for storing arbitrary state per session key.
 *
 * The default `getSessionKey` is <code>\`${ctx.from.id}:${ctx.chat.id}\`</code>.
 * If either `ctx.from` or `ctx.chat` is `undefined`, default session key and thus `ctx.session` are also `undefined`.
 *
 * Session data is kept only in memory by default,
 * which means that all data will be lost when the process is terminated.
 * If you want to store data across restarts, or share it among workers,
 * you can [install persistent session middleware from npm](https://www.npmjs.com/search?q=telegraf-session),
 * or pass custom `storage`.
 *
 * @example https://github.com/telegraf/telegraf/blob/develop/docs/examples/session-bot.ts
 * @deprecated https://github.com/telegraf/telegraf/issues/1372#issuecomment-782668499
 */
function session(options) {
    var _a, _b;
    const getSessionKey = (_a = options === null || options === void 0 ? void 0 : options.getSessionKey) !== null && _a !== void 0 ? _a : defaultGetSessionKey;
    const store = (_b = options === null || options === void 0 ? void 0 : options.store) !== null && _b !== void 0 ? _b : new MemorySessionStore();
    return async (ctx, next) => {
        const key = await getSessionKey(ctx);
        if (key == null) {
            return await next();
        }
        ctx.session = await store.get(key);
        await next();
        if (ctx.session == null) {
            await store.delete(key);
        }
        else {
            await store.set(key, ctx.session);
        }
    };
}
exports.session = session;
async function defaultGetSessionKey(ctx) {
    var _a, _b;
    const fromId = (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id;
    const chatId = (_b = ctx.chat) === null || _b === void 0 ? void 0 : _b.id;
    if (fromId == null || chatId == null) {
        return undefined;
    }
    return `${fromId}:${chatId}`;
}
/** @deprecated https://github.com/telegraf/telegraf/issues/1372#issuecomment-782668499 */
class MemorySessionStore {
    constructor(ttl = Infinity) {
        this.ttl = ttl;
        this.store = new Map();
    }
    get(name) {
        const entry = this.store.get(name);
        if (entry == null) {
            return undefined;
        }
        else if (entry.expires < Date.now()) {
            this.delete(name);
            return undefined;
        }
        return entry.session;
    }
    set(name, value) {
        const now = Date.now();
        this.store.set(name, { session: value, expires: now + this.ttl });
    }
    delete(name) {
        this.store.delete(name);
    }
}
exports.MemorySessionStore = MemorySessionStore;
function isSessionContext(ctx) {
    return 'session' in ctx;
}
exports.isSessionContext = isSessionContext;


/***/ }),

/***/ 9273:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Telegraf = void 0;
const crypto = __webpack_require__(6417);
const http = __webpack_require__(8605);
const https = __webpack_require__(7211);
const util = __webpack_require__(1669);
const composer_1 = __webpack_require__(9668);
const compact_1 = __webpack_require__(4679);
const context_1 = __webpack_require__(2468);
const debug_1 = __webpack_require__(2763);
const webhook_1 = __webpack_require__(7346);
const polling_1 = __webpack_require__(1242);
const p_timeout_1 = __webpack_require__(8653);
const telegram_1 = __webpack_require__(9425);
const url_1 = __webpack_require__(8835);
const debug = debug_1.default('telegraf:main');
const DEFAULT_OPTIONS = {
    telegram: {},
    handlerTimeout: 90000,
    contextType: context_1.default,
};
function always(x) {
    return () => x;
}
const anoop = always(Promise.resolve());
// eslint-disable-next-line import/export
class Telegraf extends composer_1.Composer {
    constructor(token, options) {
        super();
        this.context = {};
        this.handleError = (err, ctx) => {
            // set exit code to emulate `warn-with-error-code` behavior of
            // https://nodejs.org/api/cli.html#cli_unhandled_rejections_mode
            // to prevent a clean exit despite an error being thrown
            process.exitCode = 1;
            console.error('Unhandled error while processing', ctx.update);
            throw err;
        };
        // @ts-expect-error
        this.options = {
            ...DEFAULT_OPTIONS,
            ...compact_1.compactOptions(options),
        };
        this.telegram = new telegram_1.default(token, this.options.telegram);
        debug('Created a `Telegraf` instance');
    }
    get token() {
        return this.telegram.token;
    }
    /** @deprecated use `ctx.telegram.webhookReply` */
    set webhookReply(webhookReply) {
        this.telegram.webhookReply = webhookReply;
    }
    get webhookReply() {
        return this.telegram.webhookReply;
    }
    /**
     * _Override_ error handling
     */
    catch(handler) {
        this.handleError = handler;
        return this;
    }
    webhookCallback(path = '/') {
        return webhook_1.default(path, (update, res) => this.handleUpdate(update, res));
    }
    startPolling(allowedUpdates = []) {
        this.polling = new polling_1.Polling(this.telegram, allowedUpdates);
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.polling.loop(async (updates) => {
            await this.handleUpdates(updates);
        });
    }
    startWebhook(hookPath, tlsOptions, port, host, cb) {
        const webhookCb = this.webhookCallback(hookPath);
        const callback = typeof cb === 'function'
            ? (req, res) => webhookCb(req, res, () => cb(req, res))
            : webhookCb;
        this.webhookServer =
            tlsOptions !== undefined
                ? https.createServer(tlsOptions, callback)
                : http.createServer(callback);
        this.webhookServer.listen(port, host, () => {
            debug('Webhook listening on port: %s', port);
        });
        return this;
    }
    /**
     * @see https://github.com/telegraf/telegraf/discussions/1344#discussioncomment-335700
     */
    async launch(config = {}) {
        var _a, _b, _c;
        debug('Connecting to Telegram');
        (_a = this.botInfo) !== null && _a !== void 0 ? _a : (this.botInfo = await this.telegram.getMe());
        debug(`Launching @${this.botInfo.username}`);
        if (config.webhook === undefined) {
            await this.telegram.deleteWebhook({
                drop_pending_updates: config.dropPendingUpdates,
            });
            this.startPolling(config.allowedUpdates);
            debug('Bot started with long polling');
            return;
        }
        if (typeof config.webhook.domain !== 'string' &&
            typeof config.webhook.hookPath !== 'string') {
            throw new Error('Webhook domain or webhook path is required');
        }
        let domain = (_b = config.webhook.domain) !== null && _b !== void 0 ? _b : '';
        if (domain.startsWith('https://') || domain.startsWith('http://')) {
            domain = new url_1.URL(domain).host;
        }
        const hookPath = (_c = config.webhook.hookPath) !== null && _c !== void 0 ? _c : `/telegraf/${crypto.randomBytes(32).toString('hex')}`;
        const { port, host, tlsOptions, cb } = config.webhook;
        this.startWebhook(hookPath, tlsOptions, port, host, cb);
        if (!domain) {
            debug('Bot started with webhook');
            return;
        }
        await this.telegram.setWebhook(`https://${domain}${hookPath}`, {
            drop_pending_updates: config.dropPendingUpdates,
            allowed_updates: config.allowedUpdates,
        });
        debug(`Bot started with webhook @ https://${domain}`);
    }
    stop(reason = 'unspecified') {
        var _a, _b;
        debug('Stopping bot... Reason:', reason);
        // https://github.com/telegraf/telegraf/pull/1224#issuecomment-742693770
        if (this.polling === undefined && this.webhookServer === undefined) {
            throw new Error('Bot is not running!');
        }
        (_a = this.webhookServer) === null || _a === void 0 ? void 0 : _a.close();
        (_b = this.polling) === null || _b === void 0 ? void 0 : _b.stop();
    }
    handleUpdates(updates) {
        if (!Array.isArray(updates)) {
            throw new TypeError(util.format('Updates must be an array, got', updates));
        }
        return Promise.all(updates.map((update) => this.handleUpdate(update)));
    }
    async handleUpdate(update, webhookResponse) {
        var _a, _b;
        (_a = this.botInfo) !== null && _a !== void 0 ? _a : (this.botInfo = (debug('Update %d is waiting for `botInfo` to be initialized', update.update_id),
            await ((_b = this.botInfoCall) !== null && _b !== void 0 ? _b : (this.botInfoCall = this.telegram.getMe()))));
        debug('Processing update', update.update_id);
        const tg = new telegram_1.default(this.token, this.telegram.options, webhookResponse);
        const TelegrafContext = this.options.contextType;
        const ctx = new TelegrafContext(update, tg, this.botInfo);
        Object.assign(ctx, this.context);
        try {
            await p_timeout_1.default(Promise.resolve(this.middleware()(ctx, anoop)), this.options.handlerTimeout);
        }
        catch (err) {
            return await this.handleError(err, ctx);
        }
        finally {
            if ((webhookResponse === null || webhookResponse === void 0 ? void 0 : webhookResponse.writableEnded) === false) {
                webhookResponse.end();
            }
            debug('Finished processing update', update.update_id);
        }
    }
}
exports.Telegraf = Telegraf;


/***/ }),

/***/ 2622:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/** @format */
Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 9425:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Telegram = void 0;
const client_1 = __webpack_require__(7182);
const path_1 = __webpack_require__(5622);
const url_1 = __webpack_require__(8835);
class Telegram extends client_1.default {
    /**
     * Get basic information about the bot
     */
    getMe() {
        return this.callApi('getMe', {});
    }
    /**
     * Get basic info about a file and prepare it for downloading
     * @param fileId Id of file to get link to
     */
    getFile(fileId) {
        return this.callApi('getFile', { file_id: fileId });
    }
    /**
     * Get download link to a file
     */
    async getFileLink(fileId) {
        if (typeof fileId === 'string') {
            fileId = await this.getFile(fileId);
        }
        else if (fileId.file_path === undefined) {
            fileId = await this.getFile(fileId.file_id);
        }
        // Local bot API instances return the absolute path to the file
        if (fileId.file_path !== undefined && path_1.isAbsolute(fileId.file_path)) {
            const url = new url_1.URL(this.options.apiRoot);
            url.port = '';
            url.pathname = fileId.file_path;
            url.protocol = 'file:';
            return url;
        }
        return new url_1.URL(`/file/${this.options.apiMode}${this.token}/${fileId.file_path}`, this.options.apiRoot);
    }
    /**
     * Directly request incoming updates.
     * You should probably use `Telegraf::launch` instead.
     */
    getUpdates(timeout, limit, offset, allowedUpdates) {
        return this.callApi('getUpdates', {
            allowed_updates: allowedUpdates,
            limit,
            offset,
            timeout,
        });
    }
    getWebhookInfo() {
        return this.callApi('getWebhookInfo', {});
    }
    getGameHighScores(userId, inlineMessageId, chatId, messageId) {
        return this.callApi('getGameHighScores', {
            user_id: userId,
            inline_message_id: inlineMessageId,
            chat_id: chatId,
            message_id: messageId,
        });
    }
    setGameScore(userId, score, inlineMessageId, chatId, messageId, editMessage = true, force = false) {
        return this.callApi('setGameScore', {
            force,
            score,
            user_id: userId,
            inline_message_id: inlineMessageId,
            chat_id: chatId,
            message_id: messageId,
            disable_edit_message: !editMessage,
        });
    }
    /**
     * Specify a url to receive incoming updates via an outgoing webhook
     * @param url HTTPS url to send updates to. Use an empty string to remove webhook integration
     */
    setWebhook(url, extra) {
        return this.callApi('setWebhook', {
            url,
            ...extra,
        });
    }
    /**
     * Remove webhook integration
     */
    deleteWebhook(extra) {
        return this.callApi('deleteWebhook', {
            ...extra,
        });
    }
    /**
     * Send a text message
     * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param text Text of the message to be sent
     */
    sendMessage(chatId, text, extra) {
        return this.callApi('sendMessage', { chat_id: chatId, text, ...extra });
    }
    /**
     * Forward existing message.
     * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param fromChatId Unique identifier for the chat where the original message was sent (or channel username in the format @channelusername)
     * @param messageId Message identifier in the chat specified in from_chat_id
     */
    forwardMessage(chatId, fromChatId, messageId, extra) {
        return this.callApi('forwardMessage', {
            chat_id: chatId,
            from_chat_id: fromChatId,
            message_id: messageId,
            ...extra,
        });
    }
    /**
     * Use this method when you need to tell the user that something is happening on the bot's side.
     * The status is set for 5 seconds or less (when a message arrives from your bot, Telegram clients clear its typing status).
     * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     */
    sendChatAction(chatId, action) {
        return this.callApi('sendChatAction', { chat_id: chatId, action });
    }
    getUserProfilePhotos(userId, offset, limit) {
        return this.callApi('getUserProfilePhotos', {
            user_id: userId,
            offset,
            limit,
        });
    }
    /**
     * Send point on the map
     * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     */
    sendLocation(chatId, latitude, longitude, extra) {
        return this.callApi('sendLocation', {
            chat_id: chatId,
            latitude,
            longitude,
            ...extra,
        });
    }
    sendVenue(chatId, latitude, longitude, title, address, extra) {
        return this.callApi('sendVenue', {
            latitude,
            longitude,
            title,
            address,
            chat_id: chatId,
            ...extra,
        });
    }
    /**
     * @param chatId Unique identifier for the target private chat
     */
    sendInvoice(chatId, invoice, extra) {
        return this.callApi('sendInvoice', {
            chat_id: chatId,
            ...invoice,
            ...extra,
        });
    }
    sendContact(chatId, phoneNumber, firstName, extra) {
        return this.callApi('sendContact', {
            chat_id: chatId,
            phone_number: phoneNumber,
            first_name: firstName,
            ...extra,
        });
    }
    /**
     * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     */
    sendPhoto(chatId, photo, extra) {
        return this.callApi('sendPhoto', { chat_id: chatId, photo, ...extra });
    }
    /**
     * Send a dice, which will have a random value from 1 to 6.
     * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     */
    sendDice(chatId, extra) {
        return this.callApi('sendDice', { chat_id: chatId, ...extra });
    }
    /**
     * Send general files. Bots can currently send files of any type of up to 50 MB in size, this limit may be changed in the future.
     * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     */
    sendDocument(chatId, document, extra) {
        return this.callApi('sendDocument', { chat_id: chatId, document, ...extra });
    }
    /**
     * Send audio files, if you want Telegram clients to display them in the music player.
     * Your audio must be in the .mp3 format.
     * Bots can currently send audio files of up to 50 MB in size, this limit may be changed in the future.
     * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     */
    sendAudio(chatId, audio, extra) {
        return this.callApi('sendAudio', { chat_id: chatId, audio, ...extra });
    }
    /**
     * Send .webp stickers
     * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     */
    sendSticker(chatId, sticker, extra) {
        return this.callApi('sendSticker', { chat_id: chatId, sticker, ...extra });
    }
    /**
     * Send video files, Telegram clients support mp4 videos (other formats may be sent as Document)
     * Bots can currently send video files of up to 50 MB in size, this limit may be changed in the future.
     * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     */
    sendVideo(chatId, video, extra) {
        return this.callApi('sendVideo', { chat_id: chatId, video, ...extra });
    }
    /**
     * Send .gif animations
     * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     */
    sendAnimation(chatId, animation, extra) {
        return this.callApi('sendAnimation', {
            chat_id: chatId,
            animation,
            ...extra,
        });
    }
    /**
     * Send video messages
     * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     */
    sendVideoNote(chatId, videoNote, extra) {
        return this.callApi('sendVideoNote', {
            chat_id: chatId,
            video_note: videoNote,
            ...extra,
        });
    }
    /**
     * Send audio files, if you want Telegram clients to display the file as a playable voice message. For this to work, your audio must be in an .ogg file encoded with OPUS (other formats may be sent as Audio or Document). On success, the sent Message is returned. Bots can currently send voice messages of up to 50 MB in size, this limit may be changed in the future.
     * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     */
    sendVoice(chatId, voice, extra) {
        return this.callApi('sendVoice', { chat_id: chatId, voice, ...extra });
    }
    /**
     * @param chatId Unique identifier for the target chat
     * @param gameShortName Short name of the game, serves as the unique identifier for the game. Set up your games via Botfather.
     */
    sendGame(chatId, gameName, extra) {
        return this.callApi('sendGame', {
            chat_id: chatId,
            game_short_name: gameName,
            ...extra,
        });
    }
    /**
     * Send a group of photos or videos as an album
     * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param media A JSON-serialized array describing photos and videos to be sent, must include 2–10 items
     */
    sendMediaGroup(chatId, media, extra) {
        return this.callApi('sendMediaGroup', { chat_id: chatId, media, ...extra });
    }
    /**
     * Send a native poll.
     * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param question Poll question, 1-255 characters
     * @param options A JSON-serialized list of answer options, 2-10 strings 1-100 characters each
     */
    sendPoll(chatId, question, options, extra) {
        return this.callApi('sendPoll', {
            chat_id: chatId,
            type: 'regular',
            question,
            options,
            ...extra,
        });
    }
    /**
     * Send a native quiz.
     * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param question Poll question, 1-255 characters
     * @param options A JSON-serialized list of answer options, 2-10 strings 1-100 characters each
     */
    sendQuiz(chatId, question, options, extra) {
        return this.callApi('sendPoll', {
            chat_id: chatId,
            type: 'quiz',
            question,
            options,
            ...extra,
        });
    }
    /**
     * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param messageId Identifier of the original message with the poll
     */
    stopPoll(chatId, messageId, extra) {
        return this.callApi('stopPoll', {
            chat_id: chatId,
            message_id: messageId,
            ...extra,
        });
    }
    /**
     * Get up to date information about the chat (current name of the user for one-on-one conversations, current username of a user, group or channel, etc.)
     * @param chatId Unique identifier for the target chat or username of the target supergroup or channel (in the format @channelusername)
     */
    getChat(chatId) {
        return this.callApi('getChat', { chat_id: chatId });
    }
    /**
     * @param chatId Unique identifier for the target chat or username of the target supergroup or channel (in the format @channelusername)
     */
    getChatAdministrators(chatId) {
        return this.callApi('getChatAdministrators', { chat_id: chatId });
    }
    /**
     * Get information about a member of a chat.
     * @param chatId Unique identifier for the target chat or username of the target supergroup or channel (in the format @channelusername)
     * @param userId Unique identifier of the target user
     */
    getChatMember(chatId, userId) {
        return this.callApi('getChatMember', { chat_id: chatId, user_id: userId });
    }
    /**
     * Get the number of members in a chat
     * @param chatId Unique identifier for the target chat or username of the target supergroup or channel (in the format @channelusername)
     */
    getChatMembersCount(chatId) {
        return this.callApi('getChatMembersCount', { chat_id: chatId });
    }
    /**
     * Send answers to an inline query.
     * No more than 50 results per query are allowed.
     */
    answerInlineQuery(inlineQueryId, results, extra) {
        return this.callApi('answerInlineQuery', {
            inline_query_id: inlineQueryId,
            results,
            ...extra,
        });
    }
    setChatPermissions(chatId, permissions) {
        return this.callApi('setChatPermissions', { chat_id: chatId, permissions });
    }
    /**
     * Kick a user from a group, a supergroup or a channel. In the case of supergroups and channels, the user will not be able to return to the group on their own using invite links, etc., unless unbanned first. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights
     * @param chatId Unique identifier for the target group or username of the target supergroup or channel (in the format `@channelusername`)
     * @param untilDate Date when the user will be unbanned, unix time. If user is banned for more than 366 days or less than 30 seconds from the current time they are considered to be banned forever
     */
    kickChatMember(chatId, userId, untilDate, extra) {
        return this.callApi('kickChatMember', {
            chat_id: chatId,
            user_id: userId,
            until_date: untilDate,
            ...extra,
        });
    }
    /**
     * Promote or demote a user in a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights. Pass False for all boolean parameters to demote a user.
     * @param chatId Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
     */
    promoteChatMember(chatId, userId, extra) {
        return this.callApi('promoteChatMember', {
            chat_id: chatId,
            user_id: userId,
            ...extra,
        });
    }
    /**
     * Restrict a user in a supergroup. The bot must be an administrator in the supergroup for this to work and must have the appropriate admin rights. Pass True for all boolean parameters to lift restrictions from a user.
     * @param chatId Unique identifier for the target chat or username of the target supergroup (in the format @supergroupusername)
     */
    restrictChatMember(chatId, userId, extra) {
        return this.callApi('restrictChatMember', {
            chat_id: chatId,
            user_id: userId,
            ...extra,
        });
    }
    setChatAdministratorCustomTitle(chatId, userId, title) {
        return this.callApi('setChatAdministratorCustomTitle', {
            chat_id: chatId,
            user_id: userId,
            custom_title: title,
        });
    }
    /**
     * Export an invite link to a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights.
     * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     */
    exportChatInviteLink(chatId) {
        return this.callApi('exportChatInviteLink', { chat_id: chatId });
    }
    createChatInviteLink(chatId, extra) {
        return this.callApi('createChatInviteLink', {
            chat_id: chatId,
            ...extra,
        });
    }
    editChatInviteLink(chatId, inviteLink, extra) {
        return this.callApi('editChatInviteLink', {
            chat_id: chatId,
            invite_link: inviteLink,
            ...extra,
        });
    }
    revokeChatInviteLink(chatId, inviteLink) {
        return this.callApi('revokeChatInviteLink', {
            chat_id: chatId,
            invite_link: inviteLink,
        });
    }
    setChatPhoto(chatId, photo) {
        return this.callApi('setChatPhoto', { chat_id: chatId, photo });
    }
    deleteChatPhoto(chatId) {
        return this.callApi('deleteChatPhoto', { chat_id: chatId });
    }
    /**
     * Change the title of a chat. Titles can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights
     * @param chatId Unique identifier for the target group or username of the target supergroup or channel (in the format `@channelusername`)
     * @param title New chat title, 1-255 characters
     */
    setChatTitle(chatId, title) {
        return this.callApi('setChatTitle', { chat_id: chatId, title });
    }
    setChatDescription(chatId, description) {
        return this.callApi('setChatDescription', { chat_id: chatId, description });
    }
    /**
     * Pin a message in a group, a supergroup, or a channel. The bot must be an administrator in the chat for this to work and must have the 'can_pin_messages' admin right in the supergroup or 'can_edit_messages' admin right in the channel.
     * @param chatId Unique identifier for the target chat or username of the target supergroup (in the format @supergroupusername)
     */
    pinChatMessage(chatId, messageId, extra) {
        return this.callApi('pinChatMessage', {
            chat_id: chatId,
            message_id: messageId,
            ...extra,
        });
    }
    /**
     * Unpin a message in a group, a supergroup, or a channel. The bot must be an administrator in the chat for this to work and must have the 'can_pin_messages' admin right in the supergroup or 'can_edit_messages' admin right in the channel.
     * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     */
    unpinChatMessage(chatId, messageId) {
        return this.callApi('unpinChatMessage', {
            chat_id: chatId,
            message_id: messageId,
        });
    }
    /**
     * Clear the list of pinned messages in a chat
     * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     */
    unpinAllChatMessages(chatId) {
        return this.callApi('unpinAllChatMessages', { chat_id: chatId });
    }
    /**
     * Use this method for your bot to leave a group, supergroup or channel
     * @param chatId Unique identifier for the target chat or username of the target supergroup or channel (in the format @channelusername)
     */
    leaveChat(chatId) {
        return this.callApi('leaveChat', { chat_id: chatId });
    }
    /**
     * Unban a user from a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights
     * @param chatId Unique identifier for the target group or username of the target supergroup or channel (in the format @username)
     * @param userId Unique identifier of the target user
     */
    unbanChatMember(chatId, userId, extra) {
        return this.callApi('unbanChatMember', {
            chat_id: chatId,
            user_id: userId,
            ...extra,
        });
    }
    answerCbQuery(callbackQueryId, text, extra) {
        return this.callApi('answerCallbackQuery', {
            text,
            callback_query_id: callbackQueryId,
            ...extra,
        });
    }
    answerGameQuery(callbackQueryId, url) {
        return this.callApi('answerCallbackQuery', {
            url,
            callback_query_id: callbackQueryId,
        });
    }
    /**
     * If you sent an invoice requesting a shipping address and the parameter is_flexible was specified,
     * the Bot API will send an Update with a shipping_query field to the bot.
     * Reply to shipping queries.
     * @param ok  Specify True if delivery to the specified address is possible and False if there are any problems (for example, if delivery to the specified address is not possible)
     * @param shippingOptions Required if ok is True. A JSON-serialized array of available shipping options.
     * @param errorMessage Required if ok is False. Error message in human readable form that explains why it is impossible to complete the order (e.g. "Sorry, delivery to your desired address is unavailable'). Telegram will display this message to the user.
     */
    answerShippingQuery(shippingQueryId, ok, shippingOptions, errorMessage) {
        return this.callApi('answerShippingQuery', {
            ok,
            shipping_query_id: shippingQueryId,
            shipping_options: shippingOptions,
            error_message: errorMessage,
        });
    }
    /**
     * Once the user has confirmed their payment and shipping details, the Bot API sends the final confirmation in the form of an Update with the field pre_checkout_query.
     * Respond to such pre-checkout queries. On success, True is returned.
     * Note: The Bot API must receive an answer within 10 seconds after the pre-checkout query was sent.
     * @param ok  Specify True if everything is alright (goods are available, etc.) and the bot is ready to proceed with the order. Use False if there are any problems.
     * @param errorMessage Required if ok is False. Error message in human readable form that explains the reason for failure to proceed with the checkout (e.g. "Sorry, somebody just bought the last of our amazing black T-shirts while you were busy filling out your payment details. Please choose a different color or garment!"). Telegram will display this message to the user.
     */
    answerPreCheckoutQuery(preCheckoutQueryId, ok, errorMessage) {
        return this.callApi('answerPreCheckoutQuery', {
            ok,
            pre_checkout_query_id: preCheckoutQueryId,
            error_message: errorMessage,
        });
    }
    /**
     * Edit text and game messages sent by the bot or via the bot (for inline bots).
     * On success, if edited message is sent by the bot, the edited Message is returned, otherwise True is returned.
     * @param chatId Required if inlineMessageId is not specified. Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param messageId Required if inlineMessageId is not specified. Identifier of the sent message
     * @param inlineMessageId Required if chatId and messageId are not specified. Identifier of the inline message
     * @param text New text of the message
     */
    editMessageText(chatId, messageId, inlineMessageId, text, extra) {
        return this.callApi('editMessageText', {
            text,
            chat_id: chatId,
            message_id: messageId,
            inline_message_id: inlineMessageId,
            ...extra,
        });
    }
    /**
     * Edit captions of messages sent by the bot or via the bot (for inline bots).
     * On success, if edited message is sent by the bot, the edited Message is returned, otherwise True is returned.
     * @param chatId Required if inlineMessageId is not specified. Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param messageId Required if inlineMessageId is not specified. Identifier of the sent message
     * @param inlineMessageId Required if chatId and messageId are not specified. Identifier of the inline message
     * @param caption New caption of the message
     * @param markup A JSON-serialized object for an inline keyboard.
     */
    editMessageCaption(chatId, messageId, inlineMessageId, caption, extra) {
        return this.callApi('editMessageCaption', {
            caption,
            chat_id: chatId,
            message_id: messageId,
            inline_message_id: inlineMessageId,
            ...extra,
        });
    }
    /**
     * Edit animation, audio, document, photo, or video messages.
     * If a message is a part of a message album, then it can be edited only to a photo or a video.
     * Otherwise, message type can be changed arbitrarily.
     * When inline message is edited, new file can't be uploaded.
     * Use previously uploaded file via its file_id or specify a URL.
     * @param chatId Required if inlineMessageId is not specified. Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param messageId Required if inlineMessageId is not specified. Identifier of the sent message
     * @param inlineMessageId Required if chatId and messageId are not specified. Identifier of the inline message
     * @param media New media of message
     * @param markup Markup of inline keyboard
     */
    editMessageMedia(chatId, messageId, inlineMessageId, media, extra) {
        return this.callApi('editMessageMedia', {
            chat_id: chatId,
            message_id: messageId,
            inline_message_id: inlineMessageId,
            media,
            ...extra,
        });
    }
    /**
     * Edit only the reply markup of messages sent by the bot or via the bot (for inline bots).
     * @param chatId Required if inlineMessageId is not specified. Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param messageId Required if inlineMessageId is not specified. Identifier of the sent message
     * @param inlineMessageId Required if chatId and messageId are not specified. Identifier of the inline message
     * @param markup A JSON-serialized object for an inline keyboard.
     * @returns If edited message is sent by the bot, the edited Message is returned, otherwise True is returned.
     */
    editMessageReplyMarkup(chatId, messageId, inlineMessageId, markup) {
        return this.callApi('editMessageReplyMarkup', {
            chat_id: chatId,
            message_id: messageId,
            inline_message_id: inlineMessageId,
            reply_markup: markup,
        });
    }
    editMessageLiveLocation(chatId, messageId, inlineMessageId, latitude, longitude, extra) {
        return this.callApi('editMessageLiveLocation', {
            latitude,
            longitude,
            chat_id: chatId,
            message_id: messageId,
            inline_message_id: inlineMessageId,
            ...extra,
        });
    }
    stopMessageLiveLocation(chatId, messageId, inlineMessageId, markup) {
        return this.callApi('stopMessageLiveLocation', {
            chat_id: chatId,
            message_id: messageId,
            inline_message_id: inlineMessageId,
            reply_markup: markup,
        });
    }
    /**
     * Delete a message, including service messages, with the following limitations:
     * - A message can only be deleted if it was sent less than 48 hours ago.
     * - Bots can delete outgoing messages in groups and supergroups.
     * - Bots granted can_post_messages permissions can delete outgoing messages in channels.
     * - If the bot is an administrator of a group, it can delete any message there.
     * - If the bot has can_delete_messages permission in a supergroup or a channel, it can delete any message there.
     * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     */
    deleteMessage(chatId, messageId) {
        return this.callApi('deleteMessage', {
            chat_id: chatId,
            message_id: messageId,
        });
    }
    setChatStickerSet(chatId, setName) {
        return this.callApi('setChatStickerSet', {
            chat_id: chatId,
            sticker_set_name: setName,
        });
    }
    deleteChatStickerSet(chatId) {
        return this.callApi('deleteChatStickerSet', { chat_id: chatId });
    }
    getStickerSet(name) {
        return this.callApi('getStickerSet', { name });
    }
    /**
     * Upload a .png file with a sticker for later use in createNewStickerSet and addStickerToSet methods (can be used multiple times)
     * https://core.telegram.org/bots/api#sending-files
     * @param ownerId User identifier of sticker file owner
     * @param stickerFile Png image with the sticker, must be up to 512 kilobytes in size, dimensions must not exceed 512px, and either width or height must be exactly 512px.
     */
    uploadStickerFile(ownerId, stickerFile) {
        return this.callApi('uploadStickerFile', {
            user_id: ownerId,
            png_sticker: stickerFile,
        });
    }
    /**
     * Create new sticker set owned by a user. The bot will be able to edit the created sticker set
     * @param ownerId User identifier of created sticker set owner
     * @param name Short name of sticker set, to be used in t.me/addstickers/ URLs (e.g., animals). Can contain only english letters, digits and underscores. Must begin with a letter, can't contain consecutive underscores and must end in “_by_<bot username>”. <bot_username> is case insensitive. 1-64 characters.
     * @param title Sticker set title, 1-64 characters
     */
    createNewStickerSet(ownerId, name, title, stickerData) {
        return this.callApi('createNewStickerSet', {
            name,
            title,
            user_id: ownerId,
            ...stickerData,
        });
    }
    /**
     * Add a new sticker to a set created by the bot
     * @param ownerId User identifier of sticker set owner
     * @param name Sticker set name
     */
    addStickerToSet(ownerId, name, stickerData) {
        return this.callApi('addStickerToSet', {
            name,
            user_id: ownerId,
            ...stickerData,
        });
    }
    /**
     * Move a sticker in a set created by the bot to a specific position
     * @param sticker File identifier of the sticker
     * @param position New sticker position in the set, zero-based
     */
    setStickerPositionInSet(sticker, position) {
        return this.callApi('setStickerPositionInSet', {
            sticker,
            position,
        });
    }
    setStickerSetThumb(name, userId, thumb) {
        return this.callApi('setStickerSetThumb', { name, user_id: userId, thumb });
    }
    /**
     * Delete a sticker from a set created by the bot.
     * @param sticker File identifier of the sticker
     */
    deleteStickerFromSet(sticker) {
        return this.callApi('deleteStickerFromSet', { sticker });
    }
    /**
     * Get the current list of the bot's commands.
     */
    getMyCommands() {
        return this.callApi('getMyCommands', {});
    }
    /**
     * Change the list of the bot's commands.
     * @param commands A list of bot commands to be set as the list of the bot's commands. At most 100 commands can be specified.
     */
    setMyCommands(commands) {
        return this.callApi('setMyCommands', { commands });
    }
    setPassportDataErrors(userId, errors) {
        return this.callApi('setPassportDataErrors', {
            user_id: userId,
            errors: errors,
        });
    }
    /**
     * Send copy of existing message.
     * @deprecated use `copyMessage` instead
     * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param message Received message object
     */
    sendCopy(chatId, message, extra) {
        return this.copyMessage(chatId, message.chat.id, message.message_id, extra);
    }
    /**
     * Send copy of existing message
     * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param fromChatId Unique identifier for the chat where the original message was sent (or channel username in the format @channelusername)
     * @param messageId Message identifier in the chat specified in from_chat_id
     */
    copyMessage(chatId, fromChatId, messageId, extra) {
        return this.callApi('copyMessage', {
            chat_id: chatId,
            from_chat_id: fromChatId,
            message_id: messageId,
            ...extra,
        });
    }
    /**
     * Log out from the cloud Bot API server before launching the bot locally
     */
    logOut() {
        return this.callApi('logOut', {});
    }
    /**
     * Close the bot instance before moving it from one local server to another
     */
    close() {
        return this.callApi('close', {});
    }
}
exports.Telegram = Telegram;
exports.default = Telegram;


/***/ }),

/***/ 3771:
/***/ ((module, exports, __webpack_require__) => {

/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */

exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();
exports.destroy = (() => {
	let warned = false;

	return () => {
		if (!warned) {
			warned = true;
			console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
		}
	};
})();

/**
 * Colors.
 */

exports.colors = [
	'#0000CC',
	'#0000FF',
	'#0033CC',
	'#0033FF',
	'#0066CC',
	'#0066FF',
	'#0099CC',
	'#0099FF',
	'#00CC00',
	'#00CC33',
	'#00CC66',
	'#00CC99',
	'#00CCCC',
	'#00CCFF',
	'#3300CC',
	'#3300FF',
	'#3333CC',
	'#3333FF',
	'#3366CC',
	'#3366FF',
	'#3399CC',
	'#3399FF',
	'#33CC00',
	'#33CC33',
	'#33CC66',
	'#33CC99',
	'#33CCCC',
	'#33CCFF',
	'#6600CC',
	'#6600FF',
	'#6633CC',
	'#6633FF',
	'#66CC00',
	'#66CC33',
	'#9900CC',
	'#9900FF',
	'#9933CC',
	'#9933FF',
	'#99CC00',
	'#99CC33',
	'#CC0000',
	'#CC0033',
	'#CC0066',
	'#CC0099',
	'#CC00CC',
	'#CC00FF',
	'#CC3300',
	'#CC3333',
	'#CC3366',
	'#CC3399',
	'#CC33CC',
	'#CC33FF',
	'#CC6600',
	'#CC6633',
	'#CC9900',
	'#CC9933',
	'#CCCC00',
	'#CCCC33',
	'#FF0000',
	'#FF0033',
	'#FF0066',
	'#FF0099',
	'#FF00CC',
	'#FF00FF',
	'#FF3300',
	'#FF3333',
	'#FF3366',
	'#FF3399',
	'#FF33CC',
	'#FF33FF',
	'#FF6600',
	'#FF6633',
	'#FF9900',
	'#FF9933',
	'#FFCC00',
	'#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

// eslint-disable-next-line complexity
function useColors() {
	// NB: In an Electron preload script, document will be defined but not fully
	// initialized. Since we know we're in Chrome, we'll just detect this case
	// explicitly
	if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
		return true;
	}

	// Internet Explorer and Edge do not support colors.
	if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
		return false;
	}

	// Is webkit? http://stackoverflow.com/a/16459606/376773
	// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
	return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
		// Is firebug? http://stackoverflow.com/a/398120/376773
		(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
		// Is firefox >= v31?
		// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
		// Double check webkit in userAgent just in case we are in a worker
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	args[0] = (this.useColors ? '%c' : '') +
		this.namespace +
		(this.useColors ? ' %c' : ' ') +
		args[0] +
		(this.useColors ? '%c ' : ' ') +
		'+' + module.exports.humanize(this.diff);

	if (!this.useColors) {
		return;
	}

	const c = 'color: ' + this.color;
	args.splice(1, 0, c, 'color: inherit');

	// The final "%c" is somewhat tricky, because there could be other
	// arguments passed either before or after the %c, so we need to
	// figure out the correct index to insert the CSS into
	let index = 0;
	let lastC = 0;
	args[0].replace(/%[a-zA-Z%]/g, match => {
		if (match === '%%') {
			return;
		}
		index++;
		if (match === '%c') {
			// We only are interested in the *last* %c
			// (the user may have provided their own)
			lastC = index;
		}
	});

	args.splice(lastC, 0, c);
}

/**
 * Invokes `console.debug()` when available.
 * No-op when `console.debug` is not a "function".
 * If `console.debug` is not available, falls back
 * to `console.log`.
 *
 * @api public
 */
exports.log = console.debug || console.log || (() => {});

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	try {
		if (namespaces) {
			exports.storage.setItem('debug', namespaces);
		} else {
			exports.storage.removeItem('debug');
		}
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */
function load() {
	let r;
	try {
		r = exports.storage.getItem('debug');
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}

	// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
	if (!r && typeof process !== 'undefined' && 'env' in process) {
		r = process.env.DEBUG;
	}

	return r;
}

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
	try {
		// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
		// The Browser also has localStorage in the global context.
		return localStorage;
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

module.exports = __webpack_require__(8459)(exports);

const {formatters} = module.exports;

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
	try {
		return JSON.stringify(v);
	} catch (error) {
		return '[UnexpectedJSONParseError]: ' + error.message;
	}
};


/***/ }),

/***/ 8459:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */

function setup(env) {
	createDebug.debug = createDebug;
	createDebug.default = createDebug;
	createDebug.coerce = coerce;
	createDebug.disable = disable;
	createDebug.enable = enable;
	createDebug.enabled = enabled;
	createDebug.humanize = __webpack_require__(1607);
	createDebug.destroy = destroy;

	Object.keys(env).forEach(key => {
		createDebug[key] = env[key];
	});

	/**
	* The currently active debug mode names, and names to skip.
	*/

	createDebug.names = [];
	createDebug.skips = [];

	/**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/
	createDebug.formatters = {};

	/**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/
	function selectColor(namespace) {
		let hash = 0;

		for (let i = 0; i < namespace.length; i++) {
			hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
			hash |= 0; // Convert to 32bit integer
		}

		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
	}
	createDebug.selectColor = selectColor;

	/**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/
	function createDebug(namespace) {
		let prevTime;
		let enableOverride = null;

		function debug(...args) {
			// Disabled?
			if (!debug.enabled) {
				return;
			}

			const self = debug;

			// Set `diff` timestamp
			const curr = Number(new Date());
			const ms = curr - (prevTime || curr);
			self.diff = ms;
			self.prev = prevTime;
			self.curr = curr;
			prevTime = curr;

			args[0] = createDebug.coerce(args[0]);

			if (typeof args[0] !== 'string') {
				// Anything else let's inspect with %O
				args.unshift('%O');
			}

			// Apply any `formatters` transformations
			let index = 0;
			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
				// If we encounter an escaped % then don't increase the array index
				if (match === '%%') {
					return '%';
				}
				index++;
				const formatter = createDebug.formatters[format];
				if (typeof formatter === 'function') {
					const val = args[index];
					match = formatter.call(self, val);

					// Now we need to remove `args[index]` since it's inlined in the `format`
					args.splice(index, 1);
					index--;
				}
				return match;
			});

			// Apply env-specific formatting (colors, etc.)
			createDebug.formatArgs.call(self, args);

			const logFn = self.log || createDebug.log;
			logFn.apply(self, args);
		}

		debug.namespace = namespace;
		debug.useColors = createDebug.useColors();
		debug.color = createDebug.selectColor(namespace);
		debug.extend = extend;
		debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.

		Object.defineProperty(debug, 'enabled', {
			enumerable: true,
			configurable: false,
			get: () => enableOverride === null ? createDebug.enabled(namespace) : enableOverride,
			set: v => {
				enableOverride = v;
			}
		});

		// Env-specific initialization logic for debug instances
		if (typeof createDebug.init === 'function') {
			createDebug.init(debug);
		}

		return debug;
	}

	function extend(namespace, delimiter) {
		const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
		newDebug.log = this.log;
		return newDebug;
	}

	/**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/
	function enable(namespaces) {
		createDebug.save(namespaces);

		createDebug.names = [];
		createDebug.skips = [];

		let i;
		const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
		const len = split.length;

		for (i = 0; i < len; i++) {
			if (!split[i]) {
				// ignore empty strings
				continue;
			}

			namespaces = split[i].replace(/\*/g, '.*?');

			if (namespaces[0] === '-') {
				createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
			} else {
				createDebug.names.push(new RegExp('^' + namespaces + '$'));
			}
		}
	}

	/**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/
	function disable() {
		const namespaces = [
			...createDebug.names.map(toNamespace),
			...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
		].join(',');
		createDebug.enable('');
		return namespaces;
	}

	/**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/
	function enabled(name) {
		if (name[name.length - 1] === '*') {
			return true;
		}

		let i;
		let len;

		for (i = 0, len = createDebug.skips.length; i < len; i++) {
			if (createDebug.skips[i].test(name)) {
				return false;
			}
		}

		for (i = 0, len = createDebug.names.length; i < len; i++) {
			if (createDebug.names[i].test(name)) {
				return true;
			}
		}

		return false;
	}

	/**
	* Convert regexp to namespace
	*
	* @param {RegExp} regxep
	* @return {String} namespace
	* @api private
	*/
	function toNamespace(regexp) {
		return regexp.toString()
			.substring(2, regexp.toString().length - 2)
			.replace(/\.\*\?$/, '*');
	}

	/**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/
	function coerce(val) {
		if (val instanceof Error) {
			return val.stack || val.message;
		}
		return val;
	}

	/**
	* XXX DO NOT USE. This is a temporary stub function.
	* XXX It WILL be removed in the next major release.
	*/
	function destroy() {
		console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
	}

	createDebug.enable(createDebug.load());

	return createDebug;
}

module.exports = setup;


/***/ }),

/***/ 2763:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Detect Electron renderer / nwjs process, which is node, but we should
 * treat as a browser.
 */

if (typeof process === 'undefined' || process.type === 'renderer' || process.browser === true || process.__nwjs) {
	module.exports = __webpack_require__(3771);
} else {
	module.exports = __webpack_require__(1427);
}


/***/ }),

/***/ 1427:
/***/ ((module, exports, __webpack_require__) => {

/**
 * Module dependencies.
 */

const tty = __webpack_require__(3867);
const util = __webpack_require__(1669);

/**
 * This is the Node.js implementation of `debug()`.
 */

exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.destroy = util.deprecate(
	() => {},
	'Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.'
);

/**
 * Colors.
 */

exports.colors = [6, 2, 3, 4, 5, 1];

try {
	// Optional dependency (as in, doesn't need to be installed, NOT like optionalDependencies in package.json)
	// eslint-disable-next-line import/no-extraneous-dependencies
	const supportsColor = __webpack_require__(9158);

	if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
		exports.colors = [
			20,
			21,
			26,
			27,
			32,
			33,
			38,
			39,
			40,
			41,
			42,
			43,
			44,
			45,
			56,
			57,
			62,
			63,
			68,
			69,
			74,
			75,
			76,
			77,
			78,
			79,
			80,
			81,
			92,
			93,
			98,
			99,
			112,
			113,
			128,
			129,
			134,
			135,
			148,
			149,
			160,
			161,
			162,
			163,
			164,
			165,
			166,
			167,
			168,
			169,
			170,
			171,
			172,
			173,
			178,
			179,
			184,
			185,
			196,
			197,
			198,
			199,
			200,
			201,
			202,
			203,
			204,
			205,
			206,
			207,
			208,
			209,
			214,
			215,
			220,
			221
		];
	}
} catch (error) {
	// Swallow - we only care if `supports-color` is available; it doesn't have to be.
}

/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */

exports.inspectOpts = Object.keys(process.env).filter(key => {
	return /^debug_/i.test(key);
}).reduce((obj, key) => {
	// Camel-case
	const prop = key
		.substring(6)
		.toLowerCase()
		.replace(/_([a-z])/g, (_, k) => {
			return k.toUpperCase();
		});

	// Coerce string value into JS value
	let val = process.env[key];
	if (/^(yes|on|true|enabled)$/i.test(val)) {
		val = true;
	} else if (/^(no|off|false|disabled)$/i.test(val)) {
		val = false;
	} else if (val === 'null') {
		val = null;
	} else {
		val = Number(val);
	}

	obj[prop] = val;
	return obj;
}, {});

/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */

function useColors() {
	return 'colors' in exports.inspectOpts ?
		Boolean(exports.inspectOpts.colors) :
		tty.isatty(process.stderr.fd);
}

/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	const {namespace: name, useColors} = this;

	if (useColors) {
		const c = this.color;
		const colorCode = '\u001B[3' + (c < 8 ? c : '8;5;' + c);
		const prefix = `  ${colorCode};1m${name} \u001B[0m`;

		args[0] = prefix + args[0].split('\n').join('\n' + prefix);
		args.push(colorCode + 'm+' + module.exports.humanize(this.diff) + '\u001B[0m');
	} else {
		args[0] = getDate() + name + ' ' + args[0];
	}
}

function getDate() {
	if (exports.inspectOpts.hideDate) {
		return '';
	}
	return new Date().toISOString() + ' ';
}

/**
 * Invokes `util.format()` with the specified arguments and writes to stderr.
 */

function log(...args) {
	return process.stderr.write(util.format(...args) + '\n');
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	if (namespaces) {
		process.env.DEBUG = namespaces;
	} else {
		// If you set a process.env field to null or undefined, it gets cast to the
		// string 'null' or 'undefined'. Just delete instead.
		delete process.env.DEBUG;
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
	return process.env.DEBUG;
}

/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */

function init(debug) {
	debug.inspectOpts = {};

	const keys = Object.keys(exports.inspectOpts);
	for (let i = 0; i < keys.length; i++) {
		debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
	}
}

module.exports = __webpack_require__(8459)(exports);

const {formatters} = module.exports;

/**
 * Map %o to `util.inspect()`, all on a single line.
 */

formatters.o = function (v) {
	this.inspectOpts.colors = this.useColors;
	return util.inspect(v, this.inspectOpts)
		.split('\n')
		.map(str => str.trim())
		.join(' ');
};

/**
 * Map %O to `util.inspect()`, allowing multiple lines if needed.
 */

formatters.O = function (v) {
	this.inspectOpts.colors = this.useColors;
	return util.inspect(v, this.inspectOpts);
};


/***/ }),

/***/ 1028:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { Telegraf } = __webpack_require__(1942)

const ttoken = 't_token';
const tChatId = 't_chat_id';

module.exports = class Action
{
    constructor(core, execFileSync)
    {
        this._executors = new Array();
        this._core = core
        this._execFileSync = execFileSync
        this._bot = null
        this._chatId = null

        const token = core.getInput(ttoken, { required: false })
        if(token != "")
        {
            this._bot = new Telegraf(token)
            this._bot.launch()

            this._chatId = core.getInput(tChatId, { required: false })
        }
    }

    run()
    {
        try 
        {
            for(const executor of this._executors)
            {
                let res = executor.execute(this._execFileSync)
            }

            this._core.debug('_chatId ${this._chatId}')

            if(this._bot)
            {
                this._core.debug('_chatId ${this._chatId}')
                this._bot.telegram.sendMessage(this._chatId, "build successful")
            }
        } 
        catch (error)
        {
            this._core.setFailed(error.message);
            this._core.info(error.stdout);

            if(this._bot)
            {
                this._bot.telegram.sendMessage(this._chatId, error.message)
            }
        }

        this._core.debug('_chatId ${this._chatId}')

    }

    addExecutor(executor)
    {
        this._executors.push(executor);  
    }
}

/***/ }),

/***/ 9029:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const os = __webpack_require__(2087);
const process = __webpack_require__(1765);
const path = __webpack_require__(5622);
const { execFileSync } = __webpack_require__(3129);

const core = __webpack_require__(115);

const Action = __webpack_require__(1028);
const git_utils = __webpack_require__(1739);
const cmake_utils = __webpack_require__(4552);
const GroupExecutor = __webpack_require__(8207);

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

/***/ 4552:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { execFileSync } = __webpack_require__(3129);
const core = __webpack_require__(115);

const Executor = __webpack_require__(4811);

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

/***/ 4811:
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

/***/ 1739:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Executor = __webpack_require__(4811);

const gitApp = 'git';
const gitParams = ['submodule', 'update', '--init', '--recursive'];

function gitSubmoduleUpdateExecutor()
{
    return new Executor(gitApp, gitParams);
}

module.exports.gitSubmoduleUpdateExecutor = gitSubmoduleUpdateExecutor;

/***/ }),

/***/ 8207:
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

const Builder = __webpack_require__(9029);

let builder = new Builder();
builder.build();
builder.action().run();
    





/***/ }),

/***/ 7522:
/***/ ((module) => {

module.exports = eval("require")("encoding");


/***/ }),

/***/ 3129:
/***/ ((module) => {

"use strict";
module.exports = require("child_process");;

/***/ }),

/***/ 6417:
/***/ ((module) => {

"use strict";
module.exports = require("crypto");;

/***/ }),

/***/ 5747:
/***/ ((module) => {

"use strict";
module.exports = require("fs");;

/***/ }),

/***/ 8605:
/***/ ((module) => {

"use strict";
module.exports = require("http");;

/***/ }),

/***/ 7211:
/***/ ((module) => {

"use strict";
module.exports = require("https");;

/***/ }),

/***/ 2087:
/***/ ((module) => {

"use strict";
module.exports = require("os");;

/***/ }),

/***/ 5622:
/***/ ((module) => {

"use strict";
module.exports = require("path");;

/***/ }),

/***/ 1765:
/***/ ((module) => {

"use strict";
module.exports = require("process");;

/***/ }),

/***/ 2413:
/***/ ((module) => {

"use strict";
module.exports = require("stream");;

/***/ }),

/***/ 3867:
/***/ ((module) => {

"use strict";
module.exports = require("tty");;

/***/ }),

/***/ 8835:
/***/ ((module) => {

"use strict";
module.exports = require("url");;

/***/ }),

/***/ 1669:
/***/ ((module) => {

"use strict";
module.exports = require("util");;

/***/ }),

/***/ 8761:
/***/ ((module) => {

"use strict";
module.exports = require("zlib");;

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