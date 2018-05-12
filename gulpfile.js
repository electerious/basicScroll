'use strict'

const name = require('./package.json').moduleName
const gulp = require('gulp')
const tasks = require('@electerious/basictasks')(gulp, name)

const scripts = tasks.scripts({
	from: './src/scripts/main.js',
	to: './dist'
})

const watch = function() {
	gulp.watch('./src/scripts/**/*.js', [ 'scripts' ])
}

gulp.task('scripts', scripts)
gulp.task('default', [ 'scripts' ])
gulp.task('watch', [ 'default' ], watch)