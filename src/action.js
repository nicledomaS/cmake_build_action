const { Telegraf } = require('telegraf')

const ttoken = 't_token';
const tChatId = 't_chat_id';

module.exports = class Action
{
    constructor(core, execFileSync)
    {
        this._executors = new Array();
        this._core = core
        this._execFileSync = execFileSync
        this._bot = null
        this._chatId = null

        const token = core.getInput(ttoken, { required: false })
        if(token != "")
        {
            this._bot = new Telegraf(token)

            this._chatId = core.getInput(tChatId, { required: false })
        }
    }

    run()
    {
        try 
        {
            for(const executor of this._executors)
            {
                let res = executor.execute(this._execFileSync)
            }

            if(this._bot)
            {
                this._bot.telegram.sendMessage(this._chatId, "build successful")
            }
        } 
        catch (error)
        {
            this._core.setFailed(error.message);
            this._core.info(error.stdout);

            if(this._bot)
            {
                this._bot.telegram.sendMessage(this._chatId, error.message)
            }
        }
    }

    addExecutor(executor)
    {
        this._executors.push(executor);  
    }
}