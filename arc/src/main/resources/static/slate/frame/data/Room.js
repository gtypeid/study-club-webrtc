
export default class Room{
    constructor(){
        this._roomUuid;
        this._hostClient;
        this._camClients = new Map();
        this._lastModified = -1;
        this._maxUser;
    }

    spawn(hostClient){
        this._roomUuid = crypto.randomUUID();
        this._hostClient = hostClient;
        this.addClient(hostClient);
        return this;
    }

    addClient(client){
        const index = ++this._lastModified;
        client.index = index;
        this._camClients.set(index, client);

        return true;
    }

    removeClient(client){
        this._camClients.delete(client.index);
        ++this._lastModified;

        return true;
    }

    get roomUuid() {
        return this._roomUuid;
    }

    get lastModified(){
        return this._lastModified;
    }

    get camClients(){
        return this._camClients;
    }

    get maxUser(){
        return this._maxUser;
    }
}
