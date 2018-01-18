import parseUnit from 'parse-unit'
import clonedeep from 'lodash.clonedeep'
import eases from 'eases'

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
 * Returns the number of scrolled pixels.
 * @returns {Integer} scrollTop
 */
const getScrollTop = function() {

	// Use scrollTop because is's faster than getBoundingClientRect()
	return (document.scrollingElement || document.documentElement).scrollTop

}

/**
 * Returns the height of the viewport.
 * @returns {Integer} viewportHeight
 */
const getViewportHeight = function() {

	return (window.innerHeight || window.outerHeight)

}

/**
 * Checks if a value is absolute.
 * An absolute value must have a value that's not NaN.
 * @param {String|Integer} value
 * @returns {Boolean} isAbsolute
 */
const isAbsoluteValue = function(value) {

	return isNaN(parseUnit(value)[0])===false

}

/**
 * Parses an absolute value.
 * @param {String|Integer} value
 * @returns {Object} value - Parsed value.
 */
const parseAbsoluteValue = function(value) {

	const parsedValue = parseUnit(value)

	return {
		value: parsedValue[0],
		unit: parsedValue[1]
	}

}

/**
 * Checks if a value is relative.
 * A relative value must start and end with [a-z] and needs a '-' in the middle.
 * @param {String|Integer} value
 * @returns {Boolean} isRelative
 */
const isRelativeValue = function(value) {

	return String(value).match(/^[a-z]+-[a-z]+$/)!==null

}

/**
 * Converts a relative value to an absolute value.
 * @param {String} value
 * @param {Node} elem - Anchor of the relative value.
 * @param {?Integer} scrollTop - Pixels scrolled in document.
 * @param {?Integer} viewportHeight - Height of the viewport.
 * @returns {String} value - Absolute value.
 */
const relativeToAbsoluteValue = function(value, elem, scrollTop = getScrollTop(), viewportHeight = getViewportHeight()) {

	const elemSize = elem.getBoundingClientRect()

	const elemAnchor = value.match(/^[a-z]+/)[0]
	const viewportAnchor = value.match(/[a-z]+$/)[0]

	let y = 0

	if (viewportAnchor==='top') y -= 0
	if (viewportAnchor==='middle') y -= viewportHeight / 2
	if (viewportAnchor==='bottom') y -= viewportHeight

	if (elemAnchor==='top') y += (elemSize.top + scrollTop)
	if (elemAnchor==='middle') y += (elemSize.top + scrollTop) + elemSize.height / 2
	if (elemAnchor==='bottom') y += (elemSize.top + scrollTop) + elemSize.height

	return `${ y }px`

}

/**
 * Validates data and sets defaults for undefined properties.
 * @param {?Object} data
 * @returns {Object} data - Validated data.
 */
const validate = function(data = {}) {

	// Deep copy object to avoid changes by reference
	data = clonedeep(data)

	if (data.from==null) throw new Error('Missing property `from`')
	if (data.to==null) throw new Error('Missing property `to`')

	if (data.inside==null) data.inside = () => {}
	if (data.outside==null) data.outside = () => {}

	if (typeof data.inside!=='function') throw new Error('Property `inside` must be a function')
	if (typeof data.outside!=='function') throw new Error('Property `outside` must be a function')

	if (data.elem==null) {

		if (isAbsoluteValue(data.from)===false) throw new Error('Property `from` must be a absolute value when no `elem` has been provided')
		if (isAbsoluteValue(data.to)===false) throw new Error('Property `to` must be a absolute value when no `elem` has been provided')

	} else {

		if (isRelativeValue(data.from)===true) data.from = relativeToAbsoluteValue(data.from, data.elem)
		if (isRelativeValue(data.to)===true) data.to = relativeToAbsoluteValue(data.to, data.elem)

	}

	data.from = parseAbsoluteValue(data.from)
	data.to = parseAbsoluteValue(data.to)

	if (data.props==null) data.props = {}

	Object.keys(data.props).forEach((key) => {

		const prop = data.props[key]

		if (isAbsoluteValue(prop.from)===false) throw new Error('Property `from` of prop must be a absolute value')
		if (isAbsoluteValue(prop.to)===false) throw new Error('Property `from` of prop must be a absolute value')

		prop.from = parseAbsoluteValue(prop.from)
		prop.to = parseAbsoluteValue(prop.to)

		if (typeof prop.timing==='string' && eases[prop.timing]==null) throw new Error('Unknown timing for property `timing` of prop')

		if (prop.timing==null) prop.timing = eases['linear']
		if (typeof prop.timing==='string') prop.timing = eases[prop.timing]

		if (prop.direct===true && data.elem==null) throw new Error('Property `elem` required when `direct` is true')

		if (prop.direct!==true) prop.direct = false

	})

	return data

}

