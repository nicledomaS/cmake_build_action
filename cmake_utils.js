const { execFileSync } = require('child_process');

const Executor = require('./executor.js');

const cmakeApp = 'cmake';
const cmakeVersionParam = '--version';
const cmakeBuildParam = '--build';
const cmakeConfigParam = '--config';
const cmakeParallelParam = '--parallel';

const cmakeFlagE = '-E';
const cmakeFlagB = '-B';
const cmakeFlagS = '-S';
const cmakeFlagG = '-G';

const cmakeChdirCommand = 'chdir';
const cmakeMakedirectoryComand = 'make_directory';

const ctestApp = 'ctest';
const ctestOutputOnFailure = '--output-on-failure';

const cpackApp = 'cpack';

function getCmakeVersion()
{
    const versionTemplate = /(?:\d{1,})/gm;
    let cmakeVers = new Executor(cmakeApp, [cmakeVersionParam]);
    let result = cmakeVers.execute(execFileSync).toString();
    let version = result.match(versionTemplate);

    return version.length >= 2 ? 
                version[0] * 100 + version[1] * 1 :
                undefined;
}

function parallelBuildArgs(cmakeVersion, cpus)
{
    return cmakeVersion  > 311 ?
                [cmakeParallelParam, `${cpus}`] : ['--', `-j${cpus}`];
}

function cmakeMakeDirectory(cmakeBuildDir)
{
    return new Executor(cmakeApp, [cmakeFlagE, cmakeMakedirectoryComand, cmakeBuildDir]);
}

function cmakeConfigureExecutor(cmakeVersion, cmakeBuildDir, cmakeSourceDir, cmakeArgs, buildUnitTest)
{   
    let configureArgs = cmakeVersion  > 311 ? 
                [cmakeFlagB, cmakeBuildDir, cmakeFlagS, cmakeSourceDir] :
                [cmakeFlagE, cmakeChdirCommand, cmakeBuildDir, cmakeApp, cmakeSourceDir];
    
    if(buildUnitTest.length > 0)
    {
        configureArgs.push(buildUnitTest);
    }
    
    for(const arg of cmakeArgs.split(';'))
    {
        if(arg.length > 0)
        {
            configureArgs.push(arg);
        }
    }

    return new Executor(cmakeApp, configureArgs);
}

function cmakeBuildExecutor(cpus, cmakeVersion, cmakeBuildDir, config)
{
    let buildParameters = [cmakeBuildParam, cmakeBuildDir, cmakeConfigParam, config];

    if(cpus > 1)
    {
        for(const arg of parallelBuildArgs(cmakeVersion, cpus))
        {
            buildParameters.push(arg);
        }
    }
    
    return new Executor(cmakeApp, buildParameters);
}

function cmakeRunTestsExecutor(cpus, cmakeBuildDir)
{
    let args = [cmakeFlagE, cmakeChdirCommand, cmakeBuildDir, ctestApp, ctestOutputOnFailure];
    if(cpus > 1)
    {
        args.push(cmakeParallelParam);
        args.push(cpus);
    }

    return new Executor(cmakeApp, args);
}

function cmakePackageExecutor(cpakgGenerator, cmakeBuildDir)
{
    let args = [cmakeFlagE, cmakeChdirCommand, cmakeBuildDir, cpackApp, cmakeFlagG, cpakgGenerator];
    return new Executor(cmakeApp, args);
}

module.exports.getCmakeVersion = getCmakeVersion;
module.exports.cmakeMakeDirectory = cmakeMakeDirectory;
module.exports.cmakeConfigureExecutor = cmakeConfigureExecutor;
module.exports.cmakeBuildExecutor = cmakeBuildExecutor;
module.exports.cmakeRunTestsExecutor = cmakeRunTestsExecutor;
module.exports.cmakePackageExecutor = cmakePackageExecutor;