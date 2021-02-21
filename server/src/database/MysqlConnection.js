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


class MysqlConnection {
    constructor() {
        this._dbConn;
    }

    get dbConn() {
        return this._dbConn;
    }

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

    close() {
        this._dbConn.end();
    }

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
