
import {flatten, find} from "lodash";
import uniqId from "uniqid";

export function parseBoard(board){
    return flatten(board).map((cell, index) => ({
        appId: uniqId(),
        identity: cell.identity,
        text: cell.text,
        isFlip: false,
        isFind: false,
    }))
}

export function gameIsWin(cards){
    return !find(cards, {isFind: false});
}
