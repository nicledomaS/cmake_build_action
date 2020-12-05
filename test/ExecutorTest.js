var Executor = require('../src/executor.js');
var assert = require('assert');

const Command = "test"

const First = "--first"
const Second = "--second"
const Third = "--third"

const ResultOk = "Ok"

const Args = [First, Second]

describe('Executor', function() {
  describe('execute', function() {
    let executor = new Executor(Command, Args)
    let result = executor.execute((command, args)=>
    {
      it('Commands should be equal', function() {
        assert.equal(command, Command);
      });

      it('Size args should be equal', function() {
        assert.equal(args.length, Args.length);
      });

      it('Args should be equal', function() {
        for(const arg of Args)
        {
          assert.equal(args.includes(arg), true);
        }
      });
      
      return ResultOk
    })

    it('Result should be equal', function() {
      assert.equal(result, ResultOk);
    });
  });

  describe('setAdditionalArg', function() {
    let executor = new Executor(Command, [])
    executor.setAdditionalArg(Third)

    let result = executor.execute((command, args)=>
    {
      it('Commands should be equal', function() {
        assert.equal(command, Command);
      });

      it('Size args should be 1', function() {
        assert.equal(args.length, 1);
      });

      it('Args should be equal', function() {
          assert.equal(args.includes(Third), true);
      });
      
      return ResultOk
    })

    it('Result should be equal', function() {
      assert.equal(result, ResultOk);
    });
  });
});