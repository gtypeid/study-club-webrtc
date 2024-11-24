import SyncBoardDrag from "./SyncBoardDrag.js";
import SyncBoardStyler from "./SyncBoardStyler.js";

export default class SyncBoard{

    
    constructor(cientSyncer){
        this._clientSyncer = cientSyncer;
        this._canvas;
        this._ctx;
        this._lineCanvas;
        this._lineCtx;
        this._bufferCanvas;
        this._bfCtx;

        this._syncBoardStyler;
        this._syncBoardDrag;

        this._isClick = false;

        this._imgResource = new Map();
        this._playerCursors = new Map();

        this.inIt();
        this.loadPathResource("cursor.png");
    }

    inIt() {
        this._syncBoardStyler = new SyncBoardStyler();

        this._canvas = document.getElementsByClassName("canvas")[0];
        this._ctx = this._canvas.getContext("2d");
        this._canvas.style.width = '100%';
        this._canvas.style.height = 'auto'
        this._syncBoardDrag = new SyncBoardDrag(this);


        this._canvas.width = 1200;
        this._canvas.height = 400;

        this._lineCanvas = document.createElement('canvas');
        this._lineCtx = this._lineCanvas.getContext('2d');
        this._lineCanvas.width = this._canvas.width;
        this._lineCanvas.height = this._canvas.height;

        this._bufferCanvas = document.createElement('canvas');
        this._bfCtx = this._bufferCanvas.getContext('2d');
        this._bufferCanvas.width = this._canvas.width;
        this._bufferCanvas.height = this._canvas.height;

        //offer x, offer y
        document.addEventListener('mousedown', (event) => {
            this._isClick = true;
        });
        document.addEventListener('mouseup', (event) => {
            this._isClick = false;
        });
        this._canvas.addEventListener('mousemove', (event) => {
            if(!this._isClick) return;

            const { offsetX , offsetY } = event;
            const { scaleX, scaleY } = this.getScale();
            
            this.mouseMove( offsetX * scaleX, offsetY * scaleY );

        });
        this._canvas.addEventListener('mouseenter', (event) => {
        });
        this._canvas.addEventListener('mouseleave', (event) => {
        });


        const button = document.getElementsByClassName("eraser-btn")[0];
        button.addEventListener("click", (event)=>{
            this.eraser();
            const data = {
                owner : this._clientSyncer.clientUuid,
                type : "board-system", 
                msg : "eraser"
            }
            this._clientSyncer.sendData("all", data);
        });

    }

