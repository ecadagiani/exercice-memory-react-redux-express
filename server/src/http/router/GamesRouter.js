/*
 * Created in février 2021
 * Written by Eden Cadagiani <e.cadagiani@gmail.com>
 */

const express   = require( "express" );
const Joi       = require( "joi" );
const validator = require( "express-joi-validation" ).createValidator( {} );

const { idJoiSchema } = require( "constants/joiSchema" );
const Game            = require( "game/Game" );
const User            = require( "game/User" );

const gamesRouter = express.Router();

gamesRouter.get(
    "/:id",
    validator.params( Joi.object( {
        id: idJoiSchema.required(),
    } ) ),
    async ( req, res ) => {
        const { id } = req.params;
        const game   = await Game.getGameWithId( id );
        if ( !game ) {
            return res.status( 404 ).send( "game not found" ).end();
        }

        res.json( { result: game.toObject() } );
    },
);

gamesRouter.post(
    "/start",
    validator.body( Joi.object( {
        userId:   idJoiSchema,
        userName: Joi.string(),
        width:    Joi.number(),
        height:   Joi.number(),
    } ) ),
    async ( req, res ) => {
        const { userId, userName, width, height } = req.body;
        const user                                = new User( { id: userId, name: userName } );
        if ( !userId )
            await user.saveToDb();

        const game = new Game( {
            userId: user.id,
            width, height,
        } );
        game.init();
        await game.saveToDb();
        res.json( {
            result: {
                user: user.toObject(),
                game: game.toObject(),
            },
        } );
    },
);

gamesRouter.post(
    "/:id/fail",
    validator.params( Joi.object( {
        id: idJoiSchema.required(),
    } ) ),
    async ( req, res ) => {
        const { id } = req.params;
        const game   = await Game.getGameWithId( id );
        if ( !game ) {
            return res.status( 404 ).send( "game not found" ).end();
        }
        game.fail();
        await game.saveToDb();

        res.json( {
            result: game.toObject(),
        } );
    },
);

gamesRouter.post(
    "/:id/win",
    validator.params( Joi.object( {
        id: idJoiSchema.required(),
    } ) ),
    validator.body( Joi.object( {
        remainingTime: Joi.number(),
    } ) ),
    async ( req, res ) => {
        const { id } = req.params;
        const { remainingTime } = req.body;
        const game   = await Game.getGameWithId( id );
        if ( !game ) {
            return res.status( 404 ).send( "game not found" ).end();
        }
        game.win(remainingTime);
        await game.saveToDb();

        res.json( {
            result: game.toObject(),
        } );
    },
);

module.exports = gamesRouter;
