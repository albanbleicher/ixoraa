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
    MOVING:'move moving',
    END: 'move end'
}
exports.TOTEMS = {
    APPROACH:'totem approach',
    LEAVE: 'totem leave',
    BEGIN_LISTEN: 'totem begin listen',
    WAVE: 'totem wave',
    END_LISTEN: 'totem end listen',
    BEGIN_SYNC: 'totem begin sync',
    END_SYNC: 'totem end sync',
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
