/*
 * Created in février 2021
 * Written by Eden Cadagiani <e.cadagiani@gmail.com>
 */

const express     = require( "express" );
const { flatten } = require( "lodash" );

const Game = require( "game/Game" );
const User = require( "game/User" );


const webRouter = express.Router();

webRouter.get( "/", async function( req, res ) {
    const user = new User();
    await user.saveToDb();
    const game = new Game( {
        userId: user.id,
    } );
    game.init();
    await game.saveToDb();

    const cardList = flatten( game.toObject().board );
    res.render( "index", {
        ...game.toObject(),
        cardList: cardList,
        serverHost: process.env.SERVER_HOST,
    } );
} );


module.exports = webRouter;
