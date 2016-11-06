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
| Default | Includes all features. | [Demo](demos/default.html) |

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

This demo shows how to to change the opacity of an element when the user scrolls. The element starts to fade as soon as the top of the element reaches the bottom of the viewport. A opacity of `0` is reached when the middle of the element is in the middle on the viewport.

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
	/* Use the same CSS variable as specified in out instance. */
	opacity: var(--opacity);
	/* The will-change CSS property provides a way for authors to hint browsers about the kind of changes
	 * to be expected on an element, so that the browser can setup appropriate optimizations ahead of time
	 * before the element is actually changed. */
	will-change: opacity;
}
```

## API

### .create(html, opts)

Creates a new basicScroll instance.

Be sure to assign your instance to a variable. Using your instance, you can…

* …start and stop the animation.
* …check if the instance is active.
* …get the current properties.

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

Parameters:

- `data` `{Object}` An object of [data](#data).

Returns:

- `{Object}` The created instance.

## Instance API

Each basicScroll instance has a handful of handy functions. Below are all of them along with a short description.

### .start()

Start to animate the instance. basicScroll will track the current scroll position and adjust the props of the instance accordingly.

Examples:

```js
instance.start()
```

### .stop()

Stop to animate the instance. All props of the instance will keep their last value.

Examples:

```js
instance.stop()
```