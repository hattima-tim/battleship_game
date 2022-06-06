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
  ) { //means last attack was successful
    const lastHitPosition=parseInt(lastHitPositionStr)
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

export { ship, gameBoard, humanPlayer, ai };
