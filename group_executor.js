const core = require('@actions/core');
const process = require('process');

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
            core.debug(process.cwd());
            
            let result =executor.execute(exec);
            core.info(result);
        }
        core.endGroup();
    }

    addExecutor(executor)
    {
        this._executors.push(executor)
    }
}
