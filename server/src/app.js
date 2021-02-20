/*
 * Created in février 2021
 * Written by Eden Cadagiani <e.cadagiani@gmail.com>
 */

const HttpController = require( "./http/HttpController" );
const MysqlConnection = require( "./database/MysqlConnection" );

const server = new HttpController();
server.init();
server.startServer();

