import CamClient from "./data/CamClient.js";
import Room from "./data/Room.js";
import RoomAccessInfo from "./data/RoomAccessInfo.js";
import HandleEvent from "./data/HandleEvent.js";
import Def from "./Def.js";
import HTTP from "../js/doc/HTTP.js"

export default class Sever{
    static http = new HTTP();
    constructor(){
        this._roomStore = new Map();
    }


    async createRoom(){
        const requestType = { ...HTTP.RequestType };
        requestType.URL =   Def.endPoint + "/create-room";
        requestType.method = HTTP.ERequestMethod.POST;
        requestType.responseType = HTTP.EResponseType.JSON;

        const response = await Sever.http.asyncRequest(requestType);
        console.log(`%c spawn room `, Def.stylesServer);
        console.log(`%c response : `, Def.styles2, response);
        return response;
    }

    async joinRoom(roomUuid){
        const requestType = { ...HTTP.RequestType };
        requestType.URL =   Def.endPoint + "/join-room/" + roomUuid;
        requestType.method = HTTP.ERequestMethod.POST;
        requestType.responseType = HTTP.EResponseType.JSON;

        const response = await Sever.http.asyncRequest(requestType);
        console.log(`%c join room `, Def.stylesServer);
        console.log(`%c response : `, Def.styles2, response);
        return response;
    }

    exitRoom(roomUuid, camClient){
    }

    async getRooms(){
        const requestType = { ...HTTP.RequestType };
        requestType.URL =   Def.endPoint + "/rooms";
        requestType.method = HTTP.ERequestMethod.GET;
        requestType.responseType = HTTP.EResponseType.JSON;

        return Sever.http.asyncRequest(requestType);
    }

    async getRoom(roomUuid){
        const requestType = { ...HTTP.RequestType };
        requestType.URL =   Def.endPoint + "/room/" + roomUuid;
        requestType.method = HTTP.ERequestMethod.GET;
        requestType.responseType = HTTP.EResponseType.JSON;

        return Sever.http.asyncRequest(requestType);
    }
    
    async hanlder(handleEvent){
        const { eventType, roomUuid, clientUuid, targetUuid, data } = handleEvent;
        const reqHandleEvent = {
            eventType : eventType,
            roomUuid : roomUuid,
            clientUuid : clientUuid,
            targetUuid : targetUuid,
            data : data
        };

        const requestType = { ...HTTP.RequestType };
        requestType.URL =   Def.endPoint + "/handler"
        requestType.method = HTTP.ERequestMethod.POST;
        requestType.responseType = HTTP.EResponseType.JSON;
        requestType.body = JSON.stringify(reqHandleEvent);

        const response = await Sever.http.asyncRequest(requestType);
        console.log(`%c [ ${clientUuid} ] Handle Shaking [ ${eventType} ] - [ ${targetUuid} ]`, Def.stylesServer);
        console.log(`%c response : `, Def.styles2, response);
        return response;

    }
    
    spawnCamClient(type){
        return new CamClient().spawn(type);
    }
}
