import {humanPlayer} from'./gameLogic';
function addDragDropFeature(){
    const allDraggableDivs=document.querySelectorAll('.draggable');
    allDraggableDivs.forEach(div=>{
        for(let i=0;i<div.children.length;i++){
            div.children[i].addEventListener('mousedown',(e)=>{
                div.dataset.index=e.target.dataset.index; //this will give the position of draggable div on which mouse is on.
            })
        }
    })
    
    function dragstart(e){
        const shipBeingDragged=e.target;
        const positionOfMouseOnTheShip=shipBeingDragged.dataset.index;
        const lengthOfTheShip=shipBeingDragged.dataset.shiplength;
        const shipName=shipBeingDragged.id;
        const transferData=[positionOfMouseOnTheShip,lengthOfTheShip,shipName];
        e.dataTransfer.setData('ship-data', JSON.stringify(transferData));
    }
    
    function dragEnter(e){
        e.preventDefault();
    }
    
    function dragOver(e){
        e.preventDefault();
    }
    
    function dragLeave(e){
        
    }
    
    function isAShipAlreadyPlaced(
        cells_With_Same_Y_Axis_As_DropTarget,shipData,xAxisOfDroppedShipFirstPosition){
        let cellsWithShipPlaced=cells_With_Same_Y_Axis_As_DropTarget.filter(cell=>{
            return cell.classList.contains('dropped');
        });
        let shipsPositionsInXAxis=cellsWithShipPlaced.map(cell=>{
            return parseInt(cell.dataset.index.split(',')[0]);
        });
        let potentialShipPositionsForCurrentShip=[];
        const shipLength=shipData[1];
        for(let i=0;i<shipLength;i++){
            let droppedShipPosition=xAxisOfDroppedShipFirstPosition;
            droppedShipPosition+=i;
            potentialShipPositionsForCurrentShip.push(droppedShipPosition);
        }
        let totalOverlappedShipPositions = potentialShipPositionsForCurrentShip.some(potentialShipPosition=>{
            return shipsPositionsInXAxis.includes(potentialShipPosition);
        });
        if(totalOverlappedShipPositions){
            return true;
        }else{
            return false;
        }
    }

    function checkIfDropValid(event,shipData){
        const dropTargetCoordinates=event.target.dataset.index.split(',');
        const humanGameboardCellsArray=[...humanGameboardCells];
        let cells_With_Same_Y_Axis_As_DropTarget=humanGameboardCellsArray.filter(cell=>{
            const yAxisOfCell=cell.dataset.index.split(',')[1];
            const yAxisOfDropTarget=dropTargetCoordinates[1];
            return yAxisOfCell===yAxisOfDropTarget;
        })
        const xAxisOfFirstCell=cells_With_Same_Y_Axis_As_DropTarget[0].dataset.index.split(',')[0];
        const xAxisOfLastCell=cells_With_Same_Y_Axis_As_DropTarget[cells_With_Same_Y_Axis_As_DropTarget.length-1].dataset.index.split(',')[0];
        const positionOfMouseOnTheShip=shipData[0];
        const xAxisOfDroppedShipFirstPosition=dropTargetCoordinates[0]-positionOfMouseOnTheShip;
        const shiplength=Number(shipData[1]);
        if(isAShipAlreadyPlaced(cells_With_Same_Y_Axis_As_DropTarget,shipData,xAxisOfDroppedShipFirstPosition)){
            return false; //means there is already a ship placed in the same axis
        }else if(xAxisOfFirstCell<=xAxisOfDroppedShipFirstPosition 
            && (xAxisOfLastCell>=xAxisOfDroppedShipFirstPosition+(shiplength-1))){
                // shilplength-1 because 95+5=100 but if you consider 95 and add 5 to it then it would be 99
                // you have to consider this nuance when working with gameboard cells
                return true; //means the ship can be placed
            }else{
                return false;
        }
    }
        
    const human=humanPlayer();
    const totalShips=4;
    let dropCount=0;

    function drop(e){
        e.stopPropagation(); // stops the browser from redirecting.
        
        const xAxisOfDropTarget=Number(e.target.dataset.index.split(',')[0]);
        const shipDataJson=e.dataTransfer.getData('ship-data');
        const shipData=JSON.parse(shipDataJson);
        
        if(!checkIfDropValid(e,shipData)){
            return false; //this will stop the function and thus the drop will not be handled
        };
        
        const shiplength=shipData[1];
        const positionOfMouseOnTheShip=shipData[0];
        let xAxisOfShipStartPosition=xAxisOfDropTarget-positionOfMouseOnTheShip;
        const shipName=shipData[2];
        human.gameboard.placeShip(`${shipName}`,xAxisOfShipStartPosition);
        for(let i=0;i<shiplength;i++){
            humanGameboardCells[xAxisOfShipStartPosition+i].style.background='#444444';
            humanGameboardCells[xAxisOfShipStartPosition+i].classList.add('dropped');
        }

        const draggable=document.querySelector(`#${shipName}`);
        draggable.style.display='none';
        dropCount+=1;
        if(dropCount===totalShips){
            localStorage.setItem('humanPlayerData',JSON.stringify(human));
            const startGameButton=document.querySelector('#start');
            startGameButton.style.display='block';
        }
    }
    
    const humanGameboardCells=document.querySelectorAll('#friendly-area-gameboard .square_div');
    humanGameboardCells.forEach(cell => {
        cell.addEventListener('dragenter', dragEnter)
        cell.addEventListener('dragover', dragOver);
        cell.addEventListener('dragleave', dragLeave);
        cell.addEventListener('drop', drop);
    });

    const draggableShips=document.querySelectorAll('.draggable');
    draggableShips.forEach(ship=>{
        ship.addEventListener('dragstart',dragstart);
    })
}

export {addDragDropFeature}