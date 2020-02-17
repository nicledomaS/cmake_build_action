# Cmake build action

### Example workflow
```yaml
name: C/C++ CI

on: [push]

jobs:
  windows-build:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v1
      - uses: nicledomaS/workflows@add_actions_for_windows
```
