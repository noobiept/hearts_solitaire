import { StatsData } from "./statistics.js";

export interface AppData {
    hearts_statistics?: StatsData;
}

/**
 * Calls the `callback` with a dictionary that has all the requested keys/values from `localStorage`.
 */
export function getData( keys: (keyof AppData)[], callback: (data: AppData) => void )
    {
    var objects = {};

    for (var a = 0 ; a < keys.length ; a++)
        {
        var key = keys[ a ];
        var value = localStorage.getItem( key );

        objects[ key ] = value && JSON.parse( value );
        }

    callback( objects );
    }


/**
 * Sets the given key/value into `localStorage`.
 * Converts the value to string (with json).
 */
export function setData( items: AppData )
    {
    for ( var key in items )
        {
        if ( items.hasOwnProperty( key ) )
            {
            localStorage.setItem( key, JSON.stringify( items[ key ] ) );
            }
        }
    }
