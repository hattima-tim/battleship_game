function ship(shipname){
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
            length2;
            break;
    }
    let hittedPositions=[];
    function hit(hitCoordinate){
        hittedPositions.push(hitCoordinate);
    }
    function isSunk(){
        if(hittedPositions.length===shipLength){
            return true;
        }
        return false;
    }
    return {hit,isSunk}
}