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

	// Use scrollTop because is's faster than getBoundingClientRect()
	const documentTop = document.scrollingElement.scrollTop

	const viewportHeight = window.innerHeight || window.outerHeight
	const elemSize       = elem.getBoundingClientRect()

	const elemAnchor     = value.match(/^[a-z]+/)[0]
	const viewportAnchor = value.match(/[a-z]+$/)[0]

	let y = 0

	if (viewportAnchor==='top')    y -= 0
	if (viewportAnchor==='middle') y -= viewportHeight / 2
	if (viewportAnchor==='bottom') y -= viewportHeight

	if (elemAnchor==='top')    y += (elemSize.top + documentTop)
	if (elemAnchor==='middle') y += (elemSize.top + documentTop) + elemSize.height / 2
	if (elemAnchor==='bottom') y += (elemSize.top + documentTop) + elemSize.height

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

		if (isAbsoluteValue(opts.from)===false) throw new Error('Property `from` must be a absolute value when no `elem` has been provided')
		if (isAbsoluteValue(opts.to)===false)   throw new Error('Property `to` must be a absolute value when no `elem` has been provided')

	} else {

		if (isRelativeValue(opts.from)===true) opts.from = relativeToAbsoluteValue(opts.from, opts.elem)
		if (isRelativeValue(opts.to)===true)   opts.to   = relativeToAbsoluteValue(opts.to, opts.elem)

	}

	opts.from = parseAbsoluteValue(opts.from)
	opts.to   = parseAbsoluteValue(opts.to)

	forEachProp(opts.props, (prop) => {

		if (isAbsoluteValue(prop.from)===false) throw new Error('Property `from` of prop must be a absolute value')
		if (isAbsoluteValue(prop.to)===false)   throw new Error('Property `from` of prop must be a absolute value')

		prop.from = parseAbsoluteValue(prop.from)
		prop.to   = parseAbsoluteValue(prop.to)

	})

	return opts

}

const update = function(opts, documentTop) {

	// 100% in pixel
	const total = opts.to.value - opts.from.value

	// Pixel already scrolled
	const current = documentTop - opts.from.value

	// Percent already scrolled
	let percentage = (current) / (total / 100)

	// Normalize percentage
	if (percentage<=0)  percentage = 0
	if (percentage>100) percentage = 100

	const values = []

	// Update each value
	forEachProp(opts.props, (prop, key) => {

		const diff = prop.from.value - prop.to.value
		const unit = prop.from.unit || prop.to.unit

		values.push({
			key   : key,
			value : (prop.from.value - (diff / 100) * percentage) + unit
		})

	})

	return values

}

const forEachProp = function(props, fn) {

	for (const key in props) fn(props[key], key, props)

}

/**
 * Adds a property with the specified name and value to a given style object.
 * @param {Object} style - Style object.
 * @param {Object} prop - Object with a key and value.
 */
const setProp = function(style, prop) {

	style.setProperty(prop.key, prop.value)

}

/**
 * Gets and sets new props when the user has scrolled and when there
 * are active instances.
 * This part get executed with every frame. Make sure it's performant as hell.
 * @param {Object} style - Style object.
 * @param {Object} prop - Object with a key and value.
 */
const loop = function(style, previousDocumentTop) {

	// Continue loop
	const repeat = () => {

		// It depends on the browser, but it turns out that closures
		// are sometimes faster than .bind or .apply.
		requestAnimationFrame(() => loop(style, previousDocumentTop))

	}

	// Get all active instances
	const activeInstances = getActiveInstances(instances)

	// Only continue when active instances available
	if (activeInstances.length===0) return repeat()

	// Use scrollTop because is's faster than getBoundingClientRect()
	const documentTop = document.scrollingElement.scrollTop

	// Only continue when documentTop has changed
	if (previousDocumentTop===documentTop) return repeat()
	else previousDocumentTop = documentTop

	// Get new props of each instance
	const newProps = activeInstances.map((instance) => instance.update(documentTop))

	// Flatten props because each update can return multiple props.
	// The second parameter of contact takes an array, so the line is identical to:
	// [].concat(['1'], ['2'], ['3'])
	const flattedProps = [].concat.apply([], newProps)

	// Compare new props with old ones and only change the newbies
	// TODO

	// Set new props
	// forEach was much slower thats why we use a simple for-loop
	for (let i = 0; i < flattedProps.length; i++) setProp(style, flattedProps[i])

	repeat()

}

/**
 * Creats a new instance.
 * @param {Object} opts
 * @returns {Object} instance
 */
export const create = function(opts) {

	// Validate options
	opts = validate(opts)

	// Store if instance is started or stopped
	let active = false

	// Returns if instance is started or stopped
	const _isActive = () => {

		return active

	}

	// Update props
	const _update = (documentTop) => {

		return update(opts, documentTop)

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