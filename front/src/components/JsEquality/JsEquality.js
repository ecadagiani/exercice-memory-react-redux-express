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

    return (
        <code className={"JsEquality__code"}>
            {Object.values( pairs).map( ( [text1, text2], index ) => (
                <span key={index} className={"JsEquality__line"}>
                    {text1.length > text2.length ? ( // on met l'égalité le plus long en 1er car cela est plus esthétique, et la plupart du temps l'égalité est plus cohérente
                        <><strong>{text1}</strong> &lt;=&gt; <strong>{text2}</strong></>
                    ) : (
                        <><strong>{text2}</strong> &lt;=&gt; <strong>{text1}</strong></>
                    )}
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
