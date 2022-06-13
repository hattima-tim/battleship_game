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

export { addDragDropFeature };
