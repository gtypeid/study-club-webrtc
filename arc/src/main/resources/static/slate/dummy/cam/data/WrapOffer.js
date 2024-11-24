import * as Util from "../../doc/Util.js";

export default class WrapOffer{
    constructor(){
        this.sdp = "";
        this.type = "";
        this.clientUuid = "";
        this.targetClientUuid = "";
        this.rtcSignal = "";
        this.candidate;
    }

    set(ownerOffer, clientUuid, targetClientUuid, rtcSignal, candidate){

        if(!Util.isEmpty(ownerOffer)){
            this.sdp = ownerOffer.sdp;
            this.type = ownerOffer.type;
        }
        this.clientUuid = clientUuid;
        this.targetClientUuid = targetClientUuid;
        this.rtcSignal = rtcSignal;
        if(!Util.isEmpty(candidate)){
            this.candidate = candidate;
        }
        return this;
    }

}