/*
 * Created in février 2021
 * Written by Eden Cadagiani <e.cadagiani@gmail.com>
 */


import { bindActionCreators } from "redux";
import { connect }            from "react-redux";

import BoardGameContainer from "containers/BoardGameContainer";
import {
    fetchNewGameAsyncAction,
    clickOnCardAction,
    closeCardsAction,
    setGameFailAsyncAction,
    setGameWinAsyncAction,
} from "store/actions";


const mapStateToProps    = ( state ) => ({
    cardsList:   state.board.cardsList,
    gameId:      state.board.gameId,
    time:        state.board.time,
    height:      state.board.height,
    width:       state.board.width,
    fetchStatus: state.board.fetchStatus,
    isWin: state.board.isWin,
    isFail: state.board.isFail,
});
const mapDispatchToProps = dispatch => ({
    fetchNewGame: bindActionCreators( fetchNewGameAsyncAction, dispatch ),
    clickOnCard:  bindActionCreators( clickOnCardAction, dispatch ),
    closeCards:   bindActionCreators( closeCardsAction, dispatch ),
    setFail:      bindActionCreators( setGameFailAsyncAction, dispatch ),
    setWin:      bindActionCreators( setGameWinAsyncAction, dispatch ),
});
export default connect( mapStateToProps, mapDispatchToProps )( BoardGameContainer );
