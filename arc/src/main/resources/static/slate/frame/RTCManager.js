
import RTC from "./data/RTC.js";
import Def from "./Def.js"

export default class RTCManager {
    constructor(rtcClient){
        this._rtcClient = rtcClient;
        this._rtcStore = new Map();

        this._localVideo;
        this._isTest = false;

        this._msgReceiver;
        this._connector;
    }


    localVideoUpdate(clientUuid, streamID, target){
        const box = document.getElementsByClassName("local-spawn-box")[0];

        const localH = document.createElement("p");
        localH.innerHTML = "Local : " + clientUuid + "\t Target : " + target;

        const localHStream = document.createElement("p");
        localHStream.innerHTML = "Stream ID : " + streamID;

        box.appendChild(localH);
        box.appendChild(localHStream);
    }

    async spawnCaller(data){
        const { type, target, sdp } = data;
        if (!this._rtcStore.has(type)) {
            this._rtcStore.set(type, new Map());
        }
        const typeMap = this._rtcStore.get(type);
        const hasKey = typeMap.has(target);

        if(!hasKey){
            const rtc = new RTC(target);
            // 생성 후 바로 store에 셋팅
            // store에 존재해야만, msg 큐에 더 이상 안 들어옴
            typeMap.set(target, rtc);

            const result = await rtc.changeStatus( RTC.status.spawnCaller, async ()=>{
                rtc.pc = new RTCPeerConnection();
                const lc = await rtc.spawnStream();

                // this.localVideoUpdate(this._rtcClient.clientUuid, lc.id, target);

                rtc.dc = rtc.pc.createDataChannel("channel");

                rtc.dc.onopen = (event) => {
                    console.log(this._rtcClient.clientUuid + '%c caller connection open ', Def.styles2);
                    this._connector(event);
                };
    
                rtc.dc.onmessage = (event) => {
                    this._msgReceiver(event);
                };

                const iceSdpPromise = new Promise(resolve => {
                    rtc.pc.onicecandidate = (event) => {
                        if (rtc.pc && rtc.pc.localDescription) {
                            rtc.iceSDP = JSON.stringify(rtc.pc.localDescription);
                            resolve(rtc.iceSDP);
                        }
                    };
                });

                rtc.pc.ontrack = ( event ) => {
                    rtc.spawnRemoteVideo(event);
                }

                const offer = await rtc.pc.createOffer();
                await rtc.pc.setLocalDescription(offer);

                // icecandiate 할당 될 때 까지 대기함
                await iceSdpPromise;
                return typeMap.get(target);
            });

            return result;
        }

        return typeMap.get(target);
    }

    async spawReceiver(data){
        const { type, target, sdp } = data;
        if (!this._rtcStore.has(type)) {
            this._rtcStore.set(type, new Map());
        }
        const typeMap = this._rtcStore.get(type);
        const hasKey = typeMap.has(target);

        if(!hasKey){
            const rtc = new RTC(target);
            // 생성 후 바로 store에 셋팅
            // store에 존재해야만, msg 큐에 더 이상 안 들어옴
            typeMap.set(target, rtc);

            const result = await rtc.changeStatus( RTC.status.spawnCaller, async ()=>{
                rtc.pc = new RTCPeerConnection();
                const lc = await rtc.spawnStream();

                // this.localVideoUpdate(this._rtcClient.clientUuid, lc.id, target);
                // rtc.dc = rtc.pc.createDataChannel("channel");

                rtc.pc.ondatachannel = (event)=> {
                    rtc.pc.dc = event.channel;
                    rtc.pc.dc.onopen = (event)=>{
                        console.log(this._rtcClient.clientUuid + '  %c receiver connection open ', Def.styles2);
                        this._connector(event);
                    }
                    rtc.pc.dc.onmessage = (event)=>{
                        this._msgReceiver(event);
                    }
                }

                const iceSdpPromise = new Promise(resolve => {
                    rtc.pc.onicecandidate = (event) => {
                        if (rtc.pc && rtc.pc.localDescription) {
                            rtc.iceSDP = JSON.stringify(rtc.pc.localDescription);
                            resolve(rtc.iceSDP);
                        }
                    };
                });
                
                rtc.pc.ontrack = ( event ) => {
                    rtc.spawnRemoteVideo(event);
                }

                await rtc.pc.setRemoteDescription( JSON.parse (sdp) );
                const answer = await rtc.pc.createAnswer();
                await rtc.pc.setLocalDescription(answer);

                // icecandiate 할당 될 때 까지 대기함
                await iceSdpPromise;
                return typeMap.get(target);
            });

            return result;
        }

        return typeMap.get(target);
    }

    connect(data){
        const { type, target, sdp } = data;

        const typeMap = this._rtcStore.get("offer");
        const callerRTC = typeMap.get(target);

        callerRTC.pc.setRemoteDescription( JSON.parse(sdp) );

    }
    
    hasRtc(data){
        const { type, target, sdp } = data;
        if (this._rtcStore.has(type)) {
            const typeMap = this._rtcStore.get(type);
            return typeMap.has(target);
        }
        return false;
    }

    get rtcStore(){
        return this._rtcStore;
    }

    set msgReceiver(value){
        this._msgReceiver = value;
    }

    set connector(value){
        this._connector = value;
    }

}

