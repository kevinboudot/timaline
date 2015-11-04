'use strict';


// Require Scheduler

var Scheduler = require('./scheduler.js');


// Create Timaline

function Timaline(options) {

	options = options ? options : {};

	this.options = {
		speed: options.speed ? options.speed : 1,
		repeat: options.repeat ? options.repeat : 0
	};

	this.delay = 0;
	this.scheduler = new Scheduler(this.options);
}

/**
 * set() call function
 *
 * @param {function} callback
 */

Timaline.prototype.set = function(callback){
	this.scheduler.add(callback, this.delay);
	return this;
};


/**
 * wait() add delay
 *
 * @param {integer} delay
 */

Timaline.prototype.wait = function(delay){
	this.delay += (delay * this.options.speed);
	return this;
};


/**
 * addClass() add class to a given node
 *
 * @param {node} el
 * @param {string} className
 */

Timaline.prototype.addClass = function(el, className){
	this.set(function(){
		var classList = el.classList || el[0].classList;
		classList.add(className);
	});
	return this;
};


/**
 * removeClass() remove class to a given node
 *
 * @param {node} el
 * @param {string} className
 */

Timaline.prototype.removeClass = function(el, className){
	this.set(function(){
		var classList = el.classList || el[0].classList;
		classList.remove(className);
	});
	return this;
};


/**
 * destroy() cancel remove all scheduled tasks
 */

Timaline.prototype.destroy = function(){
	this.scheduler.destroy();
};


// Wrap as a module

module.exports = Timaline;
