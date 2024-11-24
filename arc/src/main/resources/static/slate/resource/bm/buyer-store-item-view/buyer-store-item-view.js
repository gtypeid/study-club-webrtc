import WidgetResource from "../../../js/doc/WidgetResource.js";
import DocEventHandler from "../../../js/comp/DocEventHandler.js";
import RestBinder from "../../../js/comp/RestBinder.js"
import EntityGenerator from "../../../js/comp/EntityGenerator.js"
import HTTP from "../../../js/doc/HTTP.js";
import DocEngine from "../../../js/doc/DocEngine.js";
import * as Util from "../../../js/doc/Util.js";

const buyerStoreItemView = "buyerStoreItemView"

export default class BuyerStoreItemView extends WidgetResource{
    constructor(cwrd){
        super(cwrd);   
        this._eventHandler;  
        this._restBinder;
        this._generator;
        this._mainView;
    }

    rConstructor(){
        super.rConstructor();
        this._eventHandler = this.addComp(DocEventHandler);
        this._restBinder = this.addComp(RestBinder);
        this._generator = this.addComp(EntityGenerator);
        this._eventHandler.bindEvent(DocEventHandler.EEvent.SCROLL, "container");
    }

    storeItemDoRequest(activeFoodCategoryData){
        const category = activeFoodCategoryData.category;

        this.doClear();
        this._restBinder.bindConfig( this.getStoreItemViewConfig(category) );
        this.doSend();
    }

    doClear(){
        this._generator.clearWidgets("store-item");
        this._restBinder.packerClear();
    }

    getStoreItemViewConfig(category){
        const   requestType = {...HTTP.RequestType };
                requestType.method = HTTP.ERequestMethod.GET;
                requestType.URL = "http://localhost:8082/seller-stores/"
                                + category;
                requestType.responseType = HTTP.EResponseType.JSON;

        const   config = {...RestBinder.RestBinderConfig };
                config.key = buyerStoreItemView;
                config.RequestType = requestType;
                config.itemSize = 9;
                config.packageLoc = RestBinder.ERBCPackageLoc.client;
                config.progressing = true;
                
        return config;
    }

    scroll(target, event){
        const pes = Util.getScrollPes(target)
        const div = 98.0;
        if(pes >= div){
            this.doSend();
        }
    }

    doSend(){
        this._restBinder.send(buyerStoreItemView, (items)=>{
            console.log(items);
            this._generator.makeElements("container", "store-item", items);
        });
    }

    storeItemSelect(target, storeItemData){
        const mainView = this.getMainView();
        mainView.menuItemViewRequest(storeItemData);
    }

    getMainView(){
        if(this._mainView){
            return this._mainView;
        }
        else{
            const htmlPipeLine = DocEngine.instance.htmlPipeLine;
            const result = htmlPipeLine.isGetWidgets("main-view");
            if(result.isValid){
                const widget = result.widget.widgetResource;
                this._mainView = widget;
                return this._mainView;
            }
        }
        return null;
    }
}