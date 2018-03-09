# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2018-03-09

### New

- `direct` option can be used to apply properties to another element than `elem` (#11)
- More demos

## [2.0.0] - 2018-02-25

### New

- [Track window size changes](README.md#track-window-size-changes) and recalculate and update instances when the size changes (#7)
- `track` option to disable [window size tracking](README.md#track-window-size-changes) for each instance individually (#7)

### Changed

- The `props` callback parameter is now nicely formatted
- The `update` method returns a nicely formatted object of props
- [Direct mode](README.md#data) must now be defined globally per instance instead of setting it on each prop individually

## [1.3.0] - 2018-02-24

### New

- Callback demo
- Destroy method (#6)

## [1.2.0] - 2018-01-18

### New

- `inside` and `outside` callbacks now receive the calculated properties

## [1.1.5] - 2017-12-17

### Changed

- Syntax of JS files

## [1.1.4] - 2017-09-01

### Changed

- Switched from `deepcopy` to `lodash.clonedeep`

## [1.1.3] - 2017-08-08

### New

- Added a changelog

### Changed

- Ignore `yarn.lock` and `package-lock.json` files