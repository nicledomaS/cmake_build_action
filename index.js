const os = require('os');
const { execFile } = require('child_process');
var fs = require('fs');


var cpus = os.cpus();

console.log(cpus.length);

const git = execFile('git', ['submodule', 'update', '--init', '--recursive'], (error, stdout, stderr) => {
    if (error) {
      throw error;
    }
    console.log(stdout);
  });

var dirName = './build';
var dir = fs.opendirSync(dirName);

console.log(dir.path);

const cmakeConfigure = execFile('cmake', ['..'], (error, stdout, stderr) => {
    if (error) {
      throw error;
    }
    console.log(stdout);
});


const cmakeBuild = execFile('cmake', ['--build', '.'], (error, stdout, stderr) => {
    if (error) {
      throw error;
    }
    console.log(stdout);
});
