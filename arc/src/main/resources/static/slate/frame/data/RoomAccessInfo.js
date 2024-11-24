export default class RoomAccessInfo{
    constructor (){
        this._room;
        this._rsProfile;
    }

    spawn(room, rsProfile){
        this._room = room;
        this._rsProfile = rsProfile;
        return this;
    }

    get room(){
        return this._room;
    }

    get rsProfile(){
        return this._rsProfile;
    }
}