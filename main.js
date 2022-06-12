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
function addDragDropFeature(human) {
  const allDraggableDivs = document.querySelectorAll(".draggable");
  allDraggableDivs.forEach((div) => {
    for (let i = 0; i < div.children.length; i++) {
      div.children[i].addEventListener("mousedown", (e) => {
        div.dataset.index = e.target.dataset.index; //this will give the position of draggable div on which mouse is on.
      });
    }
  });

  function dragstart(e) {
    const shipBeingDragged = e.target;
    const positionOfMouseOnTheShip = shipBeingDragged.dataset.index;
    const lengthOfTheShip = shipBeingDragged.dataset.shiplength;
    const shipName = shipBeingDragged.id;
    const transferData = [positionOfMouseOnTheShip, lengthOfTheShip, shipName];
    e.dataTransfer.setData("ship-data", JSON.stringify(transferData));
  }

  function dragEnter(e) {
    e.preventDefault();
  }

  function dragOver(e) {
    e.preventDefault();
  }

  function dragLeave(e) {}

  function isAShipAlreadyPlaced(
    cells_With_Same_Y_Axis_As_DropTarget,
    shipData,
    xAxisOfDroppedShipFirstPosition
  ) {
    let cellsWithShipPlaced = cells_With_Same_Y_Axis_As_DropTarget.filter(
      (cell) => {
        return cell.classList.contains("dropped");
      }
    );
    let shipsPositionsInXAxis = cellsWithShipPlaced.map((cell) => {
      return parseInt(cell.dataset.index.split(",")[0]);
    });
    let potentialShipPositionsForCurrentShip = [];
    const shipLength = shipData[1];
    for (let i = 0; i < shipLength; i++) {
      let droppedShipPosition = xAxisOfDroppedShipFirstPosition;
      droppedShipPosition += i;
      potentialShipPositionsForCurrentShip.push(droppedShipPosition);
    }
    let totalOverlappedShipPositions =
      potentialShipPositionsForCurrentShip.some((potentialShipPosition) => {
        return shipsPositionsInXAxis.includes(potentialShipPosition);
      });
    if (totalOverlappedShipPositions) {
      return true;
    } else {
      return false;
    }
  }

  function isThereEnoughSpace(
    cells_With_Same_Y_Axis_As_DropTarget,
    shipData,
    xAxisOfDroppedShipFirstPosition
  ) {
    const shiplength = Number(shipData[1]);
    const xAxisOfFirstCell =
      cells_With_Same_Y_Axis_As_DropTarget[0].dataset.index.split(",")[0];
    const xAxisOfLastCell =
      cells_With_Same_Y_Axis_As_DropTarget[
        cells_With_Same_Y_Axis_As_DropTarget.length - 1
      ].dataset.index.split(",")[0];
    if (
      xAxisOfFirstCell <= xAxisOfDroppedShipFirstPosition &&
      xAxisOfLastCell >= xAxisOfDroppedShipFirstPosition + (shiplength - 1)
    ) {
      // shilplength-1 because 95+5=100 but if you consider 95 and add 5 to it then it would be 99
      // you have to consider this nuance when working with gameboard cells
      return true; //means the ship can be placed
    } else {
      return false;
    }
  }

  function checkIfDropValid(event, shipData) {
    const dropTargetCoordinates = event.target.dataset.index.split(",");
    const positionOfMouseOnTheShip = shipData[0];
    const xAxisOfDroppedShipFirstPosition =
      dropTargetCoordinates[0] - positionOfMouseOnTheShip;
    const humanGameboardCellsArray = [...humanGameboardCells];
    let cells_With_Same_Y_Axis_As_DropTarget = humanGameboardCellsArray.filter(
      (cell) => {
        const yAxisOfCell = cell.dataset.index.split(",")[1];
        const yAxisOfDropTarget = dropTargetCoordinates[1];
        return yAxisOfCell === yAxisOfDropTarget;
      }
    );

    if (
      isAShipAlreadyPlaced(
        cells_With_Same_Y_Axis_As_DropTarget,
        shipData,
        xAxisOfDroppedShipFirstPosition
      )
    ) {
      return false; //means there is already a ship placed in the same axis
    } else if (
      isThereEnoughSpace(
        cells_With_Same_Y_Axis_As_DropTarget,
        shipData,
        xAxisOfDroppedShipFirstPosition
      )
    ) {
      return true; //means the ship can be placed
    } else {
      return false;
    }
  }

  const totalShips = 4;
  let dropCount = 0;

  function drop(e) {
    e.stopPropagation(); // stops the browser from redirecting.

    const xAxisOfDropTarget = Number(e.target.dataset.index.split(",")[0]);
    const shipDataJson = e.dataTransfer.getData("ship-data");
    const shipData = JSON.parse(shipDataJson);

    if (!checkIfDropValid(e, shipData)) {
      return false; //this will stop the function and thus the drop will not be handled
    }

    const shiplength = shipData[1];
    const positionOfMouseOnTheShip = shipData[0];
    let xAxisOfShipStartPosition = xAxisOfDropTarget - positionOfMouseOnTheShip;
    const shipName = shipData[2];
    human.gameboard.placeShip(`${shipName}`, xAxisOfShipStartPosition);
    for (let i = 0; i < shiplength; i++) {
      humanGameboardCells[xAxisOfShipStartPosition + i].style.background =
        "#444444";
      humanGameboardCells[xAxisOfShipStartPosition + i].classList.add(
        "dropped"
      );
    }

    const draggable = document.querySelector(`#${shipName}`);
    draggable.style.display = "none";
    dropCount += 1;
    if (dropCount === totalShips) {
      const startGameButton = document.querySelector("#start");
      startGameButton.style.display = "block";
    }
  }

  const humanGameboardCells = document.querySelectorAll(
    "#friendly-area-gameboard .square_div"
  );
  humanGameboardCells.forEach((cell) => {
    cell.addEventListener("dragenter", dragEnter);
    cell.addEventListener("dragover", dragOver);
    cell.addEventListener("dragleave", dragLeave);
    cell.addEventListener("drop", drop);
  });

  const draggableShips = document.querySelectorAll(".draggable");
  draggableShips.forEach((ship) => {
    ship.addEventListener("dragstart", dragstart);
  });
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
/* harmony export */   "computer": () => (/* binding */ computer),
/* harmony export */   "gameBoard": () => (/* binding */ gameBoard),
/* harmony export */   "getHitScoreOfBothPlayer": () => (/* binding */ getHitScoreOfBothPlayer),
/* harmony export */   "human": () => (/* binding */ human),
/* harmony export */   "humanPlayer": () => (/* binding */ humanPlayer),
/* harmony export */   "ship": () => (/* binding */ ship)
/* harmony export */ });
function ship(shipname, coordinate) {
  let shipLength;
  switch (shipname) {
    case "carrier":
      shipLength = 5;
      break;
    case "battleship":
      shipLength = 4;
      break;
    case "destroyer":
      shipLength = 3;
      break;
    case "submarine":
      shipLength = 2;
      break;
  }
  let hitPositions = [];
  function hit(hitCoordinate) {
    hitPositions.push(hitCoordinate);
  }
  function isSunk() {
    if (hitPositions.length === shipLength) {
      return true;
    }
    return false;
  }
  return { coordinate, shipLength, hitPositions, hit, isSunk };
}

function gameBoard() {
  let shipList = [];
  function placeShip(shipname, coordinate) {
    shipList.push(ship(shipname, coordinate));
  }
  let missedHits = [];
  function receiveAttack(hitCoordinate) {
    for (let i = 0; i < shipList.length; i++) {
      if (
        hitCoordinate >= shipList[i].coordinate &&
        hitCoordinate < shipList[i].coordinate + shipList[i].shipLength
      ) {
        shipList[i].hit(hitCoordinate);
        break;
      } else if (i === shipList.length - 1) {
        //means,we are at the end of the loop but we did not find a hit
        missedHits.push(hitCoordinate);
      }
    }
  }
  function areAllShipSunk() {
    return shipList.every((ship) => {
      return ship.isSunk();
    });
  }
  return { shipList, placeShip, receiveAttack, missedHits, areAllShipSunk };
}

function humanPlayer() {
  const gameboard = gameBoard();
  function attack(enemyGameBoard, attackCoordinate) {
    enemyGameBoard.receiveAttack(attackCoordinate);
  }
  return { gameboard, attack };
}

