
import WidgetResource from "../../../js/doc/WidgetResource.js";
import DocEventHandler from "../../../js/comp/DocEventHandler.js";
import HTMLPipeLine from "../../../js/doc/HTMLPipeLine.js";
import HTTP from "../../../js/doc/HTTP.js";
import DocEngine from "../../../js/doc/DocEngine.js";
import * as Util from "../../../js/doc/Util.js";
import WrapOffer from "../../../js/data/cam/WrapOffer.js";

const buttonCreateRoom = "create-room-button";
const buttonJoinRoom = "join-room-button";
const buttonCreateOffer = "create-offer-button";
const buttonOffer = "offer-button";
const buttonCreateAnswer = "create-answer-button";
const buttonAnswer = "answer-button";
const buttonEtc = "etc-button";

export default class CamIndex extends WidgetResource {
    constructor(cwrd){
        super(cwrd);
        this._eventHandler;
        this._ownerClientID;
        this._layout;
        this._camRoom;
    }

    rConstructor(){
        super.rConstructor();
        this._eventHandler = this.addComp(DocEventHandler);

        const eh = this._eventHandler;
        eh.bindEvent(DocEventHandler.EEvent.CLICK, buttonCreateRoom);
        eh.bindEvent(DocEventHandler.EEvent.CLICK, buttonJoinRoom);
        eh.bindEvent(DocEventHandler.EEvent.CLICK, buttonCreateOffer);
        eh.bindEvent(DocEventHandler.EEvent.CLICK, buttonOffer);
        eh.bindEvent(DocEventHandler.EEvent.CLICK, buttonCreateAnswer);
        eh.bindEvent(DocEventHandler.EEvent.CLICK, buttonAnswer);
        eh.bindEvent(DocEventHandler.EEvent.CLICK, buttonEtc);

        this.preSpawnLayout();
        this.setCommonWidgetCamIndex();
    }

    click(target, event){

        const createButton = this.key.concat('-', buttonCreateRoom);
        const joinButton = this.key.concat('-', buttonJoinRoom);
        const createOfferButton = this.key.concat('-', buttonCreateOffer);
        const offerButton = this.key.concat('-', buttonOffer);
        const createAnswerButton = this.key.concat('-', buttonCreateAnswer);
        const answerButton = this.key.concat('-', buttonAnswer);
        const etcButton = this.key.concat('-', buttonEtc);

        
        const common = DocEngine.instance.common;

        if( target.classList.contains(createButton) ) {
            
            this._ownerClientID = common.getClientID();
            this.reqCreateRoom(this._ownerClientID );
        }

        if( target.classList.contains(joinButton) ) {

            const roomUuid = this.getRoomInputValue();
            this._ownerClientID = common.getClientID();
            this.reqJoinRoom(roomUuid, this._ownerClientID);
        }

        if( target.classList.contains(createOfferButton) ) {

            const ownerWidgetVideo = this._layout.ownerWidgetVideo;
            ownerWidgetVideo.createOwnerOffer();
        }

        
        if( target.classList.contains(offerButton) ) {
            const endPoint = DocEngine.instance.endPoint;

            const http = DocEngine.instance.http;
            const requestType = { ...HTTP.RequestType };
            const roomUuid = this._camRoom.uuid;
            const ownerWidgetVideo = this._layout.ownerWidgetVideo;
            const ownerOffer = ownerWidgetVideo.ownerOffer;

            const wrapOffer = new WrapOffer().set(ownerOffer, this._ownerClientID, "", "offer", null);

            requestType.URL = endPoint
                + "/publish-offer/"
                + roomUuid;

            requestType.method = HTTP.ERequestMethod.POST;
            requestType.responseType = HTTP.EResponseType.JSON;
            requestType.body = JSON.stringify(wrapOffer);

            http.doRequest(requestType, (response) => {
                const { uuid } = response;
            });
            ownerWidgetVideo.sendOfferLog();
        }

        if( target.classList.contains(createAnswerButton) ) {

            const test = this._layout.test;
            test.createOwnerAnswer();
        }

        if( target.classList.contains(answerButton) ) {
            const endPoint = DocEngine.instance.endPoint;
            const http = DocEngine.instance.http;
            const requestType = { ...HTTP.RequestType };
            const roomUuid = this._camRoom.uuid;


            const test = this._layout.test;
            const bindClientID = test.bindClientID;
            const ownerAnswer = test.ownerAnswer;

            const wrapOffer = new WrapOffer().set(ownerAnswer, this._ownerClientID, bindClientID, "answer", null);

            requestType.URL = endPoint
                + "/publish-offer/"
                + roomUuid;

            requestType.method = HTTP.ERequestMethod.POST;
            requestType.responseType = HTTP.EResponseType.JSON;
            requestType.body = JSON.stringify(wrapOffer);

            http.doRequest(requestType, (response) => {
                const { uuid } = response;
            });
            
            test.sendAnswerLog();
        }

        if( target.classList.contains(etcButton) ) {

            const ownerWidgetVideo = this._layout.ownerWidgetVideo;
            ownerWidgetVideo.sendData("test214");
        }
    }

    getRoomInputValue(){
        const input = this.findElements("room-uuid-input")[0];
        return input.value;
    }

    reqCreateRoom(clientID){
        const common = DocEngine.instance.common;
        const http = DocEngine.instance.http;
        const endPoint = DocEngine.instance.endPoint;

        const   requestType = {...HTTP.RequestType};
                requestType.URL = endPoint 
                + "/create-room/" 
                + clientID;

                requestType.method = HTTP.ERequestMethod.GET;
                requestType.responseType = HTTP.EResponseType.JSON;

        http.doRequest(requestType, (response)=>{
            const { uuid } = response;
            navigator.clipboard.writeText(uuid)
            .then( () => {
                // target.innerHTML = uuid;
            } );
            
            this.reqJoinRoom(uuid, clientID);
        });
    }


    reqJoinRoom(roomUuid, clientID){
        const http = DocEngine.instance.http;
        const endPoint = DocEngine.instance.endPoint;

        const   requestType = {...HTTP.RequestType};
                requestType.URL =   endPoint
                        + "/join-room/"
                        + roomUuid + "/"
                        + clientID;

                requestType.method = HTTP.ERequestMethod.GET;
                requestType.responseType = HTTP.EResponseType.Text;

        http.doRequest(requestType, (response)=>{
            this._camRoom = JSON.parse( response );
            this.removeCreateRoomButton();
            this._layout.spawnWidgetVideo(this._camRoom.clients);
        });
    }

    removeCreateRoomButton(){
        const button = this.findElements(buttonCreateRoom)[0];
        button.remove();
    }

    preSpawnLayout(){
        const htmlPipeLine = DocEngine.instance.htmlPipeLine;
        const frame = this.findElements("frame")[0];
        htmlPipeLine.runTimeSpawnWidget(frame, "layout", (widget)=>{
            this._layout = widget.widgetResource;
            this._layout.visible(false);
        });

    }

    setCommonWidgetCamIndex(){
        const common = DocEngine.instance.common;
        common.setCamIndexWidget(this);
    }

    get ownerClientID(){
        return this._ownerClientID;
    }

    get layout(){
        return this._layout;
    }

    get camRoom(){
        return this._camRoom;
    }

}
