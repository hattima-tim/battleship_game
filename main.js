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

function markShipsInTheDom(humanGameBoard) {
  humanGameBoard.shipList.forEach((ship) => {
    for (let i = 0; i < ship.shipLength; i++) {
      friendlyAreaGameboard.children[ship.coordinate + i].style.background =
        "#444444";
    }
  });
}

function markHitUnhit(enemy, enemyGameboardDom) {
  enemy.gameboard.shipList.forEach((ship) => {
    ship.hitPositions.forEach((position) => {
      enemyGameboardDom.children[position].textContent = "x";
    });
  });
  enemy.gameboard.missedHits.forEach((missedHitPosition) => {
    enemyGameboardDom.children[missedHitPosition].textContent = "o";
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

function handleClickEvents() {
  const targetIndex = parseInt(this.dataset.index.split(",")[0]);
  _gameLogic__WEBPACK_IMPORTED_MODULE_0__.computer.gameboard.receiveAttack(targetIndex);
  markHitUnhit(_gameLogic__WEBPACK_IMPORTED_MODULE_0__.computer, enemyAreaGameboard);
  itIsAiTurn();
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
const scoreCard=document.querySelector('#score_card_container');
function playGame(gameStartButton) {
  gameStartButton.style.display = "none";
  aiDomContainer.style.display = "block";
  scoreCard.style.display='flex';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFlLGdEQUFRO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseURBQXlELFlBQVk7QUFDckUsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsb0VBQTRCO0FBQzlCLEVBQUUsb0VBQTRCO0FBQzlCLEVBQUUsb0VBQTRCO0FBQzlCLEVBQUUsb0VBQTRCO0FBQzlCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXBfZ2FtZS8uL3NyYy9kcmFnRHJvcExvZ2ljLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXBfZ2FtZS8uL3NyYy9nYW1lTG9naWMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcF9nYW1lL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXBfZ2FtZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcF9nYW1lL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcF9nYW1lL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcF9nYW1lLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIGFkZERyYWdEcm9wRmVhdHVyZShodW1hbikge1xuICBjb25zdCBhbGxEcmFnZ2FibGVEaXZzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5kcmFnZ2FibGVcIik7XG4gIGFsbERyYWdnYWJsZURpdnMuZm9yRWFjaCgoZGl2KSA9PiB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkaXYuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgIGRpdi5jaGlsZHJlbltpXS5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIChlKSA9PiB7XG4gICAgICAgIGRpdi5kYXRhc2V0LmluZGV4ID0gZS50YXJnZXQuZGF0YXNldC5pbmRleDsgLy90aGlzIHdpbGwgZ2l2ZSB0aGUgcG9zaXRpb24gb2YgZHJhZ2dhYmxlIGRpdiBvbiB3aGljaCBtb3VzZSBpcyBvbi5cbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG5cbiAgZnVuY3Rpb24gZHJhZ3N0YXJ0KGUpIHtcbiAgICBjb25zdCBzaGlwQmVpbmdEcmFnZ2VkID0gZS50YXJnZXQ7XG4gICAgY29uc3QgcG9zaXRpb25PZk1vdXNlT25UaGVTaGlwID0gc2hpcEJlaW5nRHJhZ2dlZC5kYXRhc2V0LmluZGV4O1xuICAgIGNvbnN0IGxlbmd0aE9mVGhlU2hpcCA9IHNoaXBCZWluZ0RyYWdnZWQuZGF0YXNldC5zaGlwbGVuZ3RoO1xuICAgIGNvbnN0IHNoaXBOYW1lID0gc2hpcEJlaW5nRHJhZ2dlZC5pZDtcbiAgICBjb25zdCB0cmFuc2ZlckRhdGEgPSBbcG9zaXRpb25PZk1vdXNlT25UaGVTaGlwLCBsZW5ndGhPZlRoZVNoaXAsIHNoaXBOYW1lXTtcbiAgICBlLmRhdGFUcmFuc2Zlci5zZXREYXRhKFwic2hpcC1kYXRhXCIsIEpTT04uc3RyaW5naWZ5KHRyYW5zZmVyRGF0YSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gZHJhZ0VudGVyKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIH1cblxuICBmdW5jdGlvbiBkcmFnT3ZlcihlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICB9XG5cbiAgZnVuY3Rpb24gZHJhZ0xlYXZlKGUpIHt9XG5cbiAgZnVuY3Rpb24gaXNBU2hpcEFscmVhZHlQbGFjZWQoXG4gICAgY2VsbHNfV2l0aF9TYW1lX1lfQXhpc19Bc19Ecm9wVGFyZ2V0LFxuICAgIHNoaXBEYXRhLFxuICAgIHhBeGlzT2ZEcm9wcGVkU2hpcEZpcnN0UG9zaXRpb25cbiAgKSB7XG4gICAgbGV0IGNlbGxzV2l0aFNoaXBQbGFjZWQgPSBjZWxsc19XaXRoX1NhbWVfWV9BeGlzX0FzX0Ryb3BUYXJnZXQuZmlsdGVyKFxuICAgICAgKGNlbGwpID0+IHtcbiAgICAgICAgcmV0dXJuIGNlbGwuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZHJvcHBlZFwiKTtcbiAgICAgIH1cbiAgICApO1xuICAgIGxldCBzaGlwc1Bvc2l0aW9uc0luWEF4aXMgPSBjZWxsc1dpdGhTaGlwUGxhY2VkLm1hcCgoY2VsbCkgPT4ge1xuICAgICAgcmV0dXJuIHBhcnNlSW50KGNlbGwuZGF0YXNldC5pbmRleC5zcGxpdChcIixcIilbMF0pO1xuICAgIH0pO1xuICAgIGxldCBwb3RlbnRpYWxTaGlwUG9zaXRpb25zRm9yQ3VycmVudFNoaXAgPSBbXTtcbiAgICBjb25zdCBzaGlwTGVuZ3RoID0gc2hpcERhdGFbMV07XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwTGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBkcm9wcGVkU2hpcFBvc2l0aW9uID0geEF4aXNPZkRyb3BwZWRTaGlwRmlyc3RQb3NpdGlvbjtcbiAgICAgIGRyb3BwZWRTaGlwUG9zaXRpb24gKz0gaTtcbiAgICAgIHBvdGVudGlhbFNoaXBQb3NpdGlvbnNGb3JDdXJyZW50U2hpcC5wdXNoKGRyb3BwZWRTaGlwUG9zaXRpb24pO1xuICAgIH1cbiAgICBsZXQgdG90YWxPdmVybGFwcGVkU2hpcFBvc2l0aW9ucyA9XG4gICAgICBwb3RlbnRpYWxTaGlwUG9zaXRpb25zRm9yQ3VycmVudFNoaXAuc29tZSgocG90ZW50aWFsU2hpcFBvc2l0aW9uKSA9PiB7XG4gICAgICAgIHJldHVybiBzaGlwc1Bvc2l0aW9uc0luWEF4aXMuaW5jbHVkZXMocG90ZW50aWFsU2hpcFBvc2l0aW9uKTtcbiAgICAgIH0pO1xuICAgIGlmICh0b3RhbE92ZXJsYXBwZWRTaGlwUG9zaXRpb25zKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGlzVGhlcmVFbm91Z2hTcGFjZShcbiAgICBjZWxsc19XaXRoX1NhbWVfWV9BeGlzX0FzX0Ryb3BUYXJnZXQsXG4gICAgc2hpcERhdGEsXG4gICAgeEF4aXNPZkRyb3BwZWRTaGlwRmlyc3RQb3NpdGlvblxuICApIHtcbiAgICBjb25zdCBzaGlwbGVuZ3RoID0gTnVtYmVyKHNoaXBEYXRhWzFdKTtcbiAgICBjb25zdCB4QXhpc09mRmlyc3RDZWxsID1cbiAgICAgIGNlbGxzX1dpdGhfU2FtZV9ZX0F4aXNfQXNfRHJvcFRhcmdldFswXS5kYXRhc2V0LmluZGV4LnNwbGl0KFwiLFwiKVswXTtcbiAgICBjb25zdCB4QXhpc09mTGFzdENlbGwgPVxuICAgICAgY2VsbHNfV2l0aF9TYW1lX1lfQXhpc19Bc19Ecm9wVGFyZ2V0W1xuICAgICAgICBjZWxsc19XaXRoX1NhbWVfWV9BeGlzX0FzX0Ryb3BUYXJnZXQubGVuZ3RoIC0gMVxuICAgICAgXS5kYXRhc2V0LmluZGV4LnNwbGl0KFwiLFwiKVswXTtcbiAgICBpZiAoXG4gICAgICB4QXhpc09mRmlyc3RDZWxsIDw9IHhBeGlzT2ZEcm9wcGVkU2hpcEZpcnN0UG9zaXRpb24gJiZcbiAgICAgIHhBeGlzT2ZMYXN0Q2VsbCA+PSB4QXhpc09mRHJvcHBlZFNoaXBGaXJzdFBvc2l0aW9uICsgKHNoaXBsZW5ndGggLSAxKVxuICAgICkge1xuICAgICAgLy8gc2hpbHBsZW5ndGgtMSBiZWNhdXNlIDk1KzU9MTAwIGJ1dCBpZiB5b3UgY29uc2lkZXIgOTUgYW5kIGFkZCA1IHRvIGl0IHRoZW4gaXQgd291bGQgYmUgOTlcbiAgICAgIC8vIHlvdSBoYXZlIHRvIGNvbnNpZGVyIHRoaXMgbnVhbmNlIHdoZW4gd29ya2luZyB3aXRoIGdhbWVib2FyZCBjZWxsc1xuICAgICAgcmV0dXJuIHRydWU7IC8vbWVhbnMgdGhlIHNoaXAgY2FuIGJlIHBsYWNlZFxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gY2hlY2tJZkRyb3BWYWxpZChldmVudCwgc2hpcERhdGEpIHtcbiAgICBjb25zdCBkcm9wVGFyZ2V0Q29vcmRpbmF0ZXMgPSBldmVudC50YXJnZXQuZGF0YXNldC5pbmRleC5zcGxpdChcIixcIik7XG4gICAgY29uc3QgcG9zaXRpb25PZk1vdXNlT25UaGVTaGlwID0gc2hpcERhdGFbMF07XG4gICAgY29uc3QgeEF4aXNPZkRyb3BwZWRTaGlwRmlyc3RQb3NpdGlvbiA9XG4gICAgICBkcm9wVGFyZ2V0Q29vcmRpbmF0ZXNbMF0gLSBwb3NpdGlvbk9mTW91c2VPblRoZVNoaXA7XG4gICAgY29uc3QgaHVtYW5HYW1lYm9hcmRDZWxsc0FycmF5ID0gWy4uLmh1bWFuR2FtZWJvYXJkQ2VsbHNdO1xuICAgIGxldCBjZWxsc19XaXRoX1NhbWVfWV9BeGlzX0FzX0Ryb3BUYXJnZXQgPSBodW1hbkdhbWVib2FyZENlbGxzQXJyYXkuZmlsdGVyKFxuICAgICAgKGNlbGwpID0+IHtcbiAgICAgICAgY29uc3QgeUF4aXNPZkNlbGwgPSBjZWxsLmRhdGFzZXQuaW5kZXguc3BsaXQoXCIsXCIpWzFdO1xuICAgICAgICBjb25zdCB5QXhpc09mRHJvcFRhcmdldCA9IGRyb3BUYXJnZXRDb29yZGluYXRlc1sxXTtcbiAgICAgICAgcmV0dXJuIHlBeGlzT2ZDZWxsID09PSB5QXhpc09mRHJvcFRhcmdldDtcbiAgICAgIH1cbiAgICApO1xuXG4gICAgaWYgKFxuICAgICAgaXNBU2hpcEFscmVhZHlQbGFjZWQoXG4gICAgICAgIGNlbGxzX1dpdGhfU2FtZV9ZX0F4aXNfQXNfRHJvcFRhcmdldCxcbiAgICAgICAgc2hpcERhdGEsXG4gICAgICAgIHhBeGlzT2ZEcm9wcGVkU2hpcEZpcnN0UG9zaXRpb25cbiAgICAgIClcbiAgICApIHtcbiAgICAgIHJldHVybiBmYWxzZTsgLy9tZWFucyB0aGVyZSBpcyBhbHJlYWR5IGEgc2hpcCBwbGFjZWQgaW4gdGhlIHNhbWUgYXhpc1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBpc1RoZXJlRW5vdWdoU3BhY2UoXG4gICAgICAgIGNlbGxzX1dpdGhfU2FtZV9ZX0F4aXNfQXNfRHJvcFRhcmdldCxcbiAgICAgICAgc2hpcERhdGEsXG4gICAgICAgIHhBeGlzT2ZEcm9wcGVkU2hpcEZpcnN0UG9zaXRpb25cbiAgICAgIClcbiAgICApIHtcbiAgICAgIHJldHVybiB0cnVlOyAvL21lYW5zIHRoZSBzaGlwIGNhbiBiZSBwbGFjZWRcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHRvdGFsU2hpcHMgPSA0O1xuICBsZXQgZHJvcENvdW50ID0gMDtcblxuICBmdW5jdGlvbiBkcm9wKGUpIHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpOyAvLyBzdG9wcyB0aGUgYnJvd3NlciBmcm9tIHJlZGlyZWN0aW5nLlxuXG4gICAgY29uc3QgeEF4aXNPZkRyb3BUYXJnZXQgPSBOdW1iZXIoZS50YXJnZXQuZGF0YXNldC5pbmRleC5zcGxpdChcIixcIilbMF0pO1xuICAgIGNvbnN0IHNoaXBEYXRhSnNvbiA9IGUuZGF0YVRyYW5zZmVyLmdldERhdGEoXCJzaGlwLWRhdGFcIik7XG4gICAgY29uc3Qgc2hpcERhdGEgPSBKU09OLnBhcnNlKHNoaXBEYXRhSnNvbik7XG5cbiAgICBpZiAoIWNoZWNrSWZEcm9wVmFsaWQoZSwgc2hpcERhdGEpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7IC8vdGhpcyB3aWxsIHN0b3AgdGhlIGZ1bmN0aW9uIGFuZCB0aHVzIHRoZSBkcm9wIHdpbGwgbm90IGJlIGhhbmRsZWRcbiAgICB9XG5cbiAgICBjb25zdCBzaGlwbGVuZ3RoID0gc2hpcERhdGFbMV07XG4gICAgY29uc3QgcG9zaXRpb25PZk1vdXNlT25UaGVTaGlwID0gc2hpcERhdGFbMF07XG4gICAgbGV0IHhBeGlzT2ZTaGlwU3RhcnRQb3NpdGlvbiA9IHhBeGlzT2ZEcm9wVGFyZ2V0IC0gcG9zaXRpb25PZk1vdXNlT25UaGVTaGlwO1xuICAgIGNvbnN0IHNoaXBOYW1lID0gc2hpcERhdGFbMl07XG4gICAgaHVtYW4uZ2FtZWJvYXJkLnBsYWNlU2hpcChgJHtzaGlwTmFtZX1gLCB4QXhpc09mU2hpcFN0YXJ0UG9zaXRpb24pO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcGxlbmd0aDsgaSsrKSB7XG4gICAgICBodW1hbkdhbWVib2FyZENlbGxzW3hBeGlzT2ZTaGlwU3RhcnRQb3NpdGlvbiArIGldLnN0eWxlLmJhY2tncm91bmQgPVxuICAgICAgICBcIiM0NDQ0NDRcIjtcbiAgICAgIGh1bWFuR2FtZWJvYXJkQ2VsbHNbeEF4aXNPZlNoaXBTdGFydFBvc2l0aW9uICsgaV0uY2xhc3NMaXN0LmFkZChcbiAgICAgICAgXCJkcm9wcGVkXCJcbiAgICAgICk7XG4gICAgfVxuXG4gICAgY29uc3QgZHJhZ2dhYmxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgIyR7c2hpcE5hbWV9YCk7XG4gICAgZHJhZ2dhYmxlLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICBkcm9wQ291bnQgKz0gMTtcbiAgICBpZiAoZHJvcENvdW50ID09PSB0b3RhbFNoaXBzKSB7XG4gICAgICBjb25zdCBzdGFydEdhbWVCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3N0YXJ0XCIpO1xuICAgICAgc3RhcnRHYW1lQnV0dG9uLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgaHVtYW5HYW1lYm9hcmRDZWxscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgXCIjZnJpZW5kbHktYXJlYS1nYW1lYm9hcmQgLnNxdWFyZV9kaXZcIlxuICApO1xuICBodW1hbkdhbWVib2FyZENlbGxzLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnZW50ZXJcIiwgZHJhZ0VudGVyKTtcbiAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnb3ZlclwiLCBkcmFnT3Zlcik7XG4gICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ2xlYXZlXCIsIGRyYWdMZWF2ZSk7XG4gICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKFwiZHJvcFwiLCBkcm9wKTtcbiAgfSk7XG5cbiAgY29uc3QgZHJhZ2dhYmxlU2hpcHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmRyYWdnYWJsZVwiKTtcbiAgZHJhZ2dhYmxlU2hpcHMuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgIHNoaXAuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdzdGFydFwiLCBkcmFnc3RhcnQpO1xuICB9KTtcbn1cblxuZXhwb3J0IHsgYWRkRHJhZ0Ryb3BGZWF0dXJlIH07XG4iLCJmdW5jdGlvbiBzaGlwKHNoaXBuYW1lLCBjb29yZGluYXRlKSB7XG4gIGxldCBzaGlwTGVuZ3RoO1xuICBzd2l0Y2ggKHNoaXBuYW1lKSB7XG4gICAgY2FzZSBcImNhcnJpZXJcIjpcbiAgICAgIHNoaXBMZW5ndGggPSA1O1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImJhdHRsZXNoaXBcIjpcbiAgICAgIHNoaXBMZW5ndGggPSA0O1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImRlc3Ryb3llclwiOlxuICAgICAgc2hpcExlbmd0aCA9IDM7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwic3VibWFyaW5lXCI6XG4gICAgICBzaGlwTGVuZ3RoID0gMjtcbiAgICAgIGJyZWFrO1xuICB9XG4gIGxldCBoaXRQb3NpdGlvbnMgPSBbXTtcbiAgZnVuY3Rpb24gaGl0KGhpdENvb3JkaW5hdGUpIHtcbiAgICBoaXRQb3NpdGlvbnMucHVzaChoaXRDb29yZGluYXRlKTtcbiAgfVxuICBmdW5jdGlvbiBpc1N1bmsoKSB7XG4gICAgaWYgKGhpdFBvc2l0aW9ucy5sZW5ndGggPT09IHNoaXBMZW5ndGgpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHsgY29vcmRpbmF0ZSwgc2hpcExlbmd0aCwgaGl0UG9zaXRpb25zLCBoaXQsIGlzU3VuayB9O1xufVxuXG5mdW5jdGlvbiBnYW1lQm9hcmQoKSB7XG4gIGxldCBzaGlwTGlzdCA9IFtdO1xuICBmdW5jdGlvbiBwbGFjZVNoaXAoc2hpcG5hbWUsIGNvb3JkaW5hdGUpIHtcbiAgICBzaGlwTGlzdC5wdXNoKHNoaXAoc2hpcG5hbWUsIGNvb3JkaW5hdGUpKTtcbiAgfVxuICBsZXQgbWlzc2VkSGl0cyA9IFtdO1xuICBmdW5jdGlvbiByZWNlaXZlQXR0YWNrKGhpdENvb3JkaW5hdGUpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoXG4gICAgICAgIGhpdENvb3JkaW5hdGUgPj0gc2hpcExpc3RbaV0uY29vcmRpbmF0ZSAmJlxuICAgICAgICBoaXRDb29yZGluYXRlIDwgc2hpcExpc3RbaV0uY29vcmRpbmF0ZSArIHNoaXBMaXN0W2ldLnNoaXBMZW5ndGhcbiAgICAgICkge1xuICAgICAgICBzaGlwTGlzdFtpXS5oaXQoaGl0Q29vcmRpbmF0ZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfSBlbHNlIGlmIChpID09PSBzaGlwTGlzdC5sZW5ndGggLSAxKSB7XG4gICAgICAgIC8vbWVhbnMsd2UgYXJlIGF0IHRoZSBlbmQgb2YgdGhlIGxvb3AgYnV0IHdlIGRpZCBub3QgZmluZCBhIGhpdFxuICAgICAgICBtaXNzZWRIaXRzLnB1c2goaGl0Q29vcmRpbmF0ZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGFyZUFsbFNoaXBTdW5rKCkge1xuICAgIHJldHVybiBzaGlwTGlzdC5ldmVyeSgoc2hpcCkgPT4ge1xuICAgICAgcmV0dXJuIHNoaXAuaXNTdW5rKCk7XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIHsgc2hpcExpc3QsIHBsYWNlU2hpcCwgcmVjZWl2ZUF0dGFjaywgbWlzc2VkSGl0cywgYXJlQWxsU2hpcFN1bmsgfTtcbn1cblxuZnVuY3Rpb24gaHVtYW5QbGF5ZXIoKSB7XG4gIGNvbnN0IGdhbWVib2FyZCA9IGdhbWVCb2FyZCgpO1xuICBmdW5jdGlvbiBhdHRhY2soZW5lbXlHYW1lQm9hcmQsIGF0dGFja0Nvb3JkaW5hdGUpIHtcbiAgICBlbmVteUdhbWVCb2FyZC5yZWNlaXZlQXR0YWNrKGF0dGFja0Nvb3JkaW5hdGUpO1xuICB9XG4gIHJldHVybiB7IGdhbWVib2FyZCwgYXR0YWNrIH07XG59XG5cbmZ1bmN0aW9uIHJldHVybkxhc3RTdWNjZXNzZnVsSGl0UG9zaXRpb25PZkVuZW15R2FtZWJvYXJkKFxuICBwcmV2aW91c0VuZW15R2FtZUJvYXJkSGl0UG9zaXRpb25zLFxuICBlbmVteUdhbWVCb2FyZFxuKSB7XG4gIGxldCB1cGRhdGVkRW5lbXlHYW1lYm9hcmRIaXRQb3NpdGlvbnMgPSBbXTtcbiAgZW5lbXlHYW1lQm9hcmQuc2hpcExpc3QuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgIHVwZGF0ZWRFbmVteUdhbWVib2FyZEhpdFBvc2l0aW9ucyA9XG4gICAgICB1cGRhdGVkRW5lbXlHYW1lYm9hcmRIaXRQb3NpdGlvbnMuY29uY2F0KHNoaXAuaGl0UG9zaXRpb25zKTtcbiAgfSk7XG4gIGNvbnN0IGxhc3RIaXRQb3NpdGlvblN0ciA9IHVwZGF0ZWRFbmVteUdhbWVib2FyZEhpdFBvc2l0aW9uc1xuICAgIC5maWx0ZXIoKHBvc2l0aW9uKSA9PiB7XG4gICAgICByZXR1cm4gIXByZXZpb3VzRW5lbXlHYW1lQm9hcmRIaXRQb3NpdGlvbnMuaW5jbHVkZXMocG9zaXRpb24pO1xuICAgIH0pXG4gICAgLnRvU3RyaW5nKCk7XG4gIGlmIChcbiAgICB1cGRhdGVkRW5lbXlHYW1lYm9hcmRIaXRQb3NpdGlvbnMubGVuZ3RoID5cbiAgICBwcmV2aW91c0VuZW15R2FtZUJvYXJkSGl0UG9zaXRpb25zLmxlbmd0aFxuICApIHtcbiAgICAvL21lYW5zIGxhc3QgYXR0YWNrIHdhcyBzdWNjZXNzZnVsXG4gICAgY29uc3QgbGFzdEhpdFBvc2l0aW9uID0gcGFyc2VJbnQobGFzdEhpdFBvc2l0aW9uU3RyKTtcbiAgICBwcmV2aW91c0VuZW15R2FtZUJvYXJkSGl0UG9zaXRpb25zLnB1c2gobGFzdEhpdFBvc2l0aW9uKTtcbiAgICByZXR1cm4gbGFzdEhpdFBvc2l0aW9uO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZTsgLy9tZWFucyBsYXN0IGF0dGFjayB3YXMgbm90IHN1Y2Nlc3NmdWxcbiAgfVxufVxuXG5mdW5jdGlvbiBjYWxjdWxhdGVTaG90Q29vcmRpbmF0ZShcbiAgcHJldmlvdXNFbmVteUdhbWVCb2FyZEhpdFBvc2l0aW9ucyxcbiAgZW5lbXlHYW1lQm9hcmQsXG4gIGNvb3JkaW5hdGVzRm9yQXR0YWNrXG4pIHtcbiAgY29uc3QgbGFzdEhpdFBvc2l0aW9uT2ZFbmVteUdhbWVib2FyZCA9XG4gICAgcmV0dXJuTGFzdFN1Y2Nlc3NmdWxIaXRQb3NpdGlvbk9mRW5lbXlHYW1lYm9hcmQoXG4gICAgICBwcmV2aW91c0VuZW15R2FtZUJvYXJkSGl0UG9zaXRpb25zLFxuICAgICAgZW5lbXlHYW1lQm9hcmRcbiAgICApO1xuICBjb25zdCBjb29yZGluYXRlc0ZvckF0dGFja0luY2x1ZGVOZXh0SGl0ID0gY29vcmRpbmF0ZXNGb3JBdHRhY2suaW5jbHVkZXMoXG4gICAgbGFzdEhpdFBvc2l0aW9uT2ZFbmVteUdhbWVib2FyZCArIDFcbiAgKTtcbiAgbGV0IHNob3RDb29yZGluYXRlO1xuXG4gIGlmIChsYXN0SGl0UG9zaXRpb25PZkVuZW15R2FtZWJvYXJkICYmIGNvb3JkaW5hdGVzRm9yQXR0YWNrSW5jbHVkZU5leHRIaXQpIHtcbiAgICAvL21lYW5zIGxhc3QgYXR0YWNrIHdhcyBhIGhpdFxuICAgIHNob3RDb29yZGluYXRlID0gbGFzdEhpdFBvc2l0aW9uT2ZFbmVteUdhbWVib2FyZCArIDE7XG4gICAgY29vcmRpbmF0ZXNGb3JBdHRhY2suc3BsaWNlKFxuICAgICAgY29vcmRpbmF0ZXNGb3JBdHRhY2suaW5kZXhPZihzaG90Q29vcmRpbmF0ZSksXG4gICAgICAxXG4gICAgKTtcbiAgICByZXR1cm4gc2hvdENvb3JkaW5hdGU7XG4gIH0gZWxzZSB7XG4gICAgc2hvdENvb3JkaW5hdGUgPVxuICAgICAgY29vcmRpbmF0ZXNGb3JBdHRhY2tbXG4gICAgICAgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNvb3JkaW5hdGVzRm9yQXR0YWNrLmxlbmd0aClcbiAgICAgIF07XG4gICAgY29vcmRpbmF0ZXNGb3JBdHRhY2suc3BsaWNlKFxuICAgICAgY29vcmRpbmF0ZXNGb3JBdHRhY2suaW5kZXhPZihzaG90Q29vcmRpbmF0ZSksXG4gICAgICAxXG4gICAgKTtcbiAgICByZXR1cm4gc2hvdENvb3JkaW5hdGU7XG4gIH1cbn1cblxuZnVuY3Rpb24gYWkoKSB7XG4gIGNvbnN0IGdhbWVib2FyZCA9IGdhbWVCb2FyZCgpO1xuICBjb25zdCBnYW1lQm9hcmRTaXplID0gMTAwO1xuICBsZXQgY29vcmRpbmF0ZXNGb3JBdHRhY2sgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBnYW1lQm9hcmRTaXplOyBpKyspIHtcbiAgICBjb29yZGluYXRlc0ZvckF0dGFjay5wdXNoKGkpO1xuICB9XG4gIGxldCBwcmV2aW91c0VuZW15R2FtZUJvYXJkSGl0UG9zaXRpb25zID0gW107XG5cbiAgZnVuY3Rpb24gYXR0YWNrKGVuZW15R2FtZUJvYXJkKSB7XG4gICAgY29uc3Qgc2hvdENvb3JkaW5hdGUgPSBjYWxjdWxhdGVTaG90Q29vcmRpbmF0ZShcbiAgICAgIHByZXZpb3VzRW5lbXlHYW1lQm9hcmRIaXRQb3NpdGlvbnMsXG4gICAgICBlbmVteUdhbWVCb2FyZCxcbiAgICAgIGNvb3JkaW5hdGVzRm9yQXR0YWNrXG4gICAgKTtcbiAgICBlbmVteUdhbWVCb2FyZC5yZWNlaXZlQXR0YWNrKHNob3RDb29yZGluYXRlKTtcbiAgfVxuICByZXR1cm4geyBnYW1lYm9hcmQsIGF0dGFjayB9O1xufVxuXG5jb25zdCBodW1hbiA9IGh1bWFuUGxheWVyKCk7XG5jb25zdCBjb21wdXRlciA9IGFpKCk7XG5cbmV4cG9ydCB7IHNoaXAsIGdhbWVCb2FyZCwgaHVtYW4sIGNvbXB1dGVyLCBodW1hblBsYXllciwgYWkgfTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgaHVtYW4sIGNvbXB1dGVyIH0gZnJvbSBcIi4vZ2FtZUxvZ2ljXCI7XG5pbXBvcnQgeyBhZGREcmFnRHJvcEZlYXR1cmUgfSBmcm9tIFwiLi9kcmFnRHJvcExvZ2ljXCI7XG5cbmNvbnN0IGZyaWVuZGx5QXJlYUdhbWVib2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gIFwiI2ZyaWVuZGx5LWFyZWEtZ2FtZWJvYXJkXCJcbik7XG5jb25zdCBlbmVteUFyZWFHYW1lYm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2VuZW15LWFyZWEtZ2FtZWJvYXJkXCIpO1xuXG5mdW5jdGlvbiBjcmVhdGVHYW1lQm9hcmREb20oZ2FtZUJvYXJkQ29udGFpbmVyTmFtZSkge1xuICBjb25zdCBncmlkU2l6ZSA9IDEwO1xuICBjb25zdCBncmlkU3F1YXJlID0gMTAwO1xuICBnYW1lQm9hcmRDb250YWluZXJOYW1lLnN0eWxlLmdyaWRUZW1wbGF0ZVJvd3MgPSBgcmVwZWF0KCR7Z3JpZFNpemV9LDFmcilgO1xuICBnYW1lQm9hcmRDb250YWluZXJOYW1lLnN0eWxlLmdyaWRUZW1wbGF0ZUNvbHVtbnMgPSBgcmVwZWF0KCR7Z3JpZFNpemV9LDFmcilgO1xuICBsZXQgc3F1YXJlRGl2ID0gW107XG4gIGxldCBsb29wQ291bnQgPSAxO1xuICBsZXQgeUF4aXMgPSAxO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGdyaWRTcXVhcmU7IGkrKykge1xuICAgIHNxdWFyZURpdltpXSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgc3F1YXJlRGl2W2ldLnNldEF0dHJpYnV0ZShcImRhdGEtaW5kZXhcIiwgYCR7W2ksIHlBeGlzXX1gKTtcbiAgICBpZiAobG9vcENvdW50ID09PSAxMCkge1xuICAgICAgeUF4aXMgKz0gMTtcbiAgICAgIGxvb3BDb3VudCA9IDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxvb3BDb3VudCArPSAxO1xuICAgIH1cbiAgICBzcXVhcmVEaXZbaV0uY2xhc3NMaXN0LmFkZChcInNxdWFyZV9kaXZcIik7XG4gICAgZ2FtZUJvYXJkQ29udGFpbmVyTmFtZS5hcHBlbmRDaGlsZChzcXVhcmVEaXZbaV0pO1xuICB9XG59XG5cbmNyZWF0ZUdhbWVCb2FyZERvbShmcmllbmRseUFyZWFHYW1lYm9hcmQpO1xuY3JlYXRlR2FtZUJvYXJkRG9tKGVuZW15QXJlYUdhbWVib2FyZCk7XG5cbmFkZERyYWdEcm9wRmVhdHVyZShodW1hbik7XG4vL2h1bWFuIGdvZXMgaW50byB0aGlzIGZ1bmN0aW9uIGFuZCBnZXQgY2hhbmdlZFxuLy9idXQgc2luY2UgaHVtYW4gaXMgYW4gb2JqZWN0IHdlIHdpbGwgZ2V0IGFuIHVwZGF0ZWQgaHVtYW4gb2JqZWN0IGluIHRoaXMgbW9kdWxlXG5cbmZ1bmN0aW9uIG1hcmtTaGlwc0luVGhlRG9tKGh1bWFuR2FtZUJvYXJkKSB7XG4gIGh1bWFuR2FtZUJvYXJkLnNoaXBMaXN0LmZvckVhY2goKHNoaXApID0+IHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAuc2hpcExlbmd0aDsgaSsrKSB7XG4gICAgICBmcmllbmRseUFyZWFHYW1lYm9hcmQuY2hpbGRyZW5bc2hpcC5jb29yZGluYXRlICsgaV0uc3R5bGUuYmFja2dyb3VuZCA9XG4gICAgICAgIFwiIzQ0NDQ0NFwiO1xuICAgIH1cbiAgfSk7XG59XG5cbmZ1bmN0aW9uIG1hcmtIaXRVbmhpdChlbmVteSwgZW5lbXlHYW1lYm9hcmREb20pIHtcbiAgZW5lbXkuZ2FtZWJvYXJkLnNoaXBMaXN0LmZvckVhY2goKHNoaXApID0+IHtcbiAgICBzaGlwLmhpdFBvc2l0aW9ucy5mb3JFYWNoKChwb3NpdGlvbikgPT4ge1xuICAgICAgZW5lbXlHYW1lYm9hcmREb20uY2hpbGRyZW5bcG9zaXRpb25dLnRleHRDb250ZW50ID0gXCJ4XCI7XG4gICAgfSk7XG4gIH0pO1xuICBlbmVteS5nYW1lYm9hcmQubWlzc2VkSGl0cy5mb3JFYWNoKChtaXNzZWRIaXRQb3NpdGlvbikgPT4ge1xuICAgIGVuZW15R2FtZWJvYXJkRG9tLmNoaWxkcmVuW21pc3NlZEhpdFBvc2l0aW9uXS50ZXh0Q29udGVudCA9IFwib1wiO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gaXRJc0FpVHVybigpIHtcbiAgY29tcHV0ZXIuYXR0YWNrKGh1bWFuLmdhbWVib2FyZCk7XG4gIG1hcmtIaXRVbmhpdChodW1hbiwgZnJpZW5kbHlBcmVhR2FtZWJvYXJkKTtcbn1cblxuZnVuY3Rpb24gY2hlY2tXaW5uZXIoKSB7XG4gIGNvbnN0IGFsbENvbXB1dGVyU2hpcFN1bmsgPSBjb21wdXRlci5nYW1lYm9hcmQuYXJlQWxsU2hpcFN1bmsoKTtcbiAgY29uc3QgYWxsSHVtYW5TaGlwU3VuayA9IGh1bWFuLmdhbWVib2FyZC5hcmVBbGxTaGlwU3VuaygpO1xuICBpZiAoYWxsQ29tcHV0ZXJTaGlwU3Vuaykge1xuICAgIHJldHVybiBcInlvdVwiO1xuICB9IGVsc2UgaWYgKGFsbEh1bWFuU2hpcFN1bmspIHtcbiAgICByZXR1cm4gXCJhaVwiO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZW1vdmVBbGxFdmVudExpc3RlbmVySW5Db21wdXRlckdhbWVib2FyZCgpIHtcbiAgZW5lbXlBcmVhR2FtZWJvYXJkLmNoaWxkTm9kZXMuZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICBjaGlsZC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgaGFuZGxlQ2xpY2tFdmVudHMpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlQ2xpY2tFdmVudHMoKSB7XG4gIGNvbnN0IHRhcmdldEluZGV4ID0gcGFyc2VJbnQodGhpcy5kYXRhc2V0LmluZGV4LnNwbGl0KFwiLFwiKVswXSk7XG4gIGNvbXB1dGVyLmdhbWVib2FyZC5yZWNlaXZlQXR0YWNrKHRhcmdldEluZGV4KTtcbiAgbWFya0hpdFVuaGl0KGNvbXB1dGVyLCBlbmVteUFyZWFHYW1lYm9hcmQpO1xuICBpdElzQWlUdXJuKCk7XG4gIGNvbnN0IHdpbm5lciA9IGNoZWNrV2lubmVyKCk7XG4gIGlmICh3aW5uZXIpIHtcbiAgICBhbGVydChgJHt3aW5uZXJ9IHdvbiB0aGUgZ2FtZWApO1xuICAgIHJlbW92ZUFsbEV2ZW50TGlzdGVuZXJJbkNvbXB1dGVyR2FtZWJvYXJkKCk7XG4gIH1cbn1cbmZ1bmN0aW9uIGFkZEV2ZW50TGlzdGVuZXJUb0FpR2FtZUJvYXJkKCkge1xuICBlbmVteUFyZWFHYW1lYm9hcmQuY2hpbGROb2Rlcy5mb3JFYWNoKChjaGlsZCkgPT4ge1xuICAgIGNoaWxkLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBoYW5kbGVDbGlja0V2ZW50cywgeyBvbmNlOiB0cnVlIH0pO1xuICB9KTtcbn1cblxuY29uc3QgYWlEb21Db250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2FpX2NvbnRhaW5lclwiKTtcbmNvbnN0IHNjb3JlQ2FyZD1kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc2NvcmVfY2FyZF9jb250YWluZXInKTtcbmZ1bmN0aW9uIHBsYXlHYW1lKGdhbWVTdGFydEJ1dHRvbikge1xuICBnYW1lU3RhcnRCdXR0b24uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICBhaURvbUNvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICBzY29yZUNhcmQuc3R5bGUuZGlzcGxheT0nZmxleCc7XG4gIGNvbXB1dGVyLmdhbWVib2FyZC5wbGFjZVNoaXAoXCJjYXJyaWVyXCIsIDQpO1xuICBjb21wdXRlci5nYW1lYm9hcmQucGxhY2VTaGlwKFwiYmF0dGxlc2hpcFwiLCAxNCk7XG4gIGNvbXB1dGVyLmdhbWVib2FyZC5wbGFjZVNoaXAoXCJkZXN0cm95ZXJcIiwgMzQpO1xuICBjb21wdXRlci5nYW1lYm9hcmQucGxhY2VTaGlwKFwic3VibWFyaW5lXCIsIDU0KTtcbiAgYWRkRXZlbnRMaXN0ZW5lclRvQWlHYW1lQm9hcmQoKTtcbn1cblxuY29uc3Qgc3RhcnRHYW1lQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNzdGFydFwiKTtcbnN0YXJ0R2FtZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgcGxheUdhbWUoZS50YXJnZXQpO1xufSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=