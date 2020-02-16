const os = require('os');
const { execFile } = require('child_process');
var process = require('process');
var path = require('path');
var fs = require('fs');

var cpus = os.cpus().length;

console.log(`CPUs: ${cpus}`);
console.log(`Starting directory:  ${process.cwd()}`);

const git = execFile('git', ['submodule', 'update', '--init', '--recursive'], (error, stdout, stderr) => {
    if (error) {
      throw error;
    }
    console.log(stdout);
  });

var dirName = 'build';
var buildPath = path.join(process.cwd(), dirName);

if (!fs.existsSync(buildPath))
{
    fs.mkdirSync(buildPath);
}

try 
{
    process.chdir(buildPath);
    console.log(`New directory: ${process.cwd()}`);
} 
catch (err) 
{
    console.error(`chdir: ${err}`);
} 

const cmakeConfigure = execFile('cmake', ['..'], (error, stdout, stderr) => {
    if (error) {
      throw error;
    }
    console.log(stdout);
});


const cmakeBuild = execFile('cmake', ['--build', '.', '-j', `${cpus}`], (error, stdout, stderr) => {
    if (error) {
      throw error;
    }
    console.log(stdout);
});
