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
    let missedHits=[];
    function receiveAttack(hitCoordinate){
        shipList.forEach((ship,index)=>{
            if(hitCoordinate>=ship.coordinate && hitCoordinate<=(ship.coordinate+ship.shipLength)){
                ship.hit(hitCoordinate);
            }else if(index===shipList.length-1){
                missedHits.push(hitCoordinate)
            }
        })
    }
    return {shipList,placeShip,receiveAttack,missedHits} 
}

export {ship,gameBoard}