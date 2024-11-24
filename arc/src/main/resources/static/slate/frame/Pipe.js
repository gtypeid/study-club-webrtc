
import PipeChain from "./PipeChain.js";

export default class Pipe {
    constructor(pipeChain) {
        this._pipeChain = pipeChain;
        this._items = [];
    }

    enqueue(data) {
        if ( this._pipeChain.enqueueFilter(this._items, data) ){
            this._items.push(data);
        }
    }

    dequeue() {
        if (this.isEmpty()) {
            return null; 
        }
        return this._items.shift(); 
    }

    front() {
        if (this.isEmpty()) {
            return null;
        }
        return this._items[0];
    }
    
    publish(type){
        while(!this.isEmpty()){
            const data = this.dequeue();
            this._pipeChain.rtcStableSend(type, data);
        }
    }

    isEmpty() {
        return this._items.length === 0;
    }

    size() {
        return this._items.length;
    }
}