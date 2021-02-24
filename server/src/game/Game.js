/*
 * Created in février 2021
 * Written by Eden Cadagiani <e.cadagiani@gmail.com>
 */

const MysqlConnection                                              = require( "database/MysqlConnection" );
const Board                                                        = require( "game/Board" );
const { GAME_STATUS, DEFAULT_WIDTH, DEFAULT_HEIGHT, DEFAULT_TIME } = require( "constants/constants" );

/**
 * Class permettant la gestion, et la creation d'une partie
 */
class Game {
    constructor( {
        id = null,
        userId,
        status = GAME_STATUS.IN_PROGRESS,
        width = DEFAULT_WIDTH,
        height = DEFAULT_HEIGHT,
        board = null, // object de type Board, si il est passé, la width et la height ne sont plus necessaire
        score = -1,
        time = DEFAULT_TIME,
    } = {} ) {
        this._status = status;
        this._board  = board || new Board( { width, height } );
        this._score  = score;
        this._time   = time;
        this._id     = id;
        this._userId = userId;
    }


    /**
     * créer et génère le board
     */
    init() {
        this._board.genBoard();
    }

    /**
     * transforme l'état de la partie en perdu
     */
    fail() {
        this._status = GAME_STATUS.FAIL;
    }

    /**
     * transforme l'état de la partie en gagné, et inscrit le score
     * @param remainingTime - temps restant en seconde
     */
    win( remainingTime ) {
        this._status = GAME_STATUS.WIN;
        this._score  = remainingTime;
    }


    /**
     * Sauvegarde la game en base de donnée, si un id est présente met à jour la partie actuel, sinon créer une nouvelle partie
     * @async
     * @return {Promise<boolean>} retourne true
     */
    async saveToDb() {
        const dbConn = new MysqlConnection();
        if ( this._id ) {
            await dbConn.query( `
                UPDATE games
                SET gm_score=?, 
                    gm_time=?, 
                    gm_board=?, 
                    gm_board_width=?,
                    gm_board_height=?,
                    gm_usr_id=?,
                    gm_gs_code=?
                WHERE gm_id = ?
                `, [
                this._score,
                this._time,
                this._board.toString(),
                this._board.width,
                this._board.height,
                this._userId,
                this._status,
                this._id,
            ], true );
            return true;
        } else {
            const res = await dbConn.query( `
                INSERT INTO games (gm_score, gm_time, gm_board, gm_board_width, gm_board_height, gm_usr_id, gm_gs_code)
                VALUES (?, ?, ?, ?, ?, ?, ? )
                `, [
                this._score,
                this._time,
                this._board.toString(),
                this._board.width,
                this._board.height,
                this._userId,
                this._status,
            ], true );
            this._id  = res.insertId;
            return true;
        }
    }

    /**
     * Methode static permettant de récuperer une partie de la base de donnée
     * @async
     * @param id - id de la game désiré
     * @return {Promise<Game|boolean>} - Retourne un objet game, si aucune game avec l'id demandé n'existe, retourne false.
     */
    static async getGameWithId( id ) {
        const dbConn = new MysqlConnection();
        const res    = await dbConn.query( `
                SELECT gm_id, gm_score, gm_time, gm_board, gm_board_width, gm_board_height, gm_usr_id, gm_gs_code
                FROM games
                WHERE gm_id = ?
                `, id, true );

        if ( res.length === 0 )
            return false;

        return new Game( {
            id:     res[0].gm_id,
            userId: res[0].gm_usr_id,
            status: res[0].gm_gs_code,
            score:  res[0].gm_score,
            time:   res[0].gm_time,
            board:  new Board( {
                width:     res[0].gm_board_width,
                height:    res[0].gm_board_height,
                cardsList: JSON.parse( res[0].gm_board ),
            } ),
        } );
    }

    /**
     * Retourne la game sous forme d'objet JS, plus simple à transformer en JSON
     * @return {{score: number, width, id: null, time: number, userId, board, status: string, height}}
     */
    toObject() {
        return {
            id:     this._id,
            userId: this._userId,
            status: this._status,
            time:   this._time,
            score:  this._score,
            width:  this._board.width,
            height: this._board.height,
            board:  this._board.cardsList,
        };
    }
}

module.exports = Game;
