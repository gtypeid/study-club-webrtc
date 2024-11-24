import DocEngine from "../../../js/doc/DocEngine.js";

export default class PipeEventSource{
    constructor(widgetVideo){
        this._eventSource;
        this._mainWidgetVideo = widgetVideo;
        this.inIt();
    }

    inIt(){
        const endPoint = DocEngine.instance.endPoint;
        this._eventSource = new EventSource(endPoint + "/sse-server");
        this._eventSource.onmessage = this.onMessage.bind(this);
        this._eventSource.onerror = this.onError.bind(this);
    }

    onMessage(event){
        const common = DocEngine.instance.common;
        const camIndexWidget = common.camIndexWidget;
        const layout = camIndexWidget.layout;
        const ownerClientID = camIndexWidget.ownerClientID;
        const wrapOffer = JSON.parse( event.data );
        const offer = { sdp : wrapOffer.sdp , type : wrapOffer.type };


        if( wrapOffer.rtcSignal === "offer" &&
            wrapOffer.clientUuid !== ownerClientID ){
            layout.stream( it =>{
                if (!it.isOwner){
                    it.handleOffer(offer);
                }
                /*
                if (!it.isOwner){
                    if(it.bindClientID === wrapOffer.clientUuid ){
                        console.log('--4. sse offer response wrap:', wrapOffer);
                        it.handleOffer(offer);
                    }
                }
                */
            });
        }

        if(wrapOffer.rtcSignal === "answer"){
            if ( wrapOffer.clientUuid !== ownerClientID ){
                layout.stream( it =>{
                    if (it.isOwner){
                        it.handleAnswer(offer);
                    }
                });
            }
            //console.log('--6. sse answer response wrap:', wrapOffer);
            //this._mainWidgetVideo.handleAnswer(offer);
        }

        if(wrapOffer.rtcSignal === "candidate"){
            this._mainWidgetVideo.handleCandidate(wrapOffer.candidate);
        }
    }

    onError(event){
        console.error('EventSource error:', event);
        eventSource.close();
    }
}