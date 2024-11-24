

export default class WidgetResource{

    constructor(cwrd){
        this._cwrd = cwrd;
        this._componentStore = new Map();
        this.rConstructor();

    }

    rConstructor(){
    }


    refresh(){

    }

    findElements(className){
        const key = this._cwrd.parnetKey;
        const parnetWidget = this._cwrd.parnetWidget;
        const widgetHTML = parnetWidget.widgetHTML;
        const makeClassName = key.concat('-', className);
        const result = widgetHTML.getElementsByClassName(makeClassName);
        const arr = Array.from(result);                                     // HTML Collection을 Array로 변환
        const isClass = widgetHTML.classList.contains(makeClassName);    // 존재한다면, 본인 삽입
        if (isClass) {
            arr.splice(0, 0, widgetHTML);
        }
        return arr;
    }

    addComp(component){
        const compName = component.name;
        const hasKey = this._componentStore.has(compName);
        if(!hasKey){
            this._componentStore.set(compName, new Array());
        }
        const newComp = new component(this);
        this._componentStore.get(compName).push(newComp);
        return newComp;
    }

    getComps(component){
        const compName = component.name;
        const hasKey = this._componentStore.has(compName);
        const result = {
            isValid : hasKey,
            comps : null
        }
        if(hasKey)
            result.comps = this._componentStore.get(compName);
    
        return result;
    }

    static CWRD = {
        parnetWidget : null,
        parnetKey : null
    }

    get widget(){
        return this._cwrd.parnetWidget;
    }

    get key(){
        return this._cwrd.parnetKey;
    }

    get uIndex(){
        return this._cwrd.parnetWidget.uIndex;
    }

}