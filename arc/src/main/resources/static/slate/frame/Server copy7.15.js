import CamClient from "./data/CamClient.js";
import Room from "./data/Room.js";
import RoomAccessInfo from "./data/RoomAccessInfo.js";
import HandleEvent from "./data/HandleEvent.js";
import Def from "./Def.js";

export default class Sever{
    constructor(){
        this._roomStore = new Map();
    }


    createRoom(){
        const spawnClient = this.spawnCamClient("host");
        const spawnRoom = new Room().spawn(spawnClient);
        this._roomStore.set(spawnRoom.roomUuid, spawnRoom);

        console.log(`%c spawn room `, Def.styles);
        console.log(`%c room : `, Def.styles2, spawnRoom);

        const copyRoom = _.cloneDeep(spawnRoom);
        return new RoomAccessInfo().spawn(copyRoom, spawnClient);
    }

    joinRoom(roomUuid){
        const spawnClient = this.spawnCamClient("client");
        const room = this._roomStore.get(roomUuid);
        room.addClient(spawnClient);

        const copy = _.cloneDeep(room);
        console.log(`%c join room `, Def.styles);
        console.log(`%c count : ${JSON.stringify(room.camClients.size)}`, Def.styles2);

        return new RoomAccessInfo().spawn(copy, spawnClient);
    }

    exitRoom(roomUuid, camClient){
        const room = this._roomStore.get(roomUuid);
        room.removeClient(camClient);

        const copy = _.cloneDeep(room);
        console.log('%c exit room ', Def.styles);
        console.log(camClient);
        console.log(room);
        return new RoomAccessInfo().spawn(copy, camClient);
    }

    hanlder(handleEvent){
        const { eventType, roomUuid, clientUuid, targetUuid, data } = handleEvent;

        const room = this._roomStore.get(roomUuid);
        console.log(`%c Server - [ ${eventType} ] :: handler`, Def.stylesServer);
        console.log(`%c handle  :`, Def.styles2, handleEvent);

        if(eventType === "join"){
            Def.rtcClients.forEach( it =>{
                if ( it.camClient ){
                    const rsHandleEvent = new HandleEvent().spawn(eventType, roomUuid, clientUuid, targetUuid, "");
                    it.clientSyncer.heartbeatSyncStatus(rsHandleEvent, _.cloneDeep(room));
                }
            });
        }

        if( eventType === "offer" ||
            eventType === "answer"
        ){
            Def.rtcClients.forEach( it =>{
                if ( it.camClient && it.camClient.clientUuid === targetUuid) {
                    const rsHandleEvent = new HandleEvent().spawn(eventType, roomUuid, clientUuid, targetUuid, data);
                    it.clientSyncer.heartbeatSyncStatus(rsHandleEvent, _.cloneDeep(room));
                }
            });
        }

    }
    
    spawnCamClient(type){
        return new CamClient().spawn(type);
    }
}
