/*
 * Created in février 2021
 * Written by Eden Cadagiani <e.cadagiani@gmail.com>
 */

import React, { useEffect, useReducer, useCallback } from "react";
import { findIndex }                                 from "lodash";
import Swal                                          from "sweetalert2";

import { startGameRequest, setGameFailRequest, setGameWinRequest } from "requests/gameRequests";
import { gameIsWin }                                               from "functions/gameFunctions";
import { REQUEST_STATUS }                                          from "constants/constants";
import { boardGameReducer, initialState }                          from "containers/BoardGame/reducerBoardGame";

import CardContainer from "components/CardContainer/CardContainer";
import TimeCounter   from "components/TimeCounter/TimeCounter";


const BoardGame = ( props ) => {
    const [state, dispatch] = useReducer( boardGameReducer, initialState );

    const fetchGame = useCallback( () => {
        dispatch( { type: "startGame/REQUEST" } );
        // todo display message on fetching
        startGameRequest().then( res => {
            dispatch( { type: "startGame/SUCCESS", payload: res.data.result } );
        } ).catch( err => {
            dispatch( { type: "startGame/ERROR" } );
            // todo display message on error
        } );
    }, [] );

    // on Mount on fetch une nouvelle game
    useEffect( () => {
        fetchGame();
    }, [fetchGame] );

    // check the success
    useEffect( () => {
        if (
            state.fetchStatus === REQUEST_STATUS.FETCHED
            && gameIsWin( state.board )
        ) {
            dispatch( { type: "gameWin" } );
            //todo stop coutdown
            // todo send time for score
            setGameWinRequest( { gameId: state.gameId } );
            Swal.fire( {
                icon:  "success",
                title: "Gagné",
                text:  "Vous avez gagné, vous avez su reconnaitre toutes les égalités en JS",
            } );
        }
    }, [state.board] );


    const onCardClick = useCallback( ( index, card ) => {
        if ( card.isFind ) // si elle est déjà find, inutile de la retourner ( on economise un render)
            return;

        if ( !card.isFlip ) { // si la carte est caché et qu'elle va etre retourné face visible
            const firstCardFlippedIndex = findIndex( state.board, { isFlip: true } );
            if ( firstCardFlippedIndex >= 0 ) { // si il y a deja une carte face visible
                // on déclenche une action dans 1,5 sec pour retourner automatiquement ces cartes
                setTimeout( () => {
                    dispatch( { type: "cardFlipTimeout", payload: { itemsIndex: [firstCardFlippedIndex, index] } } );
                }, 1000 );
            }
        }

        dispatch( { type: "clickOnImage", payload: { index } } );
    }, [state.board] );


    // quand le compteur est terminé
    const onCountDownComplete = useCallback( () => {
        if ( !state.isWin ) { // si le jeu n'est pas gagné on le met à fail
            dispatch( { type: "gameFail" } );
            setGameFailRequest( { gameId: state.gameId } );

            Swal.fire( {
                icon:              "error",
                title:             "Perdu",
                text:              "Raté, vous avez perdu, vous ferez mieux la prochaine fois.",
                confirmButtonText: "Réessayer",
                cancelButtonText:  "Fermer",
                showCancelButton:  true,
            } ).then( ( result ) => {
                if ( result.isConfirmed ) {
                    fetchGame();
                }
            } );
        }
    }, [state.gameId, state.isWin, fetchGame] );


    return (
        <div className={"BoardGame__view"}>
            <header className={"BoardGame__header"}>
                <h1 className={"BoardGame__title"}>
                    Memory JS
                </h1>
                <TimeCounter
                    totalSecond={state.time}
                    start={state.fetchStatus === REQUEST_STATUS.FETCHED}
                    onComplete={onCountDownComplete}
                    className={"BoardGame__time"}
                />
            </header>
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
