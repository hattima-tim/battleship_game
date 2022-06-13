/* eslint-disable radix */
/* eslint-disable max-len */
import { human, computer, getHitScoreOfBothPlayer } from "./gameLogic";
import { addDragDropFeature } from "./dragDropLogic";

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

addDragDropFeature(human);
// human goes into this function and get changed
// but since human is an object we will get an updated human object in this module

const autoPlaceButton = document.querySelector("#auto_place");
const shipContainer = document.querySelector("#all_ship_container");
const gameStartButton = document.querySelector("#start");

const markShipsInTheDom = function () {
    human.gameboard.shipList.forEach((ship) => {
        for (let i = 0; i < ship.shipLength; i += 1) {
            friendlyAreaGameboard.children[ship.coordinate + i].style.background =
        "#444444";
        }
    });
};

const autoPlaceShips = function () {
    human.gameboard.placeShip("carrier", 14);
    human.gameboard.placeShip("battleship", 34);
    human.gameboard.placeShip("destroyer", 94);
    human.gameboard.placeShip("submarine", 74);
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
    computer.attack(human.gameboard);
    markHitUnhit(human, friendlyAreaGameboard);
};

const checkWinner = function () {
    const allComputerShipSunk = computer.gameboard.areAllShipSunk();
    const allHumanShipSunk = human.gameboard.areAllShipSunk();
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
    const score = getHitScoreOfBothPlayer();
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
    computer.gameboard.receiveAttack(targetIndex);
    markHitUnhit(computer, enemyAreaGameboard);
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
    computer.gameboard.placeShip("carrier", 4);
    computer.gameboard.placeShip("battleship", 34);
    computer.gameboard.placeShip("destroyer", 74);
    computer.gameboard.placeShip("submarine", 94);
    addEventListenerToAiGameBoard();
};

const startGameButton = document.querySelector("#start");
startGameButton.addEventListener("click", (e) => {
    playGame(e.target);
});
