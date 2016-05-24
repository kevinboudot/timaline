'use strict';


// Require RAF

var Raf = require( 'raf' );


// Create Ticker

function Ticker() {
	this.instance = null;
	this.tickers = [];
}


// Public


/**
 * start() add given ticker to the RAF instance
 *
 * @return {Function} ticker
 */

Ticker.prototype.start = function( ticker ) {

	if ( !this.tickers.length ) {
		this._process();
	}

	this.tickers.push( ticker );

};


/**
 * end() remove given ticker from the RAF instance
 *
 * @return {Function} ticker
 */

Ticker.prototype.end = function( ticker ) {

	this.tickers.splice( this.tickers.indexOf( ticker ), 1 );

	if ( !this.tickers.length ) {
		Raf.cancel( this.instance );
	}

};


// Private


/**
 * _process() is the RAF Handler
 */

Ticker.prototype._process = function( currentTime ) {

	this.instance = Raf( this._process.bind( this ) );

	var i = this.tickers.length;

	while ( i-- ) {
		this.tickers[ i ]( currentTime );
	}

};


// Wrap as a module

module.exports = new Ticker();
