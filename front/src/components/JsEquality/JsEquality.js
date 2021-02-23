/*
 * Created in février 2021
 * Written by Eden Cadagiani <e.cadagiani@gmail.com>
 */

import React     from "react";
import PropTypes from "prop-types";

import "./JsEquality.scss";


const JsEquality = ( {
    cardsList,
} ) => {
    const pairs = cardsList.reduce( ( acc, card ) => {
        if ( !acc[card.identity] )
            acc[card.identity] = [];
        acc[card.identity].push( card.text );
        return acc;
    }, {} );

    console.log( pairs, cardsList );
    return (
        <code className={"JsEquality__code"}>
            {Object.values( pairs).map( ( [text1, text2], index ) => (
                <span key={index} className={"JsEquality__line"}>
                    <strong>{text1}</strong> === <strong>{text2}</strong>
                </span>
            ) )}
        </code>
    );
};

JsEquality.propTypes = {
    cardsList: PropTypes.arrayOf( PropTypes.shape( {
        appId:    PropTypes.string,
        text:     PropTypes.string,
        identity: PropTypes.string,
        isReturn: PropTypes.bool,
        isFind:   PropTypes.bool,
    } ) ),
};

export default JsEquality;
