import RTCManager from "./RTCManager.js";
import PipeChain from "./PipeChain.js";
import Pipe from "./Pipe.js";
import HandleEvent from "./data/HandleEvent.js";
import ClientSyncer from "./ClientSyncer.js";
import Def from "./Def.js";

export default class RTCClient{
    constructor(){
        this._server = Def.server;
        this._room;
        this._camClient;
        this._rtcManager;
        this._clientSyncer;
        this._pipe;

        this.preCreatePipeLine();
    }

    async preCreatePipeLine(){
        const pipeChain = new PipeChain();
        pipeChain.setRtcStableFilter("offer", (data)=>{
            return !this._rtcManager.hasRtc(data);
        });

        pipeChain.setRtcStableSend("offer", async (data)=>{
            const rtcCaller = await this._rtcManager.spawnCaller(data);
            const offer = rtcCaller.iceSDP;
            const roomUuid = this._room.roomUuid;
            const clientUuid = this._camClient.clientUuid;
            const targetUuid = data.target;
            const handleEvent = new HandleEvent().spawn("offer", roomUuid, clientUuid, targetUuid, offer);

            const eventType = "offer";
            console.log(`%c [ ${clientUuid} ] Client SEND [ ${eventType} ] - [ ${targetUuid} ]`, Def.styles);

            this._server.hanlder( handleEvent );
        });

        pipeChain.setRtcStableFilter("answer", (data)=>{
            return !this._rtcManager.hasRtc(data);
        });

        pipeChain.setRtcStableSend("answer", async (data)=>{
            const rtcReceiver = await this._rtcManager.spawReceiver(data);
            const answer = rtcReceiver.iceSDP;
            const roomUuid = this._room.roomUuid;
            const clientUuid = this._camClient.clientUuid;
            const targetUuid = data.target;
            const handleEvent = new HandleEvent().spawn("answer", roomUuid, clientUuid, targetUuid, answer);

            const eventType = "answer";

            console.log(`%c [ ${clientUuid} ] Client SEND [ ${eventType} ] - [ ${targetUuid} ]`, Def.styles);

            this._server.hanlder( handleEvent );
        });

        pipeChain.setRtcStableFilter("connect", (data)=>{
            return true;
        });

        pipeChain.setRtcStableSend("connect", async (data)=>{
            this._rtcManager.connect(data);

            const roomUuid = this._room.roomUuid;
            const clientUuid = this._camClient.clientUuid;
            const targetUuid = data.target;
            const handleEvent = new HandleEvent().spawn("connect", roomUuid, clientUuid, targetUuid, "");
            this._server.hanlder( handleEvent );
        });

        this._pipe = new Pipe(pipeChain);
        this._rtcManager = new RTCManager(this);
        this._clientSyncer = new ClientSyncer(this, this._rtcManager);
        
    }

    async createRoom(){
        const response = await this._server.createRoom()
        this.bindInfo(response);
        this._clientSyncer.sseBind(response);
    }

    async joinRoom(roomUuid){
        const response = await this._server.joinRoom(roomUuid);
        this.bindInfo( response );
        this._clientSyncer.sseBind(response);
        const clientUuid = this._camClient.clientUuid;
        this._server.hanlder( new HandleEvent().spawn("join", roomUuid, clientUuid, "", "") );

    }
    
    exitRoom(){
    }

    bindInfo(rs){
        this._room = rs.room;
        this._camClient = rs.rsProfile;
    }

    updateBeatSync(rsRoom){
        this._room = rsRoom;
    }

    get room(){
        return this._room;
    }

    get accessRoomUuid(){
        return this._room.roomUuid;
    }

    get camClient(){
        return this._camClient;
    }

    get clientUuid(){
        return this._camClient.clientUuid;
    }

    get rtcManager(){
        return this._rtcManager;
    }

    get pipe(){
        return this._pipe;
    }

    get clientSyncer(){
        return this._clientSyncer;
    }
}
