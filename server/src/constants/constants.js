/*
 * Created in février 2021
 * Written by Eden Cadagiani <e.cadagiani@gmail.com>
 */

const GAME_STATUS = {
    "IN_PROGRESS": "IN_PROGRESS",
    "FAIL":        "FAIL",
    "WIN":         "WIN",
};

const DEFAULT_WIDTH  = 7;
const DEFAULT_HEIGHT = 4;
const DEFAULT_TIME = 80; // in second

module.exports = { GAME_STATUS, DEFAULT_WIDTH, DEFAULT_HEIGHT, DEFAULT_TIME };
