
export default class SyncBoardStyler{
    constructor(){
        this._colorPicker;
        this._lineSize = 0.5;

        this._style = {
            color : "black",
            size : 10
        };

        this.inIt();
    }

    inIt(){
        this._colorPicker = document.getElementsByClassName("color-picker")[0];

        this._colorPicker.addEventListener("change", (event)=>{
            this._style.color = event.target.value;
        });

        const pickers = document.getElementsByClassName("color-option");
        for(let it of pickers){
            it.addEventListener("click", (event)=>{
                const color = event.target.getAttribute("data-color");
                this._colorPicker.value = color;
                this.styleUpdate(color, this._style.size);
            });
        }

        const bar = document.getElementsByClassName("line-width")[0];
        bar.addEventListener("change", (event)=>{
            this._lineSize = event.target.value;

            const max = 30;
            const size = this._lineSize * max;
            this.styleUpdate(this.color, size)
        })

        this._style.color = this.getRandomColor();
        this._style.size = 10;
    }

    styleUpdate(color, size){
        this._style.color = color;
        this._style.size = size;
    }

    getRandomColor() {
        var r = Math.floor(Math.random() * 256);
        var g = Math.floor(Math.random() * 256);
        var b = Math.floor(Math.random() * 256);
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }

    get color(){
        return this._colorPicker.value;
    }

    get lineSize(){
        return this._lineSize;
    }

    get stlye() {
        return this._style;
    }

}