exports.EVENTS = {
    USER_CONNECT: 'connection',
    USER_DISCONNECT: 'disconect',
}

exports.ROOMS_EVENTS = {
    CREATE: 'room create',
    JOIN: 'room join',
    IS_SYNCED: 'room is_synced',
    ERROR: 'room error',
    CODE: 'room code'
}

exports.MOVEMENTS = {
    UP: 'move up',
    DOWN: 'move down',
    LEFT: 'move left',
    RIGHT: 'move right',
    END: 'end'
}

exports.MUSICTIME = {
    NEARTOTEM: 'near totem',
    NEARTOTEMISOK: 'near totem is ok',
    BEGIN: 'musictime begin',
    PLAYNOTE: 'play note',
    CORRECT: 'correct',
    WRONG: 'wrong',
    WINNED: 'winned',
    TAP: 'tap'
}

exports.OBSTACLES = {
    STRENGTH: 'strength',
    WISDOM: 'wisdom',
    BEAUTY: 'beauty',
    HOPE: 'hope'
}
