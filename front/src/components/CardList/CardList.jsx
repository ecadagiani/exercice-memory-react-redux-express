/*
 * Created in février 2021
 * Written by Eden Cadagiani <e.cadagiani@gmail.com>
 */

import React     from "react";
import styled    from "@emotion/styled";
import PropTypes from "prop-types";

import Card from "components/Card/Card";


const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.width}, 1fr);
  grid-template-rows: repeat(${props => props.height}, 1fr);
  grid-gap: 30px;
  @media (max-width: 768px) {
    grid-gap: 5px;
    // en mobile, pour rester responsive, on utilise les lignes en colonnes (seulement si il y a moins de colonne que de ligne)
    grid-template-rows: repeat(${( { width, height } ) => width > height ? width : height}, 1fr);
    grid-template-columns: repeat(${( { width, height } ) => width > height ? height : width}, 1fr);
  }
`;


const CardList = ( {
    height, width, cardsList, onCardClick, ...rest
} ) => {
    return (
        <Grid height={height} width={width} {...rest}>
            {cardsList.map( ( card, index ) => (
                <Card
                    key={card.appId}
                    text={card.text}
                    imageName={card.identity}
                    isFlip={card.isFlip}
                    isFind={card.isFind}
                    onClick={() => onCardClick( card, index )}
                />
            ) )}
        </Grid>
    );
};

CardList.propTypes = {
    height:      PropTypes.number.isRequired,
    width:       PropTypes.number.isRequired,
    cardsList:   PropTypes.arrayOf( PropTypes.shape( {
        appId:    PropTypes.string,
        text:     PropTypes.string,
        identity: PropTypes.string,
        isReturn: PropTypes.bool,
        isFind:   PropTypes.bool,
    } ) ).isRequired,
    onCardClick: PropTypes.func.isRequired,
};

export default CardList;
