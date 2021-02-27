/*
 * Created in février 2021
 * Written by Eden Cadagiani <e.cadagiani@gmail.com>
 */

let cardList = window.pyrite.cardList;


$( function() {
    prepareCardList();


    $( ".Card" ).click( ( event ) => {
        const index    = event.currentTarget.getAttribute( "data-index" );
        const identity = event.currentTarget.getAttribute( "data-identity" );
        const id       = event.currentTarget.getAttribute( "id" );
        if ( cardList[index].isFind ) return;

        if ( cardList[index].isFlip ) {
            $( event.currentTarget ).removeClass( "returned" ).find( ".Card__flipper" ).removeClass( "flipped" );
            cardList[index].isFlip = false;
        } else {
            $( event.currentTarget ).addClass( "returned" ).find( ".Card__flipper" ).addClass( "flipped" );
            cardList[index].isFlip = true;
        }
    } );

} );


function prepareCardList() {
    cardList = cardList.map( x => ({
        ...x, isFind: false, isFlip: false,
    }) );
}
