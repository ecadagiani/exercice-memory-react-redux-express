/*
 * Created in février 2021
 * Written by Eden Cadagiani <e.cadagiani@gmail.com>
 */

import React     from "react";
import styled    from "@emotion/styled";
import PropTypes from "prop-types";

import Card      from "components/Card/Card";


const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.width}, 1fr);
  grid-template-rows: repeat(${props => props.height}, 1fr);
  grid-gap: 30px;
  @media (max-width: 768px) {
    grid-gap: 5px;
  }
`;
// todo add better grid for responsive


const CardContainer = ( {
    height, width, board, onCardClick, ...rest
} ) => {
    return (
        <Grid height={height} width={width} {...rest}>
            {board.map( ( card, index ) => (
                <Card
                    key={card.appId}
                    text={card.text}
                    imageName={card.identity}
                    isFlip={card.isFlip}
                    isFind={card.isFind}
                    onClick={() => onCardClick( index, card )}
                />
            ) )}
        </Grid>
    );
};

CardContainer.propTypes = {
    height:      PropTypes.number.isRequired,
    width:       PropTypes.number.isRequired,
    board:       PropTypes.arrayOf( PropTypes.shape( {
        appId:    PropTypes.string,
        text:     PropTypes.string,
        identity: PropTypes.string,
        isReturn: PropTypes.bool,
        isFind:   PropTypes.bool,
    } ) ).isRequired,
    onCardClick: PropTypes.func.isRequired,
};

export default CardContainer;
