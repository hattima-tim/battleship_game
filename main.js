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
/* eslint-disable max-len */
const addDragDropFeature=function (human) {
    const allDraggableDivs = document.querySelectorAll(".draggable");
    allDraggableDivs.forEach((div) => {
        for (let i = 0; i < div.children.length; i+=1) {
            div.children[i].addEventListener("mousedown", (e) => {
                // eslint-disable-next-line no-param-reassign
                div.dataset.index = e.target.dataset.index; // this will give the position of draggable div on which mouse is on.
            });
        }
    });

    const dragstart=function (e) {
        const shipBeingDragged = e.target;
        const positionOfMouseOnTheShip = shipBeingDragged.dataset.index;
        const lengthOfTheShip = shipBeingDragged.dataset.shiplength;
        const shipName = shipBeingDragged.id;
        const transferData = [positionOfMouseOnTheShip, lengthOfTheShip, shipName];
        e.dataTransfer.setData("ship-data", JSON.stringify(transferData));
    };

    const dragEnter=function (e) {
        e.preventDefault();
    };

    const dragOver=function (e) {
        e.preventDefault();
    };

    const isAShipAlreadyPlaced=function (
        cells_With_Same_Y_Axis_As_DropTarget,
        shipData,
        xAxisOfDroppedShipFirstPosition,
    ) {
        const cellsWithShipPlaced = cells_With_Same_Y_Axis_As_DropTarget.filter(
            (cell) => cell.classList.contains("dropped"),
        );
        // eslint-disable-next-line radix
        const shipsPositionsInXAxis = cellsWithShipPlaced.map((cell) => parseInt(cell.dataset.index.split(",")[0]));
        const potentialShipPositionsForCurrentShip = [];
        const shipLength = shipData[1];
        for (let i = 0; i < shipLength; i+=1) {
            let droppedShipPosition = xAxisOfDroppedShipFirstPosition;
            droppedShipPosition += i;
            potentialShipPositionsForCurrentShip.push(droppedShipPosition);
        }
        const totalOverlappedShipPositions =
      potentialShipPositionsForCurrentShip.some((potentialShipPosition) => shipsPositionsInXAxis.includes(potentialShipPosition));
        if (totalOverlappedShipPositions) {
            return true;
        }
        return false;

    };

    const isThereEnoughSpace=function (
        cells_With_Same_Y_Axis_As_DropTarget,
        shipData,
        xAxisOfDroppedShipFirstPosition,
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
            return true; // means the ship can be placed
        }
        return false;

    };

    const checkIfDropValid=function (event, shipData) {
        const dropTargetCoordinates = event.target.dataset.index.split(",");
        const positionOfMouseOnTheShip = shipData[0];
        const xAxisOfDroppedShipFirstPosition =
      dropTargetCoordinates[0] - positionOfMouseOnTheShip;
        const humanGameboardCellsArray = [...humanGameboardCells];
        const cells_With_Same_Y_Axis_As_DropTarget = humanGameboardCellsArray.filter(
            (cell) => {
                const yAxisOfCell = cell.dataset.index.split(",")[1];
                const yAxisOfDropTarget = dropTargetCoordinates[1];
                return yAxisOfCell === yAxisOfDropTarget;
            },
        );

        if (
            isAShipAlreadyPlaced(
                cells_With_Same_Y_Axis_As_DropTarget,
                shipData,
                xAxisOfDroppedShipFirstPosition,
            )
        ) {
            return false; // means there is already a ship placed in the same axis
        } else if (
            isThereEnoughSpace(
                cells_With_Same_Y_Axis_As_DropTarget,
                shipData,
                xAxisOfDroppedShipFirstPosition,
            )
        ) {
            return true; // means the ship can be placed
        }
        return false;

    };

    const totalShips = 4;
    let dropCount = 0;

    const drop=function (e) {
        e.stopPropagation(); // stops the browser from redirecting.

        const xAxisOfDropTarget = Number(e.target.dataset.index.split(",")[0]);
        const shipDataJson = e.dataTransfer.getData("ship-data");
        const shipData = JSON.parse(shipDataJson);

        if (!checkIfDropValid(e, shipData)) {
            return false; // this will stop the function and thus the drop will not be handled
        }

        const shiplength = shipData[1];
        const positionOfMouseOnTheShip = shipData[0];
        const xAxisOfShipStartPosition = xAxisOfDropTarget - positionOfMouseOnTheShip;
        const shipName = shipData[2];
        human.gameboard.placeShip(`${ shipName }`, xAxisOfShipStartPosition);
        for (let i = 0; i < shiplength; i+=1) {
            humanGameboardCells[xAxisOfShipStartPosition + i].style.background =
        "#444444";
            humanGameboardCells[xAxisOfShipStartPosition + i].classList.add(
                "dropped",
            );
        }

        const draggable = document.querySelector(`#${ shipName }`);
        draggable.style.display = "none";
        dropCount += 1;
        if (dropCount === totalShips) {
            const startGameButton = document.querySelector("#start");
            startGameButton.style.display = "block";
        }
    };

    const humanGameboardCells = document.querySelectorAll(
        "#friendly-area-gameboard .square_div",
    );
    humanGameboardCells.forEach((cell) => {
        cell.addEventListener("dragenter", dragEnter);
        cell.addEventListener("dragover", dragOver);
        cell.addEventListener("drop", drop);
    });

    const draggableShips = document.querySelectorAll(".draggable");
    draggableShips.forEach((ship) => {
        ship.addEventListener("dragstart", dragstart);
    });
};




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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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U0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQSxJQUFJLHVEQUFlLENBQUMsdURBQWU7QUFDbkMsaUJBQWlCLDZDQUFLO0FBQ3RCOztBQUVBO0FBQ0EsZ0NBQWdDLHlFQUFpQztBQUNqRSw2QkFBNkIsc0VBQThCO0FBQzNEO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0Esa0JBQWtCLG1FQUF1QjtBQUN6QztBQUNBO0FBQ0E7QUFDQSx1REFBdUQsMkJBQTJCO0FBQ2xGLDBDQUEwQyxxQkFBcUI7O0FBRS9EO0FBQ0E7QUFDQTtBQUNBLDBEQUEwRCw4QkFBOEI7QUFDeEYsNkNBQTZDLHdCQUF3QjtBQUNyRTs7QUFFQTtBQUNBO0FBQ0EsSUFBSSx3RUFBZ0M7QUFDcEMsaUJBQWlCLGdEQUFRO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLFNBQVM7QUFDM0I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw2REFBNkQsWUFBWTtBQUN6RSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLG9FQUE0QjtBQUNoQyxJQUFJLG9FQUE0QjtBQUNoQyxJQUFJLG9FQUE0QjtBQUNoQyxJQUFJLG9FQUE0QjtBQUNoQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwX2dhbWUvLi9zcmMvZHJhZ0Ryb3BMb2dpYy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwX2dhbWUvLi9zcmMvZ2FtZUxvZ2ljLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXBfZ2FtZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwX2dhbWUvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXBfZ2FtZS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXBfZ2FtZS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXBfZ2FtZS8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBtYXgtbGVuICovXG5jb25zdCBhZGREcmFnRHJvcEZlYXR1cmU9ZnVuY3Rpb24gKGh1bWFuKSB7XG4gICAgY29uc3QgYWxsRHJhZ2dhYmxlRGl2cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZHJhZ2dhYmxlXCIpO1xuICAgIGFsbERyYWdnYWJsZURpdnMuZm9yRWFjaCgoZGl2KSA9PiB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGl2LmNoaWxkcmVuLmxlbmd0aDsgaSs9MSkge1xuICAgICAgICAgICAgZGl2LmNoaWxkcmVuW2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgKGUpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICAgICAgICAgICAgICBkaXYuZGF0YXNldC5pbmRleCA9IGUudGFyZ2V0LmRhdGFzZXQuaW5kZXg7IC8vIHRoaXMgd2lsbCBnaXZlIHRoZSBwb3NpdGlvbiBvZiBkcmFnZ2FibGUgZGl2IG9uIHdoaWNoIG1vdXNlIGlzIG9uLlxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IGRyYWdzdGFydD1mdW5jdGlvbiAoZSkge1xuICAgICAgICBjb25zdCBzaGlwQmVpbmdEcmFnZ2VkID0gZS50YXJnZXQ7XG4gICAgICAgIGNvbnN0IHBvc2l0aW9uT2ZNb3VzZU9uVGhlU2hpcCA9IHNoaXBCZWluZ0RyYWdnZWQuZGF0YXNldC5pbmRleDtcbiAgICAgICAgY29uc3QgbGVuZ3RoT2ZUaGVTaGlwID0gc2hpcEJlaW5nRHJhZ2dlZC5kYXRhc2V0LnNoaXBsZW5ndGg7XG4gICAgICAgIGNvbnN0IHNoaXBOYW1lID0gc2hpcEJlaW5nRHJhZ2dlZC5pZDtcbiAgICAgICAgY29uc3QgdHJhbnNmZXJEYXRhID0gW3Bvc2l0aW9uT2ZNb3VzZU9uVGhlU2hpcCwgbGVuZ3RoT2ZUaGVTaGlwLCBzaGlwTmFtZV07XG4gICAgICAgIGUuZGF0YVRyYW5zZmVyLnNldERhdGEoXCJzaGlwLWRhdGFcIiwgSlNPTi5zdHJpbmdpZnkodHJhbnNmZXJEYXRhKSk7XG4gICAgfTtcblxuICAgIGNvbnN0IGRyYWdFbnRlcj1mdW5jdGlvbiAoZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgfTtcblxuICAgIGNvbnN0IGRyYWdPdmVyPWZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB9O1xuXG4gICAgY29uc3QgaXNBU2hpcEFscmVhZHlQbGFjZWQ9ZnVuY3Rpb24gKFxuICAgICAgICBjZWxsc19XaXRoX1NhbWVfWV9BeGlzX0FzX0Ryb3BUYXJnZXQsXG4gICAgICAgIHNoaXBEYXRhLFxuICAgICAgICB4QXhpc09mRHJvcHBlZFNoaXBGaXJzdFBvc2l0aW9uLFxuICAgICkge1xuICAgICAgICBjb25zdCBjZWxsc1dpdGhTaGlwUGxhY2VkID0gY2VsbHNfV2l0aF9TYW1lX1lfQXhpc19Bc19Ecm9wVGFyZ2V0LmZpbHRlcihcbiAgICAgICAgICAgIChjZWxsKSA9PiBjZWxsLmNsYXNzTGlzdC5jb250YWlucyhcImRyb3BwZWRcIiksXG4gICAgICAgICk7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByYWRpeFxuICAgICAgICBjb25zdCBzaGlwc1Bvc2l0aW9uc0luWEF4aXMgPSBjZWxsc1dpdGhTaGlwUGxhY2VkLm1hcCgoY2VsbCkgPT4gcGFyc2VJbnQoY2VsbC5kYXRhc2V0LmluZGV4LnNwbGl0KFwiLFwiKVswXSkpO1xuICAgICAgICBjb25zdCBwb3RlbnRpYWxTaGlwUG9zaXRpb25zRm9yQ3VycmVudFNoaXAgPSBbXTtcbiAgICAgICAgY29uc3Qgc2hpcExlbmd0aCA9IHNoaXBEYXRhWzFdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBMZW5ndGg7IGkrPTEpIHtcbiAgICAgICAgICAgIGxldCBkcm9wcGVkU2hpcFBvc2l0aW9uID0geEF4aXNPZkRyb3BwZWRTaGlwRmlyc3RQb3NpdGlvbjtcbiAgICAgICAgICAgIGRyb3BwZWRTaGlwUG9zaXRpb24gKz0gaTtcbiAgICAgICAgICAgIHBvdGVudGlhbFNoaXBQb3NpdGlvbnNGb3JDdXJyZW50U2hpcC5wdXNoKGRyb3BwZWRTaGlwUG9zaXRpb24pO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHRvdGFsT3ZlcmxhcHBlZFNoaXBQb3NpdGlvbnMgPVxuICAgICAgcG90ZW50aWFsU2hpcFBvc2l0aW9uc0ZvckN1cnJlbnRTaGlwLnNvbWUoKHBvdGVudGlhbFNoaXBQb3NpdGlvbikgPT4gc2hpcHNQb3NpdGlvbnNJblhBeGlzLmluY2x1ZGVzKHBvdGVudGlhbFNoaXBQb3NpdGlvbikpO1xuICAgICAgICBpZiAodG90YWxPdmVybGFwcGVkU2hpcFBvc2l0aW9ucykge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgfTtcblxuICAgIGNvbnN0IGlzVGhlcmVFbm91Z2hTcGFjZT1mdW5jdGlvbiAoXG4gICAgICAgIGNlbGxzX1dpdGhfU2FtZV9ZX0F4aXNfQXNfRHJvcFRhcmdldCxcbiAgICAgICAgc2hpcERhdGEsXG4gICAgICAgIHhBeGlzT2ZEcm9wcGVkU2hpcEZpcnN0UG9zaXRpb24sXG4gICAgKSB7XG4gICAgICAgIGNvbnN0IHNoaXBsZW5ndGggPSBOdW1iZXIoc2hpcERhdGFbMV0pO1xuICAgICAgICBjb25zdCB4QXhpc09mRmlyc3RDZWxsID1cbiAgICAgIGNlbGxzX1dpdGhfU2FtZV9ZX0F4aXNfQXNfRHJvcFRhcmdldFswXS5kYXRhc2V0LmluZGV4LnNwbGl0KFwiLFwiKVswXTtcbiAgICAgICAgY29uc3QgeEF4aXNPZkxhc3RDZWxsID1cbiAgICAgIGNlbGxzX1dpdGhfU2FtZV9ZX0F4aXNfQXNfRHJvcFRhcmdldFtcbiAgICAgICAgICBjZWxsc19XaXRoX1NhbWVfWV9BeGlzX0FzX0Ryb3BUYXJnZXQubGVuZ3RoIC0gMVxuICAgICAgXS5kYXRhc2V0LmluZGV4LnNwbGl0KFwiLFwiKVswXTtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgeEF4aXNPZkZpcnN0Q2VsbCA8PSB4QXhpc09mRHJvcHBlZFNoaXBGaXJzdFBvc2l0aW9uICYmXG4gICAgICB4QXhpc09mTGFzdENlbGwgPj0geEF4aXNPZkRyb3BwZWRTaGlwRmlyc3RQb3NpdGlvbiArIChzaGlwbGVuZ3RoIC0gMSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgICAvLyBzaGlscGxlbmd0aC0xIGJlY2F1c2UgOTUrNT0xMDAgYnV0IGlmIHlvdSBjb25zaWRlciA5NSBhbmQgYWRkIDUgdG8gaXQgdGhlbiBpdCB3b3VsZCBiZSA5OVxuICAgICAgICAgICAgLy8geW91IGhhdmUgdG8gY29uc2lkZXIgdGhpcyBudWFuY2Ugd2hlbiB3b3JraW5nIHdpdGggZ2FtZWJvYXJkIGNlbGxzXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTsgLy8gbWVhbnMgdGhlIHNoaXAgY2FuIGJlIHBsYWNlZFxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgIH07XG5cbiAgICBjb25zdCBjaGVja0lmRHJvcFZhbGlkPWZ1bmN0aW9uIChldmVudCwgc2hpcERhdGEpIHtcbiAgICAgICAgY29uc3QgZHJvcFRhcmdldENvb3JkaW5hdGVzID0gZXZlbnQudGFyZ2V0LmRhdGFzZXQuaW5kZXguc3BsaXQoXCIsXCIpO1xuICAgICAgICBjb25zdCBwb3NpdGlvbk9mTW91c2VPblRoZVNoaXAgPSBzaGlwRGF0YVswXTtcbiAgICAgICAgY29uc3QgeEF4aXNPZkRyb3BwZWRTaGlwRmlyc3RQb3NpdGlvbiA9XG4gICAgICBkcm9wVGFyZ2V0Q29vcmRpbmF0ZXNbMF0gLSBwb3NpdGlvbk9mTW91c2VPblRoZVNoaXA7XG4gICAgICAgIGNvbnN0IGh1bWFuR2FtZWJvYXJkQ2VsbHNBcnJheSA9IFsuLi5odW1hbkdhbWVib2FyZENlbGxzXTtcbiAgICAgICAgY29uc3QgY2VsbHNfV2l0aF9TYW1lX1lfQXhpc19Bc19Ecm9wVGFyZ2V0ID0gaHVtYW5HYW1lYm9hcmRDZWxsc0FycmF5LmZpbHRlcihcbiAgICAgICAgICAgIChjZWxsKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeUF4aXNPZkNlbGwgPSBjZWxsLmRhdGFzZXQuaW5kZXguc3BsaXQoXCIsXCIpWzFdO1xuICAgICAgICAgICAgICAgIGNvbnN0IHlBeGlzT2ZEcm9wVGFyZ2V0ID0gZHJvcFRhcmdldENvb3JkaW5hdGVzWzFdO1xuICAgICAgICAgICAgICAgIHJldHVybiB5QXhpc09mQ2VsbCA9PT0geUF4aXNPZkRyb3BUYXJnZXQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICApO1xuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIGlzQVNoaXBBbHJlYWR5UGxhY2VkKFxuICAgICAgICAgICAgICAgIGNlbGxzX1dpdGhfU2FtZV9ZX0F4aXNfQXNfRHJvcFRhcmdldCxcbiAgICAgICAgICAgICAgICBzaGlwRGF0YSxcbiAgICAgICAgICAgICAgICB4QXhpc09mRHJvcHBlZFNoaXBGaXJzdFBvc2l0aW9uLFxuICAgICAgICAgICAgKVxuICAgICAgICApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTsgLy8gbWVhbnMgdGhlcmUgaXMgYWxyZWFkeSBhIHNoaXAgcGxhY2VkIGluIHRoZSBzYW1lIGF4aXNcbiAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgIGlzVGhlcmVFbm91Z2hTcGFjZShcbiAgICAgICAgICAgICAgICBjZWxsc19XaXRoX1NhbWVfWV9BeGlzX0FzX0Ryb3BUYXJnZXQsXG4gICAgICAgICAgICAgICAgc2hpcERhdGEsXG4gICAgICAgICAgICAgICAgeEF4aXNPZkRyb3BwZWRTaGlwRmlyc3RQb3NpdGlvbixcbiAgICAgICAgICAgIClcbiAgICAgICAgKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTsgLy8gbWVhbnMgdGhlIHNoaXAgY2FuIGJlIHBsYWNlZFxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgIH07XG5cbiAgICBjb25zdCB0b3RhbFNoaXBzID0gNDtcbiAgICBsZXQgZHJvcENvdW50ID0gMDtcblxuICAgIGNvbnN0IGRyb3A9ZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTsgLy8gc3RvcHMgdGhlIGJyb3dzZXIgZnJvbSByZWRpcmVjdGluZy5cblxuICAgICAgICBjb25zdCB4QXhpc09mRHJvcFRhcmdldCA9IE51bWJlcihlLnRhcmdldC5kYXRhc2V0LmluZGV4LnNwbGl0KFwiLFwiKVswXSk7XG4gICAgICAgIGNvbnN0IHNoaXBEYXRhSnNvbiA9IGUuZGF0YVRyYW5zZmVyLmdldERhdGEoXCJzaGlwLWRhdGFcIik7XG4gICAgICAgIGNvbnN0IHNoaXBEYXRhID0gSlNPTi5wYXJzZShzaGlwRGF0YUpzb24pO1xuXG4gICAgICAgIGlmICghY2hlY2tJZkRyb3BWYWxpZChlLCBzaGlwRGF0YSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTsgLy8gdGhpcyB3aWxsIHN0b3AgdGhlIGZ1bmN0aW9uIGFuZCB0aHVzIHRoZSBkcm9wIHdpbGwgbm90IGJlIGhhbmRsZWRcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHNoaXBsZW5ndGggPSBzaGlwRGF0YVsxXTtcbiAgICAgICAgY29uc3QgcG9zaXRpb25PZk1vdXNlT25UaGVTaGlwID0gc2hpcERhdGFbMF07XG4gICAgICAgIGNvbnN0IHhBeGlzT2ZTaGlwU3RhcnRQb3NpdGlvbiA9IHhBeGlzT2ZEcm9wVGFyZ2V0IC0gcG9zaXRpb25PZk1vdXNlT25UaGVTaGlwO1xuICAgICAgICBjb25zdCBzaGlwTmFtZSA9IHNoaXBEYXRhWzJdO1xuICAgICAgICBodW1hbi5nYW1lYm9hcmQucGxhY2VTaGlwKGAkeyBzaGlwTmFtZSB9YCwgeEF4aXNPZlNoaXBTdGFydFBvc2l0aW9uKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwbGVuZ3RoOyBpKz0xKSB7XG4gICAgICAgICAgICBodW1hbkdhbWVib2FyZENlbGxzW3hBeGlzT2ZTaGlwU3RhcnRQb3NpdGlvbiArIGldLnN0eWxlLmJhY2tncm91bmQgPVxuICAgICAgICBcIiM0NDQ0NDRcIjtcbiAgICAgICAgICAgIGh1bWFuR2FtZWJvYXJkQ2VsbHNbeEF4aXNPZlNoaXBTdGFydFBvc2l0aW9uICsgaV0uY2xhc3NMaXN0LmFkZChcbiAgICAgICAgICAgICAgICBcImRyb3BwZWRcIixcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBkcmFnZ2FibGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjJHsgc2hpcE5hbWUgfWApO1xuICAgICAgICBkcmFnZ2FibGUuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICBkcm9wQ291bnQgKz0gMTtcbiAgICAgICAgaWYgKGRyb3BDb3VudCA9PT0gdG90YWxTaGlwcykge1xuICAgICAgICAgICAgY29uc3Qgc3RhcnRHYW1lQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNzdGFydFwiKTtcbiAgICAgICAgICAgIHN0YXJ0R2FtZUJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IGh1bWFuR2FtZWJvYXJkQ2VsbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgICBcIiNmcmllbmRseS1hcmVhLWdhbWVib2FyZCAuc3F1YXJlX2RpdlwiLFxuICAgICk7XG4gICAgaHVtYW5HYW1lYm9hcmRDZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdlbnRlclwiLCBkcmFnRW50ZXIpO1xuICAgICAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnb3ZlclwiLCBkcmFnT3Zlcik7XG4gICAgICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcImRyb3BcIiwgZHJvcCk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBkcmFnZ2FibGVTaGlwcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZHJhZ2dhYmxlXCIpO1xuICAgIGRyYWdnYWJsZVNoaXBzLmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgICAgc2hpcC5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ3N0YXJ0XCIsIGRyYWdzdGFydCk7XG4gICAgfSk7XG59O1xuXG5leHBvcnQgeyBhZGREcmFnRHJvcEZlYXR1cmUgfTtcbiIsImNvbnN0IHNoaXA9IGZ1bmN0aW9uIChzaGlwbmFtZSwgY29vcmRpbmF0ZSkge1xuICAgIGxldCBzaGlwTGVuZ3RoO1xuICAgIHN3aXRjaCAoc2hpcG5hbWUpIHtcbiAgICBjYXNlIFwiY2FycmllclwiOlxuICAgICAgICBzaGlwTGVuZ3RoID0gNTtcbiAgICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImJhdHRsZXNoaXBcIjpcbiAgICAgICAgc2hpcExlbmd0aCA9IDQ7XG4gICAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJkZXN0cm95ZXJcIjpcbiAgICAgICAgc2hpcExlbmd0aCA9IDM7XG4gICAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJzdWJtYXJpbmVcIjpcbiAgICAgICAgc2hpcExlbmd0aCA9IDI7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjb25zdCBoaXRQb3NpdGlvbnMgPSBbXTtcbiAgICBjb25zdCBoaXQ9ZnVuY3Rpb24gKGhpdENvb3JkaW5hdGUpIHtcbiAgICAgICAgaGl0UG9zaXRpb25zLnB1c2goaGl0Q29vcmRpbmF0ZSk7XG4gICAgfTtcbiAgICBjb25zdCBpc1N1bms9ZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoaGl0UG9zaXRpb25zLmxlbmd0aCA9PT0gc2hpcExlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG4gICAgcmV0dXJuIHsgY29vcmRpbmF0ZSwgc2hpcExlbmd0aCwgaGl0UG9zaXRpb25zLCBoaXQsIGlzU3VuayB9O1xufTtcblxuY29uc3QgZ2FtZUJvYXJkPWZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBzaGlwTGlzdCA9IFtdO1xuICAgIGNvbnN0IHBsYWNlU2hpcD1mdW5jdGlvbiAoc2hpcG5hbWUsIGNvb3JkaW5hdGUpIHtcbiAgICAgICAgc2hpcExpc3QucHVzaChzaGlwKHNoaXBuYW1lLCBjb29yZGluYXRlKSk7XG4gICAgfTtcbiAgICBjb25zdCBtaXNzZWRIaXRzID0gW107XG4gICAgY29uc3QgcmVjZWl2ZUF0dGFjaz1mdW5jdGlvbiAoaGl0Q29vcmRpbmF0ZSkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBMaXN0Lmxlbmd0aDsgaSs9MSkge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIGhpdENvb3JkaW5hdGUgPj0gc2hpcExpc3RbaV0uY29vcmRpbmF0ZSAmJlxuICAgICAgICBoaXRDb29yZGluYXRlIDwgc2hpcExpc3RbaV0uY29vcmRpbmF0ZSArIHNoaXBMaXN0W2ldLnNoaXBMZW5ndGhcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHNoaXBMaXN0W2ldLmhpdChoaXRDb29yZGluYXRlKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaSA9PT0gc2hpcExpc3QubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgIC8vIG1lYW5zLHdlIGFyZSBhdCB0aGUgZW5kIG9mIHRoZSBsb29wIGJ1dCB3ZSBkaWQgbm90IGZpbmQgYSBoaXRcbiAgICAgICAgICAgICAgICBtaXNzZWRIaXRzLnB1c2goaGl0Q29vcmRpbmF0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIGNvbnN0IGFyZUFsbFNoaXBTdW5rPWZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHNoaXBMaXN0LmV2ZXJ5KChzaGlwKSA9PiBzaGlwLmlzU3VuaygpKTtcbiAgICB9O1xuICAgIHJldHVybiB7IHNoaXBMaXN0LCBwbGFjZVNoaXAsIHJlY2VpdmVBdHRhY2ssIG1pc3NlZEhpdHMsIGFyZUFsbFNoaXBTdW5rIH07XG59O1xuXG5jb25zdCBodW1hblBsYXllcj1mdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgZ2FtZWJvYXJkID0gZ2FtZUJvYXJkKCk7XG4gICAgY29uc3QgYXR0YWNrPWZ1bmN0aW9uIChlbmVteUdhbWVCb2FyZCwgYXR0YWNrQ29vcmRpbmF0ZSkge1xuICAgICAgICBlbmVteUdhbWVCb2FyZC5yZWNlaXZlQXR0YWNrKGF0dGFja0Nvb3JkaW5hdGUpO1xuICAgIH07XG4gICAgcmV0dXJuIHsgZ2FtZWJvYXJkLCBhdHRhY2sgfTtcbn07XG5cbmNvbnN0IHJldHVybkxhc3RTdWNjZXNzZnVsSGl0UG9zaXRpb25PZkVuZW15R2FtZWJvYXJkPWZ1bmN0aW9uIChcbiAgICBwcmV2aW91c0VuZW15R2FtZUJvYXJkSGl0UG9zaXRpb25zLFxuICAgIGVuZW15R2FtZUJvYXJkLFxuKSB7XG4gICAgbGV0IHVwZGF0ZWRFbmVteUdhbWVib2FyZEhpdFBvc2l0aW9ucyA9IFtdO1xuICAgIGVuZW15R2FtZUJvYXJkLnNoaXBMaXN0LmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgICAgdXBkYXRlZEVuZW15R2FtZWJvYXJkSGl0UG9zaXRpb25zID1cbiAgICAgIHVwZGF0ZWRFbmVteUdhbWVib2FyZEhpdFBvc2l0aW9ucy5jb25jYXQoc2hpcC5oaXRQb3NpdGlvbnMpO1xuICAgIH0pO1xuICAgIGNvbnN0IGxhc3RIaXRQb3NpdGlvblN0ciA9IHVwZGF0ZWRFbmVteUdhbWVib2FyZEhpdFBvc2l0aW9uc1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxlblxuICAgICAgICAuZmlsdGVyKChwb3NpdGlvbikgPT4gIXByZXZpb3VzRW5lbXlHYW1lQm9hcmRIaXRQb3NpdGlvbnMuaW5jbHVkZXMocG9zaXRpb24pKVxuICAgICAgICAudG9TdHJpbmcoKTtcbiAgICBpZiAoXG4gICAgICAgIHVwZGF0ZWRFbmVteUdhbWVib2FyZEhpdFBvc2l0aW9ucy5sZW5ndGggPlxuICAgIHByZXZpb3VzRW5lbXlHYW1lQm9hcmRIaXRQb3NpdGlvbnMubGVuZ3RoXG4gICAgKSB7XG4gICAgLy8gbWVhbnMgbGFzdCBhdHRhY2sgd2FzIHN1Y2Nlc3NmdWxcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJhZGl4XG4gICAgICAgIGNvbnN0IGxhc3RIaXRQb3NpdGlvbiA9IHBhcnNlSW50KGxhc3RIaXRQb3NpdGlvblN0cik7XG4gICAgICAgIHByZXZpb3VzRW5lbXlHYW1lQm9hcmRIaXRQb3NpdGlvbnMucHVzaChsYXN0SGl0UG9zaXRpb24pO1xuICAgICAgICByZXR1cm4gbGFzdEhpdFBvc2l0aW9uO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7IC8vIG1lYW5zIGxhc3QgYXR0YWNrIHdhcyBub3Qgc3VjY2Vzc2Z1bFxuXG59O1xuXG5jb25zdCBjYWxjdWxhdGVTaG90Q29vcmRpbmF0ZT1mdW5jdGlvbiAoXG4gICAgcHJldmlvdXNFbmVteUdhbWVCb2FyZEhpdFBvc2l0aW9ucyxcbiAgICBlbmVteUdhbWVCb2FyZCxcbiAgICBjb29yZGluYXRlc0ZvckF0dGFjayxcbikge1xuICAgIGNvbnN0IGxhc3RIaXRQb3NpdGlvbk9mRW5lbXlHYW1lYm9hcmQgPVxuICAgIHJldHVybkxhc3RTdWNjZXNzZnVsSGl0UG9zaXRpb25PZkVuZW15R2FtZWJvYXJkKFxuICAgICAgICBwcmV2aW91c0VuZW15R2FtZUJvYXJkSGl0UG9zaXRpb25zLFxuICAgICAgICBlbmVteUdhbWVCb2FyZCxcbiAgICApO1xuICAgIGNvbnN0IGNvb3JkaW5hdGVzRm9yQXR0YWNrSW5jbHVkZU5leHRIaXQgPSBjb29yZGluYXRlc0ZvckF0dGFjay5pbmNsdWRlcyhcbiAgICAgICAgbGFzdEhpdFBvc2l0aW9uT2ZFbmVteUdhbWVib2FyZCArIDEsXG4gICAgKTtcbiAgICBsZXQgc2hvdENvb3JkaW5hdGU7XG5cbiAgICBpZiAobGFzdEhpdFBvc2l0aW9uT2ZFbmVteUdhbWVib2FyZCAmJiBjb29yZGluYXRlc0ZvckF0dGFja0luY2x1ZGVOZXh0SGl0KSB7XG4gICAgLy8gbWVhbnMgbGFzdCBhdHRhY2sgd2FzIGEgaGl0XG4gICAgICAgIHNob3RDb29yZGluYXRlID0gbGFzdEhpdFBvc2l0aW9uT2ZFbmVteUdhbWVib2FyZCArIDE7XG4gICAgICAgIGNvb3JkaW5hdGVzRm9yQXR0YWNrLnNwbGljZShcbiAgICAgICAgICAgIGNvb3JkaW5hdGVzRm9yQXR0YWNrLmluZGV4T2Yoc2hvdENvb3JkaW5hdGUpLFxuICAgICAgICAgICAgMSxcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIHNob3RDb29yZGluYXRlO1xuICAgIH1cbiAgICBzaG90Q29vcmRpbmF0ZSA9XG4gICAgICBjb29yZGluYXRlc0ZvckF0dGFja1tcbiAgICAgICAgICBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjb29yZGluYXRlc0ZvckF0dGFjay5sZW5ndGgpXG4gICAgICBdO1xuICAgIGNvb3JkaW5hdGVzRm9yQXR0YWNrLnNwbGljZShcbiAgICAgICAgY29vcmRpbmF0ZXNGb3JBdHRhY2suaW5kZXhPZihzaG90Q29vcmRpbmF0ZSksXG4gICAgICAgIDEsXG4gICAgKTtcbiAgICByZXR1cm4gc2hvdENvb3JkaW5hdGU7XG5cbn07XG5cbmNvbnN0IGFpPWZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBnYW1lYm9hcmQgPSBnYW1lQm9hcmQoKTtcbiAgICBjb25zdCBnYW1lQm9hcmRTaXplID0gMTAwO1xuICAgIGNvbnN0IGNvb3JkaW5hdGVzRm9yQXR0YWNrID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBnYW1lQm9hcmRTaXplOyBpKz0xKSB7XG4gICAgICAgIGNvb3JkaW5hdGVzRm9yQXR0YWNrLnB1c2goaSk7XG4gICAgfVxuICAgIGNvbnN0IHByZXZpb3VzRW5lbXlHYW1lQm9hcmRIaXRQb3NpdGlvbnMgPSBbXTtcblxuICAgIGNvbnN0IGF0dGFjaz1mdW5jdGlvbiAoZW5lbXlHYW1lQm9hcmQpIHtcbiAgICAgICAgY29uc3Qgc2hvdENvb3JkaW5hdGUgPSBjYWxjdWxhdGVTaG90Q29vcmRpbmF0ZShcbiAgICAgICAgICAgIHByZXZpb3VzRW5lbXlHYW1lQm9hcmRIaXRQb3NpdGlvbnMsXG4gICAgICAgICAgICBlbmVteUdhbWVCb2FyZCxcbiAgICAgICAgICAgIGNvb3JkaW5hdGVzRm9yQXR0YWNrLFxuICAgICAgICApO1xuICAgICAgICBlbmVteUdhbWVCb2FyZC5yZWNlaXZlQXR0YWNrKHNob3RDb29yZGluYXRlKTtcbiAgICB9O1xuICAgIHJldHVybiB7IGdhbWVib2FyZCwgYXR0YWNrIH07XG59O1xuXG5jb25zdCBodW1hbiA9IGh1bWFuUGxheWVyKCk7XG5jb25zdCBjb21wdXRlciA9IGFpKCk7XG5cbmNvbnN0IGdldEhpdFNjb3JlT2ZCb3RoUGxheWVyPWZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBodW1hbkhpdFBvc2l0aW9uc0FyciA9IFtdO1xuICAgIGNvbXB1dGVyLmdhbWVib2FyZC5zaGlwTGlzdC5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgICAgIHNoaXAuaGl0UG9zaXRpb25zLmZvckVhY2goKHBvc2l0aW9uKSA9PiB7XG4gICAgICAgICAgICBodW1hbkhpdFBvc2l0aW9uc0Fyci5wdXNoKHBvc2l0aW9uKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgY29uc3QgaHVtYW5NaXNzZWRIaXRDb3VudCA9IGNvbXB1dGVyLmdhbWVib2FyZC5taXNzZWRIaXRzLmxlbmd0aDtcblxuICAgIGNvbnN0IGNvbXB1dGVySGl0UG9zaXRpb25zQXJyID0gW107XG4gICAgaHVtYW4uZ2FtZWJvYXJkLnNoaXBMaXN0LmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgICAgc2hpcC5oaXRQb3NpdGlvbnMuZm9yRWFjaCgocG9zaXRpb24pID0+IHtcbiAgICAgICAgICAgIGNvbXB1dGVySGl0UG9zaXRpb25zQXJyLnB1c2gocG9zaXRpb24pO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICBjb25zdCBjb21wdXRlck1pc3NlZEhpdENvdW50ID0gaHVtYW4uZ2FtZWJvYXJkLm1pc3NlZEhpdHMubGVuZ3RoO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgaHVtYW5IaXRDb3VudDogaHVtYW5IaXRQb3NpdGlvbnNBcnIubGVuZ3RoLFxuICAgICAgICBodW1hbk1pc3NlZEhpdENvdW50LFxuICAgICAgICBjb21wdXRlckhpdENvdW50OiBjb21wdXRlckhpdFBvc2l0aW9uc0Fyci5sZW5ndGgsXG4gICAgICAgIGNvbXB1dGVyTWlzc2VkSGl0Q291bnQsXG4gICAgfTtcbn07XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxlblxuZXhwb3J0IHsgc2hpcCwgZ2FtZUJvYXJkLCBodW1hbiwgY29tcHV0ZXIsIGh1bWFuUGxheWVyLCBhaSwgZ2V0SGl0U2NvcmVPZkJvdGhQbGF5ZXIgfTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLyogZXNsaW50LWRpc2FibGUgcmFkaXggKi9cbi8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi9cbmltcG9ydCB7IGh1bWFuLCBjb21wdXRlciwgZ2V0SGl0U2NvcmVPZkJvdGhQbGF5ZXIgfSBmcm9tIFwiLi9nYW1lTG9naWNcIjtcbmltcG9ydCB7IGFkZERyYWdEcm9wRmVhdHVyZSB9IGZyb20gXCIuL2RyYWdEcm9wTG9naWNcIjtcblxuY29uc3QgaG93VG9Nb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbW9kYWxcIik7XG5jb25zdCBob3dUb01vZGFsQ2xvc2VCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2Nsb3NlX2hvd190b19tb2RhbFwiKTtcbmNvbnN0IGhvd1RvQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5ob3dfdG9cIik7XG5cbmhvd1RvQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgaG93VG9Nb2RhbC5zaG93TW9kYWwoKTtcbn0pO1xuXG5ob3dUb01vZGFsQ2xvc2VCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICBob3dUb01vZGFsLmNsb3NlKCk7XG59KTtcblxuY29uc3QgZnJpZW5kbHlBcmVhR2FtZWJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICBcIiNmcmllbmRseS1hcmVhLWdhbWVib2FyZFwiLFxuKTtcbmNvbnN0IGVuZW15QXJlYUdhbWVib2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZW5lbXktYXJlYS1nYW1lYm9hcmRcIik7XG5cbmNvbnN0IGNyZWF0ZUdhbWVCb2FyZERvbSA9IGZ1bmN0aW9uIChnYW1lQm9hcmRDb250YWluZXJOYW1lKSB7XG4gICAgY29uc3QgZ3JpZFNpemUgPSAxMDtcbiAgICBjb25zdCBncmlkU3F1YXJlID0gMTAwO1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICAgIGdhbWVCb2FyZENvbnRhaW5lck5hbWUuc3R5bGUuZ3JpZFRlbXBsYXRlUm93cyA9IGByZXBlYXQoJHsgZ3JpZFNpemUgfSwxZnIpYDtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICBnYW1lQm9hcmRDb250YWluZXJOYW1lLnN0eWxlLmdyaWRUZW1wbGF0ZUNvbHVtbnMgPSBgcmVwZWF0KCR7IGdyaWRTaXplIH0sMWZyKWA7XG4gICAgY29uc3Qgc3F1YXJlRGl2ID0gW107XG4gICAgbGV0IGxvb3BDb3VudCA9IDE7XG4gICAgbGV0IHlBeGlzID0gMTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdyaWRTcXVhcmU7IGkgKz0gMSkge1xuICAgICAgICBzcXVhcmVEaXZbaV0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBzcXVhcmVEaXZbaV0uc2V0QXR0cmlidXRlKFwiZGF0YS1pbmRleFwiLCBgJHsgW2ksIHlBeGlzXSB9YCk7XG4gICAgICAgIGlmIChsb29wQ291bnQgPT09IDEwKSB7XG4gICAgICAgICAgICB5QXhpcyArPSAxO1xuICAgICAgICAgICAgbG9vcENvdW50ID0gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxvb3BDb3VudCArPSAxO1xuICAgICAgICB9XG4gICAgICAgIHNxdWFyZURpdltpXS5jbGFzc0xpc3QuYWRkKFwic3F1YXJlX2RpdlwiKTtcbiAgICAgICAgZ2FtZUJvYXJkQ29udGFpbmVyTmFtZS5hcHBlbmRDaGlsZChzcXVhcmVEaXZbaV0pO1xuICAgIH1cbn07XG5cbmNyZWF0ZUdhbWVCb2FyZERvbShmcmllbmRseUFyZWFHYW1lYm9hcmQpO1xuY3JlYXRlR2FtZUJvYXJkRG9tKGVuZW15QXJlYUdhbWVib2FyZCk7XG5cbmFkZERyYWdEcm9wRmVhdHVyZShodW1hbik7XG4vLyBodW1hbiBnb2VzIGludG8gdGhpcyBmdW5jdGlvbiBhbmQgZ2V0IGNoYW5nZWRcbi8vIGJ1dCBzaW5jZSBodW1hbiBpcyBhbiBvYmplY3Qgd2Ugd2lsbCBnZXQgYW4gdXBkYXRlZCBodW1hbiBvYmplY3QgaW4gdGhpcyBtb2R1bGVcblxuY29uc3QgYXV0b1BsYWNlQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNhdXRvX3BsYWNlXCIpO1xuY29uc3Qgc2hpcENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYWxsX3NoaXBfY29udGFpbmVyXCIpO1xuY29uc3QgZ2FtZVN0YXJ0QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNzdGFydFwiKTtcblxuY29uc3QgbWFya1NoaXBzSW5UaGVEb20gPSBmdW5jdGlvbiAoKSB7XG4gICAgaHVtYW4uZ2FtZWJvYXJkLnNoaXBMaXN0LmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLnNoaXBMZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgZnJpZW5kbHlBcmVhR2FtZWJvYXJkLmNoaWxkcmVuW3NoaXAuY29vcmRpbmF0ZSArIGldLnN0eWxlLmJhY2tncm91bmQgPVxuICAgICAgICBcIiM0NDQ0NDRcIjtcbiAgICAgICAgfVxuICAgIH0pO1xufTtcblxuY29uc3QgYXV0b1BsYWNlU2hpcHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgaHVtYW4uZ2FtZWJvYXJkLnBsYWNlU2hpcChcImNhcnJpZXJcIiwgMTQpO1xuICAgIGh1bWFuLmdhbWVib2FyZC5wbGFjZVNoaXAoXCJiYXR0bGVzaGlwXCIsIDM0KTtcbiAgICBodW1hbi5nYW1lYm9hcmQucGxhY2VTaGlwKFwiZGVzdHJveWVyXCIsIDk0KTtcbiAgICBodW1hbi5nYW1lYm9hcmQucGxhY2VTaGlwKFwic3VibWFyaW5lXCIsIDc0KTtcbiAgICBtYXJrU2hpcHNJblRoZURvbSgpO1xuICAgIHNoaXBDb250YWluZXIuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIGdhbWVTdGFydEJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xufTtcbmF1dG9QbGFjZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXV0b1BsYWNlU2hpcHMpO1xuXG5jb25zdCBtYXJrSGl0VW5oaXQgPSBmdW5jdGlvbiAoZW5lbXksIGVuZW15R2FtZWJvYXJkRG9tKSB7XG4gICAgZW5lbXkuZ2FtZWJvYXJkLnNoaXBMaXN0LmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgICAgc2hpcC5oaXRQb3NpdGlvbnMuZm9yRWFjaCgocG9zaXRpb24pID0+IHtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICAgICAgICAgICAgZW5lbXlHYW1lYm9hcmREb20uY2hpbGRyZW5bcG9zaXRpb25dLnN0eWxlLmJhY2tncm91bmQgPSBcIiNGOTM5NDNcIjtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgZW5lbXkuZ2FtZWJvYXJkLm1pc3NlZEhpdHMuZm9yRWFjaCgobWlzc2VkSGl0UG9zaXRpb24pID0+IHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICAgICAgZW5lbXlHYW1lYm9hcmREb20uY2hpbGRyZW5bbWlzc2VkSGl0UG9zaXRpb25dLnN0eWxlLmJhY2tncm91bmQgPSBcIiMwNUIyRENcIjtcbiAgICB9KTtcbn07XG5cbmNvbnN0IGl0SXNBaVR1cm4gPSBmdW5jdGlvbiAoKSB7XG4gICAgY29tcHV0ZXIuYXR0YWNrKGh1bWFuLmdhbWVib2FyZCk7XG4gICAgbWFya0hpdFVuaGl0KGh1bWFuLCBmcmllbmRseUFyZWFHYW1lYm9hcmQpO1xufTtcblxuY29uc3QgY2hlY2tXaW5uZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgYWxsQ29tcHV0ZXJTaGlwU3VuayA9IGNvbXB1dGVyLmdhbWVib2FyZC5hcmVBbGxTaGlwU3VuaygpO1xuICAgIGNvbnN0IGFsbEh1bWFuU2hpcFN1bmsgPSBodW1hbi5nYW1lYm9hcmQuYXJlQWxsU2hpcFN1bmsoKTtcbiAgICBpZiAoYWxsQ29tcHV0ZXJTaGlwU3Vuaykge1xuICAgICAgICByZXR1cm4gXCJ5b3VcIjtcbiAgICB9IGVsc2UgaWYgKGFsbEh1bWFuU2hpcFN1bmspIHtcbiAgICAgICAgcmV0dXJuIFwiYWlcIjtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufTtcblxuY29uc3QgcmVtb3ZlQWxsRXZlbnRMaXN0ZW5lckluQ29tcHV0ZXJHYW1lYm9hcmQgPSBmdW5jdGlvbiAoKSB7XG4gICAgZW5lbXlBcmVhR2FtZWJvYXJkLmNoaWxkTm9kZXMuZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgICAgY2hpbGQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhhbmRsZUNsaWNrRXZlbnRzKTtcbiAgICB9KTtcbn07XG5cbmNvbnN0IHNob3dTY29yZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBzY29yZSA9IGdldEhpdFNjb3JlT2ZCb3RoUGxheWVyKCk7XG4gICAgY29uc3QgaHVtYW5TY29yZUNhcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2h1bWFuX3Njb3JlX2NhcmRcIik7XG4gICAgY29uc3QgaHVtYW5NaXNzZWRIaXRDb3VudCA9IGh1bWFuU2NvcmVDYXJkLmNoaWxkcmVuWzBdO1xuICAgIGNvbnN0IGh1bWFuSGl0Q291bnQgPSBodW1hblNjb3JlQ2FyZC5jaGlsZHJlblsxXTtcbiAgICBodW1hbk1pc3NlZEhpdENvdW50LnRleHRDb250ZW50ID0gYE1pc3NlZCBIaXRzOiAkeyBzY29yZS5odW1hbk1pc3NlZEhpdENvdW50IH1gO1xuICAgIGh1bWFuSGl0Q291bnQudGV4dENvbnRlbnQgPSBgSGl0czogJHsgc2NvcmUuaHVtYW5IaXRDb3VudCB9YDtcblxuICAgIGNvbnN0IGNvbXB1dGVyU2NvcmVDYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNhaV9zY29yZV9jYXJkXCIpO1xuICAgIGNvbnN0IGNvbXB1dGVyTWlzc2VkSGl0Q291bnQgPSBjb21wdXRlclNjb3JlQ2FyZC5jaGlsZHJlblswXTtcbiAgICBjb25zdCBjb21wdXRlckhpdENvdW50ID0gY29tcHV0ZXJTY29yZUNhcmQuY2hpbGRyZW5bMV07XG4gICAgY29tcHV0ZXJNaXNzZWRIaXRDb3VudC50ZXh0Q29udGVudCA9IGBNaXNzZWQgSGl0czogJHsgc2NvcmUuY29tcHV0ZXJNaXNzZWRIaXRDb3VudCB9YDtcbiAgICBjb21wdXRlckhpdENvdW50LnRleHRDb250ZW50ID0gYEhpdHM6ICR7IHNjb3JlLmNvbXB1dGVySGl0Q291bnQgfWA7XG59O1xuXG5jb25zdCBoYW5kbGVDbGlja0V2ZW50cyA9IGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCB0YXJnZXRJbmRleCA9IHBhcnNlSW50KHRoaXMuZGF0YXNldC5pbmRleC5zcGxpdChcIixcIilbMF0pO1xuICAgIGNvbXB1dGVyLmdhbWVib2FyZC5yZWNlaXZlQXR0YWNrKHRhcmdldEluZGV4KTtcbiAgICBtYXJrSGl0VW5oaXQoY29tcHV0ZXIsIGVuZW15QXJlYUdhbWVib2FyZCk7XG4gICAgaXRJc0FpVHVybigpO1xuICAgIHNob3dTY29yZSgpO1xuICAgIGNvbnN0IHdpbm5lciA9IGNoZWNrV2lubmVyKCk7XG4gICAgaWYgKHdpbm5lcikge1xuICAgICAgICBhbGVydChgJHsgd2lubmVyIH0gd29uIHRoZSBnYW1lYCk7XG4gICAgICAgIHJlbW92ZUFsbEV2ZW50TGlzdGVuZXJJbkNvbXB1dGVyR2FtZWJvYXJkKCk7XG4gICAgfVxufTtcblxuY29uc3QgYWRkRXZlbnRMaXN0ZW5lclRvQWlHYW1lQm9hcmQgPSBmdW5jdGlvbiAoKSB7XG4gICAgZW5lbXlBcmVhR2FtZWJvYXJkLmNoaWxkTm9kZXMuZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgICAgY2hpbGQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhhbmRsZUNsaWNrRXZlbnRzLCB7IG9uY2U6IHRydWUgfSk7XG4gICAgfSk7XG59O1xuXG5jb25zdCBhaURvbUNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYWlfY29udGFpbmVyXCIpO1xuY29uc3Qgc2NvcmVDYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNzY29yZV9jYXJkX2NvbnRhaW5lclwiKTtcbmNvbnN0IHBsYXlHYW1lID0gZnVuY3Rpb24gKGdhbWVTdGFydEJ1dHRvbikge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICAgIGdhbWVTdGFydEJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgYWlEb21Db250YWluZXIuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICBzY29yZUNhcmQuc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xuICAgIGNvbXB1dGVyLmdhbWVib2FyZC5wbGFjZVNoaXAoXCJjYXJyaWVyXCIsIDQpO1xuICAgIGNvbXB1dGVyLmdhbWVib2FyZC5wbGFjZVNoaXAoXCJiYXR0bGVzaGlwXCIsIDM0KTtcbiAgICBjb21wdXRlci5nYW1lYm9hcmQucGxhY2VTaGlwKFwiZGVzdHJveWVyXCIsIDc0KTtcbiAgICBjb21wdXRlci5nYW1lYm9hcmQucGxhY2VTaGlwKFwic3VibWFyaW5lXCIsIDk0KTtcbiAgICBhZGRFdmVudExpc3RlbmVyVG9BaUdhbWVCb2FyZCgpO1xufTtcblxuY29uc3Qgc3RhcnRHYW1lQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNzdGFydFwiKTtcbnN0YXJ0R2FtZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgICBwbGF5R2FtZShlLnRhcmdldCk7XG59KTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==