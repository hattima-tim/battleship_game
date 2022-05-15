import {ship,gameBoard,humanPlayer,ai} from './gameLogic';

const friendlyAreaGameboard=document.querySelector('#friendly-area-gameboard');
const enemyAreaGameboard=document.querySelector('#enemy-area-gameboard');

function createGameBoardDom(gameBoardContainerName){
    const gridSize=10;
    const gridSquare=100;
    gameBoardContainerName.style.gridTemplateRows=`repeat(${gridSize},1fr)`;
    gameBoardContainerName.style.gridTemplateColumns=`repeat(${gridSize},1fr)`;
    let squareDiv=[];
    for (let i=0;i<gridSquare;i++){
        squareDiv[i]=document.createElement('div');
        squareDiv[i].setAttribute('data-index',`${i}`);
        squareDiv[i].classList.add('square_div');
        gameBoardContainerName.appendChild(squareDiv[i]);
    }
}

createGameBoardDom(friendlyAreaGameboard);
createGameBoardDom(enemyAreaGameboard);

function markShipsInTheDom(humanGameBoard){
    humanGameBoard.shipList.forEach(ship => {
        for(let i=0;i<ship.shipLength;i++){
            friendlyAreaGameboard.children[ship.coordinate+i].style.background='#444444';
        }
    });
}

function markHitUnhit(enemy,enemyGameboardDom){
    enemy.gameboard.shipList.forEach((ship)=>{
        ship.hitPositions.forEach(position=>{
            enemyGameboardDom.children[position].textContent='x';
        })
    })
    enemy.gameboard.missedHits.forEach(missedHitPosition=>{
        enemyGameboardDom.children[missedHitPosition].textContent='o';
    })
}

function itIsAiTurn(ai,human){
    ai.attack(human.gameboard);
    markHitUnhit(human,friendlyAreaGameboard)
}

function addEventListenerToAiGameBoard(aiPlayer,human){
    enemyAreaGameboard.childNodes.forEach((child)=>{
        child.addEventListener('click',(e)=>{
            const targetIndex=e.target.dataset.index;
            aiPlayer.gameboard.receiveAttack(targetIndex);
            markHitUnhit(aiPlayer,enemyAreaGameboard);
            itIsAiTurn(aiPlayer,human)
        }, {once : true})
    })  
}
