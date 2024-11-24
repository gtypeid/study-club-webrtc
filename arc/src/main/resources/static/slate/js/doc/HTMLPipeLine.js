
import DocEngine from "./DocEngine.js";
import HTTP from "./HTTP.js";
import Widget from "./Widget.js";

import * as Util from "./Util.js";

export default class HTMLPipeLine{
    constructor(){
        this._attachElement;                        // 기본 값 body, 혹은 사용자 정의
        this._docNodeStore = new Map();             // html documnet 최초 로드시 저장하는 html node들
        this._docHtmlResourceStore = new Map();     // html resource (document, css, js) stroe
        this._widgetUCount = -1;                     // 위젯 생성시 일단 한개씩 증가            
        this._widgetStore = new Array();            // 위젯 객체 저장소
    }

    connectHTML(attachElement){
        this._attachElement = attachElement;
        this.serchDocChildNode(this._attachElement);
        this.nodeToResourceMatch();
    }

    serchDocChildNode(target){
        const childNodes = target.childNodes;
        for(let it of childNodes){
            const result = Util.isWidgetAndName(it.nodeName);
            if(result.isWidget){
                this.pushHTMLDocNode(result.wigetName, it);
            }
        }
    }

    pushHTMLDocNode(widgetName, node){
        const hasKey = this._docNodeStore.has(widgetName);
        if(!hasKey) this._docNodeStore.set(widgetName, new Array());

        const cursor = this._docNodeStore.get(widgetName);
        cursor.push(node);
    }

    nodeToResourceMatch(){
        for(let it of this._docNodeStore){
            const key = it[0];
            const value = it[1];
            for(let i = 0; i < value.length; ++i){
                this.getWidgetResource(key, (resource)=>{
                    const widget = this.spawnWidget(resource.key, value[i], i);
                    widget.rendering();
                });
            }
        }
    }

    getWidgetResource(widgetName, resultCB){
        const slateMap = DocEngine.instance.slateMap;
        const wname = widgetName.toLowerCase();

        if(this.isCashDocHtmlResource(wname, resultCB)) return;

        const http = DocEngine.instance.http;


        let defaultPath = window.location.href;
        if(true){
            const protocol = window.location.protocol; // 예: "https:"
            const hostname = window.location.hostname; // 예: "localhost"
            const port = window.location.port; // 예: "8081"
    
            let host = protocol + hostname;
            if (port) {
                host += ':' + port;
            }

            defaultPath = host;
            console.log(defaultPath);
        }

        const path = defaultPath + 
            slateMap["resource-path"].concat('/')
            .concat(slateMap["main-id"]).concat('/')
            .concat(wname).concat('/').concat(wname);
 
        console.log(path);

        const   htmlRequest = {...HTTP.RequestType };
                htmlRequest.method = HTTP.ERequestMethod.GET;
                htmlRequest.acceptHeader = "text/html";
                htmlRequest.responseType = HTTP.EResponseType.Document;
                htmlRequest.URL =  path.concat('.html') ;

        const   cssRequest = {...HTTP.RequestType };
                cssRequest.method = HTTP.ERequestMethod.GET;
                cssRequest.acceptHeader = "text/css";
                cssRequest.responseType = HTTP.EResponseType.Text;
                cssRequest.URL =  path.concat('.css') ;

        const jsURL = path.concat('.js');
        const pHTML = new Promise(resolve => {
            http.doRequest(htmlRequest, (response) => {
                resolve(response);
            });
        });
        const pCSS = new Promise(resolve => {
            http.doRequest(cssRequest, (response) => {
                resolve(response);
            });
        });

        const pJS = import(jsURL).then( (moduel) => {
            return moduel;
        } ) 
        .catch( (err) => { console.error("resource err", err);} );

        Promise.all([pHTML, pCSS, pJS]).then((value) => {
            const promiseResult = {
                document: value[0],
                css: value[1],
                js: value[2]
            };

            this.addDocHtmlResource(wname, promiseResult);
            resultCB(this._docHtmlResourceStore.get(wname));
        });
    }

