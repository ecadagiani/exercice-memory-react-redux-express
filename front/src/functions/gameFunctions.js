
import {flatten} from "lodash";
import uniqId from "uniqid";

export function parseBoard(board){
    return flatten(board).map(cell => ({
        appId: uniqId(),
        identity: cell.identity,
        text: cell.text,
        isReturn: true,
        isFind: false,
    }))
}
