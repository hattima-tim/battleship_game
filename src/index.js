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

