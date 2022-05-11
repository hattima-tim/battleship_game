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

