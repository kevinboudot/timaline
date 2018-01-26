'use strict'


// Require Ticker

const Ticker = require( './ticker.js' )


// Create Scheduler

const Scheduler = function( options ) {
	this.options = options
	this.infos = {}
	this.isProcessing = false
	this.tasks = {
		queue: [],
		check: []
	}
	this.taskCount = 0
	this.queueCount = 0
	this.bound = null
	Ticker.setOptions( this.options )
}


// Public


/**
 * add() add a function to the tasks queue
 *
 * @param {Function} callback
 * @return {Integer} delay (time in millisecond)
 */

Scheduler.prototype.add = function( callback, delay ) {

	this.tasks.queue.push( {
		callback: callback,
		delay: delay,
		index: this.taskCount++
	} )

	if ( !this.isProcessing ) {
		this.bound = this._tick.bind( this )
		Ticker.start( this.bound )
		this.isProcessing = true
	}

}

/**
 * update() update with custom loop
 */

Scheduler.prototype.update = function( time ) {
	Ticker.update( time )
}


/**
 * destroy() remove all scheduled tasks
 */

Scheduler.prototype.destroy = function() {

	this.tasks.queue = []

	if ( this.isProcessing ) {
		Ticker.end( this.bound )
		this.isProcessing = false
	}

}


// Private

/**
 * _onComplete() is called when timeline is finished
 *
 */

Scheduler.prototype._onComplete = function() {

	if ( this.options.repeat !== this.queueCount ) {

		let i = this.tasks.check.length

		while ( i-- ) {

			const task = this.tasks.check[ i ]
			task.startTime = null
			this.tasks.queue.push( task )
		}

		this.queueCount++

	} else {
		this.destroy()
	}

}



/**
 * _tick() is the RAF Handler
 */

Scheduler.prototype._tick = function( currentTime ) {

	// Save Timing infos

	this._saveInfos( currentTime )

	// Loop queue

	if ( this.infos.delta ) {
		this._loopQueue( currentTime )
	}

}


/**
 * _saveInfos() save RAF Timing infos
 *
 * @return {Integer} currentTime (time in millisecond)
 */

Scheduler.prototype._saveInfos = function( currentTime ) {

	if ( !this.infos.last ) {
		this.infos.last = currentTime
	} else {
		this.infos.delta = currentTime - this.infos.last
		this.infos.last = currentTime
		this.infos.fps = 1 / ( this.infos.delta / 1000 )
	}

}


/**
 * _loopQueue() loop through queue to check if task
 * need to be processed
 *
 * @return {Integer} currentTime (time in millisecond)
 */

Scheduler.prototype._loopQueue = function( currentTime ) {

	let i = this.tasks.queue.length

	while ( i-- ) {

		// Get current task

		const task = this.tasks.queue[ i ]

		if ( task ) {

			// Save task start time if not exist

			if ( !task.startTime ) {
				task.startTime = currentTime
			}

			// Predict task end time by delay

			task.endTime = task.startTime + task.delay

			// get adjusted endTime because of delta difference

			task.adjustedTime = ( task.endTime - ( this.infos.delta / 2 ) )

			// If Delay Time is elapsed

			if ( currentTime >= task.adjustedTime ) {

				// Save Timeshift after adjustment

				task.timeShift = currentTime - task.endTime

				this._processTask( task )

			}

		}

	}

}


/**
 * _prepareResponse() prepare callback response
 *
 * @return {Object} task
 */

Scheduler.prototype._prepareResponse = function( task ) {

	const response = {
		keyframe: {
			forecast: task.delay,
			real: task.delay + task.timeShift,
			shift: task.timeShift
		},
		index: task.index
	}

	return response

}


/**
 * _processTask() process task and remove it to queue
 *
 * @return {Object} task
 */

Scheduler.prototype._processTask = function( task ) {

	const response = this._prepareResponse( task )

	// Launch Callback

	task.callback( response )

	// Add task to checked task

	this.tasks.check.push( task )

	// Remove this processed task from tasks queue

	this.tasks.queue.splice( this.tasks.queue.indexOf( task ), 1 )

	// No more tasks in queue ?

	if ( !this.tasks.queue.length ) {
		this._onComplete()
	}

}


// Wrap as a module

module.exports = Scheduler
