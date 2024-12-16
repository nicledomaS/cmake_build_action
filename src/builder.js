const os = require('os');
const process = require('process');
const path = require('path');
const { execFileSync } = require('child_process');

const core = require('@actions/core');

const Action = require('./action');
const git_utils = require('./git_utils');
const cmake_utils = require('./cmake_utils');
const GroupExecutor = require('./group_executor');

const srcdir = 'srcdir'
const submoduleUpdate = 'submodule_update';
const cmakeArgs = 'cmake_args';
const runTests = 'run_tests';
const unitTestBuild = 'unit_test_build';
const config = 'config';
const createPackage = 'create_package';
const packageGenerator = 'package_generator';

const submoduleDescription = 'Submodule update';
const startBuildDescription = 'Start build';
const runTestsDescription = 'Run unit tests';
const createPackageDescriptor = 'Create package';

const dirName = 'build';

module.exports = class Builder {
    constructor() {
        const submoduleUpdateInput = core.getInput(submoduleUpdate, { required: false });
        this._submoduleUpdate = submoduleUpdateInput === 'ON';

        const runTestsInput = core.getInput(runTests, { required: false });
        this._runTests = runTestsInput === 'ON';

        const createPackageInput = core.getInput(createPackage, { required: false });
        this._createPackage = createPackageInput === 'ON';

        if (this._createPackage) {
            this._packageGenerator = core.getInput(packageGenerator, { required: true });
        }

        this._unitTestBuild = core.getInput(unitTestBuild, { required: false });
        this._cmakeArgs = core.getInput(cmakeArgs, { required: false });
        this._config = core.getInput(config, { required: false });

        this._cpus = os.cpus().length;
        this._cmakeVersion = cmake_utils.getCmakeVersion();

        this._sourceDir = process.cwd();
        const srcdir = core.getInput(submoduleUpdate, { required: false });
        if (srcdir != '') {
            this._sourceDir = this._sourceDir + '/' + srcdir;
        }

        this._buildDir = path.join(this._sourceDir, dirName);

        this._action = new Action(core, execFileSync);
    }

    build() {
        if (this._submoduleUpdate) {
            let gitExec = git_utils.gitSubmoduleUpdateExecutor();
            this._action.addExecutor(new GroupExecutor(submoduleDescription, [gitExec], core));
        }

        let cmakeBuildExecutors = [];

        if (this._cmakeVersion < 312) {
            let cmakeMakeDirectory = cmake_utils.cmakeMakeDirectory(this._buildDir);
            cmakeBuildExecutors.push(cmakeMakeDirectory);
        }

        let cmakeConfigure =
            cmake_utils.cmakeConfigureExecutor(
                this._cmakeVersion,
                this._buildDir,
                this._sourceDir,
                this._cmakeArgs,
                this._unitTestBuild);
        cmakeBuildExecutors.push(cmakeConfigure);

        let cmakeBuild =
            cmake_utils.cmakeBuildExecutor(
                this._cpus,
                this._cmakeVersion,
                this._buildDir,
                this._config
            );
        cmakeBuildExecutors.push(cmakeBuild);

        this._action.addExecutor(new GroupExecutor(startBuildDescription, cmakeBuildExecutors, core));

        if (this._runTests) {
            let ctestExecutor = cmake_utils.cmakeRunTestsExecutor(this._cpus, this._buildDir, this._config);
            this._action.addExecutor(new GroupExecutor(runTestsDescription, [ctestExecutor], core));
        }

        if (this._createPackage) {
            let cpackageExecutor = cmake_utils.cmakePackageExecutor(this._packageGenerator, this._buildDir, this._config);
            this._action.addExecutor(new GroupExecutor(createPackageDescriptor, [cpackageExecutor], core));
        }
    }

    action() {
        return this._action;
    }
}