module.exports = class Action
{
    constructor(core, execFileSync)
    {
        this._executors = new Array();
        this._core = core
        this._execFileSync = execFileSync
    }

    run()
    {
        try 
        {
            for(const executor of this._executors)
            {
                executor.execute(this._execFileSync);
            }
        } 
        catch (error)
        {
            this._core.setFailed(error.message);
            this._core.info(error.stdout);
        }
    }

    addExecutor(executor)
    {
        this._executors.push(executor);  
    }
}