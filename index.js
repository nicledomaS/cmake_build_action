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

    const googletestOn = core.getInput('submodule_update', { required: false });
    
    core.startGroup('Configure build');
    const cmakeConfigure = execFileSync('cmake', ['..', `-Dtest=${googletestOn}`]);
    core.endGroup();

    core.startGroup('Start build');
    const cmakeBuild = execFileSync('cmake', ['--build', '.', '--', `-j${cpus}`]);
    core.endGroup();
} 
catch (error)
{
    core.setFailed(error.message);
}


