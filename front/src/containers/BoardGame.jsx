/*
 * Created in février 2021
 * Written by Eden Cadagiani <e.cadagiani@gmail.com>
 */

import React, { useEffect, useReducer, useCallback } from "react";
import { filter, findIndex }                         from "lodash";
import PropTypes                                     from "prop-types";

import { startGameRequest } from "requests/gameRequests";
import { REQUEST_STATUS }   from "constants/constants";
import { parseBoard }       from "functions/gameFunctions";
import Card                 from "components/Card/Card";


const initialState = {
    gameId: null,
    board:  null,
    width:  null,
    height: null,
    user:   {
        name: null,
        id:   null,
    },

    fetchStatus: REQUEST_STATUS.INITIAL,
};

function reducer( state, action ) {
    switch ( action.type ) {
        case "startGame/REQUEST":
            return {
                ...state,
                fetchStatus: REQUEST_STATUS.FETCHING,
            };
        case "startGame/SUCCESS":
            return {
                ...state,
                fetchStatus: REQUEST_STATUS.FETCHED,
                gameId:      action.payload.game.id,
                user:        action.payload.user,
                board:       parseBoard( action.payload.game.board ),
                width:       action.payload.game.width,
                height:      action.payload.game.height,
            };
        case "startGame/ERROR":
            return {
                ...state,
                fetchStatus: REQUEST_STATUS.FAILED,
            };
        case "returnImage":
            // si il y a deja 2 cartes de retourné on empêche le joueur de toucher à une autre carte
            if ( filter( state.board, { isReturn: true } ).length >= 2 ) {
                return state;
            }

            // on copie state.board pour éviter les effets de bords
            const newBoard = [...state.board];
            newBoard[action.payload.index] = {...newBoard[action.payload.index]};

            // si il y a deja un element de retourner, si l'on viens de retourner une carte face ouverte,
            // et que les deux cartes sont de la meme identity. Alors on viens de trouver une paire, c'est validé
            const firstReturnedIndex = findIndex( state.board, { isReturn: true } );
            if (
                newBoard[firstReturnedIndex] >= 0
                && !newBoard[action.payload.index].isReturn
                && newBoard[firstReturnedIndex].identity === newBoard[action.payload.index].identity
            ) {
                newBoard[firstReturnedIndex] = {...newBoard[firstReturnedIndex]};
                newBoard[action.payload.index].isReturn = newBoard[firstReturnedIndex].isReturn = false;
                newBoard[action.payload.index].isFind   = newBoard[firstReturnedIndex].isFind = true;
            } else {
                newBoard[action.payload.index].isReturn = !newBoard[action.payload.index].isReturn;
            }

            return {
                ...state,
                board: newBoard,
            };
        default:
            throw new Error( `action ${action.type} not implemented` );
    }
}

const BoardGame = ( {} ) => {
    const [state, dispatch] = useReducer( reducer, initialState );


    const onCardClick = useCallback( ( appId, index ) => {
        dispatch( { type: "returnImage", payload: { index } } );
        // todo set timeout to return down when two card is returned
    }, [] );

    useEffect( () => {
        dispatch( { type: "startGame/REQUEST" } );
        startGameRequest().then( res => {
            dispatch( { type: "startGame/SUCCESS", payload: res.data.result } );
        } ).catch( err => {
            dispatch( { type: "startGame/FAILED" } );
            // todo display message on error
        } );
    }, [] );

    
    return (
        <div className={"BoardGame__view"}>
            <div className={"BoardGame__cardContainer"}>
                {state.fetchStatus === REQUEST_STATUS.FETCHING && (
                    <span>Loading</span>
                )}
                {state.fetchStatus === REQUEST_STATUS.FAILED && (
                    <span>ERROR</span>
                )}
                {state.fetchStatus === REQUEST_STATUS.FETCHED &&
                state.board.map( ( card, index ) => (
                    <Card
                        key={card.appId}
                        text={card.text}
                        imageName={card.identity}
                        isReturn={card.isReturn}
                        onClick={( ...args ) => onCardClick( card.appId, index, ...args )}
                    />
                ) )
                }
            </div>
        </div>
    );
};

BoardGame.propTypes = {};

export default BoardGame;
