'use strict'


// Require RAF

const Raf = require( 'raf' )


// Create Ticker

const Ticker = function() {
	this.instance = null
	this.lostTime = 0
	this.blurTime = 0
	this.tickers = []
	this.raf = false
	this._observe()
}


// Public

/**
 * setOptions()
 *
 * @return {Function} ticker
 */

Ticker.prototype.setOptions = function( options ) {
	this.raf = options.raf
}


/**
 * start() add given ticker to the RAF instance
 *
 * @return {Function} ticker
 */

Ticker.prototype.start = function( ticker ) {

	if ( !this.tickers.length ) {
		this._process()
	}

	this.tickers.push( ticker )

}


/**
 * end() remove given ticker from the RAF instance
 *
 * @return {Function} ticker
 */

Ticker.prototype.end = function( ticker ) {

	this.tickers.splice( this.tickers.indexOf( ticker ), 1 )

	if ( this.raf ) {

		if ( !this.tickers.length ) {
			Raf.cancel( this.instance )
		}

	}

}


/**
 * update() update with custom loop
 *
 */

Ticker.prototype.update = function( time ) {

	this._process( time )

}


// Private

/**
 * _observe() to check document visibility state
 */

Ticker.prototype._observe = function( currentTime ) {
	document.addEventListener( 'visibilitychange', () => {
		if ( document.visibilityState === 'hidden' ) {
			this.blurTime = Date.now()
		}
		if ( document.visibilityState === 'visible' ) {
			const now = Date.now()
			this.lostTime += ( now - this.blurTime )
			this.blurTime = 0
		}
	} )
}


/**
 * _process() is the RAF Handler
 */

Ticker.prototype._process = function( currentTime ) {

	if ( this.raf ) {
		this.instance = Raf( this._process.bind( this ) )
	}

	let i = this.tickers.length

	while ( i-- ) {
		this.tickers[ i ]( currentTime - this.lostTime )
	}

}


// Wrap as a module

module.exports = new Ticker()
