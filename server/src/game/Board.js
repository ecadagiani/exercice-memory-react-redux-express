/*
 * Created in février 2021
 * Written by Eden Cadagiani <e.cadagiani@gmail.com>
 */
const { fill, random } = require( "lodash" );

const { cards } = require( "constants/cards" );

/**
 * Class permettant la gestion du board: le plateau de jeu contenant les cartes
 */
class Board {
    constructor( props ) {
        if ( props instanceof Board ) {
            this._width     = props.width;
            this._height    = props.height;
            this._cardsList = props.cardsList;
        } else if ( typeof props === "object" ) {
            const {
                width,
                height,
                cardsList = null,
            }      = props;
            this._width  = width;
            this._height = height;

            // si le board est donné dans les paramètres on le set. Sinon on créer un board de la taille indiqué (mais vide)
            this._cardsList = cardsList || fill( Array( height ), 0 ).map( () => new Array( width ) );
        }
    }

    get height() {
        return this._height;
    }

    get width() {
        return this._width;
    }

    get cardsList() {
        return this._cardsList;
    }

    /**
     * Génère aléatoirement un board des dimensions précisé à la construction de l'objet
     */
    genBoard() {
        // le tableau withoutReplacementCards va nous permettre de faire un tirage aléatoire sans remise.
        // comme il sera modifié, nous devont le copier pour nous assurer que la constante cards restera intact.
        let withoutReplacementCards = [...cards];

        // on parcours le tableau de carte, créé dans le constructeur, mais pour le moment vide
        for ( let i = 0; i < this._cardsList.length; i++ ) {
            for ( let j = 0; j < this._cardsList[i].length; j++ ) {
                if ( withoutReplacementCards.length === 0 ) { // si le tableau de carte est vide on stoppe la boucle
                    break;
                }
                // on sélectionne un item aléatoire du tableau withoutReplacementCards
                const randomIndex     = random( 0, withoutReplacementCards.length - 1 ); // donne en entier aléatoire entre 0 et (withoutReplacementCards.length - 1)
                this._cardsList[i][j] = withoutReplacementCards[randomIndex]; // on ajoute cet element aléatoire dans notre board
                withoutReplacementCards.splice( randomIndex, 1 ); // on supprime cet element pour ne pas avoir à le piocher de nouveau
            }
        }
    }

    /**
     * le board sera stocké sur la bdd sous forme de string, la methode toString est utilisé au moment de le serialisé
     * @return {string}
     */
    toString() {
        return JSON.stringify( this._cardsList );
    }
}

module.exports = Board;
