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



// route pour récupérer une partie
gamesRouter.get(
    "/:id",
    validator.params( Joi.object( {
        id: idJoiSchema.required(),
    } ) ),
    async ( req, res ) => {
        const { id } = req.params;
        const game   = await Game.getGameWithId( id );
        // si la game avec l'id n'existe pas => retourne un 404
        if ( !game ) {
            return res.status( 404 ).send( "game not found" ).end();
        }

        res.json( { result: game.toObject() } );
    },
);

// route pour démarrer (créer) une nouvelle partie
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
        let user;

        // si le userId est précisé on essaie de le récupèrer en base
        if(userId) {
            // NB: cela ne change pas le userName
            user = User.getUserWithId( userId );
        }

        // si le userId n'est pas précisé, où si le userId donné n'existe pas en base, on créer un nouveau utilisateur
        if ( !userId || !user ) {
            user = new User( { name: userName } );
            await user.saveToDb();
        }

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

// pour noter qu'une partie a été perdu
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

// pour noter qu'une partie a été gagné et en combien de temps
gamesRouter.post(
    "/:id/win",
    validator.params( Joi.object( {
        id: idJoiSchema.required(),
    } ) ),
    validator.body( Joi.object( {
        remainingTime: Joi.number().required(),
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
