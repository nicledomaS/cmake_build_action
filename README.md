[![License][license-image]][license-url]
# Cmake build action
This action builds cmake projects.
It lets to do:
1) Update submodules
2) Add cmake args
3) Build project like release or debug
4) Build and run unit tests
5) Create package

## Example workflow
```yaml
name: C/C++ CI

on: [push]

jobs:
  ubuntu-build:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout
      uses: actions/checkout@v2.0.0
    - name: Build project
      uses: nicledomaS/cmake_build_action@master
      with:
        submodule_update: ON
        run_tests: ON
        unit_test_build: -Dtest=ON
```
## Options
### `submodule_update`
Turn on submodule update.

Default: `OFF`

### `cmake_args`
List of additional cmake args (use like splitter `;`).

Examle: `-D<ARG1>=value;-D<ARG1>=value`

### `run_tests`
Turn on unit tests.

Default: `OFF`

### `unit_test_build`
Cmake arg for build unit tests (if have).

Example: `-DTEST=ON`

### `create_package`
Turn on create package.

Default: `OFF`

### `package_generator`
Set name for package generator.

Default: `TGZ`

### `config`
For multi-configuration tools, choose configuration Release or Debug.

Default: `Release`
