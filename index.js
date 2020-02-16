const core = require('@actions/core');

const { execFileSync } = require('child_process');
const os = require('os');
const process = require('process');
const path = require('path');
const fs = require('fs');

var cpus = os.cpus().length;

core.info(`CPUs: ${cpus}`);
core.info(`Starting directory:  ${process.cwd()}`);

try 
{
    var dirName = 'build';
    var buildPath = path.join(process.cwd(), dirName);
    if (!fs.existsSync(buildPath))
    {
        core.info(`Create folder: ${dirName}`);
        fs.mkdirSync(buildPath);
    }

    process.chdir(buildPath);
    core.info(`Build directory: ${process.cwd()}`);

    const submoduleUpdate = core.getInput('submodule_update', { required: false });

    if(submoduleUpdate === 'ON')
    {
        core.startGroup('Submodule update');
        const git = execFileSync('git', ['submodule', 'update', '--init', '--recursive']);
        core.endGroup();
    }

    core.startGroup('Configure build');
    const googletestOn = core.getInput('submodule_update', { required: false });

    var configureParameters = ['..'];
    if(googletestOn.length)
    {
        configureParameters.push(`-Dtest=${googletestOn}`)
    }

    const cmakeConfigure = execFileSync('cmake', configureParameters);
    core.info(cmakeConfigure);
    core.endGroup();

    core.startGroup('Start build');
    const config = core.getInput('submodule_update', { required: false });
    let buildParameters = ['--build', '.', '--config', `${config}`];
    
    if(cpus > 1)
    {
        const cmakeVersion = execFileSync('cmake', ['--version']).toString();
        var version = cmakeVersion.match(/(?!cmake version)(?:\d{1,})/gm);
        if(version.length >= 2 && version[0] <= 3 && version[1] > 11)
        {
            buildParameters.push('--parallel');
            buildParameters.push(`${cpus}`);
        }
        else
        {
            buildParameters.push('--');
            buildParameters.push(`-j${cpus}`);
        }
    }
    
    const cmakeBuild = execFileSync('cmake', buildParameters);
    core.info(cmakeBuild);
    core.endGroup();
} 
catch (error)
{
    core.setFailed(error.message);
}


