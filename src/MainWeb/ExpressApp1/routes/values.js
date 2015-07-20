var express = require( 'express' );
var router = express.Router( );
var http = require( 'http' );

var options = {
    host: 'jettestarmpaas.cloudapp.net',
    port: 80,
    path: '/api/simple',
    method: 'GET',
    headers: {
        connection: 'keep-alive'
    }
};


function callApi( options, callback ) {
    return http.request( options, function ( res ) {
        console.log( 'STATUS: ' + res.statusCode );
        console.log( 'HEADERS: ' + JSON.stringify( res.headers ) );
        res.setEncoding( 'utf8' );
        
        var body = '';
        res.on( 'data', function ( chunk ) {
            console.log( 'BODY: ' + chunk );
            body += chunk;
        } );
        
        res.on( 'end', function ( foo ) {
            // Data reception is done, do whatever with it!
            var parsed = JSON.parse( body );
            
            var st = res.status;
            if ( res.statusCode == 200 )
                callback( null, parsed );
            else {
                callback( res.statusCode, parsed );
            }

        } );

    } ).on( 'error', function ( e ) {
        callback( true, "error" );

    } ).on( 'timeout', function ( e ) {
        res.abort( );
        callback( true, "timeout" );
    } );
    
    
}


/* GET values page. */
router.get( '/', function ( req, res ) {
    var stuff, rawData;
    callApi( options, function ( err, data ) {
        
        if ( err ) {
            res.status( err );
            var currentStack = new Error( ).stack;
            stuff = JSON.stringify( data );
            res.render( 'error', { message: stuff, error: { status: err, stack: currentStack }} );
        }
        else {
            stuff = JSON.stringify( data );
            rawData = data;
            res.render( 'values', { title: 'Values', body: stuff, data: rawData } );
        }

    } ).end( );
    


} );

module.exports = router;


