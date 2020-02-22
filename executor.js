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