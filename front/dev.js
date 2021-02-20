/*
 * Created in février 2021
 * Written by Eden Cadagiani <e.cadagiani@gmail.com>
 */

const webpackDevServer = require( "webpack-dev-server" );
const webpack          = require( "webpack" );

const config  = require( "./dev.webpackConfig.js" );
const options = {
    contentBase: "./dist",
    hot:         true,
    host:        "localhost",
    inline:      true,
};

webpackDevServer.addDevServerEntrypoints( config, options );
const compiler = webpack( config );
const server   = new webpackDevServer( compiler, options );

server.listen( 5000, "localhost", () => {
    console.log( "dev server listening on port 5000" );
} );
