import { humanPlayer, ai } from "./gameLogic";
import { addDragDropFeature } from "./dragDropLogic";

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

const human = humanPlayer();
addDragDropFeature(human);
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

function itIsAiTurn(ai, human) {
  ai.attack(human.gameboard);
  markHitUnhit(human, friendlyAreaGameboard);
}

function checkWinner(aiPlayer, human) {
  const allComputerShipSunk = aiPlayer.gameboard.areAllShipSunk();
  const allHumanShipSunk = human.gameboard.areAllShipSunk();
  if (allComputerShipSunk) {
    return "you";
  } else if (allHumanShipSunk) {
    return "ai";
  } else {
    return false;
  }
}

function addEventListenerToAiGameBoard(aiPlayer, human) {
  enemyAreaGameboard.childNodes.forEach((child) => {
    child.addEventListener(
      "click",
      (e) => {
        const targetIndex = parseInt(e.target.dataset.index.split(",")[0]);
        aiPlayer.gameboard.receiveAttack(targetIndex);
        markHitUnhit(aiPlayer, enemyAreaGameboard);
        itIsAiTurn(aiPlayer, human);
      },
      { once: true }
    );
  });
}

function playGame() {
  const computer = ai();
  computer.gameboard.placeShip("carrier", 4);
  computer.gameboard.placeShip("battleship", 14);
  computer.gameboard.placeShip("destroyer", 34);
  computer.gameboard.placeShip("submarine", 54);
  addEventListenerToAiGameBoard(computer, human);
}

const startGameButton = document.querySelector("#start");
startGameButton.addEventListener("click", () => {
  playGame();
});
