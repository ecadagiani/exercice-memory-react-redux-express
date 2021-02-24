/*
 * Created in février 2021
 * Written by Eden Cadagiani <e.cadagiani@gmail.com>
 */
import axiosInstance from "requests/axiosInstance";


export function startGameRequest( { userId, userName, width, height } = {} ) {
    return axiosInstance.post( `/game/start`, {
        userId, userName, width, height,
    } );
}

export function setGameFailRequest( { gameId } ) {
    return axiosInstance.post( `/game/${gameId}/fail` );
}

export function setGameWinRequest( { gameId, remainingTime } ) {
    return axiosInstance.post( `/game/${gameId}/win`, {
        remainingTime
    } );
}
