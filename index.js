const os = require('os');
const { execFile } = require('child_process');

var cpus = os.cpus();

console.log(cpus.length);

const child = execFile('git', ['submodule', 'update', '--init', '--recursive'], (error, stdout, stderr) => {
    if (error) {
      throw error;
    }
    console.log(stdout);
  });
