
module.exports = class Executor
{
    constructor(name, args)
    {
        this._name = name;
        this._generalArgs = args;
    }

    execute(exec)
    {
        console.log(this._name);
        console.log(this._generalArgs);
        return exec(this._name, this._generalArgs);
    }

    setAdditionalArg(arg)
    {
        this._generalArgs.push(arg);
    }
}