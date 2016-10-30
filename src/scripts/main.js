import parseUnit from 'parse-unit'

const instances = []

/**
 * Returns all active instances from an array.
 * @param {Array} instances
 * @returns {Array} instances - Active instances.
 */
const getActiveInstances = function(instances) {

	return instances.filter((instance) => instance.isActive())

}

/**
 * Checks if a value is absolute.
 * An absolute value must end with a unit.
 * @param {String|Integer} value
 * @returns {Boolean} isAbsolute
 */
const isAbsoluteValue = function(value) {

	return (isNaN(parseUnit(value)[0])===true ? false : true)

}

/**
 * Parses an absolute value.
 * @param {String|Integer} value
 * @returns {Object} parsedValue
 */
const parseAbsoluteValue = function(value) {

	const parsedValue = parseUnit(value)

	return {
		value : parsedValue[0],
		unit  : parsedValue[1]
	}

}

/**
 * Converts a relative value to an absolute value.
 * @param {String} value
 * @returns {String} absoluteValue
 */
const relativeToAbsoluteValue = function(value, elem) {

	const viewportHeight = window.innerHeight || window.outerHeight
	const documentSize   = document.scrollingElement.getBoundingClientRect()
	const elemSize       = elem.getBoundingClientRect()

	const elemAnchor     = value.match(/^[a-z]+/)[0]
	const viewportAnchor = value.match(/[a-z]+$/)[0]

	let y = 0

	if (viewportAnchor==='top')    y -= 0
	if (viewportAnchor==='middle') y -= viewportHeight / 2
	if (viewportAnchor==='bottom') y -= viewportHeight

	if (elemAnchor==='top')    y += (elemSize.top - documentSize.top)
	if (elemAnchor==='middle') y += (elemSize.top - documentSize.top) + elemSize.height / 2
	if (elemAnchor==='bottom') y += (elemSize.top - documentSize.top) + elemSize.height

	return `${ y }px`

}

/**
 * Checks if a value is relative.
 * A relative value must start and end with [a-z] and needs a '-' in the middle.
 * @param {String|Integer} value
 * @returns {Boolean} isRelative
 */
const isRelativeValue = function(value) {

	return (String(value).match(/^[a-z]+-[a-z]+$/)===null ? false : true)

}

/**
 * Validates options and sets defaults for undefined properties.
 * @param {?Object} opts
 * @returns {Object} opts - Validated options.
 */
const validate = function(opts = {}) {

	opts = Object.assign({}, opts)

	if (opts.from==null) throw new Error('Missing property `from`')
	if (opts.to==null)   throw new Error('Missing property `to`')

	if (opts.elem==null) {

		if (isAbsoluteValue(opts.from)!==true) throw new Error('Property `from` must be a absolute value when no `elem` has been provided')
		if (isAbsoluteValue(opts.to)!==true)   throw new Error('Property `to` must be a absolute value when no `elem` has been provided')

	} else {

		if (isRelativeValue(opts.from)===true) opts.from = relativeToAbsoluteValue(opts.from, opts.elem)
		if (isRelativeValue(opts.to)===true)   opts.to   = relativeToAbsoluteValue(opts.to, opts.elem)

	}

	opts.from = parseAbsoluteValue(opts.from)
	opts.to   = parseAbsoluteValue(opts.to)

	return opts

}

const update = function(opts) {

	const documentSize = document.scrollingElement.getBoundingClientRect()
	const documentTop  = documentSize.top * -1

	// 100% in pixel
	const total = opts.to.value - opts.from.value

	// Pixel already scrolled
	const current = documentTop - opts.from.value

	// Percent already scrolled
	let percent = (current) / (total / 100)

	// Normalize percentage
	if (percent<=0)  percent = 0
	if (percent>100) percent = 100

	// Update each value
	// TODO

	return []

}

/**
 * Adds a property with the specified name and value to a given style object.
 * @param {Object} style - Style object.
 * @param {Object} prop - Object with a key and value.
 */
const setProp = function(style, prop) {

	style.setProperty(prop.key, prop.value)

}

const loop = function(style) {

	const activeInstances = getActiveInstances(instances)

	// Only animate when active instances available
	if (activeInstances.length>0) {

		// Animate each instance
		const newProps = activeInstances.map((instance) => instance.update())

		// Flatten props because each update can return multiple props.
		// The second parameter of contact takes an array, so the line is identical to:
		// [].concat(['1'], ['2'], ['3'])
		const flattedProps = [].concat.apply([], newProps)

		// Compare new props with old ones and only change the newbies
		const changedProps = flattedProps // TODO

		// Set new props
		changedProps.forEach((prop) => setProp(style, prop))

	}

	requestAnimationFrame(loop.bind(null, style))

}

/**
 * Creats a new instance.
 * @param {Object} opts
 * @returns {Object} instance
 */
export const create = function(opts) {

	// Validate options
	opts = validate(opts)

	console.log(opts);

	// Store if instance is started or stopped
	let active = false

	// Returns if instance is started or stopped
	const _isActive = () => {

		return active

	}

	// Update props
	const _update = () => {

		return update(opts)

	}

	// Starts to animate
	const _start = () => {

		active = true

	}

	// Stops to animate
	const _stop = () => {

		active = false

	}

	// Assign instance to a variable so the instance can be used
	// elsewhere in the current function
	const instance = {
		isActive : _isActive,
		update   : _update,
		start    : _start,
		stop     : _stop
	}

	// Store instance in global array
	instances.push(instance)

	return instance

}

// Start to loop
loop(document.documentElement.style)