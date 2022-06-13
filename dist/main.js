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
/* eslint-disable radix */
/* eslint-disable max-len */



const howToModal = document.querySelector("#modal");
const howToModalCloseButton = document.querySelector("#close_how_to_modal");
const howToButton = document.querySelector(".how_to");

howToButton.addEventListener("click", () => {
    howToModal.showModal();
});

howToModalCloseButton.addEventListener("click", () => {
    howToModal.close();
});

const friendlyAreaGameboard = document.querySelector(
    "#friendly-area-gameboard",
);
const enemyAreaGameboard = document.querySelector("#enemy-area-gameboard");

const createGameBoardDom = function (gameBoardContainerName) {
    const gridSize = 10;
    const gridSquare = 100;
    // eslint-disable-next-line no-param-reassign
    gameBoardContainerName.style.gridTemplateRows = `repeat(${ gridSize },1fr)`;
    // eslint-disable-next-line no-param-reassign
    gameBoardContainerName.style.gridTemplateColumns = `repeat(${ gridSize },1fr)`;
    const squareDiv = [];
    let loopCount = 1;
    let yAxis = 1;
    for (let i = 0; i < gridSquare; i += 1) {
        squareDiv[i] = document.createElement("div");
        squareDiv[i].setAttribute("data-index", `${ [i, yAxis] }`);
        if (loopCount === 10) {
            yAxis += 1;
            loopCount = 1;
        } else {
            loopCount += 1;
        }
        squareDiv[i].classList.add("square_div");
        gameBoardContainerName.appendChild(squareDiv[i]);
    }
};

createGameBoardDom(friendlyAreaGameboard);
createGameBoardDom(enemyAreaGameboard);

(0,_dragDropLogic__WEBPACK_IMPORTED_MODULE_1__.addDragDropFeature)(_gameLogic__WEBPACK_IMPORTED_MODULE_0__.human);
// human goes into this function and get changed
// but since human is an object we will get an updated human object in this module

const autoPlaceButton = document.querySelector("#auto_place");
const shipContainer = document.querySelector("#all_ship_container");
const gameStartButton = document.querySelector("#start");

const markShipsInTheDom = function () {
    _gameLogic__WEBPACK_IMPORTED_MODULE_0__.human.gameboard.shipList.forEach((ship) => {
        for (let i = 0; i < ship.shipLength; i += 1) {
            friendlyAreaGameboard.children[ship.coordinate + i].style.background =
        "#444444";
        }
    });
};

const autoPlaceShips = function () {
    _gameLogic__WEBPACK_IMPORTED_MODULE_0__.human.gameboard.placeShip("carrier", 14);
    _gameLogic__WEBPACK_IMPORTED_MODULE_0__.human.gameboard.placeShip("battleship", 34);
    _gameLogic__WEBPACK_IMPORTED_MODULE_0__.human.gameboard.placeShip("destroyer", 94);
    _gameLogic__WEBPACK_IMPORTED_MODULE_0__.human.gameboard.placeShip("submarine", 74);
    markShipsInTheDom();
    shipContainer.style.display = "none";
    gameStartButton.style.display = "block";
};
autoPlaceButton.addEventListener("click", autoPlaceShips);

const markHitUnhit = function (enemy, enemyGameboardDom) {
    enemy.gameboard.shipList.forEach((ship) => {
        ship.hitPositions.forEach((position) => {
            // eslint-disable-next-line no-param-reassign
            enemyGameboardDom.children[position].style.background = "#F93943";
        });
    });
    enemy.gameboard.missedHits.forEach((missedHitPosition) => {
    // eslint-disable-next-line no-param-reassign
        enemyGameboardDom.children[missedHitPosition].style.background = "#05B2DC";
    });
};

const itIsAiTurn = function () {
    _gameLogic__WEBPACK_IMPORTED_MODULE_0__.computer.attack(_gameLogic__WEBPACK_IMPORTED_MODULE_0__.human.gameboard);
    markHitUnhit(_gameLogic__WEBPACK_IMPORTED_MODULE_0__.human, friendlyAreaGameboard);
};

const checkWinner = function () {
    const allComputerShipSunk = _gameLogic__WEBPACK_IMPORTED_MODULE_0__.computer.gameboard.areAllShipSunk();
    const allHumanShipSunk = _gameLogic__WEBPACK_IMPORTED_MODULE_0__.human.gameboard.areAllShipSunk();
    if (allComputerShipSunk) {
        return "you";
    } else if (allHumanShipSunk) {
        return "ai";
    }
    return false;
};

const removeAllEventListenerInComputerGameboard = function () {
    enemyAreaGameboard.childNodes.forEach((child) => {
        child.removeEventListener("click", handleClickEvents);
    });
};

const showScore = function () {
    const score = (0,_gameLogic__WEBPACK_IMPORTED_MODULE_0__.getHitScoreOfBothPlayer)();
    const humanScoreCard = document.querySelector("#human_score_card");
    const humanMissedHitCount = humanScoreCard.children[0];
    const humanHitCount = humanScoreCard.children[1];
    humanMissedHitCount.textContent = `Missed Hits: ${ score.humanMissedHitCount }`;
    humanHitCount.textContent = `Hits: ${ score.humanHitCount }`;

    const computerScoreCard = document.querySelector("#ai_score_card");
    const computerMissedHitCount = computerScoreCard.children[0];
    const computerHitCount = computerScoreCard.children[1];
    computerMissedHitCount.textContent = `Missed Hits: ${ score.computerMissedHitCount }`;
    computerHitCount.textContent = `Hits: ${ score.computerHitCount }`;
};

const handleClickEvents = function () {
    const targetIndex = parseInt(this.dataset.index.split(",")[0]);
    _gameLogic__WEBPACK_IMPORTED_MODULE_0__.computer.gameboard.receiveAttack(targetIndex);
    markHitUnhit(_gameLogic__WEBPACK_IMPORTED_MODULE_0__.computer, enemyAreaGameboard);
    itIsAiTurn();
    showScore();
    const winner = checkWinner();
    if (winner) {
        alert(`${ winner } won the game`);
        removeAllEventListenerInComputerGameboard();
    }
};

const addEventListenerToAiGameBoard = function () {
    enemyAreaGameboard.childNodes.forEach((child) => {
        child.addEventListener("click", handleClickEvents, { once: true });
    });
};

const aiDomContainer = document.querySelector("#ai_container");
const scoreCard = document.querySelector("#score_card_container");
const playGame = function (gameStartButton) {
    // eslint-disable-next-line no-param-reassign
    gameStartButton.style.display = "none";
    aiDomContainer.style.display = "block";
    scoreCard.style.display = "flex";
    _gameLogic__WEBPACK_IMPORTED_MODULE_0__.computer.gameboard.placeShip("carrier", 4);
    _gameLogic__WEBPACK_IMPORTED_MODULE_0__.computer.gameboard.placeShip("battleship", 14);
    _gameLogic__WEBPACK_IMPORTED_MODULE_0__.computer.gameboard.placeShip("destroyer", 34);
    _gameLogic__WEBPACK_IMPORTED_MODULE_0__.computer.gameboard.placeShip("submarine", 54);
    addEventListenerToAiGameBoard();
};

