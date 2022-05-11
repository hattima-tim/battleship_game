function ship(shipname,coordinate){
    let shipLength;
    switch(shipname){
        case 'carrier':
            shipLength=5;
            break;
        case 'battleship':
            shipLength=4;
            break;
        case ('destroyer' || 'submarine'):
            shipLength=3;
            break;
        case 'petrol boat':
            shipLength=2;
            break;
    }
    let hitPositions=[];
    function hit(hitCoordinate){
        hitPositions.push(hitCoordinate);
    }
    function isSunk(){
        if(hitPositions.length===shipLength){
            return true;
        }
        return false;
    }
    return {coordinate,shipLength,hitPositions,hit,isSunk}
}

function gameBoard(){
    let shipList=[];
    function placeShip(shipname,coordinate){
        shipList.push(ship(shipname,coordinate));
    }
    return {shipList,placeShip} 
}

export {ship,gameBoard}