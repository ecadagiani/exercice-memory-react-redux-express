/*
 * Created in février 2021
 * Written by Eden Cadagiani <e.cadagiani@gmail.com>
 */

import { createAction, createAsyncThunk }                          from "@reduxjs/toolkit";
import { setGameFailRequest, setGameWinRequest, startGameRequest } from "requests/gameRequests";


export const fetchNewGameAsyncAction = createAsyncThunk(
    'board/fetchNewGame',
    async () => {
        const res = await startGameRequest();
        return res.data.result;
    });

export const setGameFailAsyncAction = createAsyncThunk(
    'board/setGameFail',
    async ({gameId}) => {
        const res = await setGameFailRequest( { gameId} );
        return res.data.result;
    });

export const setGameWinAsyncAction = createAsyncThunk(
    'board/setGameWin',
    async ({gameId, remainingTime}) => {
        const res = await setGameWinRequest( { gameId, remainingTime} );
        return res.data.result;
    });


export const clickOnCardAction = createAction('board/clickOnCardAction');
export const closeCardsAction             = createAction('board/closeCardsAction');
