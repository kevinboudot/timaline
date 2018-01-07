# timaline

Timaline is a requestAnimationFrame based tasks scheduler.

* [To Do](#to-do)
* [Installation](#installation)
* [Features](#features)
* [Browser compatibility](#browser-compatibility)
* [Documentation](#documentation)
	* [Use](#use)
	* [Options](#options)
	* [Methods](#methods)
	* [Informations](#informations)
* [Examples](#examples)
	* [Simple task](#simple-task)
	* [Chained tasks](#chained-tasks)
	* [Shortcuts use](#shortcuts-use)
	* [Update manually](#update-manually)
	* [Destroy on the fly](#destroy-on-the-fly)

### To Do

- [x] Reduce RAF Delta impact by "prev or next" frame
- [x] Speed
- [x] Repeat
- [x] User custom loop (manually update)
- [x] Disable RAF when web page is not active
- [ ] Playback control
- [ ] RAF Delta impact reducing by average calculation
- [ ] Reduce RAF Delta aftereffect

### Installation

[![NPM](https://nodei.co/npm/Timaline.png?mini=true)](https://www.npmjs.com/package/timaline>)

### Demo

[Test timaline in your browser](https://tonicdev.com/npm/timaline)

### Features

- Set callback functions
- Wait time in millisecond
- AddClass to a node
- RemoveClass to a node
- Destroy everything
- Control speed
- Control repeat
- Update manually
- Pause when tab is not visible

### Browser compatibility

IE 10+

## Documentation

### Use

```js
var Timaline = require('Timaline');
````

### Options

You can pass 3 options to constructor, and you can combine them :

```js

var timeline = new Timaline({
	loop: false, // default : true
	speed: 0.5, // default : 1
	repeat: 3 // default : 0
});
```

### Methods

#### .wait(time)

Wait time.

##### properties

###### `time` (`Integer`)

Time to wait in millisecond

#### .set(callback)

Call your function.

##### properties

###### `callback` (`Function`)

The fonction you need to call

#### .addClass(el, classname)

AddClass shortcut.

##### properties

###### `el` (`Node`)

Your dom element

###### `classname` (`String`)

Your class name

#### .removeClass(el, classname)

RemoveClass shortcut.

##### properties

###### `el` (`Node`)

Your dom element

###### `classname` (`String`)

Your class name

#### .destroy()

Roughly destroy your timeline.

###### `speed` (`Float`)

Speed will control entire timeline (default: 1)

###### `repeat` (`Float`)

Repeat your timeline as many times as you like (default: 0)

### Informations

When you set a callback, infos are available :

```js
var delay = new Timaline();

delay
	.wait(200)
		.set(function(infos){
			console.log(infos);
		});
```

```js
var infos = {
	index: 2, // The index of your task
	keyframe: {
		forecast: 3000, // Time forecast by set wait time
		real: 2996, // Real time (with RAF Delta)
		shift:  -4 // Shift between both
	}
};
```


### Examples

#### Simple task

This example is a simple delayed task, similar as a simple window.setTimeout :

```js
var delay = new Timaline();

delay
	.wait(200)
		.set(function(infos){
			console.log(infos);
		});
```

#### Chained tasks

This example is a chained tasks :

```js
var timeline = new Timaline();

timeline
	.wait(1000)
		.set(function(infos){
			console.log('task index :' + infos.index );
		})
	.wait(2000)
		.set(function(infos){
			console.log('task index :' + infos.index );
		});
```

#### Shortcuts use

If you need, you can use shortcuts methods during your timeline :
(consider that the used classes exist in your stylesheet)

```js
var $header = document.getElementById('header');
var $container = document.getElementById('container');
var $footer = document.getElementById('footer');

var hidePage = new Timaline();

hidePage
	.set(function(infos){
		console.log('This page will disappear in a while.');
	})
	.wait(1000)
		.addClass($header, 'fadeOut')
	.wait(800)
		.removeClass($container, 'shown')
	.wait(1000)
		.addClass($footer, 'scaleOut')
	.set(function(infos){
		console.log('That\'s all folks!');
	});
```

#### Update manually

This example show how to update Timaline with your own loop :

```js
var delay = new Timaline({
	raf: false
});

function loop( timestamp ) {
	delay.update( timestamp );
	requestAnimationFrame( loop );
}

requestAnimationFrame( loop );

delay
	.wait(200)
		.set(function(infos){
			console.log(infos);
		});
```

#### Destroy on the fly

A timeline is destructs when it is finished, but sometimes you need to roughly destroy it before the end :

```js
// Create a new timeline

var timeline = new Timaline();

timeline
	.wait(3000)
	.set(function(infos){
		console.log('I\'ll never be call.');
	})
	.wait(1000)
	.set(function(infos){
		console.log('me too.');
	});

// ..and create a new one that will remove
// the first one before its end

var destroy = new Timaline();

destroy
	.wait(1000)
	.set(function(infos){
		timeline.destroy();
	});
```
