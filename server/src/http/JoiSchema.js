/*
 * Created in février 2021
 * Written by Eden Cadagiani <e.cadagiani@gmail.com>
 */

const Joi = require( "joi" );

const idJoiSchema = Joi.string().regex( /^[0-9a-fA-F]{24}$/, "valid id" );


module.exports = {
    idJoiSchema,
};
