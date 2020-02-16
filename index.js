const os = require('os');
const { execFileSync } = require('child_process');
var process = require('process');
var path = require('path');
var fs = require('fs');

var cpus = os.cpus().length;

console.log(`CPUs: ${cpus}`);
console.log(`Starting directory:  ${process.cwd()}`);

try 
{
    const git = execFileSync('git', ['submodule', 'update', '--init', '--recursive']);

    var dirName = 'build';
    var buildPath = path.join(process.cwd(), dirName);

    if (!fs.existsSync(buildPath))
    {
        fs.mkdirSync(buildPath);
    }

    process.chdir(buildPath);
    console.log(`New directory: ${process.cwd()}`);

    const cmakeConfigure = execFileSync('cmake', ['..']);    
    const cmakeBuild = execFileSync('cmake', ['--build', '.', '-j', `${cpus}`]);
} 
catch (err) 
{
    console.error(`chdir: ${err}`);
} 


