/*
 * Created in février 2021
 * Written by Eden Cadagiani <e.cadagiani@gmail.com>
 */

const express   = require( "express" );
const Joi       = require( "joi" );
const validator = require( "express-joi-validation" ).createValidator( {} );

const { idJoiSchema } = require( "../JoiSchema" );

const gamesRouter = express.Router();

gamesRouter.get(
    "/:id",
    validator.params( Joi.object( {
        id: idJoiSchema.required(),
    } ) ),
    async ( req, res ) => {
        // get game
        res.json( { result: {} } );
    },
);

module.exports = gamesRouter;