/**
 * Updates instance props and their values.
 * @param {Object} instance
 * @param {?Integer} scrollTop - Pixels scrolled in document.
 * @returns {Array} props - Updated props.
 */
const update = function(instance, scrollTop = getScrollTop()) {

	const data = instance.getData()

	// 100% in pixel
	const total = data.to.value - data.from.value

	// Pixel scrolled
	const current = scrollTop - data.from.value

	// Percent scrolled
	const precisePercentage = current / (total / 100)
	const normalizedPercentage = Math.min(Math.max(precisePercentage, 0), 100)

	// Generate an array with all updated props
	const props = Object.keys(data.props).map((key) => {

		const prop = data.props[key]

		// Apply styles directly to element when direct is true.
		// Apply them globally when direct is false.
		const elem = prop.direct===true ? data.elem : document.documentElement

		// Use the unit of from OR to. It's valid to animate from '0' to '100px' and
		// '0' should be treated as 'px', too. Unit will be an empty string when no unit given.
		const unit = prop.from.unit || prop.to.unit

		// The value that should be interpolated
		const diff = prop.from.value - prop.to.value

		// All easing functions only remap a time value, and all have the same signature.
		// Typically a value between 0 and 1, and it returns a new float that has been eased.
		const time = prop.timing(normalizedPercentage / 100)

		const value = prop.from.value - diff * time

		// Round to avoid unprecise values.
		// The precision of floating point computations is only as precise as the precision it uses.
		// http://stackoverflow.com/questions/588004/is-floating-point-math-broken
		const rounded = Math.round(value * 100) / 100

		return {
			elem: elem,
			key: key,
			value: rounded + unit
		}

	})

	// Use precise percentage to check if the viewport is between from and to.
	// Would always return true when using the normalized percentage.
	const isInside = (precisePercentage>=0 && precisePercentage<=100)
	const isOutside = (precisePercentage<0 || precisePercentage>100)

	// Execute callbacks
	if (isInside===true) data.inside(instance, precisePercentage, props)
	if (isOutside===true) data.outside(instance, precisePercentage, props)

	return props

}

/**
 * Adds a property with the specified name and value to a given style object.
 * @param {Node} elem - Styles will be applied to this element.
 * @param {Object} prop - Object with a key and value.
 */
const setProp = function(elem, prop) {

	elem.style.setProperty(prop.key, prop.value)

}

/**
 * Gets and sets new props when the user has scrolled and when there are active instances.
 * This part get executed with every frame. Make sure it's performant as hell.
 * @param {Object} style - Style object.
 * @param {?Integer} previousScrollTop
 * @returns {?*}
 */
const loop = function(style, previousScrollTop) {

	// Continue loop
	const repeat = () => {

		// It depends on the browser, but it turns out that closures
		// are sometimes faster than .bind or .apply.
		requestAnimationFrame(() => loop(style, previousScrollTop))

	}

	// Get all active instances
	const activeInstances = getActiveInstances(instances)

	// Only continue when active instances available
	if (activeInstances.length===0) return repeat()

	const scrollTop = getScrollTop()

	// Only continue when scrollTop has changed
	if (previousScrollTop===scrollTop) return repeat()
	else previousScrollTop = scrollTop

	// Get new props of each instance
	const newProps = activeInstances.map((instance) => update(instance, scrollTop))

	// Flatten props because each update can return multiple props
	const flattedProps = [].concat(...newProps)

	// Set new props
	flattedProps.forEach((prop) => setProp(prop.elem, prop))

	repeat()

}

/**
 * Creats a new instance.
 * @param {Object} data
 * @returns {Object} instance
 */
export const create = function(data) {

	// Store the parsed data
	let _data = null

	// Store if instance is started or stopped
	let active = false

	// Returns if instance is started or stopped
	const _isActive = () => {

		return active

	}

	// Returns the parsed and calculated data
	const _getData = function() {

		return _data

	}

	// Parses and calculates data
	const _calculate = function() {

		_data = validate(data)

	}

	// Update props
	const _update = () => {

		// Get new props of each instance
		const newProps = update(instance)

		// Set new props
		newProps.forEach((prop) => setProp(prop.elem, prop))

		return newProps

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
		isActive: _isActive,
		getData: _getData,
		calculate: _calculate,
		update: _update,
		start: _start,
		stop: _stop
	}

	// Store instance in global array
	instances.push(instance)

	// Calculate data for the first time
	instance.calculate()

	return instance

}

// Start to loop
loop()