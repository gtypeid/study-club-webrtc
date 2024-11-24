
import DocEngine from "../doc/DocEngine.js";
import HTMLPipeLine from "../doc/HTMLPipeLine.js";
import Component from "./Component.js";

export default class EntityGenerator extends Component{
    constructor(parent){
        super(parent);
        this._resourceStore = new Map();
    }

    makeElements(attachment, widgetKey, items){
        const hasKey = this._resourceStore.get(widgetKey);
        if(!hasKey){
            this._resourceStore.set(widgetKey, new Map());
        }
        
        const htmlPipeLine = DocEngine.instance.htmlPipeLine;
        const wr = this.parent;
        const attachElement = wr.findElements(attachment)[0];

        if(attachElement){
            for(let i = 0; i < items.length; ++i){
                htmlPipeLine.runTimeSpawnWidget(attachElement, widgetKey, (widget)=>{
                    const wr = widget.widgetResource;
                    this._resourceStore.get(widgetKey).set(wr.uIndex, wr);

                    const entityData = {
                        widgetKey : widgetKey,
                        comp : this,
                        item : items[i]
                    }
                    wr.entityBind(entityData);
                });
            }
        }
        else{
            console.error("ERROR : NOT FUNOD ATTACH ELEMENT : ", this._parent.key)
        }
    }

    clearWidgets(widgetKey){
        const hasKey = this._resourceStore.has(widgetKey);
        if(!hasKey) return;
        
        const htmlPipeLine = DocEngine.instance.htmlPipeLine
        const store = this._resourceStore.get(widgetKey);

        for(let it of store){
            const widget = it[1].widget;
            htmlPipeLine.destroy(widget);
        }

        this._resourceStore.delete(widgetKey);
    }

    entitiyDelete(widgetKey, uIndex){
        const htmlPipeLine = DocEngine.instance.htmlPipeLine
        const result = this.isGetEntitiy(widgetKey, uIndex);
        if( result.isValid ){
            const wr = result.widgetResource;
            if ( htmlPipeLine.destroy(wr.widget) ){
                this._resourceStore.get(widgetKey).delete(uIndex);
            }
        }

    }

    isGetEntitiy(widgetKey, uIndex){
        let result = {
            isValid : false,
            widgetResource : null, 
        }

        const store = this._resourceStore.get(widgetKey);
        const hasItem = store.has(uIndex);
        if(hasItem){
            result.isValid = true;
            result.widgetResource = store.get(uIndex);
        }
        else{
            result.isValid = false;
        }

        return result;
    }
    
    getStore(widgetKey){
        return this._resourceStore.get(widgetKey);
    }
}   