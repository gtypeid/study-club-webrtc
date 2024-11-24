

export default class HandleEvent{
    constructor(){
            this._eventType;
            this._roomUuid;
            this._clientUuid;
            this._targetUuid;
            this._data;
    }

    spawn(eventType, roomUuid, clientUuid, targetUuid, data){
        this._eventType = eventType;
        this._roomUuid = roomUuid;
        this._clientUuid = clientUuid;
        this._targetUuid = targetUuid;
        this._data = data;
        return this;
    }

    get eventType() {
        return this._eventType;
    }

    get roomUuid() {
        return this._roomUuid;
    }

    get clientUuid() {
        return this._clientUuid;
    }

    get targetUuid() {
        return this._targetUuid;
    }

    get data() {
        return this._data;
    }

    set eventType(value) {
        this._eventType = value;
    }
    
    set roomUuid(value) {
        this._roomUuid = value;
    }
    
    set clientUuid(value) {
        this._clientUuid = value;
    }
    
    set targetUuid(value) {
        this._targetUuid = value;
    }
    
    set data(value) {
        this._data = value;
    }
}