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

    const git = execFileSync('git', ['submodule', 'update', '--init', '--recursive']);
    const cmakeConfigure = execFileSync('cmake', ['..']);
    const cmakeBuild = execFileSync('cmake', ['--build', '.', '--', `-j${cpus}`]);
} 
catch (error)
{
    core.setFailed(error.message);
}


