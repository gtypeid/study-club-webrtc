export default class RTC{
    static status = {
        none : 0,
        spawnCaller : 1,
        spawnReceiver : 2,

    }

    constructor(target){
        this._targetClientUuid = target;
        this._rtcStatus = RTC.status.none;
        this._peerConnection;
        this._dataChannel;

        this._iceSDP;
        this._stream;

        this._remoteVideo;
    } 



    changeStatus(status, cb){
        if(this._rtcStatus < status ){
            this._rtcStatus = status;
            return new Promise(resolve => {
                cb().then(result => {
                    resolve(result);
                });
            });
        }
        return null;
    }

    async spawnStream(){
        const localVideo = document.getElementsByClassName("local-video")[0];
        this._stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true});
        localVideo.srcObject = this._stream;
        this._stream.getTracks().forEach(track => this._peerConnection.addTrack(track, this._stream));
        return this._stream;
    }

    spawnRemoteVideo(event){
        const box = document.getElementsByClassName("con-box")[0];
        if(!this._remoteVideo){

            const video = document.createElement("video");
            video.classList.add("remote-video");
            video.classList.add("video");
            video.setAttribute('playsinline', '');
            video.setAttribute('autoplay', '');
            video.setAttribute("client", this._targetClientUuid);
            box.appendChild(video);
            this._remoteVideo = video;
        }

        this._remoteVideo.srcObject = event.streams[0];
        this._remoteVideo.setAttribute("stream", event.streams[0].id);
    }

    
    get rtcStatus(){
        return this._rtcStatus;
    }

    get targetClient(){
        return this._targetClientUuid;
    }

    get pc(){
        return this._peerConnection;
    }

    set dc(value){
        this._dataChannel = value;
    }

    get dc(){
        return this._dataChannel;
    }

    set pc(value){
        this._peerConnection = value;
    }

    get iceSDP(){
        return this._iceSDP;
    }

    set iceSDP(value){
        this._iceSDP = value;
    }
}