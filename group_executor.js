const core = require('@actions/core');

module.exports = class GroupExecutor
{
    constructor(groupName, executors)
    {
        this._groupName = groupName;
        this._executors = executors;
    }

    execute(exec)
    {
        core.startGroup(this._groupName);
        for(const executor of this._executors)
        {
            executor.execute(exec);
        }
        core.endGroup();
    }

    addExecutor(executor)
    {
        this._executors.push(executor)
    }
}