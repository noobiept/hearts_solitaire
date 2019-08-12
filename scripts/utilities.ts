export function getRandomInt( min: number, max: number )
{
return Math.floor(Math.random() * (max - min + 1)) + min;
}


export function getRandomFloat( min: number, max: number )
{
return Math.random() * (max - min) + min;
}

export function getSeveralRandomInt( min: number, max: number, howMany: number )
{
var total = max - min;

if ( total < howMany )
    {
    howMany = total;
    }

var numbers = [];

while ( numbers.length < howMany )
    {
    var random = getRandomInt( min, max );

    if ( numbers.indexOf( random ) < 0 )
        {
        numbers.push( random );
        }
    }

return numbers;
}


export function calculateAngle( aX: number, aY: number, bX: number, bY: number )
{
    // make a triangle from the position the objectA is in, relative to the objectB position
var triangleOppositeSide = aY - bY;
var triangleAdjacentSide = bX - aX;

    // find the angle, given the two sides (of a right triangle)
return Math.atan2( triangleOppositeSide, triangleAdjacentSide );
}


export function calculateHypotenuse( aX: number, aY: number, bX: number, bY: number )
{
var opposite = aY - bY;
var adjacent = bX - aX;

return Math.sqrt( Math.pow( opposite, 2 ) + Math.pow( adjacent, 2 ) );
}
