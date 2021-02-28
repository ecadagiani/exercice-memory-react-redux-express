/*
 * Created in février 2021
 * Written by Eden Cadagiani <e.cadagiani@gmail.com>
 */


let cardList          = window.pyrite.cardList;
let intervalCountDown = null;
let countDown         = -1;
const axiosInstance   = axios.create( {
    baseURL: serverHost,
} );


$( function() {
    prepareCardList();
    startCountDown();


    $( ".Card" ).click( ( event ) => {
        const index = event.currentTarget.getAttribute( "data-index" );

        // la carte est trouvé
        if ( cardList[index].isFind ) {
            return;
        }

        // il y a déjà 2 cartes de retourné
        if ( _.filter( cardList, { isFlip: true } ).length >= 2 ) {
            return;
        }

        const firstCardFlippedIndex = _.findIndex( cardList, { isFlip: true } );
        if (
            firstCardFlippedIndex >= 0
            && !cardList[index].isFlip
            && cardList[firstCardFlippedIndex].identity === cardList[index].identity
        ) {
            setCardFind( event.currentTarget, index );
            setCardFind( $( `#card-${firstCardFlippedIndex}` ), firstCardFlippedIndex );
            if ( !_.find( cardList, { isFind: false } ) ) {
                win();
            }
            return;
        }

        if ( firstCardFlippedIndex >= 0 ) {
            setTimeout( () => {
                setCardFlip( $( `#card-${index}` ), index, false );
                setCardFlip( $( `#card-${firstCardFlippedIndex}` ), firstCardFlippedIndex, false );
            }, 1000 );
        }

        setCardFlip( event.currentTarget, index, !cardList[index].isFlip );
    } );

} );

function startCountDown() {
    countDown         = window.pyrite.time;
    intervalCountDown = setInterval( () => {
        if ( countDown <= 0 ) {
            fail();
        }
        countDown = countDown <= 0 ? 0 : countDown - 1;
        $( "#TimeCounter" ).text( `${Math.floor( countDown / 60 ) || 0}min ${(countDown % 60) || 0}s` );
    }, 1000 );
}

function stopCountDown() {
    clearInterval( intervalCountDown );
}

function fail() {
    stopCountDown();
    setGameFailRequest();
    Swal.fire( {
        icon:              "error",
        title:             "Perdu",
        text:              "Raté, vous avez perdu, vous ferez mieux la prochaine fois.",
        confirmButtonText: "Réessayer",
        allowOutsideClick: false,
        allowEscapeKey:    false,
    } ).then( ( result ) => {
        if ( result.isConfirmed ) {
            resetForm();
        }
    } );
}

function win() {
    stopCountDown();
    setGameWinRequest();
    Swal.fire( {
        icon:  "success",
        title: "Gagné",
        text:  "Vous avez gagné, vous avez su reconnaitre toutes les égalités en JS.",
        //html:              (<p>
        //    Vous avez gagné, vous avez su reconnaitre toutes les égalités en JS:
        //    <JsEquality cardsList={this.props.cardsList}/>
        //</p>),
        allowOutsideClick: false,
    } );
}


function prepareCardList() {
    cardList = cardList.map( x => ({
        ...x, isFind: false, isFlip: false,
    }) );
}

function setCardFind( element, index ) {
    $( element ).addClass( "found" ).addClass( "returned" ).find( ".Card__flipper" ).addClass( "flipped" );
    cardList[index].isFind = true;
    cardList[index].isFlip = false;
}

function setCardFlip( element, index, state = true ) {
    if ( !state ) {
        $( element ).removeClass( "returned" ).find( ".Card__flipper" ).removeClass( "flipped" );
        cardList[index].isFlip = false;
    } else {
        $( element ).addClass( "returned" ).find( ".Card__flipper" ).addClass( "flipped" );
        cardList[index].isFlip = true;
    }
}

function resetForm() {
// todo
}


function setGameFailRequest() {
    return axiosInstance.post( `/game/${window.pyrite.gameId}/fail` );
}

function setGameWinRequest() {
    return axiosInstance.post( `/game/${window.pyrite.gameId}/win`, {
        remainingTime: countDown,
    } );
}
