import HTTP from "../js/doc/HTTP.js"
import Def from "./Def.js"

export default class RoomInformer {
    static con = "con";
    static roomEntityClass = "room-entity";
    static roomInfoClass = "room-info";

    constructor(targetURL){
        this._eleRooms = [];
        this._anyClick = false;
        this._http = new HTTP();
        this._targetURL = targetURL;
    }

    async roomSync(){
        const rooms = await Def.server.getRooms();
        const eleCon = document.getElementsByClassName(RoomInformer.con)[0];

        for(let it of this._eleRooms){
            it.remove();
        }

        for(let key in rooms){
            const it = rooms[key];
            const entity = this.spawnEntity(it);

            this._eleRooms.push(entity);
            eleCon.appendChild(entity);
        }

    }

    spawnEntity(room){
        const { roomUuid, hostClient, camClients } = room;

        const roomEntity = document.createElement("div");
        const roomInfo = document.createElement("p");

        roomEntity.classList.add(RoomInformer.roomEntityClass);
        roomEntity.addEventListener("click", (event)=>{
            this.entityClick(event, room);
        })

        roomInfo.classList.add(RoomInformer.roomInfoClass);
        roomInfo.innerHTML += `<p>Room : ${roomUuid}</p>`;
        roomInfo.innerHTML += `<p>Host : ${hostClient.clientUuid}</p>`;

        const userCount = 1 + Object.values(camClients).length;
        roomInfo.innerHTML += `<p>Clients : ${userCount}</p>`;

        roomEntity.appendChild(roomInfo);
        

        return roomEntity;
    }

    async entityClick(event, room){
        const { roomUuid, hostClient, camClients, maxUser} = room;

        event.preventDefault();
        if(this._anyClick) return;

        this._anyClick = true;

        const responseRoom = await Def.server.getRoom(roomUuid);
        const roomUserCount = 1 + Object.values(responseRoom.camClients).length;
        if(roomUserCount < maxUser){
            window.location.href = Def.endPoint + this._targetURL + responseRoom.roomUuid
        }
        this._anyClick = false;

    }

}