import {ship,gameBoard,humanPlayer,ai} from './gameLogic';

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
    gameboard.receiveAttack(2);
    expect(gameboard.missedHits).toContain(1)
})

test('if a hit is found,for loop inside receiveAttack function breaks',()=>{
    const gameboard=gameBoard();
    gameboard.placeShip('carrier',2)
    gameboard.receiveAttack(2);
    expect(gameboard.shipList[0].hitPositions).toContain(2);
    expect(gameboard.missedHits.length).toBe(0); 
})

test('ai can make random attack',()=>{
    const human=humanPlayer();
    human.gameboard.placeShip('carrier',5);
    const gameBoardSize=100;
    const aiPlayer=ai(gameBoardSize);
    aiPlayer.attack(human.gameboard);
    try{
        expect(human.gameboard.shipList[0].hitPositions.length).toBe(1);
    }catch{
        expect(human.gameboard.missedHits.length).toBe(1)
    }
})

test('ai can attack adjacent cells when there is a successful attack',()=>{
    const human=humanPlayer();
    human.gameboard.placeShip('carrier',5);
    human.gameboard.shipList[0].hitPositions.push(5);
    const gameBoardSize=100;
    const aiPlayer=ai(gameBoardSize);
    aiPlayer.attack(human.gameboard);
    aiPlayer.attack(human.gameboard);
    aiPlayer.attack(human.gameboard);
    aiPlayer.attack(human.gameboard);
    expect(human.gameboard.shipList[0].hitPositions).toEqual([5,6,7,8,9])
})
