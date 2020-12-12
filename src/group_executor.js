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
