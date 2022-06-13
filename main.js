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
const ship= function (shipname, coordinate) {
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
    const hitPositions = [];
    const hit=function (hitCoordinate) {
        hitPositions.push(hitCoordinate);
    };
    const isSunk=function () {
        if (hitPositions.length === shipLength) {
            return true;
        }
        return false;
    };
    return { coordinate, shipLength, hitPositions, hit, isSunk };
};

const gameBoard=function () {
    const shipList = [];
    const placeShip=function (shipname, coordinate) {
        shipList.push(ship(shipname, coordinate));
    };
    const missedHits = [];
    const receiveAttack=function (hitCoordinate) {
        for (let i = 0; i < shipList.length; i+=1) {
            if (
                hitCoordinate >= shipList[i].coordinate &&
        hitCoordinate < shipList[i].coordinate + shipList[i].shipLength
            ) {
                shipList[i].hit(hitCoordinate);
                break;
            } else if (i === shipList.length - 1) {
                // means,we are at the end of the loop but we did not find a hit
                missedHits.push(hitCoordinate);
            }
        }
    };
    const areAllShipSunk=function () {
        return shipList.every((ship) => ship.isSunk());
    };
    return { shipList, placeShip, receiveAttack, missedHits, areAllShipSunk };
};

const humanPlayer=function () {
    const gameboard = gameBoard();
    const attack=function (enemyGameBoard, attackCoordinate) {
        enemyGameBoard.receiveAttack(attackCoordinate);
    };
    return { gameboard, attack };
};

const returnLastSuccessfulHitPositionOfEnemyGameboard=function (
    previousEnemyGameBoardHitPositions,
    enemyGameBoard,
) {
    let updatedEnemyGameboardHitPositions = [];
    enemyGameBoard.shipList.forEach((ship) => {
        updatedEnemyGameboardHitPositions =
      updatedEnemyGameboardHitPositions.concat(ship.hitPositions);
    });
    const lastHitPositionStr = updatedEnemyGameboardHitPositions
        // eslint-disable-next-line max-len
        .filter((position) => !previousEnemyGameBoardHitPositions.includes(position))
        .toString();
    if (
        updatedEnemyGameboardHitPositions.length >
    previousEnemyGameBoardHitPositions.length
    ) {
    // means last attack was successful
        // eslint-disable-next-line radix
        const lastHitPosition = parseInt(lastHitPositionStr);
        previousEnemyGameBoardHitPositions.push(lastHitPosition);
        return lastHitPosition;
    }
    return false; // means last attack was not successful

};

const calculateShotCoordinate=function (
    previousEnemyGameBoardHitPositions,
    enemyGameBoard,
    coordinatesForAttack,
) {
    const lastHitPositionOfEnemyGameboard =
    returnLastSuccessfulHitPositionOfEnemyGameboard(
        previousEnemyGameBoardHitPositions,
        enemyGameBoard,
    );
    const coordinatesForAttackIncludeNextHit = coordinatesForAttack.includes(
        lastHitPositionOfEnemyGameboard + 1,
    );
    let shotCoordinate;

    if (lastHitPositionOfEnemyGameboard && coordinatesForAttackIncludeNextHit) {
    // means last attack was a hit
        shotCoordinate = lastHitPositionOfEnemyGameboard + 1;
        coordinatesForAttack.splice(
            coordinatesForAttack.indexOf(shotCoordinate),
            1,
        );
        return shotCoordinate;
    }
    shotCoordinate =
      coordinatesForAttack[
          Math.floor(Math.random() * coordinatesForAttack.length)
      ];
    coordinatesForAttack.splice(
        coordinatesForAttack.indexOf(shotCoordinate),
        1,
    );
    return shotCoordinate;

};

const ai=function () {
    const gameboard = gameBoard();
    const gameBoardSize = 100;
    const coordinatesForAttack = [];
    for (let i = 0; i < gameBoardSize; i+=1) {
        coordinatesForAttack.push(i);
    }
    const previousEnemyGameBoardHitPositions = [];

    const attack=function (enemyGameBoard) {
        const shotCoordinate = calculateShotCoordinate(
            previousEnemyGameBoardHitPositions,
            enemyGameBoard,
            coordinatesForAttack,
        );
        enemyGameBoard.receiveAttack(shotCoordinate);
    };
    return { gameboard, attack };
};

const human = humanPlayer();
const computer = ai();

const getHitScoreOfBothPlayer=function () {
    const humanHitPositionsArr = [];
    computer.gameboard.shipList.forEach((ship) => {
        ship.hitPositions.forEach((position) => {
            humanHitPositionsArr.push(position);
        });
    });
    const humanMissedHitCount = computer.gameboard.missedHits.length;

    const computerHitPositionsArr = [];
    human.gameboard.shipList.forEach((ship) => {
        ship.hitPositions.forEach((position) => {
            computerHitPositionsArr.push(position);
        });
    });
    const computerMissedHitCount = human.gameboard.missedHits.length;

    return {
        humanHitCount: humanHitPositionsArr.length,
        humanMissedHitCount,
        computerHitCount: computerHitPositionsArr.length,
        computerMissedHitCount,
    };
};
// eslint-disable-next-line max-len



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
    _gameLogic__WEBPACK_IMPORTED_MODULE_0__.computer.gameboard.placeShip("battleship", 34);
    _gameLogic__WEBPACK_IMPORTED_MODULE_0__.computer.gameboard.placeShip("destroyer", 74);
    _gameLogic__WEBPACK_IMPORTED_MODULE_0__.computer.gameboard.placeShip("submarine", 94);
    addEventListenerToAiGameBoard();
};

