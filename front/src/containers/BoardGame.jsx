/*
 * Created in février 2021
 * Written by Eden Cadagiani <e.cadagiani@gmail.com>
 */

import React, { useEffect, useReducer, useCallback } from "react";
import { filter, findIndex }                         from "lodash";


import { startGameRequest } from "requests/gameRequests";
import { REQUEST_STATUS }   from "constants/constants";
import { parseBoard }       from "functions/gameFunctions";
import CardContainer        from "components/CardContainer/CardContainer";


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
    console.log( action.type, action.payload );
    switch ( action.type ) {
        case "startGame/REQUEST": {
            return {
                ...state,
                fetchStatus: REQUEST_STATUS.FETCHING,
            };
        }

        case "startGame/SUCCESS": {
            return {
                ...state,
                fetchStatus: REQUEST_STATUS.FETCHED,
                gameId:      action.payload.game.id,
                user:        action.payload.user,
                board:       parseBoard( action.payload.game.board ),
                width:       action.payload.game.width,
                height:      action.payload.game.height,
            };
        }

        case "startGame/ERROR": {
            return {
                ...state,
                fetchStatus: REQUEST_STATUS.FAILED,
            };
        }

        case "clickOnImage": {
            // si il y a deja 2 cartes de retourné on empêche le joueur de toucher à une autre carte
            if ( filter( state.board, { isReturn: true } ).length >= 2 ) {
                return state;
            }

            // on copie state.board pour éviter les effets de bords
            const newBoard                 = [...state.board];
            newBoard[action.payload.index] = { ...newBoard[action.payload.index] };

            // si il y a deja un element de retourner, si l'on viens de retourner une carte face ouverte,
            // et que les deux cartes sont de la meme identity. Alors on viens de trouver une paire, c'est validé
            const firstReturnedIndex = findIndex( state.board, { isReturn: true } );
            if (
                firstReturnedIndex >= 0
                && !newBoard[action.payload.index].isReturn
                && newBoard[firstReturnedIndex].identity === newBoard[action.payload.index].identity
            ) {
                newBoard[firstReturnedIndex]            = { ...newBoard[firstReturnedIndex] };
                newBoard[action.payload.index].isReturn = newBoard[firstReturnedIndex].isReturn = false;
                newBoard[action.payload.index].isFind   = newBoard[firstReturnedIndex].isFind = true;
                console.log( "lol" );
            } else {
                newBoard[action.payload.index].isReturn = !newBoard[action.payload.index].isReturn;
            }

            return {
                ...state,
                board: newBoard,
            };
        }

        case "returnTimeout": {
            const { itemsIndex } = action.payload;
            const newBoard       = [...state.board];
            itemsIndex.forEach( index => {
                newBoard[index]          = { ...newBoard[index] };
                newBoard[index].isReturn = false;
            } );
            return {
                ...state,
                board: newBoard,
            };
        }

        default:
            throw new Error( `action ${action.type} not implemented` );
    }
}

const BoardGame = ( {} ) => {
    const [state, dispatch] = useReducer( reducer, initialState );

    useEffect( () => {
        dispatch( { type: "startGame/REQUEST" } );
        startGameRequest().then( res => {
            dispatch( { type: "startGame/SUCCESS", payload: res.data.result } );
        } ).catch( err => {
            dispatch( { type: "startGame/ERROR" } );
            // todo display message on error
        } );
    }, [] );

    const onCardClick = useCallback( ( index, card ) => {
        if ( card.isFind ) // si elle est déjà find, inutile de la retourner ( on economise un render)
            return;

        if ( !card.isReturn ) { // si la carte est caché et qu'elle va etre retourné face visible
            const firstReturnedIndex = findIndex( state.board, { isReturn: true } );
            if ( firstReturnedIndex >= 0 ) { // si il y a deja une carte face visible
                // on déclenche une action dans 1,5 sec pour retourner automatiquement ces cartes
                setTimeout( () => {
                    dispatch( { type: "returnTimeout", payload: { itemsIndex: [firstReturnedIndex, index] } } );
                }, 1000 );
            }
        }

        dispatch( { type: "clickOnImage", payload: { index } } );
    }, [state.board] );

    return (
        <div className={"BoardGame__view"}>
            <h1 className={"BoardGame__title"}>
                Memory JS
            </h1>
            {state.fetchStatus === REQUEST_STATUS.FETCHING && (
                <span className={"BoardGame__loader"}>Loading</span>
            )}
            {state.fetchStatus === REQUEST_STATUS.FAILED && (
                <span className={"BoardGame__error"}>ERROR</span>
            )}
            {state.fetchStatus === REQUEST_STATUS.FETCHED && (
                <CardContainer
                    className={"BoardGame__cardContainer"}
                    height={state.height}
                    width={state.width}
                    board={state.board}
                    onCardClick={onCardClick}
                />
            )}
        </div>
    );
};

BoardGame.propTypes = {};

export default BoardGame;
