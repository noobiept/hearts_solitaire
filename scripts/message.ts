/// <reference path='../typings/tsd.d.ts' />

module Message
{
var MESSAGE = null;

export function init()
{
var message = document.querySelector( '#Message' );

$( message ).dialog({
        position: { my: 'left bottom', at: 'left bottom', of: window },
        dialogClass: 'no-close',
        draggable: false,
        autoOpen: false
    });

MESSAGE = message;
}

export function open( title, text )
{
$( MESSAGE ).text( text );
$( MESSAGE ).dialog( 'option', 'title', title );
$( MESSAGE ).dialog( 'open' );
}


export function close()
{
$( MESSAGE ).dialog( 'close' );
}

}