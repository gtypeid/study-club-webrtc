
export default class PipeChain {
    constructor(){
        this._rtcStableCallbacks = {
            filter: {},
            send: {},
        };
    }

    enqueueFilter(pipeItems, data){
        const {type, target, sdp} = data;
        const isValid0 = !pipeItems.some( item => {
            return (item.type === type && item.target === target ) 
        });

        const isValid1 = this.rtcStableFilter(type, data);
        return (isValid0 && isValid1);
    }

    setRtcStableFilter(type, callback) {
        this._rtcStableCallbacks.filter[type] = callback;
    }

    setRtcStableSend(type, callback) {
        this._rtcStableCallbacks.send[type] = callback;
    }

    rtcStableFilter(type, data) {
        const callback = this._rtcStableCallbacks.filter[type];
        if (callback) {
            return callback(data);
        }
        return false;
    }

    rtcStableSend(type, data) {
        const callback = this._rtcStableCallbacks.send[type];
        if (callback) {
            callback(data);
        }
    }
}