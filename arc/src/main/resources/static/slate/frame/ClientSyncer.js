
import HTTP from "../js/doc/HTTP.js";
import SyncBoard from "./SyncBoard.js";
import Def from "./Def.js";
import SyncChat from "./SyncChat.js";

export default class ClientSyncer{
    
    constructor(rtcClient, rtcManager){
       this._rtcClient = rtcClient;
       this._rtcManager = rtcManager;
       this._eventSource;

       this._SyncChat;
    }


    sseBind(rs){
        const roomUuid = rs.room.roomUuid;
        const clientUuid = rs.rsProfile.clientUuid;

        const path = Def.endPoint +"/sse-event/" + roomUuid + "/" + clientUuid;
        const camClient = this._rtcClient.camClient;

        
        this._eventSource = new EventSource(path);
        this._eventSource.onmessage = (e) =>{
            const roomStateEventHandler = JSON.parse(e.data);
            this.heartbeatSyncStatus(roomStateEventHandler.handleEvent, roomStateEventHandler.room);
        }

        this._SyncChat = new SyncChat(this);
        this._SyncBoard = new SyncBoard(this);
        this._rtcManager.msgReceiver = (event) =>{
            const receivedBuffer = event.data;
            const receivedString = new TextDecoder().decode(receivedBuffer);
            const receivedObj = JSON.parse(receivedString);
            this._SyncBoard.receive(receivedObj);
            this._SyncChat.receive(receivedObj);
        }

        this._rtcManager.connector = (event) =>{
            
        }
        //this._eventSource.onerror = this.onError.bind(this);
    }

    heartbeatSyncStatus(handleEvent, rsRoom){
        const camClient = this._rtcClient.camClient;
        const room = this._rtcClient.room;

        const { eventType, roomUuid, clientUuid, targetUuid, data } = handleEvent;
        console.log(`%c [ ${camClient.clientUuid} ] Client HB [ ${eventType} ] - [ ${clientUuid} ]`, Def.stylesBeat);

        // 최신 버전 업데이트
        if(room.lastModified < rsRoom.lastModified){

            if(eventType === "join"){
                this.syncJoin(rsRoom);
            }

            this._rtcClient.updateBeatSync(rsRoom);
        }
        // 최신 버전이라면
        else if(room.lastModified === rsRoom.lastModified){
            if(eventType === "offer"){
                this.syncHandleOffer(handleEvent)
            }

            if(eventType === "answer"){
                this.syncHandleAnswer(handleEvent)
            }
        }

    }

    syncJoin(rsRoom){
        console.log(`%c SYNC JOIN `, Def.styles);
        const { camClient, pipe } = this._rtcClient;
        const camIndex = camClient.index;

        for(let it of Object.values(rsRoom.camClients)){
            const target = it;
            if(camIndex < target.index){
                const data = { type : "offer", target : target.clientUuid, sdp : ""};
                pipe.enqueue(data);
            }
        }
        pipe.publish("offer");
    }

    syncHandleOffer(handleEvent){
        console.log(`%c sync Handle Offer `, Def.styles);
        const { camClient, pipe } = this._rtcClient;
        const { eventType, roomUuid, clientUuid, targetUuid, data } = handleEvent;

        const offerSender = clientUuid;
        const offerReciver = targetUuid; 
        const isMatch = (camClient.clientUuid === offerReciver);
        if(isMatch){
            const inData = { type : "answer", target : offerSender, sdp : data };
            pipe.enqueue(inData);
            pipe.publish("answer");
        }

    }

    syncHandleAnswer(handleEvent){
        console.log(`%c sync Handle Answer `, Def.styles);
        const { camClient, pipe } = this._rtcClient;
        const { eventType, roomUuid, clientUuid, targetUuid, data } = handleEvent;

        const answerSender = clientUuid;
        const answerReciver = targetUuid; 
        const isMatch = (camClient.clientUuid === answerReciver);
        if(isMatch){
            const inData = { type : "connect", target : answerSender, sdp : data };
            pipe.enqueue(inData);
            pipe.publish("connect");
        }
    }

    sendData(target, msg){
        const store = this._rtcManager.rtcStore;

        const jsonString = JSON.stringify(msg);
        const buffer = new TextEncoder().encode(jsonString);

        if(target === "all"){
            const rtcs0 = store.get("offer");
            if(rtcs0){
                for(let it of rtcs0){
                    const rtc = it[1];
                    if(rtc.dc && rtc.dc.readyState === 'open'){
                        rtc.dc.send(buffer);
                    }
                }
            }

            const rtcs1 = store.get("answer");
            if(rtcs1){
                for(let it of rtcs1){
                    const rtc = it[1];
                    if(rtc.pc.dc && rtc.pc.dc.readyState === 'open'){
                        rtc.pc.dc.send(buffer);
                    }
                }
            }
        }
    }

    get clientUuid(){
        return this._rtcClient.clientUuid;
    }
}