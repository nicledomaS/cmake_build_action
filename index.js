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

var dir = './build';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
    fs.openSync(dir)
}

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
