import { human, computer, getHitScoreOfBothPlayer } from "./gameLogic";
import { addDragDropFeature } from "./dragDropLogic";

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
      enemyGameboardDom.children[position].style.background = "#F93943";
    });
  });
  enemy.gameboard.missedHits.forEach((missedHitPosition) => {
    enemyGameboardDom.children[missedHitPosition].style.background = "#05B2DC";
  });
}

function itIsAiTurn() {
  computer.attack(human.gameboard);
  markHitUnhit(human, friendlyAreaGameboard);
}

function checkWinner() {
  const allComputerShipSunk = computer.gameboard.areAllShipSunk();
  const allHumanShipSunk = human.gameboard.areAllShipSunk();
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
  let score = getHitScoreOfBothPlayer();
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
  computer.gameboard.receiveAttack(targetIndex);
  markHitUnhit(computer, enemyAreaGameboard);
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
  computer.gameboard.placeShip("carrier", 4);
  computer.gameboard.placeShip("battleship", 14);
  computer.gameboard.placeShip("destroyer", 34);
  computer.gameboard.placeShip("submarine", 54);
  addEventListenerToAiGameBoard();
}

const startGameButton = document.querySelector("#start");
startGameButton.addEventListener("click", (e) => {
  playGame(e.target);
});