function returnLastSuccessfulHitPositionOfEnemyGameboard(
  previousEnemyGameBoardHitPositions,
  enemyGameBoard
) {
  let updatedEnemyGameboardHitPositions = [];
  enemyGameBoard.shipList.forEach((ship) => {
    updatedEnemyGameboardHitPositions =
      updatedEnemyGameboardHitPositions.concat(ship.hitPositions);
  });
  const lastHitPositionStr = updatedEnemyGameboardHitPositions
    .filter((position) => {
      return !previousEnemyGameBoardHitPositions.includes(position);
    })
    .toString();
  if (
    updatedEnemyGameboardHitPositions.length >
    previousEnemyGameBoardHitPositions.length
  ) {
    //means last attack was successful
    const lastHitPosition = parseInt(lastHitPositionStr);
    previousEnemyGameBoardHitPositions.push(lastHitPosition);
    return lastHitPosition;
  } else {
    return false; //means last attack was not successful
  }
}

function calculateShotCoordinate(
  previousEnemyGameBoardHitPositions,
  enemyGameBoard,
  coordinatesForAttack
) {
  const lastHitPositionOfEnemyGameboard =
    returnLastSuccessfulHitPositionOfEnemyGameboard(
      previousEnemyGameBoardHitPositions,
      enemyGameBoard
    );
  const coordinatesForAttackIncludeNextHit = coordinatesForAttack.includes(
    lastHitPositionOfEnemyGameboard + 1
  );
  let shotCoordinate;

  if (lastHitPositionOfEnemyGameboard && coordinatesForAttackIncludeNextHit) {
    //means last attack was a hit
    shotCoordinate = lastHitPositionOfEnemyGameboard + 1;
    coordinatesForAttack.splice(
      coordinatesForAttack.indexOf(shotCoordinate),
      1
    );
    return shotCoordinate;
  } else {
    shotCoordinate =
      coordinatesForAttack[
        Math.floor(Math.random() * coordinatesForAttack.length)
      ];
    coordinatesForAttack.splice(
      coordinatesForAttack.indexOf(shotCoordinate),
      1
    );
    return shotCoordinate;
  }
}

function ai() {
  const gameboard = gameBoard();
  const gameBoardSize = 100;
  let coordinatesForAttack = [];
  for (let i = 0; i < gameBoardSize; i++) {
    coordinatesForAttack.push(i);
  }
  let previousEnemyGameBoardHitPositions = [];

  function attack(enemyGameBoard) {
    const shotCoordinate = calculateShotCoordinate(
      previousEnemyGameBoardHitPositions,
      enemyGameBoard,
      coordinatesForAttack
    );
    enemyGameBoard.receiveAttack(shotCoordinate);
  }
  return { gameboard, attack };
}

const human = humanPlayer();
const computer = ai();

