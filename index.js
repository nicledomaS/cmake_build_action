const core = require('@actions/core');

const { execFileSync } = require('child_process');
const os = require('os');
const process = require('process');
const path = require('path');
const fs = require('fs');

const submoduleGroup = 'Submodule update';
const configureGroup = 'Configure build';
const startBuildGroup = 'Start build';

const dirName = 'build';
const gitApp = 'git';
const gitParams = ['submodule', 'update', '--init', '--recursive'];

const cmakeApp = 'cmake';
const cmakeVersionParam = '--version';
const cmakeBuildParam = '--build';
const cmakeConfigParam = '--config';
const cmakeParallelParam = '--parallel';
const cmakeSourceDirParam = '..';
const cmakeBuildDirParam = '.';

const submoduleUpdateInput = 'submodule_update';
const cmakeArgs = 'cmake_args';
const googletestOnInput = 'googletests_on';
const configInput = 'config';

const versionTemplate = /(?!cmake version)(?:\d{1,})/gm;

function submoduleUpdate()
{
    core.startGroup(submoduleGroup);
    const git = execFileSync(gitApp, gitParams);
    core.endGroup();
}

function cmakeConfigure()
{
    core.startGroup(configureGroup);

    var buildPath = path.join(process.cwd(), dirName);
    if (!fs.existsSync(buildPath))
    {
        core.info(`Create folder: ${dirName}`);
        fs.mkdirSync(buildPath);
    }

    process.chdir(buildPath);
    core.info(`Build directory: ${process.cwd()}`);

    const googletestOnIn = core.getInput(googletestOnInput, { required: false });

    var configureParameters = [cmakeSourceDirParam];
    if(googletestOnIn === 'ON')
    {
        configureParameters.push(`-Dtest=${googletestOnIn}`)
    }

    const cmakeArgIn = core.getInput(cmakeArgs, { required: false });
    const args = String(cmakeArgIn).split(';');
    for(const arg of args)
    {
        configureParameters.push(arg);
    }

    const cmakeConfigure = execFileSync(cmakeApp, configureParameters);
    core.info(cmakeConfigure);
    core.endGroup();
}

function cmakeBuild()
{
    core.startGroup(startBuildGroup);
    const configIn = core.getInput(configInput, { required: false });
    let buildParameters = [cmakeBuildParam, cmakeBuildDirParam, cmakeConfigParam, `${configIn}`];
    
    if(cpus > 1)
    {
        const versionText = execFileSync(cmakeApp, [cmakeVersionParam]).toString();
        var version = versionText.match(versionTemplate);
        if(version.length >= 2 && version[0] <= 3 && version[1] > 11)
        {
            buildParameters.push(cmakeParallelParam);
            buildParameters.push(`${cpus}`);
        }
        else
        {
            buildParameters.push('--');
            buildParameters.push(`-j${cpus}`);
        }
    }
    
    const cmakeBuild = execFileSync(cmakeApp, buildParameters);
    core.info(cmakeBuild);
    core.endGroup();
}

var cpus = os.cpus().length;

core.info(`CPUs: ${cpus}`);
core.info(`Starting directory:  ${process.cwd()}`);

try 
{
    const submoduleUpdateIn = core.getInput(submoduleUpdateInput, { required: false });
    if(submoduleUpdateIn === 'ON')
    {
        submoduleUpdate();
    }

    cmakeConfigure();
    cmakeBuild();

} 
catch (error)
{
    core.setFailed(error.message);
}


