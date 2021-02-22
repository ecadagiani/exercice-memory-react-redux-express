/*
 * Created in février 2021
 * Written by Eden Cadagiani <e.cadagiani@gmail.com>
 */


import { REQUEST_STATUS }    from "constants/constants";
import { parseBoard }        from "functions/gameFunctions";
import { filter, findIndex } from "lodash";


export const initialState = {
    gameId: null,
    board:  null,
    width:  null,
    height: null,
    time:   null, //en seconde
    user:   {
        name: null,
        id:   null,
    },

    fetchStatus: REQUEST_STATUS.INITIAL,
    isWin:       false,
    isFail:      false,
};

export function boardGameReducer( state, action ) {
    switch ( action.type ) {
        case "startGame/REQUEST": {
            return {
                ...initialState,
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
                time:        action.payload.game.time,
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
            if ( filter( state.board, { isFlip: true } ).length >= 2 ) {
                return state;
            }

            // on copie state.board pour éviter les effets de bords
            const newBoard                 = [...state.board];
            newBoard[action.payload.index] = { ...newBoard[action.payload.index] };

            // si il y a deja un element de retourner, si l'on viens de retourner une carte face ouverte,
            // et que les deux cartes sont de la meme identity. Alors on viens de trouver une paire, c'est validé
            const firstCardFlippedIndex = findIndex( state.board, { isFlip: true } );
            if (
                firstCardFlippedIndex >= 0
                && !newBoard[action.payload.index].isFlip
                && newBoard[firstCardFlippedIndex].identity === newBoard[action.payload.index].identity
            ) {
                newBoard[firstCardFlippedIndex]       = { ...newBoard[firstCardFlippedIndex] };
                newBoard[action.payload.index].isFlip = newBoard[firstCardFlippedIndex].isFlip = false;
                newBoard[action.payload.index].isFind = newBoard[firstCardFlippedIndex].isFind = true;
            } else {
                newBoard[action.payload.index].isFlip = !newBoard[action.payload.index].isFlip;
            }

            return {
                ...state,
                board: newBoard,
            };
        }

        case "cardFlipTimeout": {
            const { itemsIndex } = action.payload;
            const newBoard       = [...state.board];
            itemsIndex.forEach( index => {
                newBoard[index]        = { ...newBoard[index] };
                newBoard[index].isFlip = false;
            } );
            return {
                ...state,
                board: newBoard,
            };
        }

        case "gameFail": {
            return { ...state, isFail: true };
        }

        case "gameWin": {
            return { ...state, isWin: true };
        }

        default:
            throw new Error( `action ${action.type} not implemented` );
    }
}
