
class Executor
{
    constructor(name, args)
    {
        this._name = name;
        this._args = args;
    }

    execute(exec)
    {
        exec(this._name, this._args);
    }

    addArg(arg)
    {
        this._args.push(arg);
    }
}

class GroupExecutor
{
    constructor(groupName, executors)
    {
        this._groupName = groupName;
        this._executors = executors;
    }

    execute(exec)
    {
        for(const executor of this._executors)
        {
            executor.execute(exec)
        }
    }

    addExecutor(executor)
    {
        this._executors.push(executor)
    }
}