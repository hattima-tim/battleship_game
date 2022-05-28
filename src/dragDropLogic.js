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
    
    function drop(e){
        e.stopPropagation(); // stops the browser from redirecting.
        const xAxisOfDropTarget=Number(e.target.dataset.index.split(',')[0]);
        const shipDataJson=e.dataTransfer.getData('ship-data');
        const shipData=JSON.parse(shipDataJson);
        const shiplength=shipData[1];
        const positionOfMouseOnTheShip=shipData[0];
        for(let i=0;i<shiplength;i++){
            let xAxisOfShipStartPosition=xAxisOfDropTarget-positionOfMouseOnTheShip;
            humanGameboardCells[xAxisOfShipStartPosition+i].style.background='#444444';
        }
        const shipName=shipData[2];
        const draggable=document.querySelector(`#${shipName}`);
        draggable.style.display='none';
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