const startGameButton = document.querySelector("#start");
startGameButton.addEventListener("click", (e) => {
    playGame(e.target);
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QzdCLElBQUksaUVBQXlCO0FBQzdCLElBQUksaUVBQXlCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0EsSUFBSSx1REFBZSxDQUFDLHVEQUFlO0FBQ25DLGlCQUFpQiw2Q0FBSztBQUN0Qjs7QUFFQTtBQUNBLGdDQUFnQyx5RUFBaUM7QUFDakUsNkJBQTZCLHNFQUE4QjtBQUMzRDtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBLGtCQUFrQixtRUFBdUI7QUFDekM7QUFDQTtBQUNBO0FBQ0EsdURBQXVELDJCQUEyQjtBQUNsRiwwQ0FBMEMscUJBQXFCOztBQUUvRDtBQUNBO0FBQ0E7QUFDQSwwREFBMEQsOEJBQThCO0FBQ3hGLDZDQUE2Qyx3QkFBd0I7QUFDckU7O0FBRUE7QUFDQTtBQUNBLElBQUksd0VBQWdDO0FBQ3BDLGlCQUFpQixnREFBUTtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixTQUFTO0FBQzNCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNkRBQTZELFlBQVk7QUFDekUsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxvRUFBNEI7QUFDaEMsSUFBSSxvRUFBNEI7QUFDaEMsSUFBSSxvRUFBNEI7QUFDaEMsSUFBSSxvRUFBNEI7QUFDaEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcF9nYW1lLy4vc3JjL2RyYWdEcm9wTG9naWMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcF9nYW1lLy4vc3JjL2dhbWVMb2dpYy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwX2dhbWUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcF9nYW1lL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwX2dhbWUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwX2dhbWUvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwX2dhbWUvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gYWRkRHJhZ0Ryb3BGZWF0dXJlKGh1bWFuKSB7XG4gIGNvbnN0IGFsbERyYWdnYWJsZURpdnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmRyYWdnYWJsZVwiKTtcbiAgYWxsRHJhZ2dhYmxlRGl2cy5mb3JFYWNoKChkaXYpID0+IHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRpdi5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgZGl2LmNoaWxkcmVuW2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgKGUpID0+IHtcbiAgICAgICAgZGl2LmRhdGFzZXQuaW5kZXggPSBlLnRhcmdldC5kYXRhc2V0LmluZGV4OyAvL3RoaXMgd2lsbCBnaXZlIHRoZSBwb3NpdGlvbiBvZiBkcmFnZ2FibGUgZGl2IG9uIHdoaWNoIG1vdXNlIGlzIG9uLlxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcblxuICBmdW5jdGlvbiBkcmFnc3RhcnQoZSkge1xuICAgIGNvbnN0IHNoaXBCZWluZ0RyYWdnZWQgPSBlLnRhcmdldDtcbiAgICBjb25zdCBwb3NpdGlvbk9mTW91c2VPblRoZVNoaXAgPSBzaGlwQmVpbmdEcmFnZ2VkLmRhdGFzZXQuaW5kZXg7XG4gICAgY29uc3QgbGVuZ3RoT2ZUaGVTaGlwID0gc2hpcEJlaW5nRHJhZ2dlZC5kYXRhc2V0LnNoaXBsZW5ndGg7XG4gICAgY29uc3Qgc2hpcE5hbWUgPSBzaGlwQmVpbmdEcmFnZ2VkLmlkO1xuICAgIGNvbnN0IHRyYW5zZmVyRGF0YSA9IFtwb3NpdGlvbk9mTW91c2VPblRoZVNoaXAsIGxlbmd0aE9mVGhlU2hpcCwgc2hpcE5hbWVdO1xuICAgIGUuZGF0YVRyYW5zZmVyLnNldERhdGEoXCJzaGlwLWRhdGFcIiwgSlNPTi5zdHJpbmdpZnkodHJhbnNmZXJEYXRhKSk7XG4gIH1cblxuICBmdW5jdGlvbiBkcmFnRW50ZXIoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRyYWdPdmVyKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIH1cblxuICBmdW5jdGlvbiBkcmFnTGVhdmUoZSkge31cblxuICBmdW5jdGlvbiBpc0FTaGlwQWxyZWFkeVBsYWNlZChcbiAgICBjZWxsc19XaXRoX1NhbWVfWV9BeGlzX0FzX0Ryb3BUYXJnZXQsXG4gICAgc2hpcERhdGEsXG4gICAgeEF4aXNPZkRyb3BwZWRTaGlwRmlyc3RQb3NpdGlvblxuICApIHtcbiAgICBsZXQgY2VsbHNXaXRoU2hpcFBsYWNlZCA9IGNlbGxzX1dpdGhfU2FtZV9ZX0F4aXNfQXNfRHJvcFRhcmdldC5maWx0ZXIoXG4gICAgICAoY2VsbCkgPT4ge1xuICAgICAgICByZXR1cm4gY2VsbC5jbGFzc0xpc3QuY29udGFpbnMoXCJkcm9wcGVkXCIpO1xuICAgICAgfVxuICAgICk7XG4gICAgbGV0IHNoaXBzUG9zaXRpb25zSW5YQXhpcyA9IGNlbGxzV2l0aFNoaXBQbGFjZWQubWFwKChjZWxsKSA9PiB7XG4gICAgICByZXR1cm4gcGFyc2VJbnQoY2VsbC5kYXRhc2V0LmluZGV4LnNwbGl0KFwiLFwiKVswXSk7XG4gICAgfSk7XG4gICAgbGV0IHBvdGVudGlhbFNoaXBQb3NpdGlvbnNGb3JDdXJyZW50U2hpcCA9IFtdO1xuICAgIGNvbnN0IHNoaXBMZW5ndGggPSBzaGlwRGF0YVsxXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBMZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGRyb3BwZWRTaGlwUG9zaXRpb24gPSB4QXhpc09mRHJvcHBlZFNoaXBGaXJzdFBvc2l0aW9uO1xuICAgICAgZHJvcHBlZFNoaXBQb3NpdGlvbiArPSBpO1xuICAgICAgcG90ZW50aWFsU2hpcFBvc2l0aW9uc0ZvckN1cnJlbnRTaGlwLnB1c2goZHJvcHBlZFNoaXBQb3NpdGlvbik7XG4gICAgfVxuICAgIGxldCB0b3RhbE92ZXJsYXBwZWRTaGlwUG9zaXRpb25zID1cbiAgICAgIHBvdGVudGlhbFNoaXBQb3NpdGlvbnNGb3JDdXJyZW50U2hpcC5zb21lKChwb3RlbnRpYWxTaGlwUG9zaXRpb24pID0+IHtcbiAgICAgICAgcmV0dXJuIHNoaXBzUG9zaXRpb25zSW5YQXhpcy5pbmNsdWRlcyhwb3RlbnRpYWxTaGlwUG9zaXRpb24pO1xuICAgICAgfSk7XG4gICAgaWYgKHRvdGFsT3ZlcmxhcHBlZFNoaXBQb3NpdGlvbnMpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaXNUaGVyZUVub3VnaFNwYWNlKFxuICAgIGNlbGxzX1dpdGhfU2FtZV9ZX0F4aXNfQXNfRHJvcFRhcmdldCxcbiAgICBzaGlwRGF0YSxcbiAgICB4QXhpc09mRHJvcHBlZFNoaXBGaXJzdFBvc2l0aW9uXG4gICkge1xuICAgIGNvbnN0IHNoaXBsZW5ndGggPSBOdW1iZXIoc2hpcERhdGFbMV0pO1xuICAgIGNvbnN0IHhBeGlzT2ZGaXJzdENlbGwgPVxuICAgICAgY2VsbHNfV2l0aF9TYW1lX1lfQXhpc19Bc19Ecm9wVGFyZ2V0WzBdLmRhdGFzZXQuaW5kZXguc3BsaXQoXCIsXCIpWzBdO1xuICAgIGNvbnN0IHhBeGlzT2ZMYXN0Q2VsbCA9XG4gICAgICBjZWxsc19XaXRoX1NhbWVfWV9BeGlzX0FzX0Ryb3BUYXJnZXRbXG4gICAgICAgIGNlbGxzX1dpdGhfU2FtZV9ZX0F4aXNfQXNfRHJvcFRhcmdldC5sZW5ndGggLSAxXG4gICAgICBdLmRhdGFzZXQuaW5kZXguc3BsaXQoXCIsXCIpWzBdO1xuICAgIGlmIChcbiAgICAgIHhBeGlzT2ZGaXJzdENlbGwgPD0geEF4aXNPZkRyb3BwZWRTaGlwRmlyc3RQb3NpdGlvbiAmJlxuICAgICAgeEF4aXNPZkxhc3RDZWxsID49IHhBeGlzT2ZEcm9wcGVkU2hpcEZpcnN0UG9zaXRpb24gKyAoc2hpcGxlbmd0aCAtIDEpXG4gICAgKSB7XG4gICAgICAvLyBzaGlscGxlbmd0aC0xIGJlY2F1c2UgOTUrNT0xMDAgYnV0IGlmIHlvdSBjb25zaWRlciA5NSBhbmQgYWRkIDUgdG8gaXQgdGhlbiBpdCB3b3VsZCBiZSA5OVxuICAgICAgLy8geW91IGhhdmUgdG8gY29uc2lkZXIgdGhpcyBudWFuY2Ugd2hlbiB3b3JraW5nIHdpdGggZ2FtZWJvYXJkIGNlbGxzXG4gICAgICByZXR1cm4gdHJ1ZTsgLy9tZWFucyB0aGUgc2hpcCBjYW4gYmUgcGxhY2VkXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBjaGVja0lmRHJvcFZhbGlkKGV2ZW50LCBzaGlwRGF0YSkge1xuICAgIGNvbnN0IGRyb3BUYXJnZXRDb29yZGluYXRlcyA9IGV2ZW50LnRhcmdldC5kYXRhc2V0LmluZGV4LnNwbGl0KFwiLFwiKTtcbiAgICBjb25zdCBwb3NpdGlvbk9mTW91c2VPblRoZVNoaXAgPSBzaGlwRGF0YVswXTtcbiAgICBjb25zdCB4QXhpc09mRHJvcHBlZFNoaXBGaXJzdFBvc2l0aW9uID1cbiAgICAgIGRyb3BUYXJnZXRDb29yZGluYXRlc1swXSAtIHBvc2l0aW9uT2ZNb3VzZU9uVGhlU2hpcDtcbiAgICBjb25zdCBodW1hbkdhbWVib2FyZENlbGxzQXJyYXkgPSBbLi4uaHVtYW5HYW1lYm9hcmRDZWxsc107XG4gICAgbGV0IGNlbGxzX1dpdGhfU2FtZV9ZX0F4aXNfQXNfRHJvcFRhcmdldCA9IGh1bWFuR2FtZWJvYXJkQ2VsbHNBcnJheS5maWx0ZXIoXG4gICAgICAoY2VsbCkgPT4ge1xuICAgICAgICBjb25zdCB5QXhpc09mQ2VsbCA9IGNlbGwuZGF0YXNldC5pbmRleC5zcGxpdChcIixcIilbMV07XG4gICAgICAgIGNvbnN0IHlBeGlzT2ZEcm9wVGFyZ2V0ID0gZHJvcFRhcmdldENvb3JkaW5hdGVzWzFdO1xuICAgICAgICByZXR1cm4geUF4aXNPZkNlbGwgPT09IHlBeGlzT2ZEcm9wVGFyZ2V0O1xuICAgICAgfVxuICAgICk7XG5cbiAgICBpZiAoXG4gICAgICBpc0FTaGlwQWxyZWFkeVBsYWNlZChcbiAgICAgICAgY2VsbHNfV2l0aF9TYW1lX1lfQXhpc19Bc19Ecm9wVGFyZ2V0LFxuICAgICAgICBzaGlwRGF0YSxcbiAgICAgICAgeEF4aXNPZkRyb3BwZWRTaGlwRmlyc3RQb3NpdGlvblxuICAgICAgKVxuICAgICkge1xuICAgICAgcmV0dXJuIGZhbHNlOyAvL21lYW5zIHRoZXJlIGlzIGFscmVhZHkgYSBzaGlwIHBsYWNlZCBpbiB0aGUgc2FtZSBheGlzXG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGlzVGhlcmVFbm91Z2hTcGFjZShcbiAgICAgICAgY2VsbHNfV2l0aF9TYW1lX1lfQXhpc19Bc19Ecm9wVGFyZ2V0LFxuICAgICAgICBzaGlwRGF0YSxcbiAgICAgICAgeEF4aXNPZkRyb3BwZWRTaGlwRmlyc3RQb3NpdGlvblxuICAgICAgKVxuICAgICkge1xuICAgICAgcmV0dXJuIHRydWU7IC8vbWVhbnMgdGhlIHNoaXAgY2FuIGJlIHBsYWNlZFxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgdG90YWxTaGlwcyA9IDQ7XG4gIGxldCBkcm9wQ291bnQgPSAwO1xuXG4gIGZ1bmN0aW9uIGRyb3AoZSkge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7IC8vIHN0b3BzIHRoZSBicm93c2VyIGZyb20gcmVkaXJlY3RpbmcuXG5cbiAgICBjb25zdCB4QXhpc09mRHJvcFRhcmdldCA9IE51bWJlcihlLnRhcmdldC5kYXRhc2V0LmluZGV4LnNwbGl0KFwiLFwiKVswXSk7XG4gICAgY29uc3Qgc2hpcERhdGFKc29uID0gZS5kYXRhVHJhbnNmZXIuZ2V0RGF0YShcInNoaXAtZGF0YVwiKTtcbiAgICBjb25zdCBzaGlwRGF0YSA9IEpTT04ucGFyc2Uoc2hpcERhdGFKc29uKTtcblxuICAgIGlmICghY2hlY2tJZkRyb3BWYWxpZChlLCBzaGlwRGF0YSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTsgLy90aGlzIHdpbGwgc3RvcCB0aGUgZnVuY3Rpb24gYW5kIHRodXMgdGhlIGRyb3Agd2lsbCBub3QgYmUgaGFuZGxlZFxuICAgIH1cblxuICAgIGNvbnN0IHNoaXBsZW5ndGggPSBzaGlwRGF0YVsxXTtcbiAgICBjb25zdCBwb3NpdGlvbk9mTW91c2VPblRoZVNoaXAgPSBzaGlwRGF0YVswXTtcbiAgICBsZXQgeEF4aXNPZlNoaXBTdGFydFBvc2l0aW9uID0geEF4aXNPZkRyb3BUYXJnZXQgLSBwb3NpdGlvbk9mTW91c2VPblRoZVNoaXA7XG4gICAgY29uc3Qgc2hpcE5hbWUgPSBzaGlwRGF0YVsyXTtcbiAgICBodW1hbi5nYW1lYm9hcmQucGxhY2VTaGlwKGAke3NoaXBOYW1lfWAsIHhBeGlzT2ZTaGlwU3RhcnRQb3NpdGlvbik7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwbGVuZ3RoOyBpKyspIHtcbiAgICAgIGh1bWFuR2FtZWJvYXJkQ2VsbHNbeEF4aXNPZlNoaXBTdGFydFBvc2l0aW9uICsgaV0uc3R5bGUuYmFja2dyb3VuZCA9XG4gICAgICAgIFwiIzQ0NDQ0NFwiO1xuICAgICAgaHVtYW5HYW1lYm9hcmRDZWxsc1t4QXhpc09mU2hpcFN0YXJ0UG9zaXRpb24gKyBpXS5jbGFzc0xpc3QuYWRkKFxuICAgICAgICBcImRyb3BwZWRcIlxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCBkcmFnZ2FibGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjJHtzaGlwTmFtZX1gKTtcbiAgICBkcmFnZ2FibGUuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIGRyb3BDb3VudCArPSAxO1xuICAgIGlmIChkcm9wQ291bnQgPT09IHRvdGFsU2hpcHMpIHtcbiAgICAgIGNvbnN0IHN0YXJ0R2FtZUJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjc3RhcnRcIik7XG4gICAgICBzdGFydEdhbWVCdXR0b24uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICB9XG4gIH1cblxuICBjb25zdCBodW1hbkdhbWVib2FyZENlbGxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcbiAgICBcIiNmcmllbmRseS1hcmVhLWdhbWVib2FyZCAuc3F1YXJlX2RpdlwiXG4gICk7XG4gIGh1bWFuR2FtZWJvYXJkQ2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdlbnRlclwiLCBkcmFnRW50ZXIpO1xuICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdvdmVyXCIsIGRyYWdPdmVyKTtcbiAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnbGVhdmVcIiwgZHJhZ0xlYXZlKTtcbiAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJkcm9wXCIsIGRyb3ApO1xuICB9KTtcblxuICBjb25zdCBkcmFnZ2FibGVTaGlwcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZHJhZ2dhYmxlXCIpO1xuICBkcmFnZ2FibGVTaGlwcy5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgc2hpcC5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ3N0YXJ0XCIsIGRyYWdzdGFydCk7XG4gIH0pO1xufVxuXG5leHBvcnQgeyBhZGREcmFnRHJvcEZlYXR1cmUgfTtcbiIsImZ1bmN0aW9uIHNoaXAoc2hpcG5hbWUsIGNvb3JkaW5hdGUpIHtcbiAgbGV0IHNoaXBMZW5ndGg7XG4gIHN3aXRjaCAoc2hpcG5hbWUpIHtcbiAgICBjYXNlIFwiY2FycmllclwiOlxuICAgICAgc2hpcExlbmd0aCA9IDU7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiYmF0dGxlc2hpcFwiOlxuICAgICAgc2hpcExlbmd0aCA9IDQ7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiZGVzdHJveWVyXCI6XG4gICAgICBzaGlwTGVuZ3RoID0gMztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJzdWJtYXJpbmVcIjpcbiAgICAgIHNoaXBMZW5ndGggPSAyO1xuICAgICAgYnJlYWs7XG4gIH1cbiAgbGV0IGhpdFBvc2l0aW9ucyA9IFtdO1xuICBmdW5jdGlvbiBoaXQoaGl0Q29vcmRpbmF0ZSkge1xuICAgIGhpdFBvc2l0aW9ucy5wdXNoKGhpdENvb3JkaW5hdGUpO1xuICB9XG4gIGZ1bmN0aW9uIGlzU3VuaygpIHtcbiAgICBpZiAoaGl0UG9zaXRpb25zLmxlbmd0aCA9PT0gc2hpcExlbmd0aCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4geyBjb29yZGluYXRlLCBzaGlwTGVuZ3RoLCBoaXRQb3NpdGlvbnMsIGhpdCwgaXNTdW5rIH07XG59XG5cbmZ1bmN0aW9uIGdhbWVCb2FyZCgpIHtcbiAgbGV0IHNoaXBMaXN0ID0gW107XG4gIGZ1bmN0aW9uIHBsYWNlU2hpcChzaGlwbmFtZSwgY29vcmRpbmF0ZSkge1xuICAgIHNoaXBMaXN0LnB1c2goc2hpcChzaGlwbmFtZSwgY29vcmRpbmF0ZSkpO1xuICB9XG4gIGxldCBtaXNzZWRIaXRzID0gW107XG4gIGZ1bmN0aW9uIHJlY2VpdmVBdHRhY2soaGl0Q29vcmRpbmF0ZSkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcExpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChcbiAgICAgICAgaGl0Q29vcmRpbmF0ZSA+PSBzaGlwTGlzdFtpXS5jb29yZGluYXRlICYmXG4gICAgICAgIGhpdENvb3JkaW5hdGUgPCBzaGlwTGlzdFtpXS5jb29yZGluYXRlICsgc2hpcExpc3RbaV0uc2hpcExlbmd0aFxuICAgICAgKSB7XG4gICAgICAgIHNoaXBMaXN0W2ldLmhpdChoaXRDb29yZGluYXRlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9IGVsc2UgaWYgKGkgPT09IHNoaXBMaXN0Lmxlbmd0aCAtIDEpIHtcbiAgICAgICAgLy9tZWFucyx3ZSBhcmUgYXQgdGhlIGVuZCBvZiB0aGUgbG9vcCBidXQgd2UgZGlkIG5vdCBmaW5kIGEgaGl0XG4gICAgICAgIG1pc3NlZEhpdHMucHVzaChoaXRDb29yZGluYXRlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gYXJlQWxsU2hpcFN1bmsoKSB7XG4gICAgcmV0dXJuIHNoaXBMaXN0LmV2ZXJ5KChzaGlwKSA9PiB7XG4gICAgICByZXR1cm4gc2hpcC5pc1N1bmsoKTtcbiAgICB9KTtcbiAgfVxuICByZXR1cm4geyBzaGlwTGlzdCwgcGxhY2VTaGlwLCByZWNlaXZlQXR0YWNrLCBtaXNzZWRIaXRzLCBhcmVBbGxTaGlwU3VuayB9O1xufVxuXG5mdW5jdGlvbiBodW1hblBsYXllcigpIHtcbiAgY29uc3QgZ2FtZWJvYXJkID0gZ2FtZUJvYXJkKCk7XG4gIGZ1bmN0aW9uIGF0dGFjayhlbmVteUdhbWVCb2FyZCwgYXR0YWNrQ29vcmRpbmF0ZSkge1xuICAgIGVuZW15R2FtZUJvYXJkLnJlY2VpdmVBdHRhY2soYXR0YWNrQ29vcmRpbmF0ZSk7XG4gIH1cbiAgcmV0dXJuIHsgZ2FtZWJvYXJkLCBhdHRhY2sgfTtcbn1cblxuZnVuY3Rpb24gcmV0dXJuTGFzdFN1Y2Nlc3NmdWxIaXRQb3NpdGlvbk9mRW5lbXlHYW1lYm9hcmQoXG4gIHByZXZpb3VzRW5lbXlHYW1lQm9hcmRIaXRQb3NpdGlvbnMsXG4gIGVuZW15R2FtZUJvYXJkXG4pIHtcbiAgbGV0IHVwZGF0ZWRFbmVteUdhbWVib2FyZEhpdFBvc2l0aW9ucyA9IFtdO1xuICBlbmVteUdhbWVCb2FyZC5zaGlwTGlzdC5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgdXBkYXRlZEVuZW15R2FtZWJvYXJkSGl0UG9zaXRpb25zID1cbiAgICAgIHVwZGF0ZWRFbmVteUdhbWVib2FyZEhpdFBvc2l0aW9ucy5jb25jYXQoc2hpcC5oaXRQb3NpdGlvbnMpO1xuICB9KTtcbiAgY29uc3QgbGFzdEhpdFBvc2l0aW9uU3RyID0gdXBkYXRlZEVuZW15R2FtZWJvYXJkSGl0UG9zaXRpb25zXG4gICAgLmZpbHRlcigocG9zaXRpb24pID0+IHtcbiAgICAgIHJldHVybiAhcHJldmlvdXNFbmVteUdhbWVCb2FyZEhpdFBvc2l0aW9ucy5pbmNsdWRlcyhwb3NpdGlvbik7XG4gICAgfSlcbiAgICAudG9TdHJpbmcoKTtcbiAgaWYgKFxuICAgIHVwZGF0ZWRFbmVteUdhbWVib2FyZEhpdFBvc2l0aW9ucy5sZW5ndGggPlxuICAgIHByZXZpb3VzRW5lbXlHYW1lQm9hcmRIaXRQb3NpdGlvbnMubGVuZ3RoXG4gICkge1xuICAgIC8vbWVhbnMgbGFzdCBhdHRhY2sgd2FzIHN1Y2Nlc3NmdWxcbiAgICBjb25zdCBsYXN0SGl0UG9zaXRpb24gPSBwYXJzZUludChsYXN0SGl0UG9zaXRpb25TdHIpO1xuICAgIHByZXZpb3VzRW5lbXlHYW1lQm9hcmRIaXRQb3NpdGlvbnMucHVzaChsYXN0SGl0UG9zaXRpb24pO1xuICAgIHJldHVybiBsYXN0SGl0UG9zaXRpb247XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlOyAvL21lYW5zIGxhc3QgYXR0YWNrIHdhcyBub3Qgc3VjY2Vzc2Z1bFxuICB9XG59XG5cbmZ1bmN0aW9uIGNhbGN1bGF0ZVNob3RDb29yZGluYXRlKFxuICBwcmV2aW91c0VuZW15R2FtZUJvYXJkSGl0UG9zaXRpb25zLFxuICBlbmVteUdhbWVCb2FyZCxcbiAgY29vcmRpbmF0ZXNGb3JBdHRhY2tcbikge1xuICBjb25zdCBsYXN0SGl0UG9zaXRpb25PZkVuZW15R2FtZWJvYXJkID1cbiAgICByZXR1cm5MYXN0U3VjY2Vzc2Z1bEhpdFBvc2l0aW9uT2ZFbmVteUdhbWVib2FyZChcbiAgICAgIHByZXZpb3VzRW5lbXlHYW1lQm9hcmRIaXRQb3NpdGlvbnMsXG4gICAgICBlbmVteUdhbWVCb2FyZFxuICAgICk7XG4gIGNvbnN0IGNvb3JkaW5hdGVzRm9yQXR0YWNrSW5jbHVkZU5leHRIaXQgPSBjb29yZGluYXRlc0ZvckF0dGFjay5pbmNsdWRlcyhcbiAgICBsYXN0SGl0UG9zaXRpb25PZkVuZW15R2FtZWJvYXJkICsgMVxuICApO1xuICBsZXQgc2hvdENvb3JkaW5hdGU7XG5cbiAgaWYgKGxhc3RIaXRQb3NpdGlvbk9mRW5lbXlHYW1lYm9hcmQgJiYgY29vcmRpbmF0ZXNGb3JBdHRhY2tJbmNsdWRlTmV4dEhpdCkge1xuICAgIC8vbWVhbnMgbGFzdCBhdHRhY2sgd2FzIGEgaGl0XG4gICAgc2hvdENvb3JkaW5hdGUgPSBsYXN0SGl0UG9zaXRpb25PZkVuZW15R2FtZWJvYXJkICsgMTtcbiAgICBjb29yZGluYXRlc0ZvckF0dGFjay5zcGxpY2UoXG4gICAgICBjb29yZGluYXRlc0ZvckF0dGFjay5pbmRleE9mKHNob3RDb29yZGluYXRlKSxcbiAgICAgIDFcbiAgICApO1xuICAgIHJldHVybiBzaG90Q29vcmRpbmF0ZTtcbiAgfSBlbHNlIHtcbiAgICBzaG90Q29vcmRpbmF0ZSA9XG4gICAgICBjb29yZGluYXRlc0ZvckF0dGFja1tcbiAgICAgICAgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY29vcmRpbmF0ZXNGb3JBdHRhY2subGVuZ3RoKVxuICAgICAgXTtcbiAgICBjb29yZGluYXRlc0ZvckF0dGFjay5zcGxpY2UoXG4gICAgICBjb29yZGluYXRlc0ZvckF0dGFjay5pbmRleE9mKHNob3RDb29yZGluYXRlKSxcbiAgICAgIDFcbiAgICApO1xuICAgIHJldHVybiBzaG90Q29vcmRpbmF0ZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBhaSgpIHtcbiAgY29uc3QgZ2FtZWJvYXJkID0gZ2FtZUJvYXJkKCk7XG4gIGNvbnN0IGdhbWVCb2FyZFNpemUgPSAxMDA7XG4gIGxldCBjb29yZGluYXRlc0ZvckF0dGFjayA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGdhbWVCb2FyZFNpemU7IGkrKykge1xuICAgIGNvb3JkaW5hdGVzRm9yQXR0YWNrLnB1c2goaSk7XG4gIH1cbiAgbGV0IHByZXZpb3VzRW5lbXlHYW1lQm9hcmRIaXRQb3NpdGlvbnMgPSBbXTtcblxuICBmdW5jdGlvbiBhdHRhY2soZW5lbXlHYW1lQm9hcmQpIHtcbiAgICBjb25zdCBzaG90Q29vcmRpbmF0ZSA9IGNhbGN1bGF0ZVNob3RDb29yZGluYXRlKFxuICAgICAgcHJldmlvdXNFbmVteUdhbWVCb2FyZEhpdFBvc2l0aW9ucyxcbiAgICAgIGVuZW15R2FtZUJvYXJkLFxuICAgICAgY29vcmRpbmF0ZXNGb3JBdHRhY2tcbiAgICApO1xuICAgIGVuZW15R2FtZUJvYXJkLnJlY2VpdmVBdHRhY2soc2hvdENvb3JkaW5hdGUpO1xuICB9XG4gIHJldHVybiB7IGdhbWVib2FyZCwgYXR0YWNrIH07XG59XG5cbmNvbnN0IGh1bWFuID0gaHVtYW5QbGF5ZXIoKTtcbmNvbnN0IGNvbXB1dGVyID0gYWkoKTtcblxuZnVuY3Rpb24gZ2V0SGl0U2NvcmVPZkJvdGhQbGF5ZXIoKSB7XG4gIGxldCBodW1hbkhpdFBvc2l0aW9uc0FyciA9IFtdO1xuICBjb21wdXRlci5nYW1lYm9hcmQuc2hpcExpc3QuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgIHNoaXAuaGl0UG9zaXRpb25zLmZvckVhY2goKHBvc2l0aW9uKSA9PiB7XG4gICAgICBodW1hbkhpdFBvc2l0aW9uc0Fyci5wdXNoKHBvc2l0aW9uKTtcbiAgICB9KTtcbiAgfSk7XG4gIGxldCBodW1hbk1pc3NlZEhpdENvdW50ID0gY29tcHV0ZXIuZ2FtZWJvYXJkLm1pc3NlZEhpdHMubGVuZ3RoO1xuXG4gIGxldCBjb21wdXRlckhpdFBvc2l0aW9uc0FyciA9IFtdO1xuICBodW1hbi5nYW1lYm9hcmQuc2hpcExpc3QuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgIHNoaXAuaGl0UG9zaXRpb25zLmZvckVhY2goKHBvc2l0aW9uKSA9PiB7XG4gICAgICBjb21wdXRlckhpdFBvc2l0aW9uc0Fyci5wdXNoKHBvc2l0aW9uKTtcbiAgICB9KTtcbiAgfSk7XG4gIGxldCBjb21wdXRlck1pc3NlZEhpdENvdW50ID0gaHVtYW4uZ2FtZWJvYXJkLm1pc3NlZEhpdHMubGVuZ3RoO1xuXG4gIHJldHVybiB7XG4gICAgaHVtYW5IaXRDb3VudDogaHVtYW5IaXRQb3NpdGlvbnNBcnIubGVuZ3RoLFxuICAgIGh1bWFuTWlzc2VkSGl0Q291bnQsXG4gICAgY29tcHV0ZXJIaXRDb3VudDogY29tcHV0ZXJIaXRQb3NpdGlvbnNBcnIubGVuZ3RoLFxuICAgIGNvbXB1dGVyTWlzc2VkSGl0Q291bnQsXG4gIH07XG59XG5leHBvcnQgeyBzaGlwLCBnYW1lQm9hcmQsIGh1bWFuLCBjb21wdXRlciwgaHVtYW5QbGF5ZXIsIGFpICxnZXRIaXRTY29yZU9mQm90aFBsYXllcn07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8qIGVzbGludC1kaXNhYmxlIHJhZGl4ICovXG4vKiBlc2xpbnQtZGlzYWJsZSBtYXgtbGVuICovXG5pbXBvcnQgeyBodW1hbiwgY29tcHV0ZXIsIGdldEhpdFNjb3JlT2ZCb3RoUGxheWVyIH0gZnJvbSBcIi4vZ2FtZUxvZ2ljXCI7XG5pbXBvcnQgeyBhZGREcmFnRHJvcEZlYXR1cmUgfSBmcm9tIFwiLi9kcmFnRHJvcExvZ2ljXCI7XG5cbmNvbnN0IGhvd1RvTW9kYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21vZGFsXCIpO1xuY29uc3QgaG93VG9Nb2RhbENsb3NlQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjbG9zZV9ob3dfdG9fbW9kYWxcIik7XG5jb25zdCBob3dUb0J1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuaG93X3RvXCIpO1xuXG5ob3dUb0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgIGhvd1RvTW9kYWwuc2hvd01vZGFsKCk7XG59KTtcblxuaG93VG9Nb2RhbENsb3NlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgaG93VG9Nb2RhbC5jbG9zZSgpO1xufSk7XG5cbmNvbnN0IGZyaWVuZGx5QXJlYUdhbWVib2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgXCIjZnJpZW5kbHktYXJlYS1nYW1lYm9hcmRcIixcbik7XG5jb25zdCBlbmVteUFyZWFHYW1lYm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2VuZW15LWFyZWEtZ2FtZWJvYXJkXCIpO1xuXG5jb25zdCBjcmVhdGVHYW1lQm9hcmREb20gPSBmdW5jdGlvbiAoZ2FtZUJvYXJkQ29udGFpbmVyTmFtZSkge1xuICAgIGNvbnN0IGdyaWRTaXplID0gMTA7XG4gICAgY29uc3QgZ3JpZFNxdWFyZSA9IDEwMDtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICBnYW1lQm9hcmRDb250YWluZXJOYW1lLnN0eWxlLmdyaWRUZW1wbGF0ZVJvd3MgPSBgcmVwZWF0KCR7IGdyaWRTaXplIH0sMWZyKWA7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gICAgZ2FtZUJvYXJkQ29udGFpbmVyTmFtZS5zdHlsZS5ncmlkVGVtcGxhdGVDb2x1bW5zID0gYHJlcGVhdCgkeyBncmlkU2l6ZSB9LDFmcilgO1xuICAgIGNvbnN0IHNxdWFyZURpdiA9IFtdO1xuICAgIGxldCBsb29wQ291bnQgPSAxO1xuICAgIGxldCB5QXhpcyA9IDE7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBncmlkU3F1YXJlOyBpICs9IDEpIHtcbiAgICAgICAgc3F1YXJlRGl2W2ldID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgc3F1YXJlRGl2W2ldLnNldEF0dHJpYnV0ZShcImRhdGEtaW5kZXhcIiwgYCR7IFtpLCB5QXhpc10gfWApO1xuICAgICAgICBpZiAobG9vcENvdW50ID09PSAxMCkge1xuICAgICAgICAgICAgeUF4aXMgKz0gMTtcbiAgICAgICAgICAgIGxvb3BDb3VudCA9IDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsb29wQ291bnQgKz0gMTtcbiAgICAgICAgfVxuICAgICAgICBzcXVhcmVEaXZbaV0uY2xhc3NMaXN0LmFkZChcInNxdWFyZV9kaXZcIik7XG4gICAgICAgIGdhbWVCb2FyZENvbnRhaW5lck5hbWUuYXBwZW5kQ2hpbGQoc3F1YXJlRGl2W2ldKTtcbiAgICB9XG59O1xuXG5jcmVhdGVHYW1lQm9hcmREb20oZnJpZW5kbHlBcmVhR2FtZWJvYXJkKTtcbmNyZWF0ZUdhbWVCb2FyZERvbShlbmVteUFyZWFHYW1lYm9hcmQpO1xuXG5hZGREcmFnRHJvcEZlYXR1cmUoaHVtYW4pO1xuLy8gaHVtYW4gZ29lcyBpbnRvIHRoaXMgZnVuY3Rpb24gYW5kIGdldCBjaGFuZ2VkXG4vLyBidXQgc2luY2UgaHVtYW4gaXMgYW4gb2JqZWN0IHdlIHdpbGwgZ2V0IGFuIHVwZGF0ZWQgaHVtYW4gb2JqZWN0IGluIHRoaXMgbW9kdWxlXG5cbmNvbnN0IGF1dG9QbGFjZUJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYXV0b19wbGFjZVwiKTtcbmNvbnN0IHNoaXBDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2FsbF9zaGlwX2NvbnRhaW5lclwiKTtcbmNvbnN0IGdhbWVTdGFydEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjc3RhcnRcIik7XG5cbmNvbnN0IG1hcmtTaGlwc0luVGhlRG9tID0gZnVuY3Rpb24gKCkge1xuICAgIGh1bWFuLmdhbWVib2FyZC5zaGlwTGlzdC5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5zaGlwTGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGZyaWVuZGx5QXJlYUdhbWVib2FyZC5jaGlsZHJlbltzaGlwLmNvb3JkaW5hdGUgKyBpXS5zdHlsZS5iYWNrZ3JvdW5kID1cbiAgICAgICAgXCIjNDQ0NDQ0XCI7XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG5cbmNvbnN0IGF1dG9QbGFjZVNoaXBzID0gZnVuY3Rpb24gKCkge1xuICAgIGh1bWFuLmdhbWVib2FyZC5wbGFjZVNoaXAoXCJjYXJyaWVyXCIsIDE0KTtcbiAgICBodW1hbi5nYW1lYm9hcmQucGxhY2VTaGlwKFwiYmF0dGxlc2hpcFwiLCAzNCk7XG4gICAgaHVtYW4uZ2FtZWJvYXJkLnBsYWNlU2hpcChcImRlc3Ryb3llclwiLCA5NCk7XG4gICAgaHVtYW4uZ2FtZWJvYXJkLnBsYWNlU2hpcChcInN1Ym1hcmluZVwiLCA3NCk7XG4gICAgbWFya1NoaXBzSW5UaGVEb20oKTtcbiAgICBzaGlwQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICBnYW1lU3RhcnRCdXR0b24uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbn07XG5hdXRvUGxhY2VCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGF1dG9QbGFjZVNoaXBzKTtcblxuY29uc3QgbWFya0hpdFVuaGl0ID0gZnVuY3Rpb24gKGVuZW15LCBlbmVteUdhbWVib2FyZERvbSkge1xuICAgIGVuZW15LmdhbWVib2FyZC5zaGlwTGlzdC5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgICAgIHNoaXAuaGl0UG9zaXRpb25zLmZvckVhY2goKHBvc2l0aW9uKSA9PiB7XG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICAgICAgICAgIGVuZW15R2FtZWJvYXJkRG9tLmNoaWxkcmVuW3Bvc2l0aW9uXS5zdHlsZS5iYWNrZ3JvdW5kID0gXCIjRjkzOTQzXCI7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIGVuZW15LmdhbWVib2FyZC5taXNzZWRIaXRzLmZvckVhY2goKG1pc3NlZEhpdFBvc2l0aW9uKSA9PiB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gICAgICAgIGVuZW15R2FtZWJvYXJkRG9tLmNoaWxkcmVuW21pc3NlZEhpdFBvc2l0aW9uXS5zdHlsZS5iYWNrZ3JvdW5kID0gXCIjMDVCMkRDXCI7XG4gICAgfSk7XG59O1xuXG5jb25zdCBpdElzQWlUdXJuID0gZnVuY3Rpb24gKCkge1xuICAgIGNvbXB1dGVyLmF0dGFjayhodW1hbi5nYW1lYm9hcmQpO1xuICAgIG1hcmtIaXRVbmhpdChodW1hbiwgZnJpZW5kbHlBcmVhR2FtZWJvYXJkKTtcbn07XG5cbmNvbnN0IGNoZWNrV2lubmVyID0gZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGFsbENvbXB1dGVyU2hpcFN1bmsgPSBjb21wdXRlci5nYW1lYm9hcmQuYXJlQWxsU2hpcFN1bmsoKTtcbiAgICBjb25zdCBhbGxIdW1hblNoaXBTdW5rID0gaHVtYW4uZ2FtZWJvYXJkLmFyZUFsbFNoaXBTdW5rKCk7XG4gICAgaWYgKGFsbENvbXB1dGVyU2hpcFN1bmspIHtcbiAgICAgICAgcmV0dXJuIFwieW91XCI7XG4gICAgfSBlbHNlIGlmIChhbGxIdW1hblNoaXBTdW5rKSB7XG4gICAgICAgIHJldHVybiBcImFpXCI7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn07XG5cbmNvbnN0IHJlbW92ZUFsbEV2ZW50TGlzdGVuZXJJbkNvbXB1dGVyR2FtZWJvYXJkID0gZnVuY3Rpb24gKCkge1xuICAgIGVuZW15QXJlYUdhbWVib2FyZC5jaGlsZE5vZGVzLmZvckVhY2goKGNoaWxkKSA9PiB7XG4gICAgICAgIGNoaWxkLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBoYW5kbGVDbGlja0V2ZW50cyk7XG4gICAgfSk7XG59O1xuXG5jb25zdCBzaG93U2NvcmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3Qgc2NvcmUgPSBnZXRIaXRTY29yZU9mQm90aFBsYXllcigpO1xuICAgIGNvbnN0IGh1bWFuU2NvcmVDYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNodW1hbl9zY29yZV9jYXJkXCIpO1xuICAgIGNvbnN0IGh1bWFuTWlzc2VkSGl0Q291bnQgPSBodW1hblNjb3JlQ2FyZC5jaGlsZHJlblswXTtcbiAgICBjb25zdCBodW1hbkhpdENvdW50ID0gaHVtYW5TY29yZUNhcmQuY2hpbGRyZW5bMV07XG4gICAgaHVtYW5NaXNzZWRIaXRDb3VudC50ZXh0Q29udGVudCA9IGBNaXNzZWQgSGl0czogJHsgc2NvcmUuaHVtYW5NaXNzZWRIaXRDb3VudCB9YDtcbiAgICBodW1hbkhpdENvdW50LnRleHRDb250ZW50ID0gYEhpdHM6ICR7IHNjb3JlLmh1bWFuSGl0Q291bnQgfWA7XG5cbiAgICBjb25zdCBjb21wdXRlclNjb3JlQ2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYWlfc2NvcmVfY2FyZFwiKTtcbiAgICBjb25zdCBjb21wdXRlck1pc3NlZEhpdENvdW50ID0gY29tcHV0ZXJTY29yZUNhcmQuY2hpbGRyZW5bMF07XG4gICAgY29uc3QgY29tcHV0ZXJIaXRDb3VudCA9IGNvbXB1dGVyU2NvcmVDYXJkLmNoaWxkcmVuWzFdO1xuICAgIGNvbXB1dGVyTWlzc2VkSGl0Q291bnQudGV4dENvbnRlbnQgPSBgTWlzc2VkIEhpdHM6ICR7IHNjb3JlLmNvbXB1dGVyTWlzc2VkSGl0Q291bnQgfWA7XG4gICAgY29tcHV0ZXJIaXRDb3VudC50ZXh0Q29udGVudCA9IGBIaXRzOiAkeyBzY29yZS5jb21wdXRlckhpdENvdW50IH1gO1xufTtcblxuY29uc3QgaGFuZGxlQ2xpY2tFdmVudHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgdGFyZ2V0SW5kZXggPSBwYXJzZUludCh0aGlzLmRhdGFzZXQuaW5kZXguc3BsaXQoXCIsXCIpWzBdKTtcbiAgICBjb21wdXRlci5nYW1lYm9hcmQucmVjZWl2ZUF0dGFjayh0YXJnZXRJbmRleCk7XG4gICAgbWFya0hpdFVuaGl0KGNvbXB1dGVyLCBlbmVteUFyZWFHYW1lYm9hcmQpO1xuICAgIGl0SXNBaVR1cm4oKTtcbiAgICBzaG93U2NvcmUoKTtcbiAgICBjb25zdCB3aW5uZXIgPSBjaGVja1dpbm5lcigpO1xuICAgIGlmICh3aW5uZXIpIHtcbiAgICAgICAgYWxlcnQoYCR7IHdpbm5lciB9IHdvbiB0aGUgZ2FtZWApO1xuICAgICAgICByZW1vdmVBbGxFdmVudExpc3RlbmVySW5Db21wdXRlckdhbWVib2FyZCgpO1xuICAgIH1cbn07XG5cbmNvbnN0IGFkZEV2ZW50TGlzdGVuZXJUb0FpR2FtZUJvYXJkID0gZnVuY3Rpb24gKCkge1xuICAgIGVuZW15QXJlYUdhbWVib2FyZC5jaGlsZE5vZGVzLmZvckVhY2goKGNoaWxkKSA9PiB7XG4gICAgICAgIGNoaWxkLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBoYW5kbGVDbGlja0V2ZW50cywgeyBvbmNlOiB0cnVlIH0pO1xuICAgIH0pO1xufTtcblxuY29uc3QgYWlEb21Db250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2FpX2NvbnRhaW5lclwiKTtcbmNvbnN0IHNjb3JlQ2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjc2NvcmVfY2FyZF9jb250YWluZXJcIik7XG5jb25zdCBwbGF5R2FtZSA9IGZ1bmN0aW9uIChnYW1lU3RhcnRCdXR0b24pIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICBnYW1lU3RhcnRCdXR0b24uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIGFpRG9tQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgc2NvcmVDYXJkLnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIjtcbiAgICBjb21wdXRlci5nYW1lYm9hcmQucGxhY2VTaGlwKFwiY2FycmllclwiLCA0KTtcbiAgICBjb21wdXRlci5nYW1lYm9hcmQucGxhY2VTaGlwKFwiYmF0dGxlc2hpcFwiLCAxNCk7XG4gICAgY29tcHV0ZXIuZ2FtZWJvYXJkLnBsYWNlU2hpcChcImRlc3Ryb3llclwiLCAzNCk7XG4gICAgY29tcHV0ZXIuZ2FtZWJvYXJkLnBsYWNlU2hpcChcInN1Ym1hcmluZVwiLCA1NCk7XG4gICAgYWRkRXZlbnRMaXN0ZW5lclRvQWlHYW1lQm9hcmQoKTtcbn07XG5cbmNvbnN0IHN0YXJ0R2FtZUJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjc3RhcnRcIik7XG5zdGFydEdhbWVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgcGxheUdhbWUoZS50YXJnZXQpO1xufSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=