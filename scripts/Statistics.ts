module Statistics
{
var STATS = {
        games_played: 0,
        games_won: 0,
        win_rate: 0
    };



function saveObject( key, value )
{
localStorage.setItem( key, JSON.stringify( value ) );
}



function getObject( key )
{
var value = localStorage.getItem( key );

return value && JSON.parse( value );
}


export function load()
{
var stats = getObject( 'statistics' );

if ( stats !== null )
    {
    STATS.games_played = stats.games_played;
    STATS.games_won = stats.games_won;
    STATS.win_rate = stats.win_rate;
    }
}

export function save()
{
saveObject( 'statistics', STATS );
}

export function getGamesPlayed()
{
return STATS.games_played;
}

export function getGamesWon()
{
return STATS.games_won;
}

export function getWinRate()
{
return STATS.win_rate;
}

export function oneMoreGame( victory: boolean )
{
STATS.games_played++;

if ( victory === true )
    {
    STATS.games_won++;
    }

STATS.win_rate = Math.round( STATS.games_won / STATS.games_played * 100 );

save();
}



}