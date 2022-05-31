/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/dragDropLogic.js":
/*!******************************!*\
  !*** ./src/dragDropLogic.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addDragDropFeature": () => (/* binding */ addDragDropFeature)
/* harmony export */ });
function addDragDropFeature(human){
    const allDraggableDivs=document.querySelectorAll('.draggable');
    allDraggableDivs.forEach(div=>{
        for(let i=0;i<div.children.length;i++){
            div.children[i].addEventListener('mousedown',(e)=>{
                div.dataset.index=e.target.dataset.index; //this will give the position of draggable div on which mouse is on.
            })
        }
    })
    
    function dragstart(e){
        const shipBeingDragged=e.target;
        const positionOfMouseOnTheShip=shipBeingDragged.dataset.index;
        const lengthOfTheShip=shipBeingDragged.dataset.shiplength;
        const shipName=shipBeingDragged.id;
        const transferData=[positionOfMouseOnTheShip,lengthOfTheShip,shipName];
        e.dataTransfer.setData('ship-data', JSON.stringify(transferData));
    }
    
    function dragEnter(e){
        e.preventDefault();
    }
    
    function dragOver(e){
        e.preventDefault();
    }
    
    function dragLeave(e){
        
    }
    
    function isAShipAlreadyPlaced(
        cells_With_Same_Y_Axis_As_DropTarget,shipData,xAxisOfDroppedShipFirstPosition){
        let cellsWithShipPlaced=cells_With_Same_Y_Axis_As_DropTarget.filter(cell=>{
            return cell.classList.contains('dropped');
        });
        let shipsPositionsInXAxis=cellsWithShipPlaced.map(cell=>{
            return parseInt(cell.dataset.index.split(',')[0]);
        });
        let potentialShipPositionsForCurrentShip=[];
        const shipLength=shipData[1];
        for(let i=0;i<shipLength;i++){
            let droppedShipPosition=xAxisOfDroppedShipFirstPosition;
            droppedShipPosition+=i;
            potentialShipPositionsForCurrentShip.push(droppedShipPosition);
        }
        let totalOverlappedShipPositions = potentialShipPositionsForCurrentShip.some(potentialShipPosition=>{
            return shipsPositionsInXAxis.includes(potentialShipPosition);
        });
        if(totalOverlappedShipPositions){
            return true;
        }else{
            return false;
        }
    }

    function isThereEnoughSpace(cells_With_Same_Y_Axis_As_DropTarget,shipData,xAxisOfDroppedShipFirstPosition){
        const shiplength=Number(shipData[1]);
        const xAxisOfFirstCell=cells_With_Same_Y_Axis_As_DropTarget[0].dataset.index.split(',')[0];
        const xAxisOfLastCell=cells_With_Same_Y_Axis_As_DropTarget[cells_With_Same_Y_Axis_As_DropTarget.length-1].dataset.index.split(',')[0];
        if(xAxisOfFirstCell<=xAxisOfDroppedShipFirstPosition 
            && (xAxisOfLastCell>=xAxisOfDroppedShipFirstPosition+(shiplength-1))){
                // shilplength-1 because 95+5=100 but if you consider 95 and add 5 to it then it would be 99
                // you have to consider this nuance when working with gameboard cells
                return true; //means the ship can be placed
        }else{
            return false;
        }
    }

    function checkIfDropValid(event,shipData){
        const dropTargetCoordinates=event.target.dataset.index.split(',');
        const positionOfMouseOnTheShip=shipData[0];
        const xAxisOfDroppedShipFirstPosition=dropTargetCoordinates[0]-positionOfMouseOnTheShip;
        const humanGameboardCellsArray=[...humanGameboardCells];
        let cells_With_Same_Y_Axis_As_DropTarget=humanGameboardCellsArray.filter(cell=>{
            const yAxisOfCell=cell.dataset.index.split(',')[1];
            const yAxisOfDropTarget=dropTargetCoordinates[1];
            return yAxisOfCell===yAxisOfDropTarget;
        })

        if(isAShipAlreadyPlaced(cells_With_Same_Y_Axis_As_DropTarget,shipData,xAxisOfDroppedShipFirstPosition)){
            return false; //means there is already a ship placed in the same axis
        }else if(isThereEnoughSpace(cells_With_Same_Y_Axis_As_DropTarget,shipData,xAxisOfDroppedShipFirstPosition)){
                return true; //means the ship can be placed
        }else{
                return false;
        }
    }

    const totalShips=4;
    let dropCount=0;

    function drop(e){
        e.stopPropagation(); // stops the browser from redirecting.
        
        const xAxisOfDropTarget=Number(e.target.dataset.index.split(',')[0]);
        const shipDataJson=e.dataTransfer.getData('ship-data');
        const shipData=JSON.parse(shipDataJson);
        
        if(!checkIfDropValid(e,shipData)){
            return false; //this will stop the function and thus the drop will not be handled
        };
        
        const shiplength=shipData[1];
        const positionOfMouseOnTheShip=shipData[0];
        let xAxisOfShipStartPosition=xAxisOfDropTarget-positionOfMouseOnTheShip;
        const shipName=shipData[2];
        human.gameboard.placeShip(`${shipName}`,xAxisOfShipStartPosition);
        for(let i=0;i<shiplength;i++){
            humanGameboardCells[xAxisOfShipStartPosition+i].style.background='#444444';
            humanGameboardCells[xAxisOfShipStartPosition+i].classList.add('dropped');
        }

        const draggable=document.querySelector(`#${shipName}`);
        draggable.style.display='none';
        dropCount+=1;
        if(dropCount===totalShips){
            const startGameButton=document.querySelector('#start');
            startGameButton.style.display='block';
        }
    }
    
    const humanGameboardCells=document.querySelectorAll('#friendly-area-gameboard .square_div');
    humanGameboardCells.forEach(cell => {
        cell.addEventListener('dragenter', dragEnter)
        cell.addEventListener('dragover', dragOver);
        cell.addEventListener('dragleave', dragLeave);
        cell.addEventListener('drop', drop);
    });

    const draggableShips=document.querySelectorAll('.draggable');
    draggableShips.forEach(ship=>{
        ship.addEventListener('dragstart',dragstart);
    })
}



/***/ }),

/***/ "./src/gameLogic.js":
/*!**************************!*\
  !*** ./src/gameLogic.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ai": () => (/* binding */ ai),
/* harmony export */   "gameBoard": () => (/* binding */ gameBoard),
/* harmony export */   "humanPlayer": () => (/* binding */ humanPlayer),
/* harmony export */   "ship": () => (/* binding */ ship)
/* harmony export */ });
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
        console.log('working')
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

function ai(){
       const gameboard=gameBoard();
       const gameBoardSize=100;
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



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _gameLogic__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameLogic */ "./src/gameLogic.js");
/* harmony import */ var _dragDropLogic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dragDropLogic */ "./src/dragDropLogic.js");



const friendlyAreaGameboard=document.querySelector('#friendly-area-gameboard');
const enemyAreaGameboard=document.querySelector('#enemy-area-gameboard');

function createGameBoardDom(gameBoardContainerName){
    const gridSize=10;
    const gridSquare=100;
    gameBoardContainerName.style.gridTemplateRows=`repeat(${gridSize},1fr)`;
    gameBoardContainerName.style.gridTemplateColumns=`repeat(${gridSize},1fr)`;
    let squareDiv=[];
    let loopCount=1;
    let yAxis=1;
    for (let i=0;i<gridSquare;i++){
        squareDiv[i]=document.createElement('div');
        squareDiv[i].setAttribute('data-index',`${[i,yAxis]}`);
        if(loopCount===10){
            yAxis+=1;
            loopCount=1;
        }else{
            loopCount+=1;
        }
        squareDiv[i].classList.add('square_div');
        gameBoardContainerName.appendChild(squareDiv[i]);
    }
}

createGameBoardDom(friendlyAreaGameboard);
createGameBoardDom(enemyAreaGameboard);

const human=(0,_gameLogic__WEBPACK_IMPORTED_MODULE_0__.humanPlayer)();
(0,_dragDropLogic__WEBPACK_IMPORTED_MODULE_1__.addDragDropFeature)(human)
//human goes into this function and get changed inside the function
//but since human is an object we will get an updated human object in this module

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
            const targetIndex=parseInt(e.target.dataset.index.split(',')[0]);
            aiPlayer.gameboard.receiveAttack(targetIndex);
            markHitUnhit(aiPlayer,enemyAreaGameboard);
            itIsAiTurn(aiPlayer,human)
        }, {once : true})
    })  
}

function playGame(){
    const computer=(0,_gameLogic__WEBPACK_IMPORTED_MODULE_0__.ai)();
    computer.gameboard.placeShip('carrier',4);
    computer.gameboard.placeShip('battleship',14);
    computer.gameboard.placeShip('destroyer',34);
    computer.gameboard.placeShip('submarine',54);
    addEventListenerToAiGameBoard(computer,human);
    const humanGameBoard=human.gameboard;
    computer.attack(humanGameBoard)
}

const startGameButton=document.querySelector('#start');
startGameButton.addEventListener('click',()=>{
    playGame();
})
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0JBQW9CLGtCQUFrQjtBQUN0QztBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxHQUFHLFlBQVk7QUFDeEIsS0FBSztBQUNMOztBQUVBO0FBQ0EsbUJBQW1CLDhDQUFFO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcF9nYW1lLy4vc3JjL2RyYWdEcm9wTG9naWMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcF9nYW1lLy4vc3JjL2dhbWVMb2dpYy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwX2dhbWUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcF9nYW1lL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwX2dhbWUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwX2dhbWUvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwX2dhbWUvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gYWRkRHJhZ0Ryb3BGZWF0dXJlKGh1bWFuKXtcbiAgICBjb25zdCBhbGxEcmFnZ2FibGVEaXZzPWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5kcmFnZ2FibGUnKTtcbiAgICBhbGxEcmFnZ2FibGVEaXZzLmZvckVhY2goZGl2PT57XG4gICAgICAgIGZvcihsZXQgaT0wO2k8ZGl2LmNoaWxkcmVuLmxlbmd0aDtpKyspe1xuICAgICAgICAgICAgZGl2LmNoaWxkcmVuW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsKGUpPT57XG4gICAgICAgICAgICAgICAgZGl2LmRhdGFzZXQuaW5kZXg9ZS50YXJnZXQuZGF0YXNldC5pbmRleDsgLy90aGlzIHdpbGwgZ2l2ZSB0aGUgcG9zaXRpb24gb2YgZHJhZ2dhYmxlIGRpdiBvbiB3aGljaCBtb3VzZSBpcyBvbi5cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9KVxuICAgIFxuICAgIGZ1bmN0aW9uIGRyYWdzdGFydChlKXtcbiAgICAgICAgY29uc3Qgc2hpcEJlaW5nRHJhZ2dlZD1lLnRhcmdldDtcbiAgICAgICAgY29uc3QgcG9zaXRpb25PZk1vdXNlT25UaGVTaGlwPXNoaXBCZWluZ0RyYWdnZWQuZGF0YXNldC5pbmRleDtcbiAgICAgICAgY29uc3QgbGVuZ3RoT2ZUaGVTaGlwPXNoaXBCZWluZ0RyYWdnZWQuZGF0YXNldC5zaGlwbGVuZ3RoO1xuICAgICAgICBjb25zdCBzaGlwTmFtZT1zaGlwQmVpbmdEcmFnZ2VkLmlkO1xuICAgICAgICBjb25zdCB0cmFuc2ZlckRhdGE9W3Bvc2l0aW9uT2ZNb3VzZU9uVGhlU2hpcCxsZW5ndGhPZlRoZVNoaXAsc2hpcE5hbWVdO1xuICAgICAgICBlLmRhdGFUcmFuc2Zlci5zZXREYXRhKCdzaGlwLWRhdGEnLCBKU09OLnN0cmluZ2lmeSh0cmFuc2ZlckRhdGEpKTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gZHJhZ0VudGVyKGUpe1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIGRyYWdPdmVyKGUpe1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIGRyYWdMZWF2ZShlKXtcbiAgICAgICAgXG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIGlzQVNoaXBBbHJlYWR5UGxhY2VkKFxuICAgICAgICBjZWxsc19XaXRoX1NhbWVfWV9BeGlzX0FzX0Ryb3BUYXJnZXQsc2hpcERhdGEseEF4aXNPZkRyb3BwZWRTaGlwRmlyc3RQb3NpdGlvbil7XG4gICAgICAgIGxldCBjZWxsc1dpdGhTaGlwUGxhY2VkPWNlbGxzX1dpdGhfU2FtZV9ZX0F4aXNfQXNfRHJvcFRhcmdldC5maWx0ZXIoY2VsbD0+e1xuICAgICAgICAgICAgcmV0dXJuIGNlbGwuY2xhc3NMaXN0LmNvbnRhaW5zKCdkcm9wcGVkJyk7XG4gICAgICAgIH0pO1xuICAgICAgICBsZXQgc2hpcHNQb3NpdGlvbnNJblhBeGlzPWNlbGxzV2l0aFNoaXBQbGFjZWQubWFwKGNlbGw9PntcbiAgICAgICAgICAgIHJldHVybiBwYXJzZUludChjZWxsLmRhdGFzZXQuaW5kZXguc3BsaXQoJywnKVswXSk7XG4gICAgICAgIH0pO1xuICAgICAgICBsZXQgcG90ZW50aWFsU2hpcFBvc2l0aW9uc0ZvckN1cnJlbnRTaGlwPVtdO1xuICAgICAgICBjb25zdCBzaGlwTGVuZ3RoPXNoaXBEYXRhWzFdO1xuICAgICAgICBmb3IobGV0IGk9MDtpPHNoaXBMZW5ndGg7aSsrKXtcbiAgICAgICAgICAgIGxldCBkcm9wcGVkU2hpcFBvc2l0aW9uPXhBeGlzT2ZEcm9wcGVkU2hpcEZpcnN0UG9zaXRpb247XG4gICAgICAgICAgICBkcm9wcGVkU2hpcFBvc2l0aW9uKz1pO1xuICAgICAgICAgICAgcG90ZW50aWFsU2hpcFBvc2l0aW9uc0ZvckN1cnJlbnRTaGlwLnB1c2goZHJvcHBlZFNoaXBQb3NpdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHRvdGFsT3ZlcmxhcHBlZFNoaXBQb3NpdGlvbnMgPSBwb3RlbnRpYWxTaGlwUG9zaXRpb25zRm9yQ3VycmVudFNoaXAuc29tZShwb3RlbnRpYWxTaGlwUG9zaXRpb249PntcbiAgICAgICAgICAgIHJldHVybiBzaGlwc1Bvc2l0aW9uc0luWEF4aXMuaW5jbHVkZXMocG90ZW50aWFsU2hpcFBvc2l0aW9uKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmKHRvdGFsT3ZlcmxhcHBlZFNoaXBQb3NpdGlvbnMpe1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNUaGVyZUVub3VnaFNwYWNlKGNlbGxzX1dpdGhfU2FtZV9ZX0F4aXNfQXNfRHJvcFRhcmdldCxzaGlwRGF0YSx4QXhpc09mRHJvcHBlZFNoaXBGaXJzdFBvc2l0aW9uKXtcbiAgICAgICAgY29uc3Qgc2hpcGxlbmd0aD1OdW1iZXIoc2hpcERhdGFbMV0pO1xuICAgICAgICBjb25zdCB4QXhpc09mRmlyc3RDZWxsPWNlbGxzX1dpdGhfU2FtZV9ZX0F4aXNfQXNfRHJvcFRhcmdldFswXS5kYXRhc2V0LmluZGV4LnNwbGl0KCcsJylbMF07XG4gICAgICAgIGNvbnN0IHhBeGlzT2ZMYXN0Q2VsbD1jZWxsc19XaXRoX1NhbWVfWV9BeGlzX0FzX0Ryb3BUYXJnZXRbY2VsbHNfV2l0aF9TYW1lX1lfQXhpc19Bc19Ecm9wVGFyZ2V0Lmxlbmd0aC0xXS5kYXRhc2V0LmluZGV4LnNwbGl0KCcsJylbMF07XG4gICAgICAgIGlmKHhBeGlzT2ZGaXJzdENlbGw8PXhBeGlzT2ZEcm9wcGVkU2hpcEZpcnN0UG9zaXRpb24gXG4gICAgICAgICAgICAmJiAoeEF4aXNPZkxhc3RDZWxsPj14QXhpc09mRHJvcHBlZFNoaXBGaXJzdFBvc2l0aW9uKyhzaGlwbGVuZ3RoLTEpKSl7XG4gICAgICAgICAgICAgICAgLy8gc2hpbHBsZW5ndGgtMSBiZWNhdXNlIDk1KzU9MTAwIGJ1dCBpZiB5b3UgY29uc2lkZXIgOTUgYW5kIGFkZCA1IHRvIGl0IHRoZW4gaXQgd291bGQgYmUgOTlcbiAgICAgICAgICAgICAgICAvLyB5b3UgaGF2ZSB0byBjb25zaWRlciB0aGlzIG51YW5jZSB3aGVuIHdvcmtpbmcgd2l0aCBnYW1lYm9hcmQgY2VsbHNcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTsgLy9tZWFucyB0aGUgc2hpcCBjYW4gYmUgcGxhY2VkXG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2hlY2tJZkRyb3BWYWxpZChldmVudCxzaGlwRGF0YSl7XG4gICAgICAgIGNvbnN0IGRyb3BUYXJnZXRDb29yZGluYXRlcz1ldmVudC50YXJnZXQuZGF0YXNldC5pbmRleC5zcGxpdCgnLCcpO1xuICAgICAgICBjb25zdCBwb3NpdGlvbk9mTW91c2VPblRoZVNoaXA9c2hpcERhdGFbMF07XG4gICAgICAgIGNvbnN0IHhBeGlzT2ZEcm9wcGVkU2hpcEZpcnN0UG9zaXRpb249ZHJvcFRhcmdldENvb3JkaW5hdGVzWzBdLXBvc2l0aW9uT2ZNb3VzZU9uVGhlU2hpcDtcbiAgICAgICAgY29uc3QgaHVtYW5HYW1lYm9hcmRDZWxsc0FycmF5PVsuLi5odW1hbkdhbWVib2FyZENlbGxzXTtcbiAgICAgICAgbGV0IGNlbGxzX1dpdGhfU2FtZV9ZX0F4aXNfQXNfRHJvcFRhcmdldD1odW1hbkdhbWVib2FyZENlbGxzQXJyYXkuZmlsdGVyKGNlbGw9PntcbiAgICAgICAgICAgIGNvbnN0IHlBeGlzT2ZDZWxsPWNlbGwuZGF0YXNldC5pbmRleC5zcGxpdCgnLCcpWzFdO1xuICAgICAgICAgICAgY29uc3QgeUF4aXNPZkRyb3BUYXJnZXQ9ZHJvcFRhcmdldENvb3JkaW5hdGVzWzFdO1xuICAgICAgICAgICAgcmV0dXJuIHlBeGlzT2ZDZWxsPT09eUF4aXNPZkRyb3BUYXJnZXQ7XG4gICAgICAgIH0pXG5cbiAgICAgICAgaWYoaXNBU2hpcEFscmVhZHlQbGFjZWQoY2VsbHNfV2l0aF9TYW1lX1lfQXhpc19Bc19Ecm9wVGFyZ2V0LHNoaXBEYXRhLHhBeGlzT2ZEcm9wcGVkU2hpcEZpcnN0UG9zaXRpb24pKXtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTsgLy9tZWFucyB0aGVyZSBpcyBhbHJlYWR5IGEgc2hpcCBwbGFjZWQgaW4gdGhlIHNhbWUgYXhpc1xuICAgICAgICB9ZWxzZSBpZihpc1RoZXJlRW5vdWdoU3BhY2UoY2VsbHNfV2l0aF9TYW1lX1lfQXhpc19Bc19Ecm9wVGFyZ2V0LHNoaXBEYXRhLHhBeGlzT2ZEcm9wcGVkU2hpcEZpcnN0UG9zaXRpb24pKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTsgLy9tZWFucyB0aGUgc2hpcCBjYW4gYmUgcGxhY2VkXG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHRvdGFsU2hpcHM9NDtcbiAgICBsZXQgZHJvcENvdW50PTA7XG5cbiAgICBmdW5jdGlvbiBkcm9wKGUpe1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpOyAvLyBzdG9wcyB0aGUgYnJvd3NlciBmcm9tIHJlZGlyZWN0aW5nLlxuICAgICAgICBcbiAgICAgICAgY29uc3QgeEF4aXNPZkRyb3BUYXJnZXQ9TnVtYmVyKGUudGFyZ2V0LmRhdGFzZXQuaW5kZXguc3BsaXQoJywnKVswXSk7XG4gICAgICAgIGNvbnN0IHNoaXBEYXRhSnNvbj1lLmRhdGFUcmFuc2Zlci5nZXREYXRhKCdzaGlwLWRhdGEnKTtcbiAgICAgICAgY29uc3Qgc2hpcERhdGE9SlNPTi5wYXJzZShzaGlwRGF0YUpzb24pO1xuICAgICAgICBcbiAgICAgICAgaWYoIWNoZWNrSWZEcm9wVmFsaWQoZSxzaGlwRGF0YSkpe1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAvL3RoaXMgd2lsbCBzdG9wIHRoZSBmdW5jdGlvbiBhbmQgdGh1cyB0aGUgZHJvcCB3aWxsIG5vdCBiZSBoYW5kbGVkXG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICBjb25zdCBzaGlwbGVuZ3RoPXNoaXBEYXRhWzFdO1xuICAgICAgICBjb25zdCBwb3NpdGlvbk9mTW91c2VPblRoZVNoaXA9c2hpcERhdGFbMF07XG4gICAgICAgIGxldCB4QXhpc09mU2hpcFN0YXJ0UG9zaXRpb249eEF4aXNPZkRyb3BUYXJnZXQtcG9zaXRpb25PZk1vdXNlT25UaGVTaGlwO1xuICAgICAgICBjb25zdCBzaGlwTmFtZT1zaGlwRGF0YVsyXTtcbiAgICAgICAgaHVtYW4uZ2FtZWJvYXJkLnBsYWNlU2hpcChgJHtzaGlwTmFtZX1gLHhBeGlzT2ZTaGlwU3RhcnRQb3NpdGlvbik7XG4gICAgICAgIGZvcihsZXQgaT0wO2k8c2hpcGxlbmd0aDtpKyspe1xuICAgICAgICAgICAgaHVtYW5HYW1lYm9hcmRDZWxsc1t4QXhpc09mU2hpcFN0YXJ0UG9zaXRpb24raV0uc3R5bGUuYmFja2dyb3VuZD0nIzQ0NDQ0NCc7XG4gICAgICAgICAgICBodW1hbkdhbWVib2FyZENlbGxzW3hBeGlzT2ZTaGlwU3RhcnRQb3NpdGlvbitpXS5jbGFzc0xpc3QuYWRkKCdkcm9wcGVkJyk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBkcmFnZ2FibGU9ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgIyR7c2hpcE5hbWV9YCk7XG4gICAgICAgIGRyYWdnYWJsZS5zdHlsZS5kaXNwbGF5PSdub25lJztcbiAgICAgICAgZHJvcENvdW50Kz0xO1xuICAgICAgICBpZihkcm9wQ291bnQ9PT10b3RhbFNoaXBzKXtcbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0R2FtZUJ1dHRvbj1kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc3RhcnQnKTtcbiAgICAgICAgICAgIHN0YXJ0R2FtZUJ1dHRvbi5zdHlsZS5kaXNwbGF5PSdibG9jayc7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgY29uc3QgaHVtYW5HYW1lYm9hcmRDZWxscz1kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcjZnJpZW5kbHktYXJlYS1nYW1lYm9hcmQgLnNxdWFyZV9kaXYnKTtcbiAgICBodW1hbkdhbWVib2FyZENlbGxzLmZvckVhY2goY2VsbCA9PiB7XG4gICAgICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2VudGVyJywgZHJhZ0VudGVyKVxuICAgICAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgZHJhZ092ZXIpO1xuICAgICAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdsZWF2ZScsIGRyYWdMZWF2ZSk7XG4gICAgICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcignZHJvcCcsIGRyb3ApO1xuICAgIH0pO1xuXG4gICAgY29uc3QgZHJhZ2dhYmxlU2hpcHM9ZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmRyYWdnYWJsZScpO1xuICAgIGRyYWdnYWJsZVNoaXBzLmZvckVhY2goc2hpcD0+e1xuICAgICAgICBzaGlwLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdzdGFydCcsZHJhZ3N0YXJ0KTtcbiAgICB9KVxufVxuXG5leHBvcnQge2FkZERyYWdEcm9wRmVhdHVyZX0iLCJmdW5jdGlvbiBzaGlwKHNoaXBuYW1lLGNvb3JkaW5hdGUpe1xuICAgIGxldCBzaGlwTGVuZ3RoO1xuICAgIHN3aXRjaChzaGlwbmFtZSl7XG4gICAgICAgIGNhc2UgJ2NhcnJpZXInOlxuICAgICAgICAgICAgc2hpcExlbmd0aD01O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2JhdHRsZXNoaXAnOlxuICAgICAgICAgICAgc2hpcExlbmd0aD00O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgKCdkZXN0cm95ZXInKTpcbiAgICAgICAgICAgIHNoaXBMZW5ndGg9MztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICgnc3VibWFyaW5lJyk6XG4gICAgICAgICAgICBzaGlwTGVuZ3RoPTI7XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG4gICAgbGV0IGhpdFBvc2l0aW9ucz1bXTtcbiAgICBmdW5jdGlvbiBoaXQoaGl0Q29vcmRpbmF0ZSl7XG4gICAgICAgIGhpdFBvc2l0aW9ucy5wdXNoKGhpdENvb3JkaW5hdGUpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBpc1N1bmsoKXtcbiAgICAgICAgaWYoaGl0UG9zaXRpb25zLmxlbmd0aD09PXNoaXBMZW5ndGgpe1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4ge2Nvb3JkaW5hdGUsc2hpcExlbmd0aCxoaXRQb3NpdGlvbnMsaGl0LGlzU3Vua31cbn1cblxuZnVuY3Rpb24gZ2FtZUJvYXJkKCl7XG4gICAgbGV0IHNoaXBMaXN0PVtdO1xuICAgIGZ1bmN0aW9uIHBsYWNlU2hpcChzaGlwbmFtZSxjb29yZGluYXRlKXtcbiAgICAgICAgc2hpcExpc3QucHVzaChzaGlwKHNoaXBuYW1lLGNvb3JkaW5hdGUpKTtcbiAgICB9XG4gICAgbGV0IG1pc3NlZEhpdHM9W107XG4gICAgZnVuY3Rpb24gcmVjZWl2ZUF0dGFjayhoaXRDb29yZGluYXRlKXtcbiAgICAgICAgY29uc29sZS5sb2coJ3dvcmtpbmcnKVxuICAgICAgICBmb3IobGV0IGk9MDtpPHNoaXBMaXN0Lmxlbmd0aDtpKyspe1xuICAgICAgICAgICAgaWYoaGl0Q29vcmRpbmF0ZT49c2hpcExpc3RbaV0uY29vcmRpbmF0ZSAmJiBoaXRDb29yZGluYXRlPChzaGlwTGlzdFtpXS5jb29yZGluYXRlK3NoaXBMaXN0W2ldLnNoaXBMZW5ndGgpKXtcbiAgICAgICAgICAgICAgICBzaGlwTGlzdFtpXS5oaXQoaGl0Q29vcmRpbmF0ZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9ZWxzZSBpZihpPT09c2hpcExpc3QubGVuZ3RoLTEpeyAvL21lYW5zLHdlIGFyZSBhdCB0aGUgZW5kIG9mIHRoZSBsb29wIGJ1dCB3ZSBkaWQgbm90IGZpbmQgYSBoaXRcbiAgICAgICAgICAgICAgICBtaXNzZWRIaXRzLnB1c2goaGl0Q29vcmRpbmF0ZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ge3NoaXBMaXN0LHBsYWNlU2hpcCxyZWNlaXZlQXR0YWNrLG1pc3NlZEhpdHN9IFxufVxuXG5mdW5jdGlvbiBodW1hblBsYXllcigpe1xuICAgIGNvbnN0IGdhbWVib2FyZD1nYW1lQm9hcmQoKTtcbiAgICBmdW5jdGlvbiBhdHRhY2soZW5lbXlHYW1lQm9hcmQsYXR0YWNrQ29vcmRpbmF0ZSl7XG4gICAgICAgIGVuZW15R2FtZUJvYXJkLnJlY2VpdmVBdHRhY2soYXR0YWNrQ29vcmRpbmF0ZSk7XG4gICAgfVxuICAgIHJldHVybiB7Z2FtZWJvYXJkLGF0dGFja31cbn1cblxuZnVuY3Rpb24gYWkoKXtcbiAgICAgICBjb25zdCBnYW1lYm9hcmQ9Z2FtZUJvYXJkKCk7XG4gICAgICAgY29uc3QgZ2FtZUJvYXJkU2l6ZT0xMDA7XG4gICAgICAgbGV0IGNvb3JkaW5hdGVzRm9yQXR0YWNrPVtdO1xuICAgICAgIGZvcihsZXQgaT0wO2k8Z2FtZUJvYXJkU2l6ZTtpKyspe1xuICAgICAgICAgICBjb29yZGluYXRlc0ZvckF0dGFjay5wdXNoKGkpO1xuICAgICAgIH1cbiAgICAgICBmdW5jdGlvbiBhdHRhY2soZW5lbXlHYW1lQm9hcmQpe1xuICAgICAgICAgICBjb25zdCBzaG90Q29vcmRpbmF0ZT1jb29yZGluYXRlc0ZvckF0dGFja1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqY29vcmRpbmF0ZXNGb3JBdHRhY2subGVuZ3RoKV07XG4gICAgICAgICAgIGNvb3JkaW5hdGVzRm9yQXR0YWNrLnNwbGljZShjb29yZGluYXRlc0ZvckF0dGFjay5pbmRleE9mKHNob3RDb29yZGluYXRlKSwxKTtcbiAgICAgICAgICAgZW5lbXlHYW1lQm9hcmQucmVjZWl2ZUF0dGFjayhzaG90Q29vcmRpbmF0ZSk7XG4gICAgICAgfVxuICAgICAgIHJldHVybiB7Z2FtZWJvYXJkLGF0dGFja31cbn1cblxuZXhwb3J0IHtzaGlwLGdhbWVCb2FyZCxodW1hblBsYXllcixhaX0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7c2hpcCxnYW1lQm9hcmQsaHVtYW5QbGF5ZXIsYWl9IGZyb20gJy4vZ2FtZUxvZ2ljJztcbmltcG9ydCB7YWRkRHJhZ0Ryb3BGZWF0dXJlfSBmcm9tICcuL2RyYWdEcm9wTG9naWMnO1xuXG5jb25zdCBmcmllbmRseUFyZWFHYW1lYm9hcmQ9ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2ZyaWVuZGx5LWFyZWEtZ2FtZWJvYXJkJyk7XG5jb25zdCBlbmVteUFyZWFHYW1lYm9hcmQ9ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2VuZW15LWFyZWEtZ2FtZWJvYXJkJyk7XG5cbmZ1bmN0aW9uIGNyZWF0ZUdhbWVCb2FyZERvbShnYW1lQm9hcmRDb250YWluZXJOYW1lKXtcbiAgICBjb25zdCBncmlkU2l6ZT0xMDtcbiAgICBjb25zdCBncmlkU3F1YXJlPTEwMDtcbiAgICBnYW1lQm9hcmRDb250YWluZXJOYW1lLnN0eWxlLmdyaWRUZW1wbGF0ZVJvd3M9YHJlcGVhdCgke2dyaWRTaXplfSwxZnIpYDtcbiAgICBnYW1lQm9hcmRDb250YWluZXJOYW1lLnN0eWxlLmdyaWRUZW1wbGF0ZUNvbHVtbnM9YHJlcGVhdCgke2dyaWRTaXplfSwxZnIpYDtcbiAgICBsZXQgc3F1YXJlRGl2PVtdO1xuICAgIGxldCBsb29wQ291bnQ9MTtcbiAgICBsZXQgeUF4aXM9MTtcbiAgICBmb3IgKGxldCBpPTA7aTxncmlkU3F1YXJlO2krKyl7XG4gICAgICAgIHNxdWFyZURpdltpXT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgc3F1YXJlRGl2W2ldLnNldEF0dHJpYnV0ZSgnZGF0YS1pbmRleCcsYCR7W2kseUF4aXNdfWApO1xuICAgICAgICBpZihsb29wQ291bnQ9PT0xMCl7XG4gICAgICAgICAgICB5QXhpcys9MTtcbiAgICAgICAgICAgIGxvb3BDb3VudD0xO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIGxvb3BDb3VudCs9MTtcbiAgICAgICAgfVxuICAgICAgICBzcXVhcmVEaXZbaV0uY2xhc3NMaXN0LmFkZCgnc3F1YXJlX2RpdicpO1xuICAgICAgICBnYW1lQm9hcmRDb250YWluZXJOYW1lLmFwcGVuZENoaWxkKHNxdWFyZURpdltpXSk7XG4gICAgfVxufVxuXG5jcmVhdGVHYW1lQm9hcmREb20oZnJpZW5kbHlBcmVhR2FtZWJvYXJkKTtcbmNyZWF0ZUdhbWVCb2FyZERvbShlbmVteUFyZWFHYW1lYm9hcmQpO1xuXG5jb25zdCBodW1hbj1odW1hblBsYXllcigpO1xuYWRkRHJhZ0Ryb3BGZWF0dXJlKGh1bWFuKVxuLy9odW1hbiBnb2VzIGludG8gdGhpcyBmdW5jdGlvbiBhbmQgZ2V0IGNoYW5nZWQgaW5zaWRlIHRoZSBmdW5jdGlvblxuLy9idXQgc2luY2UgaHVtYW4gaXMgYW4gb2JqZWN0IHdlIHdpbGwgZ2V0IGFuIHVwZGF0ZWQgaHVtYW4gb2JqZWN0IGluIHRoaXMgbW9kdWxlXG5cbmZ1bmN0aW9uIG1hcmtTaGlwc0luVGhlRG9tKGh1bWFuR2FtZUJvYXJkKXtcbiAgICBodW1hbkdhbWVCb2FyZC5zaGlwTGlzdC5mb3JFYWNoKHNoaXAgPT4ge1xuICAgICAgICBmb3IobGV0IGk9MDtpPHNoaXAuc2hpcExlbmd0aDtpKyspe1xuICAgICAgICAgICAgZnJpZW5kbHlBcmVhR2FtZWJvYXJkLmNoaWxkcmVuW3NoaXAuY29vcmRpbmF0ZStpXS5zdHlsZS5iYWNrZ3JvdW5kPScjNDQ0NDQ0JztcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBtYXJrSGl0VW5oaXQoZW5lbXksZW5lbXlHYW1lYm9hcmREb20pe1xuICAgIGVuZW15LmdhbWVib2FyZC5zaGlwTGlzdC5mb3JFYWNoKChzaGlwKT0+e1xuICAgICAgICBzaGlwLmhpdFBvc2l0aW9ucy5mb3JFYWNoKHBvc2l0aW9uPT57XG4gICAgICAgICAgICBlbmVteUdhbWVib2FyZERvbS5jaGlsZHJlbltwb3NpdGlvbl0udGV4dENvbnRlbnQ9J3gnO1xuICAgICAgICB9KVxuICAgIH0pXG4gICAgZW5lbXkuZ2FtZWJvYXJkLm1pc3NlZEhpdHMuZm9yRWFjaChtaXNzZWRIaXRQb3NpdGlvbj0+e1xuICAgICAgICBlbmVteUdhbWVib2FyZERvbS5jaGlsZHJlblttaXNzZWRIaXRQb3NpdGlvbl0udGV4dENvbnRlbnQ9J28nO1xuICAgIH0pXG59XG5cbmZ1bmN0aW9uIGl0SXNBaVR1cm4oYWksaHVtYW4pe1xuICAgIGFpLmF0dGFjayhodW1hbi5nYW1lYm9hcmQpO1xuICAgIG1hcmtIaXRVbmhpdChodW1hbixmcmllbmRseUFyZWFHYW1lYm9hcmQpXG59XG5cbmZ1bmN0aW9uIGFkZEV2ZW50TGlzdGVuZXJUb0FpR2FtZUJvYXJkKGFpUGxheWVyLGh1bWFuKXtcbiAgICBlbmVteUFyZWFHYW1lYm9hcmQuY2hpbGROb2Rlcy5mb3JFYWNoKChjaGlsZCk9PntcbiAgICAgICAgY2hpbGQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLChlKT0+e1xuICAgICAgICAgICAgY29uc3QgdGFyZ2V0SW5kZXg9cGFyc2VJbnQoZS50YXJnZXQuZGF0YXNldC5pbmRleC5zcGxpdCgnLCcpWzBdKTtcbiAgICAgICAgICAgIGFpUGxheWVyLmdhbWVib2FyZC5yZWNlaXZlQXR0YWNrKHRhcmdldEluZGV4KTtcbiAgICAgICAgICAgIG1hcmtIaXRVbmhpdChhaVBsYXllcixlbmVteUFyZWFHYW1lYm9hcmQpO1xuICAgICAgICAgICAgaXRJc0FpVHVybihhaVBsYXllcixodW1hbilcbiAgICAgICAgfSwge29uY2UgOiB0cnVlfSlcbiAgICB9KSAgXG59XG5cbmZ1bmN0aW9uIHBsYXlHYW1lKCl7XG4gICAgY29uc3QgY29tcHV0ZXI9YWkoKTtcbiAgICBjb21wdXRlci5nYW1lYm9hcmQucGxhY2VTaGlwKCdjYXJyaWVyJyw0KTtcbiAgICBjb21wdXRlci5nYW1lYm9hcmQucGxhY2VTaGlwKCdiYXR0bGVzaGlwJywxNCk7XG4gICAgY29tcHV0ZXIuZ2FtZWJvYXJkLnBsYWNlU2hpcCgnZGVzdHJveWVyJywzNCk7XG4gICAgY29tcHV0ZXIuZ2FtZWJvYXJkLnBsYWNlU2hpcCgnc3VibWFyaW5lJyw1NCk7XG4gICAgYWRkRXZlbnRMaXN0ZW5lclRvQWlHYW1lQm9hcmQoY29tcHV0ZXIsaHVtYW4pO1xuICAgIGNvbnN0IGh1bWFuR2FtZUJvYXJkPWh1bWFuLmdhbWVib2FyZDtcbiAgICBjb21wdXRlci5hdHRhY2soaHVtYW5HYW1lQm9hcmQpXG59XG5cbmNvbnN0IHN0YXJ0R2FtZUJ1dHRvbj1kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc3RhcnQnKTtcbnN0YXJ0R2FtZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsKCk9PntcbiAgICBwbGF5R2FtZSgpO1xufSkiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=