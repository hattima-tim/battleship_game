function ship(shipname,coordinate){
    let shipLength;
    switch(shipname){
        case 'carrier':
            shipLength=5;
            break;
        case 'battleship':
            shipLength=4;
            break;
        case ('destroyer'):
            shipLength=3;
            break;
        case ('submarine'):
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

function humanPlayer(){
    const gameboard=gameBoard();
    function attack(enemyGameBoard,attackCoordinate){
        enemyGameBoard.receiveAttack(attackCoordinate);
    }
    return {gameboard,attack}
}

function ai(gameBoardSize){
       const gameboard=gameBoard();
       let coordinatesForAttack=[];
       for(let i=0;i<gameBoardSize;i++){
           coordinatesForAttack.push(i);
       }
       function attack(enemyGameBoard){
           const shotCoordinate=coordinatesForAttack[Math.floor(Math.random()*coordinatesForAttack.length)];
           coordinatesForAttack.splice(coordinatesForAttack.indexOf(shotCoordinate),1);
           enemyGameBoard.receiveAttack(shotCoordinate);
       }
       return {gameboard,attack}
}

export {ship,gameBoard,humanPlayer,ai}