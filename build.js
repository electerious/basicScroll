'use strict'

const { writeFile } = require('fs')
const { promisify } = require('util')
const handler = require('rosid-handler-js')
const save = promisify(writeFile)

handler('src/scripts/main.js', {

	optimize: true,
	browserify: {
		standalone: 'basicScroll'
	}

}).then((data) => {

	return save('dist/basicScroll.min.js', data, 'utf8')

})