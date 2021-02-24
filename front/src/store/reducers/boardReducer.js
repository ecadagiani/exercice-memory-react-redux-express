/*
 * Created in février 2021
 * Written by Eden Cadagiani <e.cadagiani@gmail.com>
 */

import { createReducer } from "@reduxjs/toolkit";

import { REQUEST_STATUS }                                                                                              from "constants/constants";
import { fetchNewGameAsyncAction, clickOnCardAction, closeCardsAction, setGameFailAsyncAction, setGameWinAsyncAction } from "store/actions";
import { parseBoard }                                                                                                  from "functions/gameFunctions";
import { filter, findIndex }                           from "lodash";


const initialState = {
    gameId:   null,
    cardsList: null,
    width:    null,
    height:   null,
    time:     null, //en seconde
    user:     {
        name: null,
        id:   null,
    },

    fetchStatus: REQUEST_STATUS.INITIAL,
    fetchErrorMessage: "",
    isWin:       false,
    isFail:      false,
};

export const boardReducer = createReducer( initialState, {
    // on requête une nouvelle partie, on reset le store a son état d'origine
    [fetchNewGameAsyncAction.pending]:   ( state, action ) => {
        return {
            ...initialState,
            fetchStatus: REQUEST_STATUS.FETCHING,
        };
    },

    // reception des infos de la nouvelle partie
    [fetchNewGameAsyncAction.fulfilled]: ( state, { payload } ) => {
        state.fetchStatus = REQUEST_STATUS.FETCHED;
        state.gameId      = payload.game.id;
        state.user        = payload.user;
        state.width       = payload.game.width;
        state.height      = payload.game.height;
        state.time        = payload.game.time;
        state.cardsList    = parseBoard( payload.game.board );
    },

    // une erreur est survenue lors de la récupération de la nouvelle partie
    [fetchNewGameAsyncAction.rejected]:  ( state, action ) => {
        console.log(action)
        state.fetchStatus = REQUEST_STATUS.FAILED;
        state.fetchErrorMessage = action.error.message;
    },

    // l'utilisateur à cliqué sur une carte
    [clickOnCardAction]: ( state, action ) => {
        // si il y a deja 2 cartes de retourné on empêche le joueur de toucher à une autre carte
        if ( filter( state.cardsList, { isFlip: true } ).length >= 2 ) {
            return;
        }

        // si il y a deja un element de retourner, si l'on viens de retourner une carte face ouverte,
        // et que les deux cartes sont de la meme identity. Alors on viens de trouver une paire, c'est validé
        const firstCardFlippedIndex = findIndex( state.cardsList, { isFlip: true } );
        if (
            firstCardFlippedIndex >= 0
            && !state.cardsList[action.payload.index].isFlip
            && state.cardsList[firstCardFlippedIndex].identity === state.cardsList[action.payload.index].identity
        ) {
            state.cardsList[action.payload.index].isFlip = state.cardsList[firstCardFlippedIndex].isFlip = false;
            state.cardsList[action.payload.index].isFind = state.cardsList[firstCardFlippedIndex].isFind = true;
        } else {
            state.cardsList[action.payload.index].isFlip = !state.cardsList[action.payload.index].isFlip;
        }
    },

    // il faut retourner des cartes (notamment après le timeout de 1sec, après l'affichage de 2 cartes)
    [closeCardsAction]: ( state, action ) => {
        const { itemsIndex } = action.payload;
        itemsIndex.forEach( index => {
            state.cardsList[index].isFlip = false;
        } );
    },

    // la partie a été perdu (une requete a été envoyé)
    [setGameFailAsyncAction.pending]: ( state, action ) => {
        state.isFail = true
    },

    //la partie a été gagné (une requete a été envoyé)
    [setGameWinAsyncAction.pending]: ( state, action ) => {
        state.isWin = true
    },
} );
