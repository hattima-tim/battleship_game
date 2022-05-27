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
        const lengthOfTheShip=e.target.dataset.shiplength;
        const transferData=[positionOfMouseOnTheShip,lengthOfTheShip];
        e.dataTransfer.setData('ship-data', JSON.stringify(transferData));
    }

    function dragEnter(e){

    }

    function dragOver(e){

    }

    function dragLeave(e){

    }
    
    function drop(e){

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