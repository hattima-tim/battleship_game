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
        for(let i=0;i<shipList.length;i++){
            if(hitCoordinate>=shipList[i].coordinate && hitCoordinate<(shipList[i].coordinate+shipList[i].shipLength)){
                shipList[i].hit(hitCoordinate);
                break;
            }else if(i===shipList.length-1){ //means,we are at the end of the loop but we did not find a hit
                missedHits.push(hitCoordinate)
            }
        }
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

function calculateShotCoordinate(
    previousEnemyGameBoardHitPositions,
    enemyGameBoard,
    coordinatesForAttack
    ){
    let updatedEnemyGameboardHitPositions = [];
    enemyGameBoard.shipList.forEach((ship)=>{
        updatedEnemyGameboardHitPositions=updatedEnemyGameboardHitPositions.concat(ship.hitPositions);
    });
    
    const oldLength=previousEnemyGameBoardHitPositions.length;
    const newLength=updatedEnemyGameboardHitPositions.length;
    let shotCoordinate;
    
    if(oldLength<newLength){ //means last attack was a hit
        previousEnemyGameBoardHitPositions.push(updatedEnemyGameboardHitPositions);
        shotCoordinate = updatedEnemyGameboardHitPositions[newLength-1]+1;
        coordinatesForAttack.splice(coordinatesForAttack.indexOf(shotCoordinate),1);
        return shotCoordinate;
    }else{
        shotCoordinate = coordinatesForAttack[Math.floor(Math.random()*coordinatesForAttack.length)];
        coordinatesForAttack.splice(coordinatesForAttack.indexOf(shotCoordinate),1);
        return shotCoordinate;
    }
}

function ai(){
       const gameboard=gameBoard();
       const gameBoardSize=100;
       let coordinatesForAttack=[];
       for(let i=0;i<gameBoardSize;i++){
           coordinatesForAttack.push(i);
       }
       let previousEnemyGameBoardHitPositions=[];
       
       function attack(enemyGameBoard){           
           const shotCoordinate=calculateShotCoordinate(previousEnemyGameBoardHitPositions,enemyGameBoard,coordinatesForAttack);
           enemyGameBoard.receiveAttack(shotCoordinate);
       }
       return {gameboard,attack}
}

export {ship,gameBoard,humanPlayer,ai}