function getHitScoreOfBothPlayer() {
  let humanHitPositionsArr = [];
  computer.gameboard.shipList.forEach((ship) => {
    ship.hitPositions.forEach((position) => {
      humanHitPositionsArr.push(position);
    });
  });
  let humanMissedHitCount = computer.gameboard.missedHits.length;

  let computerHitPositionsArr = [];
  human.gameboard.shipList.forEach((ship) => {
    ship.hitPositions.forEach((position) => {
      computerHitPositionsArr.push(position);
    });
  });
  let computerMissedHitCount = human.gameboard.missedHits.length;

  return {
    humanHitCount: humanHitPositionsArr.length,
    humanMissedHitCount,
    computerHitCount: computerHitPositionsArr.length,
    computerMissedHitCount,
  };
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



const howToModal=document.querySelector('#modal');
const howToModalCloseButton=document.querySelector('#close_how_to_modal');
const howToButton=document.querySelector('.how_to');

howToButton.addEventListener('click',()=>{
  howToModal.showModal();
})

howToModalCloseButton.addEventListener('click',()=>{
  howToModal.close();
})

const friendlyAreaGameboard = document.querySelector(
  "#friendly-area-gameboard"
);
const enemyAreaGameboard = document.querySelector("#enemy-area-gameboard");

function createGameBoardDom(gameBoardContainerName) {
  const gridSize = 10;
  const gridSquare = 100;
  gameBoardContainerName.style.gridTemplateRows = `repeat(${gridSize},1fr)`;
  gameBoardContainerName.style.gridTemplateColumns = `repeat(${gridSize},1fr)`;
  let squareDiv = [];
  let loopCount = 1;
  let yAxis = 1;
  for (let i = 0; i < gridSquare; i++) {
    squareDiv[i] = document.createElement("div");
    squareDiv[i].setAttribute("data-index", `${[i, yAxis]}`);
    if (loopCount === 10) {
      yAxis += 1;
      loopCount = 1;
    } else {
      loopCount += 1;
    }
    squareDiv[i].classList.add("square_div");
    gameBoardContainerName.appendChild(squareDiv[i]);
  }
}

createGameBoardDom(friendlyAreaGameboard);
createGameBoardDom(enemyAreaGameboard);

(0,_dragDropLogic__WEBPACK_IMPORTED_MODULE_1__.addDragDropFeature)(_gameLogic__WEBPACK_IMPORTED_MODULE_0__.human);
//human goes into this function and get changed
//but since human is an object we will get an updated human object in this module

const autoPlaceButton=document.querySelector('#auto_place');
const shipContainer=document.querySelector('#all_ship_container');
const gameStartButton=document.querySelector('#start');

function markShipsInTheDom() {
  _gameLogic__WEBPACK_IMPORTED_MODULE_0__.human.gameboard.shipList.forEach((ship) => {
    for (let i = 0; i < ship.shipLength; i++) {
      friendlyAreaGameboard.children[ship.coordinate + i].style.background =
        "#444444";
    }
  });
}

function autoPlaceShips(){
  _gameLogic__WEBPACK_IMPORTED_MODULE_0__.human.gameboard.placeShip("carrier", 14);
  _gameLogic__WEBPACK_IMPORTED_MODULE_0__.human.gameboard.placeShip("battleship", 34);
  _gameLogic__WEBPACK_IMPORTED_MODULE_0__.human.gameboard.placeShip("destroyer", 94);
  _gameLogic__WEBPACK_IMPORTED_MODULE_0__.human.gameboard.placeShip("submarine", 74);
  markShipsInTheDom();
  shipContainer.style.display='none';
  gameStartButton.style.display='block';
}
autoPlaceButton.addEventListener('click',autoPlaceShips);

function markHitUnhit(enemy, enemyGameboardDom) {
  enemy.gameboard.shipList.forEach((ship) => {
    ship.hitPositions.forEach((position) => {
      enemyGameboardDom.children[position].style.background = "#F93943";
    });
  });
  enemy.gameboard.missedHits.forEach((missedHitPosition) => {
    enemyGameboardDom.children[missedHitPosition].style.background = "#05B2DC";
  });
}

function itIsAiTurn() {
  _gameLogic__WEBPACK_IMPORTED_MODULE_0__.computer.attack(_gameLogic__WEBPACK_IMPORTED_MODULE_0__.human.gameboard);
  markHitUnhit(_gameLogic__WEBPACK_IMPORTED_MODULE_0__.human, friendlyAreaGameboard);
}

function checkWinner() {
  const allComputerShipSunk = _gameLogic__WEBPACK_IMPORTED_MODULE_0__.computer.gameboard.areAllShipSunk();
  const allHumanShipSunk = _gameLogic__WEBPACK_IMPORTED_MODULE_0__.human.gameboard.areAllShipSunk();
  if (allComputerShipSunk) {
    return "you";
  } else if (allHumanShipSunk) {
    return "ai";
  } else {
    return false;
  }
}

function removeAllEventListenerInComputerGameboard() {
  enemyAreaGameboard.childNodes.forEach((child) => {
    child.removeEventListener("click", handleClickEvents);
  });
}

function showScore() {
  let score = (0,_gameLogic__WEBPACK_IMPORTED_MODULE_0__.getHitScoreOfBothPlayer)();
  let humanScoreCard = document.querySelector("#human_score_card");
  let humanMissedHitCount = humanScoreCard.children[0];
  let humanHitCount = humanScoreCard.children[1];
  humanMissedHitCount.textContent = `Missed Hits: ${score.humanMissedHitCount}`;
  humanHitCount.textContent = `Hits: ${score.humanHitCount}`;

  let computerScoreCard = document.querySelector("#ai_score_card");
  let computerMissedHitCount = computerScoreCard.children[0];
  let computerHitCount = computerScoreCard.children[1];
  computerMissedHitCount.textContent = `Missed Hits: ${score.computerMissedHitCount}`;
  computerHitCount.textContent = `Hits: ${score.computerHitCount}`;
}

function handleClickEvents() {
  const targetIndex = parseInt(this.dataset.index.split(",")[0]);
  _gameLogic__WEBPACK_IMPORTED_MODULE_0__.computer.gameboard.receiveAttack(targetIndex);
  markHitUnhit(_gameLogic__WEBPACK_IMPORTED_MODULE_0__.computer, enemyAreaGameboard);
  itIsAiTurn();
  showScore();
  const winner = checkWinner();
  if (winner) {
    alert(`${winner} won the game`);
    removeAllEventListenerInComputerGameboard();
  }
}
function addEventListenerToAiGameBoard() {
  enemyAreaGameboard.childNodes.forEach((child) => {
    child.addEventListener("click", handleClickEvents, { once: true });
  });
}

const aiDomContainer = document.querySelector("#ai_container");
const scoreCard = document.querySelector("#score_card_container");
function playGame(gameStartButton) {
  gameStartButton.style.display = "none";
  aiDomContainer.style.display = "block";
  scoreCard.style.display = "flex";
  _gameLogic__WEBPACK_IMPORTED_MODULE_0__.computer.gameboard.placeShip("carrier", 4);
  _gameLogic__WEBPACK_IMPORTED_MODULE_0__.computer.gameboard.placeShip("battleship", 14);
  _gameLogic__WEBPACK_IMPORTED_MODULE_0__.computer.gameboard.placeShip("destroyer", 34);
  _gameLogic__WEBPACK_IMPORTED_MODULE_0__.computer.gameboard.placeShip("submarine", 54);
  addEventListenerToAiGameBoard();
}

const startGameButton = document.querySelector("#start");
startGameButton.addEventListener("click", (e) => {
  playGame(e.target);
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQix5QkFBeUI7QUFDN0M7QUFDQSxvREFBb0Q7QUFDcEQsT0FBTztBQUNQO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxvQkFBb0IsZ0JBQWdCO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQjtBQUNuQixNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUI7QUFDbkIsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EseUJBQXlCOztBQUV6QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxvQkFBb0I7QUFDcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMsU0FBUztBQUMxQyxvQkFBb0IsZ0JBQWdCO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpREFBaUQsU0FBUztBQUMxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRThCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMzSzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IscUJBQXFCO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsV0FBVztBQUNYOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKLGtCQUFrQjtBQUNsQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLG1CQUFtQjtBQUNyQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNxRjs7Ozs7OztVQy9LckY7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7QUNOdUU7QUFDbEI7O0FBRXJEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSw0REFBNEQsU0FBUztBQUNyRSwrREFBK0QsU0FBUztBQUN4RTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsZ0JBQWdCO0FBQ2xDO0FBQ0EsK0NBQStDLFdBQVc7QUFDMUQ7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLGtFQUFrQixDQUFDLDZDQUFLO0FBQ3hCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsRUFBRSx3RUFBZ0M7QUFDbEMsb0JBQW9CLHFCQUFxQjtBQUN6QztBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQSxFQUFFLGlFQUF5QjtBQUMzQixFQUFFLGlFQUF5QjtBQUMzQixFQUFFLGlFQUF5QjtBQUMzQixFQUFFLGlFQUF5QjtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0EsRUFBRSx1REFBZSxDQUFDLHVEQUFlO0FBQ2pDLGVBQWUsNkNBQUs7QUFDcEI7O0FBRUE7QUFDQSw4QkFBOEIseUVBQWlDO0FBQy9ELDJCQUEyQixzRUFBOEI7QUFDekQ7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0EsY0FBYyxtRUFBdUI7QUFDckM7QUFDQTtBQUNBO0FBQ0Esb0RBQW9ELDBCQUEwQjtBQUM5RSx1Q0FBdUMsb0JBQW9COztBQUUzRDtBQUNBO0FBQ0E7QUFDQSx1REFBdUQsNkJBQTZCO0FBQ3BGLDBDQUEwQyx1QkFBdUI7QUFDakU7O0FBRUE7QUFDQTtBQUNBLEVBQUUsd0VBQWdDO0FBQ2xDLGVBQWUsZ0RBQVE7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlEQUF5RCxZQUFZO0FBQ3JFLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLG9FQUE0QjtBQUM5QixFQUFFLG9FQUE0QjtBQUM5QixFQUFFLG9FQUE0QjtBQUM5QixFQUFFLG9FQUE0QjtBQUM5QjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwX2dhbWUvLi9zcmMvZHJhZ0Ryb3BMb2dpYy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwX2dhbWUvLi9zcmMvZ2FtZUxvZ2ljLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXBfZ2FtZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwX2dhbWUvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXBfZ2FtZS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXBfZ2FtZS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXBfZ2FtZS8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBhZGREcmFnRHJvcEZlYXR1cmUoaHVtYW4pIHtcbiAgY29uc3QgYWxsRHJhZ2dhYmxlRGl2cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZHJhZ2dhYmxlXCIpO1xuICBhbGxEcmFnZ2FibGVEaXZzLmZvckVhY2goKGRpdikgPT4ge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGl2LmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICBkaXYuY2hpbGRyZW5baV0uYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCAoZSkgPT4ge1xuICAgICAgICBkaXYuZGF0YXNldC5pbmRleCA9IGUudGFyZ2V0LmRhdGFzZXQuaW5kZXg7IC8vdGhpcyB3aWxsIGdpdmUgdGhlIHBvc2l0aW9uIG9mIGRyYWdnYWJsZSBkaXYgb24gd2hpY2ggbW91c2UgaXMgb24uXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIGRyYWdzdGFydChlKSB7XG4gICAgY29uc3Qgc2hpcEJlaW5nRHJhZ2dlZCA9IGUudGFyZ2V0O1xuICAgIGNvbnN0IHBvc2l0aW9uT2ZNb3VzZU9uVGhlU2hpcCA9IHNoaXBCZWluZ0RyYWdnZWQuZGF0YXNldC5pbmRleDtcbiAgICBjb25zdCBsZW5ndGhPZlRoZVNoaXAgPSBzaGlwQmVpbmdEcmFnZ2VkLmRhdGFzZXQuc2hpcGxlbmd0aDtcbiAgICBjb25zdCBzaGlwTmFtZSA9IHNoaXBCZWluZ0RyYWdnZWQuaWQ7XG4gICAgY29uc3QgdHJhbnNmZXJEYXRhID0gW3Bvc2l0aW9uT2ZNb3VzZU9uVGhlU2hpcCwgbGVuZ3RoT2ZUaGVTaGlwLCBzaGlwTmFtZV07XG4gICAgZS5kYXRhVHJhbnNmZXIuc2V0RGF0YShcInNoaXAtZGF0YVwiLCBKU09OLnN0cmluZ2lmeSh0cmFuc2ZlckRhdGEpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRyYWdFbnRlcihlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICB9XG5cbiAgZnVuY3Rpb24gZHJhZ092ZXIoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRyYWdMZWF2ZShlKSB7fVxuXG4gIGZ1bmN0aW9uIGlzQVNoaXBBbHJlYWR5UGxhY2VkKFxuICAgIGNlbGxzX1dpdGhfU2FtZV9ZX0F4aXNfQXNfRHJvcFRhcmdldCxcbiAgICBzaGlwRGF0YSxcbiAgICB4QXhpc09mRHJvcHBlZFNoaXBGaXJzdFBvc2l0aW9uXG4gICkge1xuICAgIGxldCBjZWxsc1dpdGhTaGlwUGxhY2VkID0gY2VsbHNfV2l0aF9TYW1lX1lfQXhpc19Bc19Ecm9wVGFyZ2V0LmZpbHRlcihcbiAgICAgIChjZWxsKSA9PiB7XG4gICAgICAgIHJldHVybiBjZWxsLmNsYXNzTGlzdC5jb250YWlucyhcImRyb3BwZWRcIik7XG4gICAgICB9XG4gICAgKTtcbiAgICBsZXQgc2hpcHNQb3NpdGlvbnNJblhBeGlzID0gY2VsbHNXaXRoU2hpcFBsYWNlZC5tYXAoKGNlbGwpID0+IHtcbiAgICAgIHJldHVybiBwYXJzZUludChjZWxsLmRhdGFzZXQuaW5kZXguc3BsaXQoXCIsXCIpWzBdKTtcbiAgICB9KTtcbiAgICBsZXQgcG90ZW50aWFsU2hpcFBvc2l0aW9uc0ZvckN1cnJlbnRTaGlwID0gW107XG4gICAgY29uc3Qgc2hpcExlbmd0aCA9IHNoaXBEYXRhWzFdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcExlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgZHJvcHBlZFNoaXBQb3NpdGlvbiA9IHhBeGlzT2ZEcm9wcGVkU2hpcEZpcnN0UG9zaXRpb247XG4gICAgICBkcm9wcGVkU2hpcFBvc2l0aW9uICs9IGk7XG4gICAgICBwb3RlbnRpYWxTaGlwUG9zaXRpb25zRm9yQ3VycmVudFNoaXAucHVzaChkcm9wcGVkU2hpcFBvc2l0aW9uKTtcbiAgICB9XG4gICAgbGV0IHRvdGFsT3ZlcmxhcHBlZFNoaXBQb3NpdGlvbnMgPVxuICAgICAgcG90ZW50aWFsU2hpcFBvc2l0aW9uc0ZvckN1cnJlbnRTaGlwLnNvbWUoKHBvdGVudGlhbFNoaXBQb3NpdGlvbikgPT4ge1xuICAgICAgICByZXR1cm4gc2hpcHNQb3NpdGlvbnNJblhBeGlzLmluY2x1ZGVzKHBvdGVudGlhbFNoaXBQb3NpdGlvbik7XG4gICAgICB9KTtcbiAgICBpZiAodG90YWxPdmVybGFwcGVkU2hpcFBvc2l0aW9ucykge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBpc1RoZXJlRW5vdWdoU3BhY2UoXG4gICAgY2VsbHNfV2l0aF9TYW1lX1lfQXhpc19Bc19Ecm9wVGFyZ2V0LFxuICAgIHNoaXBEYXRhLFxuICAgIHhBeGlzT2ZEcm9wcGVkU2hpcEZpcnN0UG9zaXRpb25cbiAgKSB7XG4gICAgY29uc3Qgc2hpcGxlbmd0aCA9IE51bWJlcihzaGlwRGF0YVsxXSk7XG4gICAgY29uc3QgeEF4aXNPZkZpcnN0Q2VsbCA9XG4gICAgICBjZWxsc19XaXRoX1NhbWVfWV9BeGlzX0FzX0Ryb3BUYXJnZXRbMF0uZGF0YXNldC5pbmRleC5zcGxpdChcIixcIilbMF07XG4gICAgY29uc3QgeEF4aXNPZkxhc3RDZWxsID1cbiAgICAgIGNlbGxzX1dpdGhfU2FtZV9ZX0F4aXNfQXNfRHJvcFRhcmdldFtcbiAgICAgICAgY2VsbHNfV2l0aF9TYW1lX1lfQXhpc19Bc19Ecm9wVGFyZ2V0Lmxlbmd0aCAtIDFcbiAgICAgIF0uZGF0YXNldC5pbmRleC5zcGxpdChcIixcIilbMF07XG4gICAgaWYgKFxuICAgICAgeEF4aXNPZkZpcnN0Q2VsbCA8PSB4QXhpc09mRHJvcHBlZFNoaXBGaXJzdFBvc2l0aW9uICYmXG4gICAgICB4QXhpc09mTGFzdENlbGwgPj0geEF4aXNPZkRyb3BwZWRTaGlwRmlyc3RQb3NpdGlvbiArIChzaGlwbGVuZ3RoIC0gMSlcbiAgICApIHtcbiAgICAgIC8vIHNoaWxwbGVuZ3RoLTEgYmVjYXVzZSA5NSs1PTEwMCBidXQgaWYgeW91IGNvbnNpZGVyIDk1IGFuZCBhZGQgNSB0byBpdCB0aGVuIGl0IHdvdWxkIGJlIDk5XG4gICAgICAvLyB5b3UgaGF2ZSB0byBjb25zaWRlciB0aGlzIG51YW5jZSB3aGVuIHdvcmtpbmcgd2l0aCBnYW1lYm9hcmQgY2VsbHNcbiAgICAgIHJldHVybiB0cnVlOyAvL21lYW5zIHRoZSBzaGlwIGNhbiBiZSBwbGFjZWRcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGNoZWNrSWZEcm9wVmFsaWQoZXZlbnQsIHNoaXBEYXRhKSB7XG4gICAgY29uc3QgZHJvcFRhcmdldENvb3JkaW5hdGVzID0gZXZlbnQudGFyZ2V0LmRhdGFzZXQuaW5kZXguc3BsaXQoXCIsXCIpO1xuICAgIGNvbnN0IHBvc2l0aW9uT2ZNb3VzZU9uVGhlU2hpcCA9IHNoaXBEYXRhWzBdO1xuICAgIGNvbnN0IHhBeGlzT2ZEcm9wcGVkU2hpcEZpcnN0UG9zaXRpb24gPVxuICAgICAgZHJvcFRhcmdldENvb3JkaW5hdGVzWzBdIC0gcG9zaXRpb25PZk1vdXNlT25UaGVTaGlwO1xuICAgIGNvbnN0IGh1bWFuR2FtZWJvYXJkQ2VsbHNBcnJheSA9IFsuLi5odW1hbkdhbWVib2FyZENlbGxzXTtcbiAgICBsZXQgY2VsbHNfV2l0aF9TYW1lX1lfQXhpc19Bc19Ecm9wVGFyZ2V0ID0gaHVtYW5HYW1lYm9hcmRDZWxsc0FycmF5LmZpbHRlcihcbiAgICAgIChjZWxsKSA9PiB7XG4gICAgICAgIGNvbnN0IHlBeGlzT2ZDZWxsID0gY2VsbC5kYXRhc2V0LmluZGV4LnNwbGl0KFwiLFwiKVsxXTtcbiAgICAgICAgY29uc3QgeUF4aXNPZkRyb3BUYXJnZXQgPSBkcm9wVGFyZ2V0Q29vcmRpbmF0ZXNbMV07XG4gICAgICAgIHJldHVybiB5QXhpc09mQ2VsbCA9PT0geUF4aXNPZkRyb3BUYXJnZXQ7XG4gICAgICB9XG4gICAgKTtcblxuICAgIGlmIChcbiAgICAgIGlzQVNoaXBBbHJlYWR5UGxhY2VkKFxuICAgICAgICBjZWxsc19XaXRoX1NhbWVfWV9BeGlzX0FzX0Ryb3BUYXJnZXQsXG4gICAgICAgIHNoaXBEYXRhLFxuICAgICAgICB4QXhpc09mRHJvcHBlZFNoaXBGaXJzdFBvc2l0aW9uXG4gICAgICApXG4gICAgKSB7XG4gICAgICByZXR1cm4gZmFsc2U7IC8vbWVhbnMgdGhlcmUgaXMgYWxyZWFkeSBhIHNoaXAgcGxhY2VkIGluIHRoZSBzYW1lIGF4aXNcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgaXNUaGVyZUVub3VnaFNwYWNlKFxuICAgICAgICBjZWxsc19XaXRoX1NhbWVfWV9BeGlzX0FzX0Ryb3BUYXJnZXQsXG4gICAgICAgIHNoaXBEYXRhLFxuICAgICAgICB4QXhpc09mRHJvcHBlZFNoaXBGaXJzdFBvc2l0aW9uXG4gICAgICApXG4gICAgKSB7XG4gICAgICByZXR1cm4gdHJ1ZTsgLy9tZWFucyB0aGUgc2hpcCBjYW4gYmUgcGxhY2VkXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBjb25zdCB0b3RhbFNoaXBzID0gNDtcbiAgbGV0IGRyb3BDb3VudCA9IDA7XG5cbiAgZnVuY3Rpb24gZHJvcChlKSB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTsgLy8gc3RvcHMgdGhlIGJyb3dzZXIgZnJvbSByZWRpcmVjdGluZy5cblxuICAgIGNvbnN0IHhBeGlzT2ZEcm9wVGFyZ2V0ID0gTnVtYmVyKGUudGFyZ2V0LmRhdGFzZXQuaW5kZXguc3BsaXQoXCIsXCIpWzBdKTtcbiAgICBjb25zdCBzaGlwRGF0YUpzb24gPSBlLmRhdGFUcmFuc2Zlci5nZXREYXRhKFwic2hpcC1kYXRhXCIpO1xuICAgIGNvbnN0IHNoaXBEYXRhID0gSlNPTi5wYXJzZShzaGlwRGF0YUpzb24pO1xuXG4gICAgaWYgKCFjaGVja0lmRHJvcFZhbGlkKGUsIHNoaXBEYXRhKSkge1xuICAgICAgcmV0dXJuIGZhbHNlOyAvL3RoaXMgd2lsbCBzdG9wIHRoZSBmdW5jdGlvbiBhbmQgdGh1cyB0aGUgZHJvcCB3aWxsIG5vdCBiZSBoYW5kbGVkXG4gICAgfVxuXG4gICAgY29uc3Qgc2hpcGxlbmd0aCA9IHNoaXBEYXRhWzFdO1xuICAgIGNvbnN0IHBvc2l0aW9uT2ZNb3VzZU9uVGhlU2hpcCA9IHNoaXBEYXRhWzBdO1xuICAgIGxldCB4QXhpc09mU2hpcFN0YXJ0UG9zaXRpb24gPSB4QXhpc09mRHJvcFRhcmdldCAtIHBvc2l0aW9uT2ZNb3VzZU9uVGhlU2hpcDtcbiAgICBjb25zdCBzaGlwTmFtZSA9IHNoaXBEYXRhWzJdO1xuICAgIGh1bWFuLmdhbWVib2FyZC5wbGFjZVNoaXAoYCR7c2hpcE5hbWV9YCwgeEF4aXNPZlNoaXBTdGFydFBvc2l0aW9uKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBsZW5ndGg7IGkrKykge1xuICAgICAgaHVtYW5HYW1lYm9hcmRDZWxsc1t4QXhpc09mU2hpcFN0YXJ0UG9zaXRpb24gKyBpXS5zdHlsZS5iYWNrZ3JvdW5kID1cbiAgICAgICAgXCIjNDQ0NDQ0XCI7XG4gICAgICBodW1hbkdhbWVib2FyZENlbGxzW3hBeGlzT2ZTaGlwU3RhcnRQb3NpdGlvbiArIGldLmNsYXNzTGlzdC5hZGQoXG4gICAgICAgIFwiZHJvcHBlZFwiXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IGRyYWdnYWJsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCMke3NoaXBOYW1lfWApO1xuICAgIGRyYWdnYWJsZS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgZHJvcENvdW50ICs9IDE7XG4gICAgaWYgKGRyb3BDb3VudCA9PT0gdG90YWxTaGlwcykge1xuICAgICAgY29uc3Qgc3RhcnRHYW1lQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNzdGFydFwiKTtcbiAgICAgIHN0YXJ0R2FtZUJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGh1bWFuR2FtZWJvYXJkQ2VsbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgIFwiI2ZyaWVuZGx5LWFyZWEtZ2FtZWJvYXJkIC5zcXVhcmVfZGl2XCJcbiAgKTtcbiAgaHVtYW5HYW1lYm9hcmRDZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ2VudGVyXCIsIGRyYWdFbnRlcik7XG4gICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ292ZXJcIiwgZHJhZ092ZXIpO1xuICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdsZWF2ZVwiLCBkcmFnTGVhdmUpO1xuICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcImRyb3BcIiwgZHJvcCk7XG4gIH0pO1xuXG4gIGNvbnN0IGRyYWdnYWJsZVNoaXBzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5kcmFnZ2FibGVcIik7XG4gIGRyYWdnYWJsZVNoaXBzLmZvckVhY2goKHNoaXApID0+IHtcbiAgICBzaGlwLmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnc3RhcnRcIiwgZHJhZ3N0YXJ0KTtcbiAgfSk7XG59XG5cbmV4cG9ydCB7IGFkZERyYWdEcm9wRmVhdHVyZSB9O1xuIiwiZnVuY3Rpb24gc2hpcChzaGlwbmFtZSwgY29vcmRpbmF0ZSkge1xuICBsZXQgc2hpcExlbmd0aDtcbiAgc3dpdGNoIChzaGlwbmFtZSkge1xuICAgIGNhc2UgXCJjYXJyaWVyXCI6XG4gICAgICBzaGlwTGVuZ3RoID0gNTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJiYXR0bGVzaGlwXCI6XG4gICAgICBzaGlwTGVuZ3RoID0gNDtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJkZXN0cm95ZXJcIjpcbiAgICAgIHNoaXBMZW5ndGggPSAzO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInN1Ym1hcmluZVwiOlxuICAgICAgc2hpcExlbmd0aCA9IDI7XG4gICAgICBicmVhaztcbiAgfVxuICBsZXQgaGl0UG9zaXRpb25zID0gW107XG4gIGZ1bmN0aW9uIGhpdChoaXRDb29yZGluYXRlKSB7XG4gICAgaGl0UG9zaXRpb25zLnB1c2goaGl0Q29vcmRpbmF0ZSk7XG4gIH1cbiAgZnVuY3Rpb24gaXNTdW5rKCkge1xuICAgIGlmIChoaXRQb3NpdGlvbnMubGVuZ3RoID09PSBzaGlwTGVuZ3RoKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB7IGNvb3JkaW5hdGUsIHNoaXBMZW5ndGgsIGhpdFBvc2l0aW9ucywgaGl0LCBpc1N1bmsgfTtcbn1cblxuZnVuY3Rpb24gZ2FtZUJvYXJkKCkge1xuICBsZXQgc2hpcExpc3QgPSBbXTtcbiAgZnVuY3Rpb24gcGxhY2VTaGlwKHNoaXBuYW1lLCBjb29yZGluYXRlKSB7XG4gICAgc2hpcExpc3QucHVzaChzaGlwKHNoaXBuYW1lLCBjb29yZGluYXRlKSk7XG4gIH1cbiAgbGV0IG1pc3NlZEhpdHMgPSBbXTtcbiAgZnVuY3Rpb24gcmVjZWl2ZUF0dGFjayhoaXRDb29yZGluYXRlKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKFxuICAgICAgICBoaXRDb29yZGluYXRlID49IHNoaXBMaXN0W2ldLmNvb3JkaW5hdGUgJiZcbiAgICAgICAgaGl0Q29vcmRpbmF0ZSA8IHNoaXBMaXN0W2ldLmNvb3JkaW5hdGUgKyBzaGlwTGlzdFtpXS5zaGlwTGVuZ3RoXG4gICAgICApIHtcbiAgICAgICAgc2hpcExpc3RbaV0uaGl0KGhpdENvb3JkaW5hdGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIH0gZWxzZSBpZiAoaSA9PT0gc2hpcExpc3QubGVuZ3RoIC0gMSkge1xuICAgICAgICAvL21lYW5zLHdlIGFyZSBhdCB0aGUgZW5kIG9mIHRoZSBsb29wIGJ1dCB3ZSBkaWQgbm90IGZpbmQgYSBoaXRcbiAgICAgICAgbWlzc2VkSGl0cy5wdXNoKGhpdENvb3JkaW5hdGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBhcmVBbGxTaGlwU3VuaygpIHtcbiAgICByZXR1cm4gc2hpcExpc3QuZXZlcnkoKHNoaXApID0+IHtcbiAgICAgIHJldHVybiBzaGlwLmlzU3VuaygpO1xuICAgIH0pO1xuICB9XG4gIHJldHVybiB7IHNoaXBMaXN0LCBwbGFjZVNoaXAsIHJlY2VpdmVBdHRhY2ssIG1pc3NlZEhpdHMsIGFyZUFsbFNoaXBTdW5rIH07XG59XG5cbmZ1bmN0aW9uIGh1bWFuUGxheWVyKCkge1xuICBjb25zdCBnYW1lYm9hcmQgPSBnYW1lQm9hcmQoKTtcbiAgZnVuY3Rpb24gYXR0YWNrKGVuZW15R2FtZUJvYXJkLCBhdHRhY2tDb29yZGluYXRlKSB7XG4gICAgZW5lbXlHYW1lQm9hcmQucmVjZWl2ZUF0dGFjayhhdHRhY2tDb29yZGluYXRlKTtcbiAgfVxuICByZXR1cm4geyBnYW1lYm9hcmQsIGF0dGFjayB9O1xufVxuXG5mdW5jdGlvbiByZXR1cm5MYXN0U3VjY2Vzc2Z1bEhpdFBvc2l0aW9uT2ZFbmVteUdhbWVib2FyZChcbiAgcHJldmlvdXNFbmVteUdhbWVCb2FyZEhpdFBvc2l0aW9ucyxcbiAgZW5lbXlHYW1lQm9hcmRcbikge1xuICBsZXQgdXBkYXRlZEVuZW15R2FtZWJvYXJkSGl0UG9zaXRpb25zID0gW107XG4gIGVuZW15R2FtZUJvYXJkLnNoaXBMaXN0LmZvckVhY2goKHNoaXApID0+IHtcbiAgICB1cGRhdGVkRW5lbXlHYW1lYm9hcmRIaXRQb3NpdGlvbnMgPVxuICAgICAgdXBkYXRlZEVuZW15R2FtZWJvYXJkSGl0UG9zaXRpb25zLmNvbmNhdChzaGlwLmhpdFBvc2l0aW9ucyk7XG4gIH0pO1xuICBjb25zdCBsYXN0SGl0UG9zaXRpb25TdHIgPSB1cGRhdGVkRW5lbXlHYW1lYm9hcmRIaXRQb3NpdGlvbnNcbiAgICAuZmlsdGVyKChwb3NpdGlvbikgPT4ge1xuICAgICAgcmV0dXJuICFwcmV2aW91c0VuZW15R2FtZUJvYXJkSGl0UG9zaXRpb25zLmluY2x1ZGVzKHBvc2l0aW9uKTtcbiAgICB9KVxuICAgIC50b1N0cmluZygpO1xuICBpZiAoXG4gICAgdXBkYXRlZEVuZW15R2FtZWJvYXJkSGl0UG9zaXRpb25zLmxlbmd0aCA+XG4gICAgcHJldmlvdXNFbmVteUdhbWVCb2FyZEhpdFBvc2l0aW9ucy5sZW5ndGhcbiAgKSB7XG4gICAgLy9tZWFucyBsYXN0IGF0dGFjayB3YXMgc3VjY2Vzc2Z1bFxuICAgIGNvbnN0IGxhc3RIaXRQb3NpdGlvbiA9IHBhcnNlSW50KGxhc3RIaXRQb3NpdGlvblN0cik7XG4gICAgcHJldmlvdXNFbmVteUdhbWVCb2FyZEhpdFBvc2l0aW9ucy5wdXNoKGxhc3RIaXRQb3NpdGlvbik7XG4gICAgcmV0dXJuIGxhc3RIaXRQb3NpdGlvbjtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2U7IC8vbWVhbnMgbGFzdCBhdHRhY2sgd2FzIG5vdCBzdWNjZXNzZnVsXG4gIH1cbn1cblxuZnVuY3Rpb24gY2FsY3VsYXRlU2hvdENvb3JkaW5hdGUoXG4gIHByZXZpb3VzRW5lbXlHYW1lQm9hcmRIaXRQb3NpdGlvbnMsXG4gIGVuZW15R2FtZUJvYXJkLFxuICBjb29yZGluYXRlc0ZvckF0dGFja1xuKSB7XG4gIGNvbnN0IGxhc3RIaXRQb3NpdGlvbk9mRW5lbXlHYW1lYm9hcmQgPVxuICAgIHJldHVybkxhc3RTdWNjZXNzZnVsSGl0UG9zaXRpb25PZkVuZW15R2FtZWJvYXJkKFxuICAgICAgcHJldmlvdXNFbmVteUdhbWVCb2FyZEhpdFBvc2l0aW9ucyxcbiAgICAgIGVuZW15R2FtZUJvYXJkXG4gICAgKTtcbiAgY29uc3QgY29vcmRpbmF0ZXNGb3JBdHRhY2tJbmNsdWRlTmV4dEhpdCA9IGNvb3JkaW5hdGVzRm9yQXR0YWNrLmluY2x1ZGVzKFxuICAgIGxhc3RIaXRQb3NpdGlvbk9mRW5lbXlHYW1lYm9hcmQgKyAxXG4gICk7XG4gIGxldCBzaG90Q29vcmRpbmF0ZTtcblxuICBpZiAobGFzdEhpdFBvc2l0aW9uT2ZFbmVteUdhbWVib2FyZCAmJiBjb29yZGluYXRlc0ZvckF0dGFja0luY2x1ZGVOZXh0SGl0KSB7XG4gICAgLy9tZWFucyBsYXN0IGF0dGFjayB3YXMgYSBoaXRcbiAgICBzaG90Q29vcmRpbmF0ZSA9IGxhc3RIaXRQb3NpdGlvbk9mRW5lbXlHYW1lYm9hcmQgKyAxO1xuICAgIGNvb3JkaW5hdGVzRm9yQXR0YWNrLnNwbGljZShcbiAgICAgIGNvb3JkaW5hdGVzRm9yQXR0YWNrLmluZGV4T2Yoc2hvdENvb3JkaW5hdGUpLFxuICAgICAgMVxuICAgICk7XG4gICAgcmV0dXJuIHNob3RDb29yZGluYXRlO1xuICB9IGVsc2Uge1xuICAgIHNob3RDb29yZGluYXRlID1cbiAgICAgIGNvb3JkaW5hdGVzRm9yQXR0YWNrW1xuICAgICAgICBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjb29yZGluYXRlc0ZvckF0dGFjay5sZW5ndGgpXG4gICAgICBdO1xuICAgIGNvb3JkaW5hdGVzRm9yQXR0YWNrLnNwbGljZShcbiAgICAgIGNvb3JkaW5hdGVzRm9yQXR0YWNrLmluZGV4T2Yoc2hvdENvb3JkaW5hdGUpLFxuICAgICAgMVxuICAgICk7XG4gICAgcmV0dXJuIHNob3RDb29yZGluYXRlO1xuICB9XG59XG5cbmZ1bmN0aW9uIGFpKCkge1xuICBjb25zdCBnYW1lYm9hcmQgPSBnYW1lQm9hcmQoKTtcbiAgY29uc3QgZ2FtZUJvYXJkU2l6ZSA9IDEwMDtcbiAgbGV0IGNvb3JkaW5hdGVzRm9yQXR0YWNrID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZ2FtZUJvYXJkU2l6ZTsgaSsrKSB7XG4gICAgY29vcmRpbmF0ZXNGb3JBdHRhY2sucHVzaChpKTtcbiAgfVxuICBsZXQgcHJldmlvdXNFbmVteUdhbWVCb2FyZEhpdFBvc2l0aW9ucyA9IFtdO1xuXG4gIGZ1bmN0aW9uIGF0dGFjayhlbmVteUdhbWVCb2FyZCkge1xuICAgIGNvbnN0IHNob3RDb29yZGluYXRlID0gY2FsY3VsYXRlU2hvdENvb3JkaW5hdGUoXG4gICAgICBwcmV2aW91c0VuZW15R2FtZUJvYXJkSGl0UG9zaXRpb25zLFxuICAgICAgZW5lbXlHYW1lQm9hcmQsXG4gICAgICBjb29yZGluYXRlc0ZvckF0dGFja1xuICAgICk7XG4gICAgZW5lbXlHYW1lQm9hcmQucmVjZWl2ZUF0dGFjayhzaG90Q29vcmRpbmF0ZSk7XG4gIH1cbiAgcmV0dXJuIHsgZ2FtZWJvYXJkLCBhdHRhY2sgfTtcbn1cblxuY29uc3QgaHVtYW4gPSBodW1hblBsYXllcigpO1xuY29uc3QgY29tcHV0ZXIgPSBhaSgpO1xuXG5mdW5jdGlvbiBnZXRIaXRTY29yZU9mQm90aFBsYXllcigpIHtcbiAgbGV0IGh1bWFuSGl0UG9zaXRpb25zQXJyID0gW107XG4gIGNvbXB1dGVyLmdhbWVib2FyZC5zaGlwTGlzdC5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgc2hpcC5oaXRQb3NpdGlvbnMuZm9yRWFjaCgocG9zaXRpb24pID0+IHtcbiAgICAgIGh1bWFuSGl0UG9zaXRpb25zQXJyLnB1c2gocG9zaXRpb24pO1xuICAgIH0pO1xuICB9KTtcbiAgbGV0IGh1bWFuTWlzc2VkSGl0Q291bnQgPSBjb21wdXRlci5nYW1lYm9hcmQubWlzc2VkSGl0cy5sZW5ndGg7XG5cbiAgbGV0IGNvbXB1dGVySGl0UG9zaXRpb25zQXJyID0gW107XG4gIGh1bWFuLmdhbWVib2FyZC5zaGlwTGlzdC5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgc2hpcC5oaXRQb3NpdGlvbnMuZm9yRWFjaCgocG9zaXRpb24pID0+IHtcbiAgICAgIGNvbXB1dGVySGl0UG9zaXRpb25zQXJyLnB1c2gocG9zaXRpb24pO1xuICAgIH0pO1xuICB9KTtcbiAgbGV0IGNvbXB1dGVyTWlzc2VkSGl0Q291bnQgPSBodW1hbi5nYW1lYm9hcmQubWlzc2VkSGl0cy5sZW5ndGg7XG5cbiAgcmV0dXJuIHtcbiAgICBodW1hbkhpdENvdW50OiBodW1hbkhpdFBvc2l0aW9uc0Fyci5sZW5ndGgsXG4gICAgaHVtYW5NaXNzZWRIaXRDb3VudCxcbiAgICBjb21wdXRlckhpdENvdW50OiBjb21wdXRlckhpdFBvc2l0aW9uc0Fyci5sZW5ndGgsXG4gICAgY29tcHV0ZXJNaXNzZWRIaXRDb3VudCxcbiAgfTtcbn1cbmV4cG9ydCB7IHNoaXAsIGdhbWVCb2FyZCwgaHVtYW4sIGNvbXB1dGVyLCBodW1hblBsYXllciwgYWkgLGdldEhpdFNjb3JlT2ZCb3RoUGxheWVyfTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgaHVtYW4sIGNvbXB1dGVyLCBnZXRIaXRTY29yZU9mQm90aFBsYXllciB9IGZyb20gXCIuL2dhbWVMb2dpY1wiO1xuaW1wb3J0IHsgYWRkRHJhZ0Ryb3BGZWF0dXJlIH0gZnJvbSBcIi4vZHJhZ0Ryb3BMb2dpY1wiO1xuXG5jb25zdCBob3dUb01vZGFsPWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNtb2RhbCcpO1xuY29uc3QgaG93VG9Nb2RhbENsb3NlQnV0dG9uPWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjbG9zZV9ob3dfdG9fbW9kYWwnKTtcbmNvbnN0IGhvd1RvQnV0dG9uPWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ob3dfdG8nKTtcblxuaG93VG9CdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCgpPT57XG4gIGhvd1RvTW9kYWwuc2hvd01vZGFsKCk7XG59KVxuXG5ob3dUb01vZGFsQ2xvc2VCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCgpPT57XG4gIGhvd1RvTW9kYWwuY2xvc2UoKTtcbn0pXG5cbmNvbnN0IGZyaWVuZGx5QXJlYUdhbWVib2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gIFwiI2ZyaWVuZGx5LWFyZWEtZ2FtZWJvYXJkXCJcbik7XG5jb25zdCBlbmVteUFyZWFHYW1lYm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2VuZW15LWFyZWEtZ2FtZWJvYXJkXCIpO1xuXG5mdW5jdGlvbiBjcmVhdGVHYW1lQm9hcmREb20oZ2FtZUJvYXJkQ29udGFpbmVyTmFtZSkge1xuICBjb25zdCBncmlkU2l6ZSA9IDEwO1xuICBjb25zdCBncmlkU3F1YXJlID0gMTAwO1xuICBnYW1lQm9hcmRDb250YWluZXJOYW1lLnN0eWxlLmdyaWRUZW1wbGF0ZVJvd3MgPSBgcmVwZWF0KCR7Z3JpZFNpemV9LDFmcilgO1xuICBnYW1lQm9hcmRDb250YWluZXJOYW1lLnN0eWxlLmdyaWRUZW1wbGF0ZUNvbHVtbnMgPSBgcmVwZWF0KCR7Z3JpZFNpemV9LDFmcilgO1xuICBsZXQgc3F1YXJlRGl2ID0gW107XG4gIGxldCBsb29wQ291bnQgPSAxO1xuICBsZXQgeUF4aXMgPSAxO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGdyaWRTcXVhcmU7IGkrKykge1xuICAgIHNxdWFyZURpdltpXSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgc3F1YXJlRGl2W2ldLnNldEF0dHJpYnV0ZShcImRhdGEtaW5kZXhcIiwgYCR7W2ksIHlBeGlzXX1gKTtcbiAgICBpZiAobG9vcENvdW50ID09PSAxMCkge1xuICAgICAgeUF4aXMgKz0gMTtcbiAgICAgIGxvb3BDb3VudCA9IDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxvb3BDb3VudCArPSAxO1xuICAgIH1cbiAgICBzcXVhcmVEaXZbaV0uY2xhc3NMaXN0LmFkZChcInNxdWFyZV9kaXZcIik7XG4gICAgZ2FtZUJvYXJkQ29udGFpbmVyTmFtZS5hcHBlbmRDaGlsZChzcXVhcmVEaXZbaV0pO1xuICB9XG59XG5cbmNyZWF0ZUdhbWVCb2FyZERvbShmcmllbmRseUFyZWFHYW1lYm9hcmQpO1xuY3JlYXRlR2FtZUJvYXJkRG9tKGVuZW15QXJlYUdhbWVib2FyZCk7XG5cbmFkZERyYWdEcm9wRmVhdHVyZShodW1hbik7XG4vL2h1bWFuIGdvZXMgaW50byB0aGlzIGZ1bmN0aW9uIGFuZCBnZXQgY2hhbmdlZFxuLy9idXQgc2luY2UgaHVtYW4gaXMgYW4gb2JqZWN0IHdlIHdpbGwgZ2V0IGFuIHVwZGF0ZWQgaHVtYW4gb2JqZWN0IGluIHRoaXMgbW9kdWxlXG5cbmNvbnN0IGF1dG9QbGFjZUJ1dHRvbj1kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYXV0b19wbGFjZScpO1xuY29uc3Qgc2hpcENvbnRhaW5lcj1kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYWxsX3NoaXBfY29udGFpbmVyJyk7XG5jb25zdCBnYW1lU3RhcnRCdXR0b249ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3N0YXJ0Jyk7XG5cbmZ1bmN0aW9uIG1hcmtTaGlwc0luVGhlRG9tKCkge1xuICBodW1hbi5nYW1lYm9hcmQuc2hpcExpc3QuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5zaGlwTGVuZ3RoOyBpKyspIHtcbiAgICAgIGZyaWVuZGx5QXJlYUdhbWVib2FyZC5jaGlsZHJlbltzaGlwLmNvb3JkaW5hdGUgKyBpXS5zdHlsZS5iYWNrZ3JvdW5kID1cbiAgICAgICAgXCIjNDQ0NDQ0XCI7XG4gICAgfVxuICB9KTtcbn1cblxuZnVuY3Rpb24gYXV0b1BsYWNlU2hpcHMoKXtcbiAgaHVtYW4uZ2FtZWJvYXJkLnBsYWNlU2hpcChcImNhcnJpZXJcIiwgMTQpO1xuICBodW1hbi5nYW1lYm9hcmQucGxhY2VTaGlwKFwiYmF0dGxlc2hpcFwiLCAzNCk7XG4gIGh1bWFuLmdhbWVib2FyZC5wbGFjZVNoaXAoXCJkZXN0cm95ZXJcIiwgOTQpO1xuICBodW1hbi5nYW1lYm9hcmQucGxhY2VTaGlwKFwic3VibWFyaW5lXCIsIDc0KTtcbiAgbWFya1NoaXBzSW5UaGVEb20oKTtcbiAgc2hpcENvbnRhaW5lci5zdHlsZS5kaXNwbGF5PSdub25lJztcbiAgZ2FtZVN0YXJ0QnV0dG9uLnN0eWxlLmRpc3BsYXk9J2Jsb2NrJztcbn1cbmF1dG9QbGFjZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsYXV0b1BsYWNlU2hpcHMpO1xuXG5mdW5jdGlvbiBtYXJrSGl0VW5oaXQoZW5lbXksIGVuZW15R2FtZWJvYXJkRG9tKSB7XG4gIGVuZW15LmdhbWVib2FyZC5zaGlwTGlzdC5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgc2hpcC5oaXRQb3NpdGlvbnMuZm9yRWFjaCgocG9zaXRpb24pID0+IHtcbiAgICAgIGVuZW15R2FtZWJvYXJkRG9tLmNoaWxkcmVuW3Bvc2l0aW9uXS5zdHlsZS5iYWNrZ3JvdW5kID0gXCIjRjkzOTQzXCI7XG4gICAgfSk7XG4gIH0pO1xuICBlbmVteS5nYW1lYm9hcmQubWlzc2VkSGl0cy5mb3JFYWNoKChtaXNzZWRIaXRQb3NpdGlvbikgPT4ge1xuICAgIGVuZW15R2FtZWJvYXJkRG9tLmNoaWxkcmVuW21pc3NlZEhpdFBvc2l0aW9uXS5zdHlsZS5iYWNrZ3JvdW5kID0gXCIjMDVCMkRDXCI7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBpdElzQWlUdXJuKCkge1xuICBjb21wdXRlci5hdHRhY2soaHVtYW4uZ2FtZWJvYXJkKTtcbiAgbWFya0hpdFVuaGl0KGh1bWFuLCBmcmllbmRseUFyZWFHYW1lYm9hcmQpO1xufVxuXG5mdW5jdGlvbiBjaGVja1dpbm5lcigpIHtcbiAgY29uc3QgYWxsQ29tcHV0ZXJTaGlwU3VuayA9IGNvbXB1dGVyLmdhbWVib2FyZC5hcmVBbGxTaGlwU3VuaygpO1xuICBjb25zdCBhbGxIdW1hblNoaXBTdW5rID0gaHVtYW4uZ2FtZWJvYXJkLmFyZUFsbFNoaXBTdW5rKCk7XG4gIGlmIChhbGxDb21wdXRlclNoaXBTdW5rKSB7XG4gICAgcmV0dXJuIFwieW91XCI7XG4gIH0gZWxzZSBpZiAoYWxsSHVtYW5TaGlwU3Vuaykge1xuICAgIHJldHVybiBcImFpXCI7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUFsbEV2ZW50TGlzdGVuZXJJbkNvbXB1dGVyR2FtZWJvYXJkKCkge1xuICBlbmVteUFyZWFHYW1lYm9hcmQuY2hpbGROb2Rlcy5mb3JFYWNoKChjaGlsZCkgPT4ge1xuICAgIGNoaWxkLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBoYW5kbGVDbGlja0V2ZW50cyk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBzaG93U2NvcmUoKSB7XG4gIGxldCBzY29yZSA9IGdldEhpdFNjb3JlT2ZCb3RoUGxheWVyKCk7XG4gIGxldCBodW1hblNjb3JlQ2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjaHVtYW5fc2NvcmVfY2FyZFwiKTtcbiAgbGV0IGh1bWFuTWlzc2VkSGl0Q291bnQgPSBodW1hblNjb3JlQ2FyZC5jaGlsZHJlblswXTtcbiAgbGV0IGh1bWFuSGl0Q291bnQgPSBodW1hblNjb3JlQ2FyZC5jaGlsZHJlblsxXTtcbiAgaHVtYW5NaXNzZWRIaXRDb3VudC50ZXh0Q29udGVudCA9IGBNaXNzZWQgSGl0czogJHtzY29yZS5odW1hbk1pc3NlZEhpdENvdW50fWA7XG4gIGh1bWFuSGl0Q291bnQudGV4dENvbnRlbnQgPSBgSGl0czogJHtzY29yZS5odW1hbkhpdENvdW50fWA7XG5cbiAgbGV0IGNvbXB1dGVyU2NvcmVDYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNhaV9zY29yZV9jYXJkXCIpO1xuICBsZXQgY29tcHV0ZXJNaXNzZWRIaXRDb3VudCA9IGNvbXB1dGVyU2NvcmVDYXJkLmNoaWxkcmVuWzBdO1xuICBsZXQgY29tcHV0ZXJIaXRDb3VudCA9IGNvbXB1dGVyU2NvcmVDYXJkLmNoaWxkcmVuWzFdO1xuICBjb21wdXRlck1pc3NlZEhpdENvdW50LnRleHRDb250ZW50ID0gYE1pc3NlZCBIaXRzOiAke3Njb3JlLmNvbXB1dGVyTWlzc2VkSGl0Q291bnR9YDtcbiAgY29tcHV0ZXJIaXRDb3VudC50ZXh0Q29udGVudCA9IGBIaXRzOiAke3Njb3JlLmNvbXB1dGVySGl0Q291bnR9YDtcbn1cblxuZnVuY3Rpb24gaGFuZGxlQ2xpY2tFdmVudHMoKSB7XG4gIGNvbnN0IHRhcmdldEluZGV4ID0gcGFyc2VJbnQodGhpcy5kYXRhc2V0LmluZGV4LnNwbGl0KFwiLFwiKVswXSk7XG4gIGNvbXB1dGVyLmdhbWVib2FyZC5yZWNlaXZlQXR0YWNrKHRhcmdldEluZGV4KTtcbiAgbWFya0hpdFVuaGl0KGNvbXB1dGVyLCBlbmVteUFyZWFHYW1lYm9hcmQpO1xuICBpdElzQWlUdXJuKCk7XG4gIHNob3dTY29yZSgpO1xuICBjb25zdCB3aW5uZXIgPSBjaGVja1dpbm5lcigpO1xuICBpZiAod2lubmVyKSB7XG4gICAgYWxlcnQoYCR7d2lubmVyfSB3b24gdGhlIGdhbWVgKTtcbiAgICByZW1vdmVBbGxFdmVudExpc3RlbmVySW5Db21wdXRlckdhbWVib2FyZCgpO1xuICB9XG59XG5mdW5jdGlvbiBhZGRFdmVudExpc3RlbmVyVG9BaUdhbWVCb2FyZCgpIHtcbiAgZW5lbXlBcmVhR2FtZWJvYXJkLmNoaWxkTm9kZXMuZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICBjaGlsZC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgaGFuZGxlQ2xpY2tFdmVudHMsIHsgb25jZTogdHJ1ZSB9KTtcbiAgfSk7XG59XG5cbmNvbnN0IGFpRG9tQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNhaV9jb250YWluZXJcIik7XG5jb25zdCBzY29yZUNhcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Njb3JlX2NhcmRfY29udGFpbmVyXCIpO1xuZnVuY3Rpb24gcGxheUdhbWUoZ2FtZVN0YXJ0QnV0dG9uKSB7XG4gIGdhbWVTdGFydEJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gIGFpRG9tQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gIHNjb3JlQ2FyZC5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCI7XG4gIGNvbXB1dGVyLmdhbWVib2FyZC5wbGFjZVNoaXAoXCJjYXJyaWVyXCIsIDQpO1xuICBjb21wdXRlci5nYW1lYm9hcmQucGxhY2VTaGlwKFwiYmF0dGxlc2hpcFwiLCAxNCk7XG4gIGNvbXB1dGVyLmdhbWVib2FyZC5wbGFjZVNoaXAoXCJkZXN0cm95ZXJcIiwgMzQpO1xuICBjb21wdXRlci5nYW1lYm9hcmQucGxhY2VTaGlwKFwic3VibWFyaW5lXCIsIDU0KTtcbiAgYWRkRXZlbnRMaXN0ZW5lclRvQWlHYW1lQm9hcmQoKTtcbn1cblxuY29uc3Qgc3RhcnRHYW1lQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNzdGFydFwiKTtcbnN0YXJ0R2FtZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgcGxheUdhbWUoZS50YXJnZXQpO1xufSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=