/*
 * Created in février 2021
 * Written by Eden Cadagiani <e.cadagiani@gmail.com>
 */

import React     from "react";
import cx        from "classnames";
import PropTypes from "prop-types";

import { cardsImages } from "constants/cardsImages";
import "./Card.scss";


const Card = ( {
    imageName,
    text,
    isReturn,
    isFind,
    onClick,
} ) => {
    const isFlipped = isReturn || isFind;

    return (
        <div
            className={cx( "Card", { "returned": isFlipped, "found": isFind } )}
            onClick={onClick}
        >
            <div className={cx( "Card__flipper", { "flipped": isFlipped } )}>
                <div className={"Card__front"}>
                    <span>?</span>
                </div>
                <div className={"Card__back"}>
                    <img
                        src={cardsImages[imageName]}
                        alt={imageName}
                        className="Card__backImage"
                    />
                    <span className={"Card__text"}>{text}</span>
                </div>
            </div>
        </div>
    );
};

Card.propTypes = {
    imageName: PropTypes.string,
    text:      PropTypes.string,
};

export default Card;
