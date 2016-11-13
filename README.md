# basicScroll

Standalone parallax scrolling for mobile and desktop with CSS variables.

basicScroll allows you to change CSS variables depending on the scroll position. Use the variables directly in your CSS to animate whatever you want. Highly inspired by [skrollr](https://github.com/Prinzhorn/skrollr) and [Reactive Animations with CSS Variables](http://slides.com/davidkhourshid/reactanim#/).

## Contents

- [Demos](#demos)
- [Features](#features)
- [Requirements](#requirements)
- [Setup](#setup)
- [API](#api)
- [Instance API](#instance-api)
- [Data](#data)

## Demos

| Name | Description | Link |
|:-----------|:------------|:------------|
| Default | Includes all features. | [Try it on CodePen](http://codepen.io/electerious/pen/QGNxxx) |

## Features

- Zero dependencies
- CommonJS and AMD support
- Simple JS API
- Insane performance
- Support for mobile and desktop

## Requirements

basicScroll depends on the following browser features and APIs:

- [CSS Custom Properties](https://drafts.csswg.org/css-variables/#defining-variables)
- [requestAnimationFrame](https://www.w3.org/TR/animation-timing/#dom-windowanimationtiming-requestanimationframe)

Some of these APIs are capable of being polyfilled in older browsers. Check the linked resources above to determine if you must polyfill to achieve your desired level of browser support.

## Setup

We recommend to install basicScroll using [Bower](https://bower.io/) or [npm](https://npmjs.com).

```sh
bower install basicScroll
```

```sh
npm install basicscroll
```

Include the JS file at the end of your `body` tag…

```html
<script src="dist/basicScroll.min.js"></script>
```

…or skip the JS file and use basicScroll as a module:

```js
const basicScroll = require('basicScroll')
```

## Usage

This demo shows how to to change the opacity of an element when the user scrolls. The element starts to fade as soon as the top of the element reaches the bottom of the viewport. A opacity of `0` is reached when the middle of the element is in the middle of the viewport.

```js
const instance = basicScroll.create({
	elem  : document.querySelector('.element'),
	from  : 'top-bottom',
	to    : 'middle-middle',
	props : {
		'--opacity': {
			from : '1',
			to   : '0'
		}
	}
})

instance.start()
```

```css
.element {
	/*
	 * Use the same CSS variable as specified in out instance.
	 */
	opacity: var(--opacity);
	/*
	 * The will-change CSS property provides a way for authors to hint browsers about the kind of changes
	 * to be expected on an element, so that the browser can setup appropriate optimizations ahead of time
	 * before the element is actually changed.
	 */
	will-change: opacity;
}
```

## API

### .create(html, opts)

Creates a new basicScroll instance.

Be sure to assign your instance to a variable. Using your instance, you can…

* …start and stop the animation.
* …check if the instance is active.
* …get the current props.

Examples:

```js
const instance = basicScroll.create({
	from  : '0',
	to    : '100px',
	props : {
		'--opacity': {
			from : '0',
			to   : '1'
		}
	}
})
```

```js
const instance = basicScroll.create({
	elem  : document.querySelector('.element'),
	from  : 'top-bottom',
	to    : 'bottom-top',
	props : {
		'--translateY': {
			from   : '0',
			to     : '100%',
			timing : 'elasticOut'
		}
	}
})
```

```js
const instance = basicScroll.create({
	elem    : document.querySelector('.element'),
	from    : 'top-middle',
	to      : 'bottom-middle',
	inside  : (instance, percentage) => {
		console.log('viewport is inside from and to')
	},
	outside : (instance, percentage) => {
		console.log('viewport is outside from and to')
	}
})
```

Parameters:

- `data` `{Object}` An object of [data](#data).

Returns:

- `{Object}` The created instance.

## Instance API

Each basicScroll instance has a handful of handy functions. Below are all of them along with a short description.

### .start()

Starts to animate the instance. basicScroll will track the scroll position and adjust the [props](#props) of the instance accordingly. An update will be performed only when the scroll position has changed.

Example:

```js
instance.start()
```

### .stop()

Stops to animate the instance. All [props](#props) of the instance will keep their last value.

Example:

```js
instance.stop()
```

### .update()

Triggers an update of an instance, even when the instance is currently stopped.

Example:

```js
instance.update()
```

Returns:

- `{Array}` New props. An array of objects, each with a key and value.

### .calculate()

Converts the [start and stop position](#start-and-stop-position) of the instance to absolute values. basicScroll relies on those values to start and stop the animation at the right position. It runs the calculation once during the instance creation. `.calculate()` should be called when elements have altered their position or when the size of the site/viewport has changed.

Example:

```js
instance.calculate()
```

### .isActive()

Returns `true` when the instance is started and `false` when the instance is stopped.

Example:

```js
instance.isActive()
```

Returns:

- `{Boolean}`

### .getData()

Returns calculated data. More or less a parsed version of the [data](#data) used for the instance creation. The data might change when calling the [calculate](#calculate) function.

Example:

```js
instance.getData()
```

Returns:

- `{Object}` Parsed [data](#data).

## Data

The data object can include the following properties:

```js
{
	/*
	 * DOM Element/Node.
	 */
	elem: null,
	/*
	 * Start and stop position.
	 */
	from  : null,
 	to    : null,
	/*
	 * Callback functions.
	 */
	inside  : (instance, percentage) => {},
	outside : (instance, percentage) => {},
	/*
	 * Props.
	 */
	props: {
		/*
		 * Property name / CSS Custom Properties.
		 */
		'--name': {
			/*
			 * Start and end values.
			 */
			from : null,
			to   : null,
			/*
			 * Animation timing.
			 */
			timing: 'ease'
		}
	}
}
```

### DOM Element/Node

Type: `Node` Default: `null` Optional: `true`

A DOM Element/Node.

The position and size of the element will be used to convert the [start and stop position](#start-and-stop-position) to absolute values. How else is basicScroll supposed to know when to start and stop an animation with relative values?

You can skip the property when using absolute values.

Example:

```js
{
	elem: document.querySelector('.element')
	/* ... */
}
```

### Start and stop position

Type: `Integer|String` Default: `null` Optional: `false`

basicScroll starts to animate the [props](#props) when the scroll position is above `from` and below `to`. Absolute and relative values are allowed. Relative values require a [DOM Element/Node](#dom-elementnode).

Examples:

```js
{
	/* ... */
	from : '0px',
	to   : '100px',
	/* ... */
}
```

```js
{
	/* ... */
	from : 'top-middle',
	to   : 'bottom-middle',
	/* ... */
}
```

### Callback functions

Type: `Function` Default: `() => {}` Optional: `true`

- The `inside` callback executes when the user scrolls and the viewport is within the given [start and stop position](#start-and-stop-position).
- The `outside` callback executes when the user scrolls and the viewport is outside the given [start and stop position](#start-and-stop-position).

Both callbacks receive the current instance and a percentage:

- < 0% percent = Scroll position is below `from`
- = 0% percent = Scroll position is `from`
- = 100% percent = Scroll position is `to`
- > 100% percent = Scroll position is above `from`

Example:

```js
{
	/* ... */
	inside  : (instance, percentage) => {},
	outside : (instance, percentage) => {},
	/* ... */
}
```

### Props

Type: `Object` Default: `{}` Optional: `true`

Values to animate when the scroll position changes.

Each prop of the object represents a CSS property or CSS Custom Property (CSS variables). Custom CSS properties always start with two dashes. A prop with the name `--name` is accessible with `var(--name)` in CSS.

More about [CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_variables).

Example:

```js
{
	/* ... */
	props: {
		'--one-variable': { /* ... */ },
		'--another-variable': { /* ... */ }
	}
}
```

### Start and end values

Type: `Integer|String` Default: `null` Optional: `false`

Works with all kinds of units. basicScroll uses the unit of `to` when `from` has no unit.

Examples:

```js
'--name': {
	/* ... */
	from : '0',
	to   : '100px',
	/* ... */
}
```

```js
'--name': {
	/* ... */
	from : '50%',
	to   : '100%',
	/* ... */
}
```

```js
'--name': {
	/* ... */
	from : '0',
	to   : '1turn',
	/* ... */
}
```

### Animation timing

Type: `String|Function` Default: `ease` Optional: `true`

A known timing or a custom function. Easing functions get just one argument, which is a value between 0 and 1 (the percentage of how much of the animation is done). The function should return a value between 0 and 1 as well, but for some timings a value less than 0 or greater than 1 is just fine.

Known timings: `backInOut`, `backIn`, `backOut`, `bounceInOut`, `bounceIn`, `bounceOut`, `circInOut`, `circIn`, `circOut`, `cubicInOut`, `cubicIn`, `cubicOut`, `elasticInOut`, `elasticIn`, `elasticOut`, `expoInOut`, `expoIn`, `expoOut`, `linear`, `quadInOut`, `quadIn`, `quadOut`, `quartInOut`, `quartIn`, `quartOut`, `quintInOut`, `quintIn`, `quintOut`, `sineInOut`, `sineIn`, `sineOut`

Examples:

```js
'--name': {
	/* ... */
	timing: 'circInOut'
}
```

```js
'--name': {
	/* ... */
	timing: (t) => t * t
}
```