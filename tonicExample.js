const Timaline = require( 'timaline' )
const timeline = new Timaline()

timeline
	.wait( 500 )
	.set( function( infos ) {
		console.log( infos.keyframe.real + ' ≈ ' + infos.keyframe.forecast )
	} )
	.wait( 1000 )
	.set( function( infos ) {
		console.log( infos.keyframe.real + ' ≈ ' + infos.keyframe.forecast )
	} )
