function getRandomInt( min, max )
{
return Math.floor(Math.random() * (max - min + 1)) + min;
}


function getRandomFloat( min, max )
{
return Math.random() * (max - min) + min;
}

function calculateAngle( aX, aY, bX, bY )
{
    // make a triangle from the position the objectA is in, relative to the objectB position
var triangleOppositeSide = aY - bY;
var triangleAdjacentSide = bX - aX;

    // find the angle, given the two sides (of a right triangle)
return Math.atan2( triangleOppositeSide, triangleAdjacentSide );
}


function calculateHypotenuse( aX, aY, bX, bY )
{
var opposite = aY - bY;
var adjacent = bX - aX;

return Math.sqrt( Math.pow( opposite, 2 ) + Math.pow( adjacent, 2 ) );
}