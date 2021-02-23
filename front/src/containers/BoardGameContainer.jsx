/*
 * Created in février 2021
 * Written by Eden Cadagiani <e.cadagiani@gmail.com>
 */

import React, { Component } from "react";
import { findIndex }        from "lodash";
import Swal                 from "sweetalert2";

import { REQUEST_STATUS } from "constants/constants";

import CardContainer from "components/CardContainer/CardContainer";
import TimeCounter   from "components/TimeCounter/TimeCounter";
import { gameIsWin } from "functions/gameFunctions";


class BoardGameContainer extends Component {
    constructor() {
        super();
        this.state = {
            countDown:        -1,
            intervalId:       null,
            countDownStarted: false,
        };

    }

    componentDidMount() {
        this.props.fetchNewGame();
    }


    componentDidUpdate( prevProps, prevState, snapshot ) {
        if ( this.state.countDown === -1 && this.props.time > 0 ) {
            this.startCountDown();
        }
        if ( this.state.countDownStarted && this.state.countDown === 0 && !this.props.isFail ) {
            this.onFail();
        }

        if (
            this.props.fetchStatus === REQUEST_STATUS.FETCHED
            && !this.props.isWin
            && gameIsWin( this.props.cardsList )
        ) {
            this.onWin();
        }
    }

    startCountDown = () => {
        const intervalId = setInterval( () => {
            this.setState( ( state ) => ({
                countDown: state.countDown <= 0 ? 0 : state.countDown - 1,
            }) );
        }, 1000 );
        this.setState( { countDown: this.props.time, intervalId, countDownStarted: true } );
    };

    stopCountDown = () => {
        clearInterval( this.state.intervalId );
    };

    resetForm = () => {
        this.stopCountDown()
        this.setState( {
            countDown:        -1,
            intervalId:       null,
            countDownStarted: false,
        } );
        this.props.fetchNewGame();
    };

    // quand le compteur est terminé
    onFail = () => {
        this.stopCountDown();
        this.props.setFail( { gameId: this.props.gameId } );
        Swal.fire( {
            icon:              "error",
            title:             "Perdu",
            text:              "Raté, vous avez perdu, vous ferez mieux la prochaine fois.",
            confirmButtonText: "Réessayer",
            allowOutsideClick: false,
            allowEscapeKey: false,
        } ).then( ( result ) => {
            if ( result.isConfirmed ) {
                this.resetForm();
            }
        } );
    };

    // toute les cartes ont été retourné
    onWin = () => {
        this.stopCountDown();
        this.props.setWin( { gameId: this.props.gameId, remainingTime: this.state.countDown } );
        Swal.fire( {
            icon:  "success",
            title: "Gagné",
            text:  "Vous avez gagné, vous avez su reconnaitre toutes les égalités en JS",
            allowOutsideClick: false,
        } );
    };

    onCardClick = ( card, index ) => {
        if ( card.isFind ) // si elle est déjà find, inutile de la retourner ( on economise un render)
            return;

        if ( !card.isFlip ) { // si la carte est caché et qu'elle va être retourné face visible
            const firstCardFlippedIndex = findIndex( this.props.cardsList, { isFlip: true } );
            if ( firstCardFlippedIndex >= 0 ) { // si il y a deja une carte face visible
                // on déclenche une action dans 1,5 sec pour retourner automatiquement ces cartes
                setTimeout( () => {
                    this.props.closeCards( { itemsIndex: [firstCardFlippedIndex, index] } );
                }, 1000 );
            }
        }
        this.props.clickOnCard( { index } );
    };


    render() {
        const { fetchStatus, height, width, cardsList } = this.props;

        return (
            <div className={"BoardGame__view"}>
                <header className={"BoardGame__header"}>
                    <h1 className={"BoardGame__title"}>
                        Memory JS
                    </h1>
                    <div>
                        <TimeCounter
                            controlledCountDown={this.state.countDown * 1000}
                            className={"BoardGame__time"}
                        />
                        <button className={"materialButton BoardGame__buttonReset"} onClick={this.resetForm}>Reset</button>
                    </div>
                </header>
                {fetchStatus === REQUEST_STATUS.FETCHING && (
                    <span className={"BoardGame__loader"}>Loading</span>
                )}
                {fetchStatus === REQUEST_STATUS.FAILED && (
                    <span className={"BoardGame__error"}>ERROR</span>
                )}
                {fetchStatus === REQUEST_STATUS.FETCHED && (
                    <CardContainer
                        className={"BoardGame__cardContainer"}
                        height={height}
                        width={width}
                        cardsList={cardsList}
                        onCardClick={this.onCardClick}
                    />
                )}
            </div>
        );
    }
}

BoardGameContainer.propTypes = {};

export default BoardGameContainer;
