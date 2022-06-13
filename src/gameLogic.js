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
export { ship, gameBoard, human, computer, humanPlayer, ai, getHitScoreOfBothPlayer };