    async asyncGetWidgetResource(widgetName){
        const result = new Promise(resolve => {
            this.getWidgetResource(widgetName, (resource)=>{
                resolve(resource);
            });
        });
        return result;
    }
    
    spawnWidget(widgetName, node, nodeIndex){
        const   cwd = {...Widget.CWD };
                cwd.uid = crypto.randomUUID();
                cwd.uindex = ++this._widgetUCount;
                cwd.widgetResourceKey = widgetName;
                cwd.widgetNodeIndex = nodeIndex;
                cwd.node = node;

        const widget = new Widget(cwd);
        this._widgetStore.push(widget);
        return widget;
    }

    destroy(widget){
        let flag = false;

        let foundWidget = null;
        let foundIndex = 0;
        for(let it of this._widgetStore){
            if( it.key === widget.key &&
                it.uIndex == widget.uIndex){
                    foundWidget = it;
                    foundIndex = foundIndex;
                    break;
            } 
            ++foundIndex;
        }

        if(foundWidget && foundIndex != -1){
            this._widgetStore.splice(foundIndex, 1);
            foundWidget.destroy();
            foundWidget = null;
            flag = true;
        }
        else{
            console.err(" DESTROY FAIL ");
        }

        // this._docNodeStore
        // this._docHtmlResourceStore 
        // this._widgetUCount         
        return flag;
    }

    runTimeSpawnWidget(attachElement, key, cb){

        const w = "w:";
        const widgetTag = w.concat(key);
        const node = document.createElement(widgetTag);
        attachElement.appendChild(node);

        this.pushHTMLDocNode(key, node);
        const index = this._docNodeStore.get(key).length;
        this.getWidgetResource(key, (resource)=>{
            const widget = this.spawnWidget(resource.key, node, index);
            widget.rendering();
            cb(widget);
        });
    }

    async asyncRunTimeSpawnWidget(attachElement, key){
        const result = new Promise(resolve => {
            this.runTimeSpawnWidget(attachElement, key, widget=>{
                resolve(widget);
            })
        });
        return result;
    }

    addDocHtmlResource(widgetName, response){
        const   resourceData = {...HTMLPipeLine.DocHtmlResource };
                resourceData.key = widgetName;
                resourceData.html = response.document;
                resourceData.css = response.css;
                resourceData.js = response.js;
                resourceData.defindRuleCSS = false;
        
        const hasKey = this._docHtmlResourceStore.has(widgetName);
        if(!hasKey) this._docHtmlResourceStore.set(widgetName, resourceData);
    }

    isDefindRuleCSS(key){
        const target = this._docHtmlResourceStore.get(key);
        return target.defindRuleCSS;
    }

    updateDefindRuleCSS(key){
        let ptr = this._docHtmlResourceStore.get(key);
        ptr.defindRuleCSS = true;
    }

    isCashDocHtmlResource(widgetName, resultCB){
        const hasKey = this._docHtmlResourceStore.has(widgetName);
        if(hasKey)  resultCB(this._docHtmlResourceStore.get(widgetName));
        return hasKey;
    }

    rendering(){
        for(let it of this._widgetStore){
            it.renderingHTML();
        }
    }

    isGetWidgets(widgetKey){
        let resutl = {
            isValid : false,
            widget : null
        };

        for(let it of this._widgetStore){
            if(it.key === widgetKey){
                resutl.isValid = true;
                resutl.widget = it;
                return resutl;
            }
        }

        resutl.isValid = false;
        resutl.widget = null;
        return resutl;
    }

    // GET Document HTML Resource
    getDHR(key){
        let result = {
            isValid : false,
            dhr : null
        }

        const hasKey = this._docHtmlResourceStore.has(key);
        result.isValid = hasKey;
        if(hasKey)  result.dhr = this._docHtmlResourceStore.get(key);

        return result;
    }

    static DocHtmlResource = {
        key : "",
        html : null,
        css : "",
        js : "",
        defindRuleCSS : false
    }

}   