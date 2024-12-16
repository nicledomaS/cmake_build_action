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
      uses: nicledomaS/cmake_build_action@v1.4
      with:
        submodule_update: ON
        run_tests: ON
        unit_test_build: -Dtest=ON
```
## Options
### `srcdir`
Enable alterative location for C++ source code.

Default: `OFF`


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

Configure upload artifacts. Files will save to folder `build` after build project.

Example:

```yaml
- uses: actions/upload-artifact@v2
      with:
        path: build/*.tar.gz
        name: artifact_${{ matrix.os }}_${{ matrix.configs }}.tar.gz
```

### `config`
For multi-configuration tools, choose configuration Release or Debug.

Default: `Release`

## Related project
[C++ project template](https://github.com/nicledomaS/CppProjectTemplate)


[license-image]: https://img.shields.io/badge/license-MIT-blue.svg
[license-url]: LICENSE
