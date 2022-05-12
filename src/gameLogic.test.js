import {ship,gameBoard} from './gameLogic';

test('hit function marks hit positions',()=>{
    const shipObj=ship('carrier',2);
    shipObj.hit(1);
    expect(shipObj.hitPositions).toContain(1)
})

test('placeShip function add ships to the shipList array',()=>{
    const gameboard=gameBoard();
    gameboard.placeShip('carrier',2);
    expect(gameboard.shipList.length).toBe(1);
})

test('receiveAttack function sends the hit function to the correct ship',()=>{
    const gameboard=gameBoard();
    gameboard.placeShip('carrier',2)
    gameboard.receiveAttack(2);
    expect(gameboard.shipList[0].hitPositions).toContain(2);
    gameboard.receiveAttack(3);
    expect(gameboard.shipList[0].hitPositions).toContain(3);
})

test('gameBoard keep record of the missed attacks',()=>{
    const gameboard=gameBoard();
    gameboard.placeShip('carrier',2)
    gameboard.receiveAttack(1);
    expect(gameboard.missedHits).toContain(1)
})