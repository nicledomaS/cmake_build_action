var assert = require('assert');
var Executor = require('../src/executor.js');
var GroupExecutor = require('../src/group_executor.js');
var Core = require('./actions/core.js');

const RunUnitTest_1 = "Run unit test 1"
const RunUnitTest_2 = "Run unit test 2"

const Command = "test"

const First = "--first"
const Second = "--second"
const Third = "--third"

const ResultOk = "Ok"

const Args = [First, Second]

describe('GroupExecutor', function() {
  describe('execute', function() {
    var core = new Core();
    var group_executor = new GroupExecutor(
      RunUnitTest_1, [new Executor(Command, Args)], core);
    group_executor.execute((command, args)=>
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
    });

    it('Core startGroup text should be equal', function() {
      assert.equal(core.getGroup(), RunUnitTest_1);
    });

    it('Core info text should be equal', function() {
      assert.equal(core.getInfo(), ResultOk);
    });

    it('Core endGroup should be called', function() {
      assert.equal(core.isEndCalled(), true);
    });
  });

  describe('addExecutor_2', function() {
    var core = new Core();
    var group_executor = new GroupExecutor(
      RunUnitTest_1, [new Executor(Command, Args)], core);
    var second = new Executor(Command, Args);
    group_executor.addExecutor(second);
    var count = 0;
    group_executor.execute((command, args)=>
    {
      ++count;
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
    });

    it('Core startGroup text should be equal', function() {
      assert.equal(core.getGroup(), RunUnitTest_1);
    });

    it('Core info text should be equal', function() {
      assert.equal(core.getInfo(), ResultOk);
    });

    it('Core endGroup should be called', function() {
      assert.equal(core.isEndCalled(), true);
    });

    it('2 executors should be called', function() {
      assert.equal(count, 2);
    });
  });

  describe('addExecutor_3', function() {
    var core = new Core();
    var group_executor = new GroupExecutor(
      RunUnitTest_2, [new Executor(Command, Args)], core);
    var second = new Executor(Command, Args);
    group_executor.addExecutor(second);
    group_executor.addExecutor(second);
    var count = 0;
    group_executor.execute((command, args)=>
    {
      ++count;
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
    });

    it('Core startGroup text should be equal', function() {
      assert.equal(core.getGroup(), RunUnitTest_2);
    });

    it('Core info text should be equal', function() {
      assert.equal(core.getInfo(), ResultOk);
    });

    it('Core endGroup should be called', function() {
      assert.equal(core.isEndCalled(), true);
    });

    it('3 executors should be called', function() {
      assert.equal(count, 3);
    });
  });
});