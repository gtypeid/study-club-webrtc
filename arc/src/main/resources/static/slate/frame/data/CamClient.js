import Room from "./Room.js";

export default class CamClient{
    static asciiCode = 65;
    static asciiCount = 0;

    constructor(){
        this._clientUuid;   
        this._type;
        this._index;
    }

    spawn(type){
        // this._clientUuid = crypto.randomUUID();
        this._clientUuid = String.fromCharCode( ( CamClient.asciiCode + (CamClient.asciiCount++) ) );
        this._type = type;
        return this;
    }

    get type(){
        return this._type;
    }

    set index(value){
        this._index = value;
    }

    get index(){
        return this._index;
    }

    get clientUuid(){
        return this._clientUuid;
    }

}