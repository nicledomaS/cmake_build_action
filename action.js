const { execFileSync } = require('child_process');

module.exports = class Action
{
    constructor()
    {
        this._executors = new Array();
    }

    run()
    {
        for(const executor of this._executors)
        {
            executor.execute(execFileSync);
        }
    }

    addExecutor(executor)
    {
        this._executors.push(executor);  
    }
}