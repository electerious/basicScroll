import parseUnit from 'parse-unit'
import eases from 'eases'

const instances = []
const isBrowser = typeof window !== 'undefined'

/**
 * Debounces a function that will be triggered many times.
 * @param {Function} fn
 * @param {Number} duration
 * @returns {Function}
 */
const debounce = function(fn, duration) {

	let timeout = null

	return (...args) => {

		clearTimeout(timeout)

		timeout = setTimeout(() => fn(...args), duration)

	}

}

/**
 * Returns all active instances from an array.
 * @param {Array} instances
 * @returns {Array} instances - Active instances.
 */
const getActiveInstances = function(instances) {

	return instances.filter((instance) => instance != null && instance.isActive())

}

/**
 * Returns all tracked instances from an array.
 * @param {Array} instances
 * @returns {Array} instances - Tracked instances.
 */
const getTrackedInstances = function(instances) {

	return instances.filter((instance) => instance != null && instance.getData().track)

}


/**
 * Returns the number of scrolled pixels.
 * @returns {Number} scrollTop
 */
const getScrollTop = function() {

	// Use scrollTop because it's faster than getBoundingClientRect()
	return (document.scrollingElement || document.documentElement).scrollTop

}

/**
 * Returns the height of the viewport.
 * @returns {Number} viewportHeight
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

	return isNaN(parseUnit(value)[0]) === false

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

	return String(value).match(/^[a-z]+-[a-z]+$/) !== null

}

/**
 * Returns the property that should be used according to direct.
 * @param {Boolean|Node} direct
 * @param {Object} properties
 * @returns {*}
 */
const mapDirectToProperty = function(direct, properties) {

	if (direct === true) return properties.elem
	if (direct instanceof HTMLElement === true) return properties.direct

	return properties.global

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

	if (viewportAnchor === 'top') y -= 0
	if (viewportAnchor === 'middle') y -= viewportHeight / 2
	if (viewportAnchor === 'bottom') y -= viewportHeight

	if (elemAnchor === 'top') y += (elemSize.top + scrollTop)
	if (elemAnchor === 'middle') y += (elemSize.top + scrollTop) + elemSize.height / 2
	if (elemAnchor === 'bottom') y += (elemSize.top + scrollTop) + elemSize.height

	return `${ y }px`

}

/**
 * Validates data and sets defaults for undefined properties.
 * @param {?Object} data
 * @returns {Object} data - Validated data.
 */
const validate = function(data = {}) {

	// Copy root object to avoid changes by reference
	data = Object.assign({}, data)

	if (data.inside == null) data.inside = () => {}
	if (data.outside == null) data.outside = () => {}
	if (data.direct == null) data.direct = false
	if (data.track == null) data.track = true
	if (data.props == null) data.props = {}

	if (data.from == null) throw new Error('Missing property `from`')
	if (data.to == null) throw new Error('Missing property `to`')
	if (typeof data.inside !== 'function') throw new Error('Property `inside` must be undefined or a function')
	if (typeof data.outside !== 'function') throw new Error('Property `outside` must be undefined or a function')
	if (typeof data.direct !== 'boolean' && data.direct instanceof HTMLElement === false) throw new Error('Property `direct` must be undefined, a boolean or a DOM element/node')
	if (data.direct === true && data.elem == null) throw new Error('Property `elem` is required when `direct` is true')
	if (typeof data.track !== 'boolean') throw new Error('Property `track` must be undefined or a boolean')
	if (typeof data.props !== 'object') throw new Error('Property `props` must be undefined or an object')

	if (data.elem == null) {

		if (isAbsoluteValue(data.from) === false) throw new Error('Property `from` must be a absolute value when no `elem` has been provided')
		if (isAbsoluteValue(data.to) === false) throw new Error('Property `to` must be a absolute value when no `elem` has been provided')

	} else {

		if (isRelativeValue(data.from) === true) data.from = relativeToAbsoluteValue(data.from, data.elem)
		if (isRelativeValue(data.to) === true) data.to = relativeToAbsoluteValue(data.to, data.elem)

	}

	data.from = parseAbsoluteValue(data.from)
	data.to = parseAbsoluteValue(data.to)

	// Create a new props object to avoid changes by reference
	data.props = Object.keys(data.props).reduce((acc, key) => {

		// Copy prop object to avoid changes by reference
		const prop = Object.assign({}, data.props[key])

		if (isAbsoluteValue(prop.from) === false) throw new Error('Property `from` of prop must be a absolute value')
		if (isAbsoluteValue(prop.to) === false) throw new Error('Property `from` of prop must be a absolute value')

		prop.from = parseAbsoluteValue(prop.from)
		prop.to = parseAbsoluteValue(prop.to)

		if (prop.timing == null) prop.timing = eases['linear']

		if (typeof prop.timing !== 'string' && typeof prop.timing !== 'function') throw new Error('Property `timing` of prop must be undefined, a string or a function')

		if (typeof prop.timing === 'string' && eases[prop.timing] == null) throw new Error('Unknown timing for property `timing` of prop')
		if (typeof prop.timing === 'string') prop.timing = eases[prop.timing]

		acc[key] = prop

		return acc

	}, {})

	return data

}

