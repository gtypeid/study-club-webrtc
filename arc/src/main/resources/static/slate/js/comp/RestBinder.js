
import DocEngine from "../doc/DocEngine.js";
import Component from "./Component.js";
import HTTP from "../doc/HTTP.js";
import * as Util from "../doc/Util.js";


export default class RestBinder extends Component{
    constructor(parent){
        super(parent);
        this._restBinderConfig = new Map();
        this._inBoundPacker = new Map();
    }

    bindConfig(config){
        const hasKey = this._restBinderConfig.has(config.key);
        if(!hasKey){
            this._restBinderConfig.set(config.key, config);
        }
    }

    send(key, cb){
        const config = this._restBinderConfig.get(key);

        // client package
        if ( config.packageLoc === RestBinder.ERBCPackageLoc.client ){
            this.getInboundData(config, (items)=>{
                cb(items);
            });
        }
        else if( config.packageLoc === RestBinder.ERBCPackageLoc.server ){

        }
    }

    getInboundData(config, cb){
        let items = null;
        let packer = null;

        const engine = DocEngine.instance;
        const http = engine.http;
        const key = config.key;
        const hasInboundPacker = this._inBoundPacker.get(key);
        if (!hasInboundPacker) {
            http.doRequest(config.RequestType, (response) => {

                this._inBoundPacker.set(key, { store: new Map(), progressIndex: 0 });
                packer = this._inBoundPacker.get(key);
                for (let obj of response) {
                    packer.store.set(obj.uuid, obj);
                }
                packer.progressIndex = 0;
                items = this.getPackerItems(config, packer);
                cb(items);
                return;
            });

        }
        else{
            packer = this._inBoundPacker.get(key);
            items = this.getPackerItems(config, packer);
            cb(items);
        }

    }

    getPackerItems(config, packer){

        const arr = Array.from(packer.store.values());
        let start = packer.progressIndex * config.itemSize;
        let end = ( (packer.progressIndex + 1) * config.itemSize) -1;
        if(end === 0 )  end = config.itemSize;
        if(end >= arr.length ) end = arr.length - 1;

        let result = [];
        for(let i = start; i <= end; ++i){
            if( arr[i]) {
                result.push(arr[i]);
            }
        }
        if(result.length != 0 && config.progressing)
            packer.progressIndex++;

        return result;
    }

    storeIterator(key, item){
        const storeMap = this._inBoundPacker.get(key).store;
        if(storeMap.size == 0){
            item(null, null);
        }
        else{
            for(let it in storeMap){
                item(it[0], it[1]);
            }
        }
    }

    getProgress(key){
        let progress = 0;
        let hasPacker = this._inBoundPacker.has(key);
        if(hasPacker){
            progress = this._inBoundPacker.get(key).progressIndex;
        }
        return progress;
    }

    packerClear(){
        this._inBoundPacker.clear();
        this._restBinderConfig.clear();
    }
    
    static RestBinderConfig = {
        key : "",
        RequestType : HTTP.RequestType,
        itemSize : 0,
        packageLoc : "",
        progressing : true
    }

    static ERBCPackageLoc = {
        client : "client",
        server : "server"
    }

    
}   