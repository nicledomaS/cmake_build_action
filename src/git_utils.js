const Executor = require('./executor.js');

const gitApp = 'git';
const gitParams = ['submodule', 'update', '--init', '--recursive'];

function gitSubmoduleUpdateExecutor()
{
    return new Executor(gitApp, gitParams);
}

module.exports.gitSubmoduleUpdateExecutor = gitSubmoduleUpdateExecutor;