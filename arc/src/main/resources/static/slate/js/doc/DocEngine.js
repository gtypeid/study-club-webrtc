
import HTMLPipeLine from "./HTMLPipeLine.js";
import HTTP from "./HTTP.js";
import DataGenerator from "./DataGenerator.js";

let docEngineInstance;

export default class DocEngine{

    constructor(){
        if(docEngineInstance)
            return DocEngine.instance;
        
        this._slateMap;
        this._htmlPipeLine = new HTMLPipeLine();    
        this._dataGenerator = new DataGenerator();
        this._http = new HTTP();
        this._common;
    }

    static get instance(){
        if(docEngineInstance == null)   
            docEngineInstance = new DocEngine();

        return docEngineInstance;
    }

    run(slateMap, attachPoint = ""){
        this._slateMap = slateMap;
        this._common = slateMap.getCommon();
        this._common.endPoint = this.slateMap["end-point"];

        let attachElement;
        if(attachPoint === "")  attachElement = document.body;
        else{
            attachElement = document.getElementsByClassName(attachPoint)[0];
            if(attachElement === ""){
                attachElement = document.body;
            }
        }

        this._htmlPipeLine.connectHTML(attachElement);
    }

    get http(){
        return this._http;
    }

    get htmlPipeLine(){
        return this._htmlPipeLine;
    }

    get dataGenerator(){
        return this._dataGenerator;
    }

    get slateMap(){
        return this._slateMap;
    }

    get common(){
        return this._common;
    }

    get endPoint(){
        return this._common.endPoint;
    }
}   