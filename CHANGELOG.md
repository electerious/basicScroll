# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [3.0.4] - 2021-01-17

### Changed

- Updated dependencies

## [3.0.3] - 2020-03-20

### Changed

- Updated dependencies
- Updated documentation

## [3.0.2] - 2019-02-23

### Changed

- Replace `gulp` and `basicTasks` with custom build process

## [3.0.1] - 2018-12-20

### Added

- Support SSR by checking if `window` exists (#32)

## [3.0.0] - 2018-10-03

### Added

- Reduced the size of the minified version by almost 50%
- `Object.assign` must be supported by the browser

### Fixed

- "Missing property `from`" error (#21)

## [2.1.1] - 2018-04-01

### Changed

- Precise property rounding to avoid choppy animations (#16)

## [2.1.0] - 2018-03-09

### Added

- `direct` option can be used to apply properties to another element than `elem` (#11)
- More demos

## [2.0.0] - 2018-02-25

### Added

- [Track window size changes](README.md#track-window-size-changes) and recalculate and update instances when the size changes (#7)
- `track` option to disable [window size tracking](README.md#track-window-size-changes) for each instance individually (#7)

### Changed

- The `props` callback parameter is now nicely formatted
- The `update` method returns a nicely formatted object of props
- [Direct mode](README.md#data) must now be defined globally per instance instead of setting it on each prop individually

## [1.3.0] - 2018-02-24

### Added

- Callback demo
- Destroy method (#6)

## [1.2.0] - 2018-01-18

### Added

- `inside` and `outside` callbacks now receive the calculated properties

## [1.1.5] - 2017-12-17

### Changed

- Syntax of JS files

## [1.1.4] - 2017-09-01

### Changed

- Switched from `deepcopy` to `lodash.clonedeep`

## [1.1.3] - 2017-08-08

### Added

- Added a changelog

### Changed

- Ignore `yarn.lock` and `package-lock.json` files