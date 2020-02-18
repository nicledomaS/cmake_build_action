const core = require('@actions/core');

module.exports = class Executor
{
    constructor(name, args)
    {
        this._name = name;
        this._args = args;
    }

    execute(exec)
    {
        const result = exec(this._name, this._args);
        core.info(result);
    }

    addArg(arg)
    {
        this._args.push(arg);
    }
}