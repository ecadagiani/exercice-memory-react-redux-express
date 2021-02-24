/*
 * Created in février 2021
 * Written by Eden Cadagiani <e.cadagiani@gmail.com>
 */

const mysql = require( "mysql" );

const dbConnInfo = {
    host:     process.env.SERVER_DB_HOST,
    user:     process.env.SERVER_DB_USER,
    password: process.env.SERVER_DB_PASSWORD,
    database: "pyrite",
    charset:  "utf8mb4",
    //insecureAuth: true
};

/**
 * Class permettant la gestion de la connexion à la bdd et des query SQL envoyé
 */
class MysqlConnection {
    constructor() {
        this._dbConn;
    }

    /**
     * Retourne la connexion à la bdd
     * @return {*}
     */
    get dbConn() {
        return this._dbConn;
    }

    /**
     * Essaie de ce connecter à la bdd
     * @async
     * @return {Promise<Connection>}
     * @private
     */
    __connect() {
        return new Promise( ( resolve, reject ) => {
            if ( this._dbConn )
                resolve( this._dbConn );

            this._dbConn = mysql.createConnection( dbConnInfo );
            this._dbConn.connect( ( err ) => {
                if ( err )
                    reject( err );
                else
                    resolve( this._dbConn );
            } );
        } );
    }

    /**
     * Essaie de ce connecter à la bdd (tente plusieurs fois à quelques secondes d'intervalle)
     * @async
     * @return {Promise<Connection>}
     */
    async connect() {
        const start = Date.now();
        if ( this._dbConn )
            return this._dbConn;

        // eslint-disable-next-line no-constant-condition
        while ( true ) {
            try {
                await this.__connect();
            } catch ( err ) {
                if ( Date.now() - start > 1000 * 60 * 5 )
                    throw err;

                continue;
            }
            return this._dbConn;
        }
    }

    /**
     * Ferme la connexion à la bdd
     */
    close() {
        this._dbConn.end();
    }

    /**
     * Envoie une query à mysql
     * @async
     * @param sql {string} - La query à envoyer
     * @param value {string} - Les éventuelles valeurs à ajouter à la query (a escape)
     * @param closeConn {boolean=false} - Si il faut fermer la connection après la query
     * @return {Promise<unknown>} - Retourne les résultats de la query
     */
    async query( sql, value, closeConn = false ) {
        await this.connect();
        return new Promise( ( resolve, reject ) => {
            const handler = ( error, results ) => {
                if ( error )
                    reject( error );
                else
                    resolve( results );

                if ( closeConn )
                    this.close();
            };

            if ( value )
                this.dbConn.query( sql, value, handler );
            else
                this.dbConn.query( sql, handler );

        } );
    }
}

module.exports = MysqlConnection;
