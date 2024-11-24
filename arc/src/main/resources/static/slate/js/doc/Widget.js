
import DocEngine from "./DocEngine.js";
import HTMLPipeLine from "./HTMLPipeLine.js";
import WidgetResource from "./WidgetResource.js";

import * as Util from "./Util.js";

export default class Widget{
    constructor(cwd){
        this._cwd = cwd;
        this._isRender = false;
        this._widgetHTML;               // HTML 파일 만
        this._widgetResourceObj;        // resource 파일로부터 읽어온 Object
    }

    static CWD = {
        uid : "",
        uindex : 0,
        widgetResourceKey : "",
        widgetNodeIndex : 0, 
        node : null
    }

    rendering(){
        let isSuccess = true;

        const htmlPipeLine = DocEngine.instance.htmlPipeLine;
        const key = this._cwd.widgetResourceKey;
        const dhrResult = htmlPipeLine.getDHR(key);
        
        if(!dhrResult.isValid){
            console.error("render ERROR : Dcoument HTML Resource : ", key);
            isSuccess = false;
            return isSuccess;
        }

        this.appendHTML(dhrResult, key);
        this.appendCSS(dhrResult, key, htmlPipeLine);
        this.appendJS(dhrResult, key)

        this._isRender = isSuccess;
    }

    appendHTML(dhrResult, key){
        const node = this._cwd.node;
        const { tagName, className, innerHTML } = 
            dhrResult.dhr.html.body.children[0]; // 읽어온 문서 첫번째 요소

        const makeElement = document.createElement(tagName);
        makeElement.className = className;
        makeElement.innerHTML = innerHTML;

        this._widgetHTML = makeElement;
        
        node.appendChild(makeElement);
        const overlap = true;
        if(overlap){
            node.replaceWith(makeElement);
            const className = key;
        }
        Util.sequenceTree(this._widgetHTML, (element) => {
            const makeName = key.concat('-', element.className);
            element.className = makeName;
        });
    }

    appendCSS(dhrResult, key, htmlPipeLine){

        // 동일한 Key Rule CSS 정의 되어 있는지 체크
        if (htmlPipeLine.isDefindRuleCSS(key)) return;

        /* 
            현재 정규식으로 CSS
            class-name{
                property
            }

            class-name
            {
                property
            }

            줄바꿈있으면 인식못함
         */
        const tags = dhrResult.dhr.css.match(/.+{/g);
        const propertys = dhrResult.dhr.css.match(/{([^}]*)}/g);

        for (let i = 0; i < tags.length; ++i) {
            const makeCName = '.'.concat( key, '-', tags[i].substring(1, tags[i].length -1) );
            const makeProperty = makeCName.concat(propertys[i]);
            document.styleSheets[0].insertRule(makeProperty);
        }

        htmlPipeLine.updateDefindRuleCSS(key);
    }

    appendJS(dhrResult, key){
        const moduel = dhrResult.dhr.js;
        if(moduel && moduel.default != null){
            const classType = moduel.default;
            const   cwrd = {...WidgetResource.CWRD };
                    cwrd.parnetWidget = this;
                    cwrd.parnetKey = key;
            this._widgetResourceObj = new classType(cwrd);
        }
        else{
            console.error( ("ERROR : module error : ").concat(key) );
        }
    }

    destroy(){
        this._widgetHTML.remove();
        this._widgetResourceObj = null;
    }


    get key(){
        return this._cwd.widgetResourceKey;
    }
    
    get widgetHTML(){
        return this._widgetHTML;
    }

    get isRender(){
        return this._isRender;
    }

    get widgetResource(){
        return this._widgetResourceObj;
    }

    get widgetNodeIndex(){
        return this._cwd.widgetNodeIndex;
    }

    get uIndex(){
        return this._cwd.uindex;
    }
}   