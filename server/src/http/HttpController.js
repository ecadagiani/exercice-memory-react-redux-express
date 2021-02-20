/*
 * Created in février 2021
 * Written by Eden Cadagiani <e.cadagiani@gmail.com>
 */
const express    = require( "express" );
const bodyParser = require( "body-parser" );
const cors       = require( "cors" );
const helmet     = require( "helmet" );
const http       = require( "http" );

const gamesRouter = require( "./router/GamesRouter" );

class HttpController {
    constructor() {
        this.app    = express();
        this.server = http.createServer( this.app );
    }

    init() {
        this.app.use( bodyParser.urlencoded( { extended: true } ) );
        this.app.use( bodyParser.json() );
        this.app.use( cors( { origin: "*" } ) );
        this.app.use( helmet() );

        this.app.use( "/game", gamesRouter );

        this.app.get( "/ping", ( req, res ) => {
            res.send( "pong" );
        } );
        this.app.get( "/", ( req, res ) => {
            res.send( "Hello you are on the pyrite server" );
        } );

    }

    startServer() {
        this.server.listen( process.env.SERVER_PORT, () => {
            // eslint-disable-next-line no-console
            console.log( "Express Server Running" );
        } );
    }
}

module.exports = HttpController;
