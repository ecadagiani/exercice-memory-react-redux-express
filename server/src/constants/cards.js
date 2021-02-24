/*
 * Created in février 2021
 * Written by Eden Cadagiani <e.cadagiani@gmail.com>
 */

/*
    Les différentes cartes qui seront affiché sur la page.
    Un simple tableau avec 1 carte par element.
    le champs identity permet de reconnaitre les paires, et d'indiquer au front l'image a utiliser
    le champs texte servira pour l'affichage
 */
const cards = [
    {
        identity: "et",
        text: "[] + []",
    },
    {
        identity: "et",
        text: "\"\"",
    },

    {
        identity: "diese",
        text: "[] + {}",
    },
    {
        identity: "diese",
        text: "[object Object]",
    },

    {
        identity: "plus",
        text: "NaN + null",
    },
    {
        identity: "plus",
        text: "NaN",
    },

    {
        identity: "egal",
        text: "\"0\" == []",
    },
    {
        identity: "egal",
        text: "false",
    },

    {
        identity: "barre",
        text: "\"11\" + 1",
    },
    {
        identity: "barre",
        text: "\"111\"",
    },

    {
        identity: "tiret",
        text: "\"11\" - 1",
    },
    {
        identity: "tiret",
        text: "10",
    },

    {
        identity: "tilde",
        text: "0 == \"0\"",
    },
    {
        identity: "tilde",
        text: "true",
    },

    {
        identity: "pointVirgule",
        text: "0 == []",
    },
    {
        identity: "pointVirgule",
        text: "true",
    },

    {
        identity: "pointExclamation",
        text: "\"2\" + \"2\" - 2",
    },
    {
        identity: "pointExclamation",
        text: "20",
    },

    {
        identity: "arobase",
        text: "Array(4).join(\"foo\"-1)",
    },
    {
        identity: "arobase",
        text: "NaNNaNNaNNaNNaN",
    },

    {
        identity: "dollar",
        text: "null + undefined",
    },
    {
        identity: "dollar",
        text: "NaN",
    },

    {
        identity: "pointInterrogation",
        text: "typeof NaN",
    },
    {
        identity: "pointInterrogation",
        text: "\"number\"",
    },

    {
        identity: "etoile",
        text: "null + 1",
    },
    {
        identity: "etoile",
        text: "1",
    },

    {
        identity: "pourcent",
        text: "typeof ( 1 + {})",
    },
    {
        identity: "pourcent",
        text: "\"string\"",
    },
];

module.exports = {
    cards,
};