/**
 * Calculates the props of an instance.
 * @param {Object} instance
 * @param {?Integer} scrollTop - Pixels scrolled in document.
 * @returns {Object} Calculated props and the element to apply styles to.
 */
const getProps = function(instance, scrollTop = getScrollTop()) {

	const data = instance.getData()

	// 100% in pixel
	const total = data.to.value - data.from.value

	// Pixel scrolled
	const current = scrollTop - data.from.value

	// Percent scrolled
	const precisePercentage = current / (total / 100)
	const normalizedPercentage = Math.min(Math.max(precisePercentage, 0), 100)

	// Get the element that should be used according to direct
	const elem = mapDirectToProperty(data.direct, {
		global: document.documentElement,
		elem: data.elem,
		direct: data.direct
	})

	// Generate an object with all new props
	const props = Object.keys(data.props).reduce((acc, key) => {

		const prop = data.props[key]

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
		const rounded = Math.round(value * 10000) / 10000

		acc[key] = rounded + unit

		return acc

	}, {})

	// Use precise percentage to check if the viewport is between from and to.
	// Would always return true when using the normalized percentage.
	const isInside = (precisePercentage >= 0 && precisePercentage <= 100)
	const isOutside = (precisePercentage < 0 || precisePercentage > 100)

	// Execute callbacks
	if (isInside === true) data.inside(instance, precisePercentage, props)
	if (isOutside === true) data.outside(instance, precisePercentage, props)

	return {
		elem,
		props
	}

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
 * Adds properties to a given style object.
 * @param {Node} elem - Styles will be applied to this element.
 * @param {Object} props - Object of props.
 */
const setProps = function(elem, props) {

	Object.keys(props).forEach((key) => setProp(elem, {
		key: key,
		value: props[key]
	}))

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
	if (activeInstances.length === 0) return repeat()

	const scrollTop = getScrollTop()

	// Only continue when scrollTop has changed
	if (previousScrollTop === scrollTop) return repeat()
	else previousScrollTop = scrollTop

	// Get and set new props of each instance
	activeInstances
		.map((instance) => getProps(instance, scrollTop))
		.forEach(({ elem, props }) => setProps(elem, props))

	repeat()

}

/**
 * Creates a new instance.
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

		// Get new props
		const { elem, props } = getProps(instance)

		// Set new props
		setProps(elem, props)

		return props

	}

	// Starts to animate
	const _start = () => {

		active = true

	}

	// Stops to animate
	const _stop = () => {

		active = false

	}

	// Destroys the instance
	const _destroy = () => {

		// Replace instance instead of deleting the item to avoid
		// that the index of other instances changes.
		instances[index] = undefined

	}

	// Assign instance to a variable so the instance can be used
	// elsewhere in the current function.
	const instance = {
		isActive: _isActive,
		getData: _getData,
		calculate: _calculate,
		update: _update,
		start: _start,
		stop: _stop,
		destroy: _destroy
	}

	// Store instance in global array and save the index
	const index = instances.push(instance) - 1

	// Calculate data for the first time
	instance.calculate()

	return instance

}

// Only run basicScroll when executed in a browser environment
if (isBrowser === true) {

	// Start to loop
	loop()

	// Recalculate and update instances when the window size changes
	window.addEventListener('resize', debounce(() => {

		// Get all tracked instances
		const trackedInstances = getTrackedInstances(instances)

		trackedInstances.forEach((instance) => {
			instance.calculate()
			instance.update()
		})

	}, 50))

} else {

	console.warn('basicScroll is not executing because you are using it in an environment without a `window` object')

}