    insertDragResource(file, dragEnvet){
        const { offsetX, offsetY } = dragEnvet;
        const { scaleX, scaleY } = this.getScale();
        const x = offsetX * scaleX;
        const y = offsetY * scaleY;

        const name = file.name;
        const hasKey = this._imgResource.has(name);
        if(!hasKey){
            const reader = new FileReader();
            // 파일 읽음
            reader.onload = (event) => {
                const img = new Image();
                // 이미지 읽음
                img.onload = () => {
                    const imgData = { 
                        load : true,
                        img : img,
                        basebuffer : event.target.result,
                        entitys : []
                    };
                    
                    this._imgResource.set(name, imgData);

                    const lineSize = this._syncBoardStyler.lineSize;
                    const sizeX = img.width * lineSize;
                    const sizeY = img.height * lineSize;
                    this.spawnDragImgEntity(name, x, y, sizeX, sizeY);
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
        else if(hasKey){
            const imgData = this._imgResource.get(name)
            const img = imgData.img;
            const lineSize = this._syncBoardStyler.lineSize;
            const sizeX = img.width * lineSize;
            const sizeY = img.height * lineSize;
            this.spawnDragImgEntity(name, x, y, sizeX, sizeY);
        }
    
    
    }

    spawnDragImgEntity(name, offsetX, offsetY, sizeX, sizeY){
        const dragImgEntityData = {
            x : offsetX,
            y : offsetY,
            sizeX : sizeX,
            sizeY : sizeY
        }
        const imgData = this._imgResource.get(name);
        imgData.entitys.push(dragImgEntityData)

        // draw
        this.drawBufferImgs();
        this._ctx.drawImage(this._bufferCanvas, 0, 0);

        this.resource(name, (resource)=>{
            // data 
            const data = {
                owner : this._clientSyncer.clientUuid,
                type : "board-img", 
                msg : `{"basebuffer":"${resource.basebuffer}", 
                "imgstyle":${JSON.stringify(dragImgEntityData)}}`
            }

            this._clientSyncer.sendData("all", data);
        });
    }
    

    loadPathResource(source){
        const hasKey = this._imgResource.has(source);
        if(!hasKey){
            const img = new Image();
            img.src = "./frame/rs/" + source;
            img.onload = (event)=>{
                const imgData = { load : true,
                    img : img
                };
                this._imgResource.set(source, imgData);
            }
            this._imgResource.set(source, { load : false} );
        }
    }

    resource(source, cb){
        const hasKey = this._imgResource.has(source);
        if(hasKey){
            const resource = this._imgResource.get(source);
            if(resource.load){
                cb(resource);
            }
        }
    }

    mouseMove(x, y){
        const style = this._syncBoardStyler.stlye;

        const data = {
            owner : this._clientSyncer.clientUuid,
            type : "board", 
            msg : `{"style":${JSON.stringify(style)},"x":${x},"y":${y}}`
        }
        this._clientSyncer.sendData("all", data);
        this.drawing(data.owner, style, x, y);
    }

    receive(data){
        const { owner, msg, type} = data;

        if(type === "board"){
            const drawData = JSON.parse(msg);
            this.drawing(owner, drawData.style, drawData.x, drawData.y);
        }
        else if(type === "board-img"){
            const imgData = JSON.parse(msg);
            const img = new Image();
            img.src = imgData.basebuffer;
            img.onload = ()=>{
                const {x, y, sizeX, sizeY } = imgData.imgstyle;
                this._bfCtx.drawImage(img, x, y, sizeX, sizeY);
                this._bfCtx.drawImage(this._lineCanvas, 0, 0);
                this._ctx.drawImage(this._bufferCanvas, 0, 0);
            }   
        }
        else if(type === "board-system"){
            if(msg === "eraser"){
                this.eraser();
            }
        }
    }

    drawing(owner, style, x, y) {

        this.drawCursor(owner, x,y);
        this.drawLineCanvas(style, x, y);
        this.drawBufferImgs();
        this._ctx.drawImage(this._bufferCanvas, 0, 0);
    }

    drawLineCanvas(style, x, y){
        const { color, size } = style;
        this._lineCtx.fillStyle = color;
        this._lineCtx.fillRect(x, y, size, size);
    }

    drawBufferImgs(){
        for(let resource of this._imgResource){
            const key = resource[0];
            const value = resource[1];
            if(key !== "cursor.png"){
                this.resource(key, (resource)=>{
                    const {img ,entitys} = resource;
                    for(let data of entitys){
                        const { x, y, sizeX, sizeY } = data;
                        this._bfCtx.drawImage(img, x, y, sizeX, sizeY);
                    }
                });
            }
        }

        this._bfCtx.drawImage(this._lineCanvas, 0, 0);
    } 


    drawCursor(owner, x, y){
        this.resource("cursor.png", (resource)=>{
            this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.width);
            this._playerCursors.set(owner, { x : x , y : y });

            for(let it of this._playerCursors){
                const key = it[0];
                const value = it[1];
                this._ctx.drawImage(resource.img, value.x, value.y, 24, 36);
            }
        });
    }

    eraser(){
        this._lineCtx.clearRect(0, 0, this._canvas.width, this._canvas.width);
        this._bfCtx.clearRect(0, 0, this._canvas.width, this._canvas.width);
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.width);
        this._imgResource.clear();
        this.loadPathResource("cursor.png");
    }

    getScale(){
        const styleWidth = this._canvas.clientWidth;
        const styleHeight = this._canvas.clientHeight;

        const actualWidth = this._canvas.width;
        const actualHeight = this._canvas.height;

        const scaleX = actualWidth / styleWidth;
        const scaleY = actualHeight / styleHeight;
        return {scaleX, scaleY};
    }

    get style() {
        return this._style;
    }

    get canvas(){
        return this._canvas;
    }
}