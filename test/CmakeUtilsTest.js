var assert = require('assert');
const cmake_utils = require('../src/cmake_utils.js');

const cmakeApp = 'cmake';
const cmakeVersionParam = '--version';
const cmakeBuildParam = '--build';
const cmakeConfigParam = '--config';
const cmakeParallelParam = '--parallel';

const cpu = 5;
const cmakeBuildDir = '/test/path';
const cmakeSourceDir = '/test/source/dir'
const cpakgGenerator = 'TGZ';
const config = 'Debug';
const cmakeVersion_311 = 311
const cmakeVersion_312 = 312

const cmakeFlagE = '-E';
const cmakeFlagB = '-B';
const cmakeFlagS = '-S';
const cmakeFlagG = '-G';
const cmakeFlagC = '-C';

const cmakeChdirCommand = 'chdir';
const cmakeMakedirectoryComand = 'make_directory';

const ctestApp = 'ctest';
const ctestOutputOnFailure = '--output-on-failure';

const cpackApp = 'cpack';

const createDirArgs = [cmakeFlagE, cmakeMakedirectoryComand, cmakeBuildDir];
const testArgs = [cmakeFlagE, cmakeChdirCommand, cmakeBuildDir, ctestApp, ctestOutputOnFailure, cmakeFlagC, config];
const packageArgs = [cmakeFlagE, cmakeChdirCommand, cmakeBuildDir, cpackApp, cmakeFlagG, cpakgGenerator, cmakeFlagC, config];
const buildArgs = [cmakeBuildParam, cmakeBuildDir, cmakeConfigParam, config];
const configureArgs_v312 = [cmakeFlagB, cmakeBuildDir, cmakeFlagS, cmakeSourceDir];
const configureArgs_v311 = [cmakeFlagE, cmakeChdirCommand, cmakeBuildDir, cmakeApp, cmakeSourceDir];
const dArgs = '-DTEST=ON;-DCC=gcc;-DCMAKE_PACKAGE=TGZ'

const ResultOk = "Ok"

describe('cmake_utils', function() {
    describe('parallelBuildArgs_version_311', function() {
        let params_version = cmake_utils.parallelBuildArgs(311, cpu);
        it('Should be 2 params', function() {
            assert.equal(params_version.length, 2);
        });
        it('Should be "--" param', function() {
            assert.equal(params_version.includes("--"), true);
        });
        it(`Should be -j${cpu} param`, function() {
            assert.equal(params_version.includes("--"), true);
        });
    });

    describe('parallelBuildArgs_version_more_311', function() {
        let params_version = cmake_utils.parallelBuildArgs(312, cpu);
        it('Should be 2 params', function() {
            assert.equal(params_version.length, 2);
        });
        it(`Should be ${cmakeParallelParam} param`, function() {
            assert.equal(params_version.includes(cmakeParallelParam), true);
        });
        it(`Should be ${cpu} param`, function() {
            assert.equal(params_version.includes(`${cpu}`), true);
        });
    });

    describe('cmakeMakeDirectory', function() {
        let cmakeExec = cmake_utils.cmakeMakeDirectory(cmakeBuildDir);
        let result = cmakeExec.execute((command, args)=>
        {
            it('Commands should be equal', function() {
                assert.equal(command, cmakeApp);
            });
    
            it('Size args should be equal', function() {
                assert.equal(args.length, createDirArgs.length);
            });
    
            it('Args should be equal', function() {
                for(const arg of createDirArgs)
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

    describe('cmakePackageExecutor', function() {
        let cmakeExec = cmake_utils.cmakePackageExecutor(cpakgGenerator, cmakeBuildDir, config);
        let result = cmakeExec.execute((command, args)=>
        {
            it('Commands should be equal', function() {
                assert.equal(command, cmakeApp);
            });
    
            it('Size args should be equal', function() {
                assert.equal(args.length, packageArgs.length);
            });
    
            it('Args should be equal', function() {
                for(const arg of packageArgs)
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

    describe('cmakeRunTestsExecutor_cpu1', function() {
        let cmakeExec = cmake_utils.cmakeRunTestsExecutor(1, cmakeBuildDir, config);
        let result = cmakeExec.execute((command, args)=>
        {
            it('Commands should be equal', function() {
                assert.equal(command, cmakeApp);
            });
    
            it('Size args should be equal', function() {
                assert.equal(args.length, testArgs.length);
            });
    
            it('Args should be equal', function() {
                for(const arg of testArgs)
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

    describe('cmakeRunTestsExecutor_cpu5', function() {
        var newArgs = [];
        for(const arg of testArgs)
        {
            newArgs.push(arg);
        }

        newArgs.push(cmakeParallelParam);
        newArgs.push(`${cpu}`);
        
        let cmakeExec = cmake_utils.cmakeRunTestsExecutor(cpu, cmakeBuildDir);
        let result = cmakeExec.execute((command, args)=>
        {
            it('Commands should be equal', function() {
                assert.equal(command, cmakeApp);
            });
    
            it('Size args should be equal', function() {
                assert.equal(args.length, newArgs.length);
            });
    
            it('Args should be equal', function() {
                for(const arg of newArgs)
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

    describe('cmakeBuildExecutor_cpu1_v311', function() {
        var newArgs = [];
        for(const arg of buildArgs)
        {
            newArgs.push(arg);
        }
        
        let cmakeExec = cmake_utils.cmakeBuildExecutor(1, cmakeVersion_311, cmakeBuildDir, config);
        let result = cmakeExec.execute((command, args)=>
        {
            it('Commands should be equal', function() {
                assert.equal(command, cmakeApp);
            });
    
            it('Size args should be equal', function() {
                assert.equal(args.length, newArgs.length);
            });
    
            it('Args should be equal', function() {
                for(const arg of newArgs)
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

    describe('cmakeBuildExecutor_cpu5_v311', function() {
        var newArgs = [];
        for(const arg of buildArgs)
        {
            newArgs.push(arg);
        }

        for(const arg of cmake_utils.parallelBuildArgs(cmakeVersion_311, cpu))
        {
            newArgs.push(arg);
        }
        
        let cmakeExec = cmake_utils.cmakeBuildExecutor(cpu, cmakeVersion_311, cmakeBuildDir, config);
        let result = cmakeExec.execute((command, args)=>
        {
            it('Commands should be equal', function() {
                assert.equal(command, cmakeApp);
            });
    
            it('Size args should be equal', function() {
                assert.equal(args.length, newArgs.length);
            });
    
            it('Args should be equal', function() {
                for(const arg of newArgs)
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

    describe('cmakeBuildExecutor_cpu1_v312', function() {
        var newArgs = [];
        for(const arg of buildArgs)
        {
            newArgs.push(arg);
        }
        
        let cmakeExec = cmake_utils.cmakeBuildExecutor(1, cmakeVersion_312, cmakeBuildDir, config);
        let result = cmakeExec.execute((command, args)=>
        {
            it('Commands should be equal', function() {
                assert.equal(command, cmakeApp);
            });
    
            it('Size args should be equal', function() {
                assert.equal(args.length, newArgs.length);
            });
    
            it('Args should be equal', function() {
                for(const arg of newArgs)
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

    describe('cmakeBuildExecutor_cpu5_v312', function() {
        var newArgs = [];
        for(const arg of buildArgs)
        {
            newArgs.push(arg);
        }

        for(const arg of cmake_utils.parallelBuildArgs(cmakeVersion_312, cpu))
        {
            newArgs.push(arg);
        }
        
        let cmakeExec = cmake_utils.cmakeBuildExecutor(cpu, cmakeVersion_312, cmakeBuildDir, config);
        let result = cmakeExec.execute((command, args)=>
        {
            it('Commands should be equal', function() {
                assert.equal(command, cmakeApp);
            });
    
            it('Size args should be equal', function() {
                assert.equal(args.length, newArgs.length);
            });
    
            it('Args should be equal', function() {
                for(const arg of newArgs)
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

    describe('cmakeConfigureExecutor_v311', function() {
        var newArgs = [];
        for(const arg of configureArgs_v311)
        {
            newArgs.push(arg);
        }
        
        let cmakeExec = cmake_utils.cmakeConfigureExecutor(cmakeVersion_311, cmakeBuildDir, cmakeSourceDir, '', '');
        let result = cmakeExec.execute((command, args)=>
        {
            it('Commands should be equal', function() {
                assert.equal(command, cmakeApp);
            });
    
            it('Size args should be equal', function() {
                assert.equal(args.length, newArgs.length);
            });
    
            it('Args should be equal', function() {
                for(const arg of newArgs)
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

    describe('cmakeConfigureExecutor_v311', function() {
        var newArgs = [];
        for(const arg of configureArgs_v311)
        {
            newArgs.push(arg);
        }

        for(const arg of dArgs.split(';'))
        {
            newArgs.push(arg);
        }

        newArgs.push('-DTEST=ON')
        
        let cmakeExec = cmake_utils.cmakeConfigureExecutor(cmakeVersion_311, cmakeBuildDir, cmakeSourceDir, dArgs, '-DTEST=ON');
        let result = cmakeExec.execute((command, args)=>
        {
            it('Commands should be equal', function() {
                assert.equal(command, cmakeApp);
            });
    
            it('Size args should be equal', function() {
                assert.equal(args.length, newArgs.length);
            });
    
            it('Args should be equal', function() {
                for(const arg of newArgs)
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

    describe('cmakeConfigureExecutor_v312', function() {
        var newArgs = [];
        for(const arg of configureArgs_v312)
        {
            newArgs.push(arg);
        }
        
        let cmakeExec = cmake_utils.cmakeConfigureExecutor(cmakeVersion_312, cmakeBuildDir, cmakeSourceDir, '', '');
        let result = cmakeExec.execute((command, args)=>
        {
            it('Commands should be equal', function() {
                assert.equal(command, cmakeApp);
            });
    
            it('Size args should be equal', function() {
                assert.equal(args.length, newArgs.length);
            });
    
            it('Args should be equal', function() {
                for(const arg of newArgs)
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

    describe('cmakeConfigureExecutor_v312', function() {
        var newArgs = [];
        for(const arg of configureArgs_v312)
        {
            newArgs.push(arg);
        }

        for(const arg of dArgs.split(';'))
        {
            newArgs.push(arg);
        }

        newArgs.push('-DTEST=ON')
        
        let cmakeExec = cmake_utils.cmakeConfigureExecutor(cmakeVersion_312, cmakeBuildDir, cmakeSourceDir, dArgs, '-DTEST=ON');
        let result = cmakeExec.execute((command, args)=>
        {
            it('Commands should be equal', function() {
                assert.equal(command, cmakeApp);
            });
    
            it('Size args should be equal', function() {
                assert.equal(args.length, newArgs.length);
            });
    
            it('Args should be equal', function() {
                for(const arg of newArgs)
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