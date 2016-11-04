'use strict'

let name  = require('./package.json').moduleName
let gulp  = require('gulp')
let tasks = require('@electerious/basictasks')(gulp, name)

const scripts = tasks.scripts({
	from : './src/scripts/main.js',
	to   : './dist'
})

const watch = function() {
	gulp.watch('./src/scripts/**/*.js', [ 'scripts' ])
}

gulp.task('scripts', scripts)
gulp.task('default', [ 'scripts' ])
gulp.task('watch', [ 'default' ], watch)