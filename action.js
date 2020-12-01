const { execFileSync } = require('child_process');

const core = require('@actions/core');

module.exports = class Action
{
    constructor()
    {
        this._executors = new Array();
    }

    run()
    {
        try 
        {
            for(const executor of this._executors)
            {
                let log = executor.execute(execFileSync);
                core.info(log);
            }
        } 
        catch (error)
        {
            core.setFailed(error.message);
        }
    }

    addExecutor(executor)
    {
        this._executors.push(executor);  
    }
}
