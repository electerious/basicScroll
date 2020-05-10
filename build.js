'use strict'

const { writeFile } = require('fs').promises
const js = require('rosid-handler-js')

js('src/scripts/main.js', {

	optimize: true,
	browserify: {
		standalone: 'basicScroll'
	}

}).then((data) => {

	return writeFile('dist/basicScroll.min.js', data)

})