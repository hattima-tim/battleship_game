import {ship,gameBoard} from './gameLogic';

test('hit function marks hit positions',()=>{
    const shipObj=ship('carrier',2);
    shipObj.hit(1);
    expect(shipObj.hitPositions).toContain(1)
})

