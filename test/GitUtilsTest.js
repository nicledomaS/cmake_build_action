var assert = require('assert');
const git_utils = require('../src/git_utils');

const gitApp = 'git';
const gitParams = ['submodule', 'update', '--init', '--recursive'];
const ResultOk = "Ok"

describe('git_utils', function() {
    describe('gitSubmoduleUpdateExecutor', function() {
        let gitExec = git_utils.gitSubmoduleUpdateExecutor();
        let result = gitExec.execute((command, args)=>
        {
            it('Commands should be equal', function() {
                assert.equal(command, gitApp);
            });
    
            it('Size args should be equal', function() {
                assert.equal(args.length, gitParams.length);
            });
    
            it('Args should be equal', function() {
                for(const arg of gitParams)
                {
                    assert.equal(args.includes(arg), true);
                }
            });
            
            return ResultOk;
        })
    
        it('Result should be equal', function() {
            assert.equal(result, ResultOk);
        });
    });
});