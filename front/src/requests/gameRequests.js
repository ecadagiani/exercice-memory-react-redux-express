/*
 * Created in février 2021
 * Written by Eden Cadagiani <e.cadagiani@gmail.com>
 */
import axiosInstance from "requests/axiosInstance";


export function startGameRequest({userId, userName, width, height} = {}) {
    return axiosInstance.post(`/game/start`, {
        userId, userName, width, height
    })
}
