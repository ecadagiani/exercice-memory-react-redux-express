/*
 * Created in février 2021
 * Written by Eden Cadagiani <e.cadagiani@gmail.com>
 */

const Joi = require( "joi" );

// route validator pour les id mysql
const idJoiSchema = Joi.string().regex( /^[0-9]{1,11}$/, "valid id" );


module.exports = {
    idJoiSchema,
};