const startGameButton = document.querySelector("#start");
startGameButton.addEventListener("click", (e) => {
    playGame(e.target);
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0EsSUFBSSx1REFBZSxDQUFDLHVEQUFlO0FBQ25DLGlCQUFpQiw2Q0FBSztBQUN0Qjs7QUFFQTtBQUNBLGdDQUFnQyx5RUFBaUM7QUFDakUsNkJBQTZCLHNFQUE4QjtBQUMzRDtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBLGtCQUFrQixtRUFBdUI7QUFDekM7QUFDQTtBQUNBO0FBQ0EsdURBQXVELDJCQUEyQjtBQUNsRiwwQ0FBMEMscUJBQXFCOztBQUUvRDtBQUNBO0FBQ0E7QUFDQSwwREFBMEQsOEJBQThCO0FBQ3hGLDZDQUE2Qyx3QkFBd0I7QUFDckU7O0FBRUE7QUFDQTtBQUNBLElBQUksd0VBQWdDO0FBQ3BDLGlCQUFpQixnREFBUTtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixTQUFTO0FBQzNCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNkRBQTZELFlBQVk7QUFDekUsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxvRUFBNEI7QUFDaEMsSUFBSSxvRUFBNEI7QUFDaEMsSUFBSSxvRUFBNEI7QUFDaEMsSUFBSSxvRUFBNEI7QUFDaEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcF9nYW1lLy4vc3JjL2RyYWdEcm9wTG9naWMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcF9nYW1lLy4vc3JjL2dhbWVMb2dpYy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwX2dhbWUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcF9nYW1lL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwX2dhbWUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwX2dhbWUvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwX2dhbWUvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gYWRkRHJhZ0Ryb3BGZWF0dXJlKGh1bWFuKSB7XG4gIGNvbnN0IGFsbERyYWdnYWJsZURpdnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmRyYWdnYWJsZVwiKTtcbiAgYWxsRHJhZ2dhYmxlRGl2cy5mb3JFYWNoKChkaXYpID0+IHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRpdi5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgZGl2LmNoaWxkcmVuW2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgKGUpID0+IHtcbiAgICAgICAgZGl2LmRhdGFzZXQuaW5kZXggPSBlLnRhcmdldC5kYXRhc2V0LmluZGV4OyAvL3RoaXMgd2lsbCBnaXZlIHRoZSBwb3NpdGlvbiBvZiBkcmFnZ2FibGUgZGl2IG9uIHdoaWNoIG1vdXNlIGlzIG9uLlxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcblxuICBmdW5jdGlvbiBkcmFnc3RhcnQoZSkge1xuICAgIGNvbnN0IHNoaXBCZWluZ0RyYWdnZWQgPSBlLnRhcmdldDtcbiAgICBjb25zdCBwb3NpdGlvbk9mTW91c2VPblRoZVNoaXAgPSBzaGlwQmVpbmdEcmFnZ2VkLmRhdGFzZXQuaW5kZXg7XG4gICAgY29uc3QgbGVuZ3RoT2ZUaGVTaGlwID0gc2hpcEJlaW5nRHJhZ2dlZC5kYXRhc2V0LnNoaXBsZW5ndGg7XG4gICAgY29uc3Qgc2hpcE5hbWUgPSBzaGlwQmVpbmdEcmFnZ2VkLmlkO1xuICAgIGNvbnN0IHRyYW5zZmVyRGF0YSA9IFtwb3NpdGlvbk9mTW91c2VPblRoZVNoaXAsIGxlbmd0aE9mVGhlU2hpcCwgc2hpcE5hbWVdO1xuICAgIGUuZGF0YVRyYW5zZmVyLnNldERhdGEoXCJzaGlwLWRhdGFcIiwgSlNPTi5zdHJpbmdpZnkodHJhbnNmZXJEYXRhKSk7XG4gIH1cblxuICBmdW5jdGlvbiBkcmFnRW50ZXIoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRyYWdPdmVyKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIH1cblxuICBmdW5jdGlvbiBkcmFnTGVhdmUoZSkge31cblxuICBmdW5jdGlvbiBpc0FTaGlwQWxyZWFkeVBsYWNlZChcbiAgICBjZWxsc19XaXRoX1NhbWVfWV9BeGlzX0FzX0Ryb3BUYXJnZXQsXG4gICAgc2hpcERhdGEsXG4gICAgeEF4aXNPZkRyb3BwZWRTaGlwRmlyc3RQb3NpdGlvblxuICApIHtcbiAgICBsZXQgY2VsbHNXaXRoU2hpcFBsYWNlZCA9IGNlbGxzX1dpdGhfU2FtZV9ZX0F4aXNfQXNfRHJvcFRhcmdldC5maWx0ZXIoXG4gICAgICAoY2VsbCkgPT4ge1xuICAgICAgICByZXR1cm4gY2VsbC5jbGFzc0xpc3QuY29udGFpbnMoXCJkcm9wcGVkXCIpO1xuICAgICAgfVxuICAgICk7XG4gICAgbGV0IHNoaXBzUG9zaXRpb25zSW5YQXhpcyA9IGNlbGxzV2l0aFNoaXBQbGFjZWQubWFwKChjZWxsKSA9PiB7XG4gICAgICByZXR1cm4gcGFyc2VJbnQoY2VsbC5kYXRhc2V0LmluZGV4LnNwbGl0KFwiLFwiKVswXSk7XG4gICAgfSk7XG4gICAgbGV0IHBvdGVudGlhbFNoaXBQb3NpdGlvbnNGb3JDdXJyZW50U2hpcCA9IFtdO1xuICAgIGNvbnN0IHNoaXBMZW5ndGggPSBzaGlwRGF0YVsxXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBMZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGRyb3BwZWRTaGlwUG9zaXRpb24gPSB4QXhpc09mRHJvcHBlZFNoaXBGaXJzdFBvc2l0aW9uO1xuICAgICAgZHJvcHBlZFNoaXBQb3NpdGlvbiArPSBpO1xuICAgICAgcG90ZW50aWFsU2hpcFBvc2l0aW9uc0ZvckN1cnJlbnRTaGlwLnB1c2goZHJvcHBlZFNoaXBQb3NpdGlvbik7XG4gICAgfVxuICAgIGxldCB0b3RhbE92ZXJsYXBwZWRTaGlwUG9zaXRpb25zID1cbiAgICAgIHBvdGVudGlhbFNoaXBQb3NpdGlvbnNGb3JDdXJyZW50U2hpcC5zb21lKChwb3RlbnRpYWxTaGlwUG9zaXRpb24pID0+IHtcbiAgICAgICAgcmV0dXJuIHNoaXBzUG9zaXRpb25zSW5YQXhpcy5pbmNsdWRlcyhwb3RlbnRpYWxTaGlwUG9zaXRpb24pO1xuICAgICAgfSk7XG4gICAgaWYgKHRvdGFsT3ZlcmxhcHBlZFNoaXBQb3NpdGlvbnMpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaXNUaGVyZUVub3VnaFNwYWNlKFxuICAgIGNlbGxzX1dpdGhfU2FtZV9ZX0F4aXNfQXNfRHJvcFRhcmdldCxcbiAgICBzaGlwRGF0YSxcbiAgICB4QXhpc09mRHJvcHBlZFNoaXBGaXJzdFBvc2l0aW9uXG4gICkge1xuICAgIGNvbnN0IHNoaXBsZW5ndGggPSBOdW1iZXIoc2hpcERhdGFbMV0pO1xuICAgIGNvbnN0IHhBeGlzT2ZGaXJzdENlbGwgPVxuICAgICAgY2VsbHNfV2l0aF9TYW1lX1lfQXhpc19Bc19Ecm9wVGFyZ2V0WzBdLmRhdGFzZXQuaW5kZXguc3BsaXQoXCIsXCIpWzBdO1xuICAgIGNvbnN0IHhBeGlzT2ZMYXN0Q2VsbCA9XG4gICAgICBjZWxsc19XaXRoX1NhbWVfWV9BeGlzX0FzX0Ryb3BUYXJnZXRbXG4gICAgICAgIGNlbGxzX1dpdGhfU2FtZV9ZX0F4aXNfQXNfRHJvcFRhcmdldC5sZW5ndGggLSAxXG4gICAgICBdLmRhdGFzZXQuaW5kZXguc3BsaXQoXCIsXCIpWzBdO1xuICAgIGlmIChcbiAgICAgIHhBeGlzT2ZGaXJzdENlbGwgPD0geEF4aXNPZkRyb3BwZWRTaGlwRmlyc3RQb3NpdGlvbiAmJlxuICAgICAgeEF4aXNPZkxhc3RDZWxsID49IHhBeGlzT2ZEcm9wcGVkU2hpcEZpcnN0UG9zaXRpb24gKyAoc2hpcGxlbmd0aCAtIDEpXG4gICAgKSB7XG4gICAgICAvLyBzaGlscGxlbmd0aC0xIGJlY2F1c2UgOTUrNT0xMDAgYnV0IGlmIHlvdSBjb25zaWRlciA5NSBhbmQgYWRkIDUgdG8gaXQgdGhlbiBpdCB3b3VsZCBiZSA5OVxuICAgICAgLy8geW91IGhhdmUgdG8gY29uc2lkZXIgdGhpcyBudWFuY2Ugd2hlbiB3b3JraW5nIHdpdGggZ2FtZWJvYXJkIGNlbGxzXG4gICAgICByZXR1cm4gdHJ1ZTsgLy9tZWFucyB0aGUgc2hpcCBjYW4gYmUgcGxhY2VkXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBjaGVja0lmRHJvcFZhbGlkKGV2ZW50LCBzaGlwRGF0YSkge1xuICAgIGNvbnN0IGRyb3BUYXJnZXRDb29yZGluYXRlcyA9IGV2ZW50LnRhcmdldC5kYXRhc2V0LmluZGV4LnNwbGl0KFwiLFwiKTtcbiAgICBjb25zdCBwb3NpdGlvbk9mTW91c2VPblRoZVNoaXAgPSBzaGlwRGF0YVswXTtcbiAgICBjb25zdCB4QXhpc09mRHJvcHBlZFNoaXBGaXJzdFBvc2l0aW9uID1cbiAgICAgIGRyb3BUYXJnZXRDb29yZGluYXRlc1swXSAtIHBvc2l0aW9uT2ZNb3VzZU9uVGhlU2hpcDtcbiAgICBjb25zdCBodW1hbkdhbWVib2FyZENlbGxzQXJyYXkgPSBbLi4uaHVtYW5HYW1lYm9hcmRDZWxsc107XG4gICAgbGV0IGNlbGxzX1dpdGhfU2FtZV9ZX0F4aXNfQXNfRHJvcFRhcmdldCA9IGh1bWFuR2FtZWJvYXJkQ2VsbHNBcnJheS5maWx0ZXIoXG4gICAgICAoY2VsbCkgPT4ge1xuICAgICAgICBjb25zdCB5QXhpc09mQ2VsbCA9IGNlbGwuZGF0YXNldC5pbmRleC5zcGxpdChcIixcIilbMV07XG4gICAgICAgIGNvbnN0IHlBeGlzT2ZEcm9wVGFyZ2V0ID0gZHJvcFRhcmdldENvb3JkaW5hdGVzWzFdO1xuICAgICAgICByZXR1cm4geUF4aXNPZkNlbGwgPT09IHlBeGlzT2ZEcm9wVGFyZ2V0O1xuICAgICAgfVxuICAgICk7XG5cbiAgICBpZiAoXG4gICAgICBpc0FTaGlwQWxyZWFkeVBsYWNlZChcbiAgICAgICAgY2VsbHNfV2l0aF9TYW1lX1lfQXhpc19Bc19Ecm9wVGFyZ2V0LFxuICAgICAgICBzaGlwRGF0YSxcbiAgICAgICAgeEF4aXNPZkRyb3BwZWRTaGlwRmlyc3RQb3NpdGlvblxuICAgICAgKVxuICAgICkge1xuICAgICAgcmV0dXJuIGZhbHNlOyAvL21lYW5zIHRoZXJlIGlzIGFscmVhZHkgYSBzaGlwIHBsYWNlZCBpbiB0aGUgc2FtZSBheGlzXG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGlzVGhlcmVFbm91Z2hTcGFjZShcbiAgICAgICAgY2VsbHNfV2l0aF9TYW1lX1lfQXhpc19Bc19Ecm9wVGFyZ2V0LFxuICAgICAgICBzaGlwRGF0YSxcbiAgICAgICAgeEF4aXNPZkRyb3BwZWRTaGlwRmlyc3RQb3NpdGlvblxuICAgICAgKVxuICAgICkge1xuICAgICAgcmV0dXJuIHRydWU7IC8vbWVhbnMgdGhlIHNoaXAgY2FuIGJlIHBsYWNlZFxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgdG90YWxTaGlwcyA9IDQ7XG4gIGxldCBkcm9wQ291bnQgPSAwO1xuXG4gIGZ1bmN0aW9uIGRyb3AoZSkge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7IC8vIHN0b3BzIHRoZSBicm93c2VyIGZyb20gcmVkaXJlY3RpbmcuXG5cbiAgICBjb25zdCB4QXhpc09mRHJvcFRhcmdldCA9IE51bWJlcihlLnRhcmdldC5kYXRhc2V0LmluZGV4LnNwbGl0KFwiLFwiKVswXSk7XG4gICAgY29uc3Qgc2hpcERhdGFKc29uID0gZS5kYXRhVHJhbnNmZXIuZ2V0RGF0YShcInNoaXAtZGF0YVwiKTtcbiAgICBjb25zdCBzaGlwRGF0YSA9IEpTT04ucGFyc2Uoc2hpcERhdGFKc29uKTtcblxuICAgIGlmICghY2hlY2tJZkRyb3BWYWxpZChlLCBzaGlwRGF0YSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTsgLy90aGlzIHdpbGwgc3RvcCB0aGUgZnVuY3Rpb24gYW5kIHRodXMgdGhlIGRyb3Agd2lsbCBub3QgYmUgaGFuZGxlZFxuICAgIH1cblxuICAgIGNvbnN0IHNoaXBsZW5ndGggPSBzaGlwRGF0YVsxXTtcbiAgICBjb25zdCBwb3NpdGlvbk9mTW91c2VPblRoZVNoaXAgPSBzaGlwRGF0YVswXTtcbiAgICBsZXQgeEF4aXNPZlNoaXBTdGFydFBvc2l0aW9uID0geEF4aXNPZkRyb3BUYXJnZXQgLSBwb3NpdGlvbk9mTW91c2VPblRoZVNoaXA7XG4gICAgY29uc3Qgc2hpcE5hbWUgPSBzaGlwRGF0YVsyXTtcbiAgICBodW1hbi5nYW1lYm9hcmQucGxhY2VTaGlwKGAke3NoaXBOYW1lfWAsIHhBeGlzT2ZTaGlwU3RhcnRQb3NpdGlvbik7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwbGVuZ3RoOyBpKyspIHtcbiAgICAgIGh1bWFuR2FtZWJvYXJkQ2VsbHNbeEF4aXNPZlNoaXBTdGFydFBvc2l0aW9uICsgaV0uc3R5bGUuYmFja2dyb3VuZCA9XG4gICAgICAgIFwiIzQ0NDQ0NFwiO1xuICAgICAgaHVtYW5HYW1lYm9hcmRDZWxsc1t4QXhpc09mU2hpcFN0YXJ0UG9zaXRpb24gKyBpXS5jbGFzc0xpc3QuYWRkKFxuICAgICAgICBcImRyb3BwZWRcIlxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCBkcmFnZ2FibGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjJHtzaGlwTmFtZX1gKTtcbiAgICBkcmFnZ2FibGUuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIGRyb3BDb3VudCArPSAxO1xuICAgIGlmIChkcm9wQ291bnQgPT09IHRvdGFsU2hpcHMpIHtcbiAgICAgIGNvbnN0IHN0YXJ0R2FtZUJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjc3RhcnRcIik7XG4gICAgICBzdGFydEdhbWVCdXR0b24uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICB9XG4gIH1cblxuICBjb25zdCBodW1hbkdhbWVib2FyZENlbGxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcbiAgICBcIiNmcmllbmRseS1hcmVhLWdhbWVib2FyZCAuc3F1YXJlX2RpdlwiXG4gICk7XG4gIGh1bWFuR2FtZWJvYXJkQ2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdlbnRlclwiLCBkcmFnRW50ZXIpO1xuICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdvdmVyXCIsIGRyYWdPdmVyKTtcbiAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnbGVhdmVcIiwgZHJhZ0xlYXZlKTtcbiAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJkcm9wXCIsIGRyb3ApO1xuICB9KTtcblxuICBjb25zdCBkcmFnZ2FibGVTaGlwcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZHJhZ2dhYmxlXCIpO1xuICBkcmFnZ2FibGVTaGlwcy5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgc2hpcC5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ3N0YXJ0XCIsIGRyYWdzdGFydCk7XG4gIH0pO1xufVxuXG5leHBvcnQgeyBhZGREcmFnRHJvcEZlYXR1cmUgfTtcbiIsImNvbnN0IHNoaXA9IGZ1bmN0aW9uIChzaGlwbmFtZSwgY29vcmRpbmF0ZSkge1xuICAgIGxldCBzaGlwTGVuZ3RoO1xuICAgIHN3aXRjaCAoc2hpcG5hbWUpIHtcbiAgICBjYXNlIFwiY2FycmllclwiOlxuICAgICAgICBzaGlwTGVuZ3RoID0gNTtcbiAgICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImJhdHRsZXNoaXBcIjpcbiAgICAgICAgc2hpcExlbmd0aCA9IDQ7XG4gICAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJkZXN0cm95ZXJcIjpcbiAgICAgICAgc2hpcExlbmd0aCA9IDM7XG4gICAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJzdWJtYXJpbmVcIjpcbiAgICAgICAgc2hpcExlbmd0aCA9IDI7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjb25zdCBoaXRQb3NpdGlvbnMgPSBbXTtcbiAgICBjb25zdCBoaXQ9ZnVuY3Rpb24gKGhpdENvb3JkaW5hdGUpIHtcbiAgICAgICAgaGl0UG9zaXRpb25zLnB1c2goaGl0Q29vcmRpbmF0ZSk7XG4gICAgfTtcbiAgICBjb25zdCBpc1N1bms9ZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoaGl0UG9zaXRpb25zLmxlbmd0aCA9PT0gc2hpcExlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG4gICAgcmV0dXJuIHsgY29vcmRpbmF0ZSwgc2hpcExlbmd0aCwgaGl0UG9zaXRpb25zLCBoaXQsIGlzU3VuayB9O1xufTtcblxuY29uc3QgZ2FtZUJvYXJkPWZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBzaGlwTGlzdCA9IFtdO1xuICAgIGNvbnN0IHBsYWNlU2hpcD1mdW5jdGlvbiAoc2hpcG5hbWUsIGNvb3JkaW5hdGUpIHtcbiAgICAgICAgc2hpcExpc3QucHVzaChzaGlwKHNoaXBuYW1lLCBjb29yZGluYXRlKSk7XG4gICAgfTtcbiAgICBjb25zdCBtaXNzZWRIaXRzID0gW107XG4gICAgY29uc3QgcmVjZWl2ZUF0dGFjaz1mdW5jdGlvbiAoaGl0Q29vcmRpbmF0ZSkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBMaXN0Lmxlbmd0aDsgaSs9MSkge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIGhpdENvb3JkaW5hdGUgPj0gc2hpcExpc3RbaV0uY29vcmRpbmF0ZSAmJlxuICAgICAgICBoaXRDb29yZGluYXRlIDwgc2hpcExpc3RbaV0uY29vcmRpbmF0ZSArIHNoaXBMaXN0W2ldLnNoaXBMZW5ndGhcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHNoaXBMaXN0W2ldLmhpdChoaXRDb29yZGluYXRlKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaSA9PT0gc2hpcExpc3QubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgIC8vIG1lYW5zLHdlIGFyZSBhdCB0aGUgZW5kIG9mIHRoZSBsb29wIGJ1dCB3ZSBkaWQgbm90IGZpbmQgYSBoaXRcbiAgICAgICAgICAgICAgICBtaXNzZWRIaXRzLnB1c2goaGl0Q29vcmRpbmF0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIGNvbnN0IGFyZUFsbFNoaXBTdW5rPWZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHNoaXBMaXN0LmV2ZXJ5KChzaGlwKSA9PiBzaGlwLmlzU3VuaygpKTtcbiAgICB9O1xuICAgIHJldHVybiB7IHNoaXBMaXN0LCBwbGFjZVNoaXAsIHJlY2VpdmVBdHRhY2ssIG1pc3NlZEhpdHMsIGFyZUFsbFNoaXBTdW5rIH07XG59O1xuXG5jb25zdCBodW1hblBsYXllcj1mdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgZ2FtZWJvYXJkID0gZ2FtZUJvYXJkKCk7XG4gICAgY29uc3QgYXR0YWNrPWZ1bmN0aW9uIChlbmVteUdhbWVCb2FyZCwgYXR0YWNrQ29vcmRpbmF0ZSkge1xuICAgICAgICBlbmVteUdhbWVCb2FyZC5yZWNlaXZlQXR0YWNrKGF0dGFja0Nvb3JkaW5hdGUpO1xuICAgIH07XG4gICAgcmV0dXJuIHsgZ2FtZWJvYXJkLCBhdHRhY2sgfTtcbn07XG5cbmNvbnN0IHJldHVybkxhc3RTdWNjZXNzZnVsSGl0UG9zaXRpb25PZkVuZW15R2FtZWJvYXJkPWZ1bmN0aW9uIChcbiAgICBwcmV2aW91c0VuZW15R2FtZUJvYXJkSGl0UG9zaXRpb25zLFxuICAgIGVuZW15R2FtZUJvYXJkLFxuKSB7XG4gICAgbGV0IHVwZGF0ZWRFbmVteUdhbWVib2FyZEhpdFBvc2l0aW9ucyA9IFtdO1xuICAgIGVuZW15R2FtZUJvYXJkLnNoaXBMaXN0LmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgICAgdXBkYXRlZEVuZW15R2FtZWJvYXJkSGl0UG9zaXRpb25zID1cbiAgICAgIHVwZGF0ZWRFbmVteUdhbWVib2FyZEhpdFBvc2l0aW9ucy5jb25jYXQoc2hpcC5oaXRQb3NpdGlvbnMpO1xuICAgIH0pO1xuICAgIGNvbnN0IGxhc3RIaXRQb3NpdGlvblN0ciA9IHVwZGF0ZWRFbmVteUdhbWVib2FyZEhpdFBvc2l0aW9uc1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxlblxuICAgICAgICAuZmlsdGVyKChwb3NpdGlvbikgPT4gIXByZXZpb3VzRW5lbXlHYW1lQm9hcmRIaXRQb3NpdGlvbnMuaW5jbHVkZXMocG9zaXRpb24pKVxuICAgICAgICAudG9TdHJpbmcoKTtcbiAgICBpZiAoXG4gICAgICAgIHVwZGF0ZWRFbmVteUdhbWVib2FyZEhpdFBvc2l0aW9ucy5sZW5ndGggPlxuICAgIHByZXZpb3VzRW5lbXlHYW1lQm9hcmRIaXRQb3NpdGlvbnMubGVuZ3RoXG4gICAgKSB7XG4gICAgLy8gbWVhbnMgbGFzdCBhdHRhY2sgd2FzIHN1Y2Nlc3NmdWxcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJhZGl4XG4gICAgICAgIGNvbnN0IGxhc3RIaXRQb3NpdGlvbiA9IHBhcnNlSW50KGxhc3RIaXRQb3NpdGlvblN0cik7XG4gICAgICAgIHByZXZpb3VzRW5lbXlHYW1lQm9hcmRIaXRQb3NpdGlvbnMucHVzaChsYXN0SGl0UG9zaXRpb24pO1xuICAgICAgICByZXR1cm4gbGFzdEhpdFBvc2l0aW9uO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7IC8vIG1lYW5zIGxhc3QgYXR0YWNrIHdhcyBub3Qgc3VjY2Vzc2Z1bFxuXG59O1xuXG5jb25zdCBjYWxjdWxhdGVTaG90Q29vcmRpbmF0ZT1mdW5jdGlvbiAoXG4gICAgcHJldmlvdXNFbmVteUdhbWVCb2FyZEhpdFBvc2l0aW9ucyxcbiAgICBlbmVteUdhbWVCb2FyZCxcbiAgICBjb29yZGluYXRlc0ZvckF0dGFjayxcbikge1xuICAgIGNvbnN0IGxhc3RIaXRQb3NpdGlvbk9mRW5lbXlHYW1lYm9hcmQgPVxuICAgIHJldHVybkxhc3RTdWNjZXNzZnVsSGl0UG9zaXRpb25PZkVuZW15R2FtZWJvYXJkKFxuICAgICAgICBwcmV2aW91c0VuZW15R2FtZUJvYXJkSGl0UG9zaXRpb25zLFxuICAgICAgICBlbmVteUdhbWVCb2FyZCxcbiAgICApO1xuICAgIGNvbnN0IGNvb3JkaW5hdGVzRm9yQXR0YWNrSW5jbHVkZU5leHRIaXQgPSBjb29yZGluYXRlc0ZvckF0dGFjay5pbmNsdWRlcyhcbiAgICAgICAgbGFzdEhpdFBvc2l0aW9uT2ZFbmVteUdhbWVib2FyZCArIDEsXG4gICAgKTtcbiAgICBsZXQgc2hvdENvb3JkaW5hdGU7XG5cbiAgICBpZiAobGFzdEhpdFBvc2l0aW9uT2ZFbmVteUdhbWVib2FyZCAmJiBjb29yZGluYXRlc0ZvckF0dGFja0luY2x1ZGVOZXh0SGl0KSB7XG4gICAgLy8gbWVhbnMgbGFzdCBhdHRhY2sgd2FzIGEgaGl0XG4gICAgICAgIHNob3RDb29yZGluYXRlID0gbGFzdEhpdFBvc2l0aW9uT2ZFbmVteUdhbWVib2FyZCArIDE7XG4gICAgICAgIGNvb3JkaW5hdGVzRm9yQXR0YWNrLnNwbGljZShcbiAgICAgICAgICAgIGNvb3JkaW5hdGVzRm9yQXR0YWNrLmluZGV4T2Yoc2hvdENvb3JkaW5hdGUpLFxuICAgICAgICAgICAgMSxcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIHNob3RDb29yZGluYXRlO1xuICAgIH1cbiAgICBzaG90Q29vcmRpbmF0ZSA9XG4gICAgICBjb29yZGluYXRlc0ZvckF0dGFja1tcbiAgICAgICAgICBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjb29yZGluYXRlc0ZvckF0dGFjay5sZW5ndGgpXG4gICAgICBdO1xuICAgIGNvb3JkaW5hdGVzRm9yQXR0YWNrLnNwbGljZShcbiAgICAgICAgY29vcmRpbmF0ZXNGb3JBdHRhY2suaW5kZXhPZihzaG90Q29vcmRpbmF0ZSksXG4gICAgICAgIDEsXG4gICAgKTtcbiAgICByZXR1cm4gc2hvdENvb3JkaW5hdGU7XG5cbn07XG5cbmNvbnN0IGFpPWZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBnYW1lYm9hcmQgPSBnYW1lQm9hcmQoKTtcbiAgICBjb25zdCBnYW1lQm9hcmRTaXplID0gMTAwO1xuICAgIGNvbnN0IGNvb3JkaW5hdGVzRm9yQXR0YWNrID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBnYW1lQm9hcmRTaXplOyBpKz0xKSB7XG4gICAgICAgIGNvb3JkaW5hdGVzRm9yQXR0YWNrLnB1c2goaSk7XG4gICAgfVxuICAgIGNvbnN0IHByZXZpb3VzRW5lbXlHYW1lQm9hcmRIaXRQb3NpdGlvbnMgPSBbXTtcblxuICAgIGNvbnN0IGF0dGFjaz1mdW5jdGlvbiAoZW5lbXlHYW1lQm9hcmQpIHtcbiAgICAgICAgY29uc3Qgc2hvdENvb3JkaW5hdGUgPSBjYWxjdWxhdGVTaG90Q29vcmRpbmF0ZShcbiAgICAgICAgICAgIHByZXZpb3VzRW5lbXlHYW1lQm9hcmRIaXRQb3NpdGlvbnMsXG4gICAgICAgICAgICBlbmVteUdhbWVCb2FyZCxcbiAgICAgICAgICAgIGNvb3JkaW5hdGVzRm9yQXR0YWNrLFxuICAgICAgICApO1xuICAgICAgICBlbmVteUdhbWVCb2FyZC5yZWNlaXZlQXR0YWNrKHNob3RDb29yZGluYXRlKTtcbiAgICB9O1xuICAgIHJldHVybiB7IGdhbWVib2FyZCwgYXR0YWNrIH07XG59O1xuXG5jb25zdCBodW1hbiA9IGh1bWFuUGxheWVyKCk7XG5jb25zdCBjb21wdXRlciA9IGFpKCk7XG5cbmNvbnN0IGdldEhpdFNjb3JlT2ZCb3RoUGxheWVyPWZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBodW1hbkhpdFBvc2l0aW9uc0FyciA9IFtdO1xuICAgIGNvbXB1dGVyLmdhbWVib2FyZC5zaGlwTGlzdC5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgICAgIHNoaXAuaGl0UG9zaXRpb25zLmZvckVhY2goKHBvc2l0aW9uKSA9PiB7XG4gICAgICAgICAgICBodW1hbkhpdFBvc2l0aW9uc0Fyci5wdXNoKHBvc2l0aW9uKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgY29uc3QgaHVtYW5NaXNzZWRIaXRDb3VudCA9IGNvbXB1dGVyLmdhbWVib2FyZC5taXNzZWRIaXRzLmxlbmd0aDtcblxuICAgIGNvbnN0IGNvbXB1dGVySGl0UG9zaXRpb25zQXJyID0gW107XG4gICAgaHVtYW4uZ2FtZWJvYXJkLnNoaXBMaXN0LmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgICAgc2hpcC5oaXRQb3NpdGlvbnMuZm9yRWFjaCgocG9zaXRpb24pID0+IHtcbiAgICAgICAgICAgIGNvbXB1dGVySGl0UG9zaXRpb25zQXJyLnB1c2gocG9zaXRpb24pO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICBjb25zdCBjb21wdXRlck1pc3NlZEhpdENvdW50ID0gaHVtYW4uZ2FtZWJvYXJkLm1pc3NlZEhpdHMubGVuZ3RoO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgaHVtYW5IaXRDb3VudDogaHVtYW5IaXRQb3NpdGlvbnNBcnIubGVuZ3RoLFxuICAgICAgICBodW1hbk1pc3NlZEhpdENvdW50LFxuICAgICAgICBjb21wdXRlckhpdENvdW50OiBjb21wdXRlckhpdFBvc2l0aW9uc0Fyci5sZW5ndGgsXG4gICAgICAgIGNvbXB1dGVyTWlzc2VkSGl0Q291bnQsXG4gICAgfTtcbn07XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxlblxuZXhwb3J0IHsgc2hpcCwgZ2FtZUJvYXJkLCBodW1hbiwgY29tcHV0ZXIsIGh1bWFuUGxheWVyLCBhaSwgZ2V0SGl0U2NvcmVPZkJvdGhQbGF5ZXIgfTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLyogZXNsaW50LWRpc2FibGUgcmFkaXggKi9cbi8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi9cbmltcG9ydCB7IGh1bWFuLCBjb21wdXRlciwgZ2V0SGl0U2NvcmVPZkJvdGhQbGF5ZXIgfSBmcm9tIFwiLi9nYW1lTG9naWNcIjtcbmltcG9ydCB7IGFkZERyYWdEcm9wRmVhdHVyZSB9IGZyb20gXCIuL2RyYWdEcm9wTG9naWNcIjtcblxuY29uc3QgaG93VG9Nb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbW9kYWxcIik7XG5jb25zdCBob3dUb01vZGFsQ2xvc2VCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2Nsb3NlX2hvd190b19tb2RhbFwiKTtcbmNvbnN0IGhvd1RvQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5ob3dfdG9cIik7XG5cbmhvd1RvQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgaG93VG9Nb2RhbC5zaG93TW9kYWwoKTtcbn0pO1xuXG5ob3dUb01vZGFsQ2xvc2VCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICBob3dUb01vZGFsLmNsb3NlKCk7XG59KTtcblxuY29uc3QgZnJpZW5kbHlBcmVhR2FtZWJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICBcIiNmcmllbmRseS1hcmVhLWdhbWVib2FyZFwiLFxuKTtcbmNvbnN0IGVuZW15QXJlYUdhbWVib2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZW5lbXktYXJlYS1nYW1lYm9hcmRcIik7XG5cbmNvbnN0IGNyZWF0ZUdhbWVCb2FyZERvbSA9IGZ1bmN0aW9uIChnYW1lQm9hcmRDb250YWluZXJOYW1lKSB7XG4gICAgY29uc3QgZ3JpZFNpemUgPSAxMDtcbiAgICBjb25zdCBncmlkU3F1YXJlID0gMTAwO1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICAgIGdhbWVCb2FyZENvbnRhaW5lck5hbWUuc3R5bGUuZ3JpZFRlbXBsYXRlUm93cyA9IGByZXBlYXQoJHsgZ3JpZFNpemUgfSwxZnIpYDtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICBnYW1lQm9hcmRDb250YWluZXJOYW1lLnN0eWxlLmdyaWRUZW1wbGF0ZUNvbHVtbnMgPSBgcmVwZWF0KCR7IGdyaWRTaXplIH0sMWZyKWA7XG4gICAgY29uc3Qgc3F1YXJlRGl2ID0gW107XG4gICAgbGV0IGxvb3BDb3VudCA9IDE7XG4gICAgbGV0IHlBeGlzID0gMTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdyaWRTcXVhcmU7IGkgKz0gMSkge1xuICAgICAgICBzcXVhcmVEaXZbaV0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBzcXVhcmVEaXZbaV0uc2V0QXR0cmlidXRlKFwiZGF0YS1pbmRleFwiLCBgJHsgW2ksIHlBeGlzXSB9YCk7XG4gICAgICAgIGlmIChsb29wQ291bnQgPT09IDEwKSB7XG4gICAgICAgICAgICB5QXhpcyArPSAxO1xuICAgICAgICAgICAgbG9vcENvdW50ID0gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxvb3BDb3VudCArPSAxO1xuICAgICAgICB9XG4gICAgICAgIHNxdWFyZURpdltpXS5jbGFzc0xpc3QuYWRkKFwic3F1YXJlX2RpdlwiKTtcbiAgICAgICAgZ2FtZUJvYXJkQ29udGFpbmVyTmFtZS5hcHBlbmRDaGlsZChzcXVhcmVEaXZbaV0pO1xuICAgIH1cbn07XG5cbmNyZWF0ZUdhbWVCb2FyZERvbShmcmllbmRseUFyZWFHYW1lYm9hcmQpO1xuY3JlYXRlR2FtZUJvYXJkRG9tKGVuZW15QXJlYUdhbWVib2FyZCk7XG5cbmFkZERyYWdEcm9wRmVhdHVyZShodW1hbik7XG4vLyBodW1hbiBnb2VzIGludG8gdGhpcyBmdW5jdGlvbiBhbmQgZ2V0IGNoYW5nZWRcbi8vIGJ1dCBzaW5jZSBodW1hbiBpcyBhbiBvYmplY3Qgd2Ugd2lsbCBnZXQgYW4gdXBkYXRlZCBodW1hbiBvYmplY3QgaW4gdGhpcyBtb2R1bGVcblxuY29uc3QgYXV0b1BsYWNlQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNhdXRvX3BsYWNlXCIpO1xuY29uc3Qgc2hpcENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYWxsX3NoaXBfY29udGFpbmVyXCIpO1xuY29uc3QgZ2FtZVN0YXJ0QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNzdGFydFwiKTtcblxuY29uc3QgbWFya1NoaXBzSW5UaGVEb20gPSBmdW5jdGlvbiAoKSB7XG4gICAgaHVtYW4uZ2FtZWJvYXJkLnNoaXBMaXN0LmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLnNoaXBMZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgZnJpZW5kbHlBcmVhR2FtZWJvYXJkLmNoaWxkcmVuW3NoaXAuY29vcmRpbmF0ZSArIGldLnN0eWxlLmJhY2tncm91bmQgPVxuICAgICAgICBcIiM0NDQ0NDRcIjtcbiAgICAgICAgfVxuICAgIH0pO1xufTtcblxuY29uc3QgYXV0b1BsYWNlU2hpcHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgaHVtYW4uZ2FtZWJvYXJkLnBsYWNlU2hpcChcImNhcnJpZXJcIiwgMTQpO1xuICAgIGh1bWFuLmdhbWVib2FyZC5wbGFjZVNoaXAoXCJiYXR0bGVzaGlwXCIsIDM0KTtcbiAgICBodW1hbi5nYW1lYm9hcmQucGxhY2VTaGlwKFwiZGVzdHJveWVyXCIsIDk0KTtcbiAgICBodW1hbi5nYW1lYm9hcmQucGxhY2VTaGlwKFwic3VibWFyaW5lXCIsIDc0KTtcbiAgICBtYXJrU2hpcHNJblRoZURvbSgpO1xuICAgIHNoaXBDb250YWluZXIuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIGdhbWVTdGFydEJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xufTtcbmF1dG9QbGFjZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXV0b1BsYWNlU2hpcHMpO1xuXG5jb25zdCBtYXJrSGl0VW5oaXQgPSBmdW5jdGlvbiAoZW5lbXksIGVuZW15R2FtZWJvYXJkRG9tKSB7XG4gICAgZW5lbXkuZ2FtZWJvYXJkLnNoaXBMaXN0LmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgICAgc2hpcC5oaXRQb3NpdGlvbnMuZm9yRWFjaCgocG9zaXRpb24pID0+IHtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICAgICAgICAgICAgZW5lbXlHYW1lYm9hcmREb20uY2hpbGRyZW5bcG9zaXRpb25dLnN0eWxlLmJhY2tncm91bmQgPSBcIiNGOTM5NDNcIjtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgZW5lbXkuZ2FtZWJvYXJkLm1pc3NlZEhpdHMuZm9yRWFjaCgobWlzc2VkSGl0UG9zaXRpb24pID0+IHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICAgICAgZW5lbXlHYW1lYm9hcmREb20uY2hpbGRyZW5bbWlzc2VkSGl0UG9zaXRpb25dLnN0eWxlLmJhY2tncm91bmQgPSBcIiMwNUIyRENcIjtcbiAgICB9KTtcbn07XG5cbmNvbnN0IGl0SXNBaVR1cm4gPSBmdW5jdGlvbiAoKSB7XG4gICAgY29tcHV0ZXIuYXR0YWNrKGh1bWFuLmdhbWVib2FyZCk7XG4gICAgbWFya0hpdFVuaGl0KGh1bWFuLCBmcmllbmRseUFyZWFHYW1lYm9hcmQpO1xufTtcblxuY29uc3QgY2hlY2tXaW5uZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgYWxsQ29tcHV0ZXJTaGlwU3VuayA9IGNvbXB1dGVyLmdhbWVib2FyZC5hcmVBbGxTaGlwU3VuaygpO1xuICAgIGNvbnN0IGFsbEh1bWFuU2hpcFN1bmsgPSBodW1hbi5nYW1lYm9hcmQuYXJlQWxsU2hpcFN1bmsoKTtcbiAgICBpZiAoYWxsQ29tcHV0ZXJTaGlwU3Vuaykge1xuICAgICAgICByZXR1cm4gXCJ5b3VcIjtcbiAgICB9IGVsc2UgaWYgKGFsbEh1bWFuU2hpcFN1bmspIHtcbiAgICAgICAgcmV0dXJuIFwiYWlcIjtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufTtcblxuY29uc3QgcmVtb3ZlQWxsRXZlbnRMaXN0ZW5lckluQ29tcHV0ZXJHYW1lYm9hcmQgPSBmdW5jdGlvbiAoKSB7XG4gICAgZW5lbXlBcmVhR2FtZWJvYXJkLmNoaWxkTm9kZXMuZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgICAgY2hpbGQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhhbmRsZUNsaWNrRXZlbnRzKTtcbiAgICB9KTtcbn07XG5cbmNvbnN0IHNob3dTY29yZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBzY29yZSA9IGdldEhpdFNjb3JlT2ZCb3RoUGxheWVyKCk7XG4gICAgY29uc3QgaHVtYW5TY29yZUNhcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2h1bWFuX3Njb3JlX2NhcmRcIik7XG4gICAgY29uc3QgaHVtYW5NaXNzZWRIaXRDb3VudCA9IGh1bWFuU2NvcmVDYXJkLmNoaWxkcmVuWzBdO1xuICAgIGNvbnN0IGh1bWFuSGl0Q291bnQgPSBodW1hblNjb3JlQ2FyZC5jaGlsZHJlblsxXTtcbiAgICBodW1hbk1pc3NlZEhpdENvdW50LnRleHRDb250ZW50ID0gYE1pc3NlZCBIaXRzOiAkeyBzY29yZS5odW1hbk1pc3NlZEhpdENvdW50IH1gO1xuICAgIGh1bWFuSGl0Q291bnQudGV4dENvbnRlbnQgPSBgSGl0czogJHsgc2NvcmUuaHVtYW5IaXRDb3VudCB9YDtcblxuICAgIGNvbnN0IGNvbXB1dGVyU2NvcmVDYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNhaV9zY29yZV9jYXJkXCIpO1xuICAgIGNvbnN0IGNvbXB1dGVyTWlzc2VkSGl0Q291bnQgPSBjb21wdXRlclNjb3JlQ2FyZC5jaGlsZHJlblswXTtcbiAgICBjb25zdCBjb21wdXRlckhpdENvdW50ID0gY29tcHV0ZXJTY29yZUNhcmQuY2hpbGRyZW5bMV07XG4gICAgY29tcHV0ZXJNaXNzZWRIaXRDb3VudC50ZXh0Q29udGVudCA9IGBNaXNzZWQgSGl0czogJHsgc2NvcmUuY29tcHV0ZXJNaXNzZWRIaXRDb3VudCB9YDtcbiAgICBjb21wdXRlckhpdENvdW50LnRleHRDb250ZW50ID0gYEhpdHM6ICR7IHNjb3JlLmNvbXB1dGVySGl0Q291bnQgfWA7XG59O1xuXG5jb25zdCBoYW5kbGVDbGlja0V2ZW50cyA9IGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCB0YXJnZXRJbmRleCA9IHBhcnNlSW50KHRoaXMuZGF0YXNldC5pbmRleC5zcGxpdChcIixcIilbMF0pO1xuICAgIGNvbXB1dGVyLmdhbWVib2FyZC5yZWNlaXZlQXR0YWNrKHRhcmdldEluZGV4KTtcbiAgICBtYXJrSGl0VW5oaXQoY29tcHV0ZXIsIGVuZW15QXJlYUdhbWVib2FyZCk7XG4gICAgaXRJc0FpVHVybigpO1xuICAgIHNob3dTY29yZSgpO1xuICAgIGNvbnN0IHdpbm5lciA9IGNoZWNrV2lubmVyKCk7XG4gICAgaWYgKHdpbm5lcikge1xuICAgICAgICBhbGVydChgJHsgd2lubmVyIH0gd29uIHRoZSBnYW1lYCk7XG4gICAgICAgIHJlbW92ZUFsbEV2ZW50TGlzdGVuZXJJbkNvbXB1dGVyR2FtZWJvYXJkKCk7XG4gICAgfVxufTtcblxuY29uc3QgYWRkRXZlbnRMaXN0ZW5lclRvQWlHYW1lQm9hcmQgPSBmdW5jdGlvbiAoKSB7XG4gICAgZW5lbXlBcmVhR2FtZWJvYXJkLmNoaWxkTm9kZXMuZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgICAgY2hpbGQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhhbmRsZUNsaWNrRXZlbnRzLCB7IG9uY2U6IHRydWUgfSk7XG4gICAgfSk7XG59O1xuXG5jb25zdCBhaURvbUNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYWlfY29udGFpbmVyXCIpO1xuY29uc3Qgc2NvcmVDYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNzY29yZV9jYXJkX2NvbnRhaW5lclwiKTtcbmNvbnN0IHBsYXlHYW1lID0gZnVuY3Rpb24gKGdhbWVTdGFydEJ1dHRvbikge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICAgIGdhbWVTdGFydEJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgYWlEb21Db250YWluZXIuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICBzY29yZUNhcmQuc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xuICAgIGNvbXB1dGVyLmdhbWVib2FyZC5wbGFjZVNoaXAoXCJjYXJyaWVyXCIsIDQpO1xuICAgIGNvbXB1dGVyLmdhbWVib2FyZC5wbGFjZVNoaXAoXCJiYXR0bGVzaGlwXCIsIDM0KTtcbiAgICBjb21wdXRlci5nYW1lYm9hcmQucGxhY2VTaGlwKFwiZGVzdHJveWVyXCIsIDc0KTtcbiAgICBjb21wdXRlci5nYW1lYm9hcmQucGxhY2VTaGlwKFwic3VibWFyaW5lXCIsIDk0KTtcbiAgICBhZGRFdmVudExpc3RlbmVyVG9BaUdhbWVCb2FyZCgpO1xufTtcblxuY29uc3Qgc3RhcnRHYW1lQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNzdGFydFwiKTtcbnN0YXJ0R2FtZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgICBwbGF5R2FtZShlLnRhcmdldCk7XG59KTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==