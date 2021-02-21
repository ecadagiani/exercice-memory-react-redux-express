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

    return (
        <div
            className={cx( "Card", { "returned": isReturn, "found": isFind } )}
            onClick={onClick}
        >
            {isReturn || isFind? (
                <img
                    src={cardsImages[imageName]}
                    alt={imageName}
                    className="Card__versoImage"
                />
            ): (
                <span className={"Card__rectoImage"}>?</span>
            )}
        </div>
    );
};

Card.propTypes = {
    imageName: PropTypes.string,
    text:      PropTypes.string,
};

export default Card;
