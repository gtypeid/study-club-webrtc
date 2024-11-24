import Common from "../../doc/Common.js";
import * as Util from "../../doc/Util.js";

export default class ComCam extends Common{
    constructor(){
        super();

        this._clientID;
        this._camIndexWidget;
        this._endPoint;
    }

    getClientID(){
        if(Util.isEmpty(this._clientID)){
            this._clientID = crypto.randomUUID();
        }
        return this._clientID;
    }

    setCamIndexWidget(widget){
        this._camIndexWidget = widget;
    }

    get endPoint(){
        return this._endPoint;
    }

    get camIndexWidget(){
        return this._camIndexWidget;
    }

    set endPoint(value){
        this._endPoint = value;
    }
}