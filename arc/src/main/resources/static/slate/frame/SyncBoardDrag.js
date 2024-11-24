import SyncBoard from "./SyncBoard.js";

export default class SyncBoardDrag{
    constructor(syncBoard){
        this._syncBoard = syncBoard;
        this.inIt();
    }

    inIt(){
        const canvas = this._syncBoard.canvas;
        canvas.addEventListener("dragenter", (event)=>{
            event.preventDefault();

        })

        canvas.addEventListener("dragover", (event) => {
            event.preventDefault();
        });

        canvas.addEventListener("dragleave", (event) => {
            event.preventDefault();
        });

        canvas.addEventListener("drop", (event) => {
            event.preventDefault();
            const file = event.dataTransfer.files[0];   
            if(file.size > 0){

                this._syncBoard.insertDragResource(file, event);
            }
        });
    }
    
    
}