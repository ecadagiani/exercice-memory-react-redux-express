/*
 * Created in février 2021
 * Written by Eden Cadagiani <e.cadagiani@gmail.com>
 */

const uniqId = require( "uniqid" );

const MysqlConnection = require( "database/MysqlConnection" );

class User {
    constructor( {
        id = null, name = "",
    } ) {
        this._id   = id;
        this._name = name || uniqId( "user-" );
    }

    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    toObject() {
        return {
            id:   this._id,
            name: this._name,
        };
    }

    async saveToDb() {
        const dbConn = new MysqlConnection();
        if ( this._id ) {
            await dbConn.query( `
                UPDATE users
                SET usr_name=?
                WHERE usr_id = ?
                `, [this._name, this._id], true );
            return true;
        } else {
            const resName = await dbConn.query( `
                SELECT usr_id
                FROM users
                WHERE usr_name = ?
                `, this._name );
            if ( resName.length > 0 ) {
                this._id = resName[0].usr_id;
                return true;
            }

            const res = await dbConn.query( `
                INSERT INTO users (usr_name)
                VALUES (?)
                `, this._name, true );
            this._id  = res.insertId;
            return true;
        }
    }

    static async getUserWithId( id ) {
        const dbConn = new MysqlConnection();
        const res    = dbConn.query( `
                SELECT usr_id, usr_name
                FROM users
                WHERE usr_id = ?
                `, id, true );
        if ( res.length === 0 )
            return false;

        return new User( {
            id:   res[0].usr_id,
            name: res[0].usr_name,
        } );
    }

}

module.exports = User;
