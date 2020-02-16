const os = require('os');
const { execFile } = require('child_process');
const path = require('path');


var cpus = os.cpus();

console.log(cpus.length);

const git = execFile('git', ['submodule', 'update', '--init', '--recursive'], (error, stdout, stderr) => {
    if (error) {
      throw error;
    }
    console.log(stdout);
  });

const cmakeConfigure = execFile('cmake', ['-B', 'build'], (error, stdout, stderr) => {
    if (error) {
      throw error;
    }
    console.log(stdout);
});

const cmakeBuild = execFile('cmake', ['--build=build'], (error, stdout, stderr) => {
    if (error) {
      throw error;
    }
    console.log(stdout);
});
