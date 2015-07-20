if ( process.env.new_relic_app_name )
    require( 'newrelic' );


var express = require( 'express' );

global.cookieLifetime = 1000 * 60 * 60 * 24 * 7;

global._ = require( 'lodash' );
//global.loader = require( require( 'path' ).join( __dirname, 'lib', 'loader' ) );
//global.log = require( 'log' );// loader.lib( 'log' );

var Log = require( 'log' ),
  log = new Log( 'info' );

var app = express( );

app.get( '/dummy', function ( req, res, next ) {
    res.send( { 'ido': true } );
} );

var apiKey = "foobar";//loader.config( ).apiKey;
var https = require( 'https' );

https.globalAgent.keepAlive = true;
https.globalAgent.maxSockets = 500;


app.get( '/count', function ( req, res, next ) {
    var count = 0;
    var total = 10000;
    var began = ( new Date( ) ).valueOf( );
    var next = function ( i ) {
        if ( i > total )
            return;
        //res.write('loading:' + i + '\n');
        var start = ( new Date( ) ).valueOf( );
        https.request( {
            'hostname': 'APIHOST.com',
            'path': '/api/Account/ClientTicket',
            'headers': {
                'APIKey': apiKey,
                'Connection': 'Keep-Alive'
            }
        }, function ( response ) {
            response.on( 'data', function () { } );
            response.on( 'end', function () {
                var end = ( new Date( ) ).valueOf( );
                count++;
                res.write( 'loaded:' + i + ' - ' + count + '  ' + res.statusCode + ' ' + ( end - start ) + 'ms!\n' );
                if ( count == total ) {
                    var end = ( new Date( ) ).valueOf( );
                    res.write( 'Completed in ' + ( end - began ) + 'ms.' );
                    return res.end( );
                }
            } );
            response.on( 'error', function () {
                var end = ( new Date( ) ).valueOf( );
                count++;
                res.write( 'ERROR:' + i + ' - ' + count + '  ' + res.statusCode + ' ' + ( end - start ) + 'ms!\n' );
                if ( count == total ) {
                    var end = ( new Date( ) ).valueOf( );
                    res.write( 'Completed in ' + ( end - began ) + 'ms.' );
                    return res.end( );
                }
            } );
        } ).end( );
        
        setTimeout( function () {
            next( i + 1 );
        }, 0 );
    };
    
    next( 0 );
} );

app.get( '/search_test', function ( req, res, next ) {
    getClientTicket( function () {
        res.json( { 'success': true } );
    } );
} );

var getClientTicket = function ( cb ) {
    https.request( {
        'hostname': 'APIHOST.com',
        'path': '/api/Account/ClientTicket',
        'headers': {
            'APIKey': apiKey
        }
    }, function ( response ) {
        var res = '';
        response.on( 'data', function ( chunk ) {
            res += chunk;
        } );
        
        response.on( 'error', function () {
            cb( );
        } );
        
        response.on( 'end', function () {
            try {
                res = JSON.parse( res );
            } catch ( e ) {
                res = {};
            }
            cb( res.ticket );
        } );
    } ).end( );
};

var qs = require( 'querystring' );

app.get( '/search_test_2', function ( req, res, next ) {
    getClientTicket( function ( ticket ) {
        https.request( {
            'hostname': 'APIHOST.com',
            'path': '/api/products/search?' + qs.stringify( {
                'searchText': 'huggies',
                'from': 0,
                'size': 24,
                'zipCode': '07843'
            } ),
            'headers': {
                'APIKey': apiKey,
                'ClientTicket': ticket,
                'Accept': 'application/vnd.apihost.productsearchresult.v1+json'
            }
        }, function ( response ) {
            response.on( 'data', function ( chunk ) { } );
            response.on( 'end', function () {
                res.json( { 'success': true } );
            } );
        } ).end( );
    } );
} );


var port = 8888;//loader.lib( 'args' ).port;

var server = app.listen( port, function () {
    log.info( 'Express web running on port:', port );
} );

process.on( 'uncaughtException', function ( err ) {

    log.error( 'Uncaught Exception', err.code, err.message, err.stack );
} );


