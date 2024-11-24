

export default class RoomStateEventHandler{
    constructor (){
        this._room;
        this._handleEvent;
    }

    spawn(room, handleEvent){
        this._room = room;
        this._handleEvent = handleEvent;
        return this;
    }

    get room(){
        return this._room;
    }

    get handleEvent(){
        return this._handleEvent;
    }
}