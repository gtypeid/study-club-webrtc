
import WidgetResource from "../../../js/doc/WidgetResource.js";
import DocEventHandler from "../../../js/comp/DocEventHandler.js";
import HTTP from "../../../js/doc/HTTP.js";
import DocEngine from "../../../js/doc/DocEngine.js";
import PipeEventSource from "./PipeEventSource.js";
import WrapOffer from "../../../js/data/cam/WrapOffer.js";
import * as Util from "../../../js/doc/Util.js";

export default class WidgetVideo extends WidgetResource {
    constructor(cwrd){
        super(cwrd);

        this._video;
        this._constraints;
        this._isOwner;
        this._bindClientID;
        this._stream;
        this._ownerOffer;
        this._ownerAnswer;
        this._pipeEventSource;
        this._isConnected = false;

        this._peerConnection;

        this._dataChannel;
        this._iceStore = [];
    }

    rConstructor(){
        super.rConstructor();

        this._video = this.findElements("video")[0];
        this._video.onloadedmetadata = this.onVideoLoadedMetadata.bind(this);
    }

    async entityBind(entityData){

        this._entityData = entityData;
        this._bindClientID = this._entityData.item;

        const h1 = this.findElements("h-client-id")[0].innerHTML = this.bindClientID;

        const common = DocEngine.instance.common;
        const camIndexWidget = common.camIndexWidget;

        await this.matchOwnerCam(camIndexWidget, this._entityData);
    }

    pipeBoxAdd(title, obj){
        const pipeBox = this.findElements("pipe-box")[0];
        const newP = document.createElement("p");
        let append = JSON.stringify(obj);
        if(Util.isEmpty(append) || append === "{}" ){
            append = obj;
        }
      
        let today = new Date();   
      
        let hours = today.getHours(); // 시
        let minutes = today.getMinutes();  // 분
        let seconds = today.getSeconds();  // 초
        let milliseconds = today.getMilliseconds(); // 밀리초
      
        const time = hours + ':' + minutes + ':' + seconds + ':' + milliseconds;
      
        newP.innerHTML = title + ":: " + append + "<br>" + time;
        pipeBox.appendChild(newP);
    }

    async matchOwnerCam(camIndexWidget, entityData){
        const ownerClientID = camIndexWidget.ownerClientID;
        const { item, comp } = entityData;

        if(ownerClientID === item){
            this._isOwner = true;
            this._bindClientID = ownerClientID;

            await this.createStream();
            this.createPeerConnection(this._stream);

            const videoTracks = this._stream.getVideoTracks();
            // window.stream = stream;
            this._video.srcObject = this._stream;
            this.pipeBoxAdd("Owner - using video device", videoTracks[0].label);

            const layout = comp.parent;
            layout.setOwnerWidgetVideo(this);
            this.pipeBoxAdd("Owner - client ID", ownerClientID);
            this._pipeEventSource = new PipeEventSource(this);


            /*
            /// test
            this._dataChannel = this._peerConnection.createDataChannel('myDataChannel');
            this._dataChannel.onopen = () => {
                console.log('Data channel is open and ready to use');
                // 데이터 채널이 열리면 로컬에서 원하는 문자열을 보낼 수 있습니다.
                this.sendData("Hello from local!");
              };
            this._dataChannel.onmessage = (event) => {
                console.log('Received message:', event.data);
              };
              */
        }
    }

    sendData(message) {
        this._dataChannel.send(message);
    }    

    createConstraints(){
        const t = {...window.constraints };
        t.audio = true;
        t.video = true;

        return t;
    }
  
    async createStream() {
        try {
            this._constraints = this.createConstraints();
            this._stream = await navigator.mediaDevices.getUserMedia(this._constraints);

            this.pipeBoxAdd("create - Stream", this._stream.id);

        } catch (err) {
            this.errorHandler(err);
        }
    }

    createPeerConnection(stream) {
        try {
            this._peerConnection = new RTCPeerConnection();
            this._peerConnection.onicecandidate = this.onIceCandidate.bind(this);
            this._peerConnection.oniceconnectionstatechange = this.onIceConnectionStateChange.bind(this);
            this._peerConnection.ontrack = this.onTrack.bind(this);

            this.pipeBoxAdd("create - PeerConnection", this._peerConnection);

            // 로컬 스트림의 트랙을 PeerConnection에 추가
            stream.getTracks().forEach(track => {
                this._peerConnection.addTrack(track, stream);
                this.pipeBoxAdd("add - Track", track.id);
            });
            
        } catch (err) {
            this.errorHandler(err);
        }
    }

    async createOwnerOffer() {
        try {
            this._ownerOffer = await this._peerConnection.createOffer();
            this.pipeBoxAdd("create - Owner Offer", "");
            this.pipeBoxAdd("@ peerConnection",
                { connectionState : this._peerConnection.connectionState,
                  iceConnectionState : this._peerConnection.iceConnectionState,
                  signalingState : this._peerConnection.signalingState,
                  //remoteDescription : this._peerConnection.remoteDescription,
                  //localDescription : this._peerConnection.localDescription
                });

            await this._peerConnection.setLocalDescription(this._ownerOffer);
            this.pipeBoxAdd("set - Local Offer", "");
            this.pipeBoxAdd("@ peerConnection",
                { connectionState : this._peerConnection.connectionState,
                  iceConnectionState : this._peerConnection.iceConnectionState,
                  signalingState : this._peerConnection.signalingState,
                  //remoteDescription : this._peerConnection.remoteDescription,
                  //localDescription : this._peerConnection.localDescription
                });


        } catch (err) {
            this.errorHandler(err);
        }
    }

    sendOfferLog(){
        this.pipeBoxAdd("send - offer", "");
        this.pipeBoxAdd("@ peerConnection",
            { connectionState : this._peerConnection.connectionState,
              iceConnectionState : this._peerConnection.iceConnectionState,
              signalingState : this._peerConnection.signalingState,
              // remoteDescription : this._peerConnection.remoteDescription,
              // localDescription : this._peerConnection.localDescription
            });
    }

    async handleOffer(offer) {
        try {

            await this.createStream();
            this.createPeerConnection(this._stream);

            const videoTracks = this._stream.getVideoTracks();
            // window.stream = stream;
            this._video.srcObject = this._stream;
            this.pipeBoxAdd("Owner - using video device", videoTracks[0].label);

            await this._peerConnection.setRemoteDescription(offer);
            this.pipeBoxAdd("set Remote - Offer Handle", offer);
            this.pipeBoxAdd("@ peerConnection",
                { connectionState : this._peerConnection.connectionState,
                  iceConnectionState : this._peerConnection.iceConnectionState,
                  signalingState : this._peerConnection.signalingState,
                  // remoteDescription : this._peerConnection.remoteDescription,
                  // localDescription : this._peerConnection.localDescription
                });

            const common = DocEngine.instance.common;
            const camIndexWidget = common.camIndexWidget;
            const layout = camIndexWidget.layout;
            layout.test = this;

        } catch (err) {
            this.errorHandler(err);
        }
    }

    async createOwnerAnswer() {
        this._ownerAnswer = await this._peerConnection.createAnswer()
        this.pipeBoxAdd("create - Answer", this._ownerAnswer);
        this.pipeBoxAdd("@ peerConnection",
            { connectionState : this._peerConnection.connectionState,
            iceConnectionState : this._peerConnection.iceConnectionState,
            signalingState : this._peerConnection.signalingState,
            // remoteDescription : this._peerConnection.remoteDescription,
            // localDescription : this._peerConnection.localDescription
            });

        console.log(this._ownerAnswer);

        await this._peerConnection.setLocalDescription(this._ownerAnswer)
        this.pipeBoxAdd("set Local - Answer", this._ownerAnswer);
        this.pipeBoxAdd("@ peerConnection",
            { connectionState : this._peerConnection.connectionState,
              iceConnectionState : this._peerConnection.iceConnectionState,
              signalingState : this._peerConnection.signalingState,
              // remoteDescription : this._peerConnection.remoteDescription,
              // localDescription : this._peerConnection.localDescription
            });
        
        this._isConnected = true;

    }

    sendAnswerLog(){
        this.pipeBoxAdd("send - Answer", "");
        this.pipeBoxAdd("@ peerConnection",
            { connectionState : this._peerConnection.connectionState,
              iceConnectionState : this._peerConnection.iceConnectionState,
              signalingState : this._peerConnection.signalingState,
              // remoteDescription : this._peerConnection.remoteDescription,
              // localDescription : this._peerConnection.localDescription
            });
    }

    async handleAnswer(answer) {
        // if(this._ownerAnswer) return;
        await this._peerConnection.setRemoteDescription(answer)
        this.pipeBoxAdd("set Remote - Answer Handle", answer);
        this.pipeBoxAdd("@ peerConnection",
            { connectionState : this._peerConnection.connectionState,
              iceConnectionState : this._peerConnection.iceConnectionState,
              signalingState : this._peerConnection.signalingState,
              // remoteDescription : this._peerConnection.remoteDescription,
              // localDescription : this._peerConnection.localDescription
            });

    }

    async handleCandidate(candidate){
        console.log("HANDLE RESPONSE ");
        console.log(candidate);
        if (candidate) {
            this._peerConnection.addIceCandidate(candidate)
            .then(() => {
                this.pipeBoxAdd("on add Ice Candidate ", candidate);
                this.pipeBoxAdd("@ peerConnection",
                    { connectionState : this._peerConnection.connectionState,
                      iceConnectionState : this._peerConnection.iceConnectionState,
                      signalingState : this._peerConnection.signalingState,
                      //remoteDescription : this._peerConnection.remoteDescription,
                      //localDescription : this._peerConnection.localDescription
                    });
                });

        }
    }



    onVideoLoadedMetadata(event){
        const common = DocEngine.instance.common;
        const camIndexWidget = common.camIndexWidget;
    }

    onIceCandidate(event){
        console.log("ON----------------------------");
        console.log(event);
        console.log(event.candidate);
        if(event.candidate){
            const candidate = event.candidate;
            const msg = {
                type: 'candidate',
                candidate: candidate.candidate,
                sdpMid: candidate.sdpMid,
                sdpMLineIndex: candidate.sdpMLineIndex
            }
    
            const common = DocEngine.instance.common;
            const endPoint = DocEngine.instance.endPoint;
            const http = DocEngine.instance.http;
            const requestType = { ...HTTP.RequestType };
            const camIndexWidget = common.camIndexWidget;
            const roomUuid = camIndexWidget.camRoom.uuid;
    
            const wrapOffer = new WrapOffer().set(null, this._ownerClientID, this._bindClientID, "candidate", msg);
    
            requestType.URL = endPoint
                + "/publish-offer/"
                + roomUuid;
    
            requestType.method = HTTP.ERequestMethod.POST;
            requestType.responseType = HTTP.EResponseType.JSON;
            requestType.body = JSON.stringify(wrapOffer);
    
            http.doRequest(requestType, (response) => {
                const { uuid } = response;
            });
    
            this.pipeBoxAdd("request - candidate ", candidate);
        }
    }

    onIceConnectionStateChange(event){

    }

    onTrack(event){

        if (event.streams && event.streams[0]) {
            const remoteVideo = document.getElementsByClassName("widget-video-video")[1];
            remoteVideo.srcObject = event.streams[0];

            this.pipeBoxAdd(":: on - Stream", event.streams[0].id);
            this.pipeBoxAdd(":: on - Track", event.track.id);

            remoteVideo.style.border = "dotted";
            remoteVideo.id = "remote";
        }
    }
    

    errorHandler(err) {
        console.error(err);
    }

    get constraints() {
        return this._constraints;
    }

    get stream() {
        return this._stream;
    }

    get video(){
        return this._video;
    }

    get ownerOffer(){
        return this._ownerOffer;
    }

    get ownerAnswer(){
        return this._ownerAnswer;
    }

    get isOwner(){
        return this._isOwner;
    }

    get bindClientID(){
        return this._bindClientID;
    }
}