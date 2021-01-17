# basicScroll

[![Donate via PayPal](https://img.shields.io/badge/paypal-donate-009cde.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=CYKBESW577YWE)

Standalone parallax scrolling for mobile and desktop with CSS variables.

basicScroll allows you to change CSS variables depending on the scroll position. Use the variables directly in your CSS to animate whatever you want. Highly inspired by [skrollr](https://github.com/Prinzhorn/skrollr) and [Reactive Animations with CSS Variables](http://slides.com/davidkhourshid/reactanim#/).

## Contents

- [Demos](#demos)
- [Tutorials](#tutorials)
- [Features](#features)
- [Requirements](#requirements)
- [Setup](#setup)
- [API](#api)
- [Instance API](#instance-api)
- [Data](#data)
- [Related](#related)
- [Tips](#tips)

## Demos

| Name | Description | Link | Author |
|:-----------|:------------|:------------|:------------|
| Default | Includes most features | [Try it on CodePen](http://codepen.io/electerious/pen/QGNxxx) |
| Callback | Animate properties in JS via callbacks | [Try it on CodePen](https://codepen.io/electerious/pen/goZRBv) |
| Parallax scene | A composition of multiple, moving layers | [Try it on CodePen](http://codepen.io/electerious/pen/gLLozQ) | [@electerious](https://twitter.com/electerious) |
| Rolling eyes | Custom element to track scrolling | [Try it on CodePen](https://codepen.io/electerious/pen/MZJZxm) | [@electerious](https://twitter.com/electerious) |
| Headline explosion | Animated letters | [Try it on CodePen](https://codepen.io/electerious/pen/EQzxxJ) | [@electerious](https://twitter.com/electerious) |
| Scroll and morph | Morph text using CSS clip-path | [Try it on CodePen](https://codepen.io/ainalem/pen/jZzxrP) | [@mikaelainalem](https://twitter.com/mikaelainalem) |
| Parallax with JS | Several examples and a debug mode | [Try it on CodePen](https://codepen.io/animaticss/pen/rNBJwmq) | [AnimatiCSS](https://www.youtube.com/channel/UC73Tk5wfEBh67Vm7gM_zaAw) |

## Tutorials

| Name | Link |
|:-----------|:------------|
| 📃 Parallax scrolling with JS controlled CSS variables | [Read it on Medium](https://medium.com/@electerious/parallax-scrolling-with-js-controlled-css-variables-63cfe96820c7) |
| 🎬 Apple-like scroll animations | [Watch it on YouTube](https://www.youtube.com/watch?v=hPd1srSWDU4) |
| 🎬 Parallax effect tutorial (🇪🇸) | [Watch it on YouTube](https://www.youtube.com/watch?v=QeRg4t3I2zc) |

## Features

- Framework independent
- Insane performance
- Support for mobile and desktop
- CommonJS and AMD support
- Simple JS API

## Requirements

basicScroll depends on the following browser features and APIs:

- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Object.assign](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
- [window.requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)

Some of these APIs are capable of being polyfilled in older browsers. Check the linked resources above to determine if you must polyfill to achieve your desired level of browser support.

## Setup

We recommend installing basicScroll using [npm](https://npmjs.com) or [yarn](https://yarnpkg.com).

```sh
npm install basicscroll
```

```sh
yarn add basicscroll
```

Include the JS file at the end of your `body` tag…

```html
<script src="dist/basicScroll.min.js"></script>
```

…or skip the JS file and use basicScroll as a module:

```js
const basicScroll = require('basicscroll')
```

```js
import * as basicScroll from 'basicscroll'
```

## Usage

This demo shows how to to change the opacity of an element when the user scrolls. The element starts to fade as soon as the top of the element reaches the bottom of the viewport. A opacity of `.99` is reached when the middle of the element is in the middle of the viewport.

Tip: Animating from `.01` to `.99` avoids the repaints that normally occur when the element changes from fully transparent to translucent and from translucent to fully visible.

```js
const instance = basicScroll.create({
	elem: document.querySelector('.element'),
	from: 'top-bottom',
	to: 'middle-middle',
	props: {
		'--opacity': {
			from: .01,
			to: .99
		}
	}
})

instance.start()
```

```css
.element {
	/*
	 * Use the same CSS variable as specified in our instance.
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
* …recalculate the props when the window size changes.

Examples:

```js
const instance = basicScroll.create({
	from: '0',
	to: '100px',
	props: {
		'--opacity': {
			from: 0,
			to: 1
		}
	}
})
```

```js
const instance = basicScroll.create({
	elem: document.querySelector('.element'),
	from: 'top-bottom',
	to: 'bottom-top',
	props: {
		'--translateY': {
			from: '0',
			to: '100%',
			timing: 'elasticOut'
		}
	}
})
```

```js
const instance = basicScroll.create({
	elem: document.querySelector('.element'),
	from: 'top-middle',
	to: 'bottom-middle',
	inside: (instance, percentage, props) => {
		console.log('viewport is inside from and to')
	},
	outside: (instance, percentage, props) => {
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

### .destroy()

Destroys the instance. Should be called when the instance is no longer needed. All [props](#props) of the instance will keep their last value.

Example:

```js
instance.destroy()
```

### .update()

Triggers an update of an instance, even when the instance is currently stopped.

Example:

```js
const props = instance.update()
```

Returns:

- `{Object}` Applied props.

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
	 * DOM element/node.
	 */
	elem: null,
	/*
	 * Start and stop position.
	 */
	from: null,
 	to: null,
	/*
	 * Direct mode.
	 */
	direct: false,
	/*
	 * Track window size changes.
	 */
	track: true,
	/*
	 * Callback functions.
	 */
	inside: (instance, percentage, props) => {},
	outside: (instance, percentage, props) => {},
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
			from: null,
			to: null,
			/*
			 * Animation timing.
			 */
			timing: 'ease'
		}
	}
}
```

### DOM element/node

Type: `Node` Default: `null` Optional: `true`

A DOM element/node.

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

basicScroll starts to animate the [props](#props) when the scroll position is above `from` and below `to`. Absolute and relative values are allowed.

Relative values require a [DOM element/node](#dom-elementnode). The first part of the value describes the element position, the last part describes the viewport position: `<element>-<viewport>`. `middle-bottom` in `from` specifies that the animation starts when the middle of the element reaches the bottom of the viewport.

Known relative values: `top-top`, `top-middle`, `top-bottom`, `middle-top`, `middle-middle`, `middle-bottom`, `bottom-top`, `bottom-middle`, `bottom-bottom`

It's possible to track a custom anchor when you want to animate for [a specific viewport height](https://github.com/electerious/basicScroll/issues/26#issuecomment-449130809) or when you need to [start and end with an offset](https://github.com/electerious/basicScroll/issues/17#issuecomment-449134650).

Examples:

```js
{
	/* ... */
	from: '0px',
	to: '100px',
	/* ... */
}
```

```js
{
	/* ... */
	from: 0,
	to: 360,
	/* ... */
}
```

```js
{
	/* ... */
	from: 'top-middle',
	to: 'bottom-middle',
	/* ... */
}
```

### Direct mode

Type: `Boolean|Node` Default: `false` Optional: `true`

basicScroll applies all [props](#props) globally by default. This way you can use variables everywhere in your CSS, even when the instance tracks just one element. Set `direct` to `true` or to a DOM element/node to apply all [props](#props) directly to the [DOM element/node](#dom-elementnode) or to the DOM element/node you have specified. This also allows you to animate CSS properties, not just CSS variables.

- `false`: Apply props globally (default)
- `true`: Apply props to the [DOM element/node](#dom-elementnode)
- `Node`: Apply props to a DOM element/node of your choice

Examples:

```html
<!-- direct: false -->
<html style="--name: 0;">
	<div class="trackedElem"></div>
	<div class="anotherElem"></div>
</html>
```

```html
<!-- direct: true -->
<html>
	<div class="trackedElem" style="--name: 0;"></div>
	<div class="anotherElem"></div>
</html>
```

```html
<!-- direct: document.querySelector('.anotherElem') -->
<html>
	<div class="trackedElem"></div>
	<div class="anotherElem" style="--name: 0;"></div>
</html>
```

### Track window size changes

Type: `Boolean` Default: `true` Optional: `true`

basicScroll automatically recalculates and updates instances when the size of the window changes. You can disable the tracking for each instance individually when you want to take care of it by yourself.

Note: basicScroll only tracks the window size. You still must recalculate and update your instances manually when you modify your site. Each modification that changes the layout of the page should trigger such an update in your code.

Example:

```js
const instance = basicScroll.create({
	elem: document.querySelector('.element'),
	from: 'top-bottom',
	to: 'bottom-top',
	track: false,
	props: {
		'--opacity': {
			from: 0,
			to: 1
		}
	}
})

// Recalculate and update your instance manually when the tracking is disabled.
// Debounce this function in production to avoid unnecessary calculations.
window.onresize = function() {

	instance.calculate()
	instance.update()

}
```

### Callback functions

Type: `Function` Default: `() => {}` Optional: `true`

- The `inside` callback executes when the user scrolls and the viewport is within the given [start and stop position](#start-and-stop-position).
- The `outside` callback executes when the user scrolls and the viewport is outside the given [start and stop position](#start-and-stop-position).

Both callbacks receive the current instance, a percentage and the calculated properties:

- `< 0%` percent = Scroll position is below `from`
- `= 0%` percent = Scroll position is `from`
- `= 100%` percent = Scroll position is `to`
- `> 100%` percent = Scroll position is above `from`

Example:

```js
{
	/* ... */
	inside: (instance, percentage, props) => {},
	outside: (instance, percentage, props) => {},
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
	from: '0',
	to: '100px',
	/* ... */
}
```

```js
'--name': {
	/* ... */
	from: '50%',
	to: '100%',
	/* ... */
}
```

```js
'--name': {
	/* ... */
	from: '0',
	to: '1turn',
	/* ... */
}
```

### Animation timing

Type: `String|Function` Default: `linear` Optional: `true`

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

## Related

- [ngx-basicscroll](https://github.com/theunreal/ngx-basicscroll) - Angular wrapper for basicScroll
- [react-basic-scroll](https://github.com/liorbd/react-basic-scroll) - React wrapper for basicScroll

## Tips

- Only animate `transform` and `opacity` and use `will-change` to [hint browsers about the kind of changes](https://developer.mozilla.org/de/docs/Web/CSS/will-change). This way the browser can setup appropriate optimizations ahead of time before the element is actually changed.
- Keep the amount of instances low. More instances means more checks, calculations and style changes.
- Don't animate everything at once and don't animate too many properties. Browsers don't like this.
- Smooth animations by adding a short transition to the element: `transform: translateY(var(--ty)); transition: transform .1s`.
- basicScroll applies all [props](#props) globally by default. Try to reuse variables across elements instead of creating more instances.