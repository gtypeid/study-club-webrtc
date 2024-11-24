import WidgetResource from "../../../js/doc/WidgetResource.js";
import RestBinder from "../../../js/comp/RestBinder.js"
import EntityGenerator from "../../../js/comp/EntityGenerator.js"
import HTTP from "../../../js/doc/HTTP.js";
import DocEventHandler from "../../../js/comp/DocEventHandler.js";
import DocEngine from "../../../js/doc/DocEngine.js";
import * as Util from "../../../js/doc/Util.js";

const menuItemView = "menuItemView"
const backButton = "back-button";
const plusButton = "plus-button";

export default class MenuItemView extends WidgetResource{
    constructor(cwrd){
        super(cwrd); 
        this._restBinder;
        this._generator;
        this._eventHandler;
        this._sellerMenuRegisterView;
        this._buyerMenuOrderBox;
        this._storeObject;
    }

    rConstructor(){
        super.rConstructor();
        this._restBinder = this.addComp(RestBinder);
        this._generator = this.addComp(EntityGenerator);
        this._eventHandler = this.addComp(DocEventHandler);
        this._eventHandler.bindEvent(DocEventHandler.EEvent.CLICK, backButton);

        if(Util.getSubID() === "buyer"){
            const buttonPlus = this.findElements(plusButton)[0];
            buttonPlus.style.display = "none";
        }
        else{
            this._eventHandler.bindEvent(DocEventHandler.EEvent.CLICK, plusButton);
        }
    }

    menuItemDoRequest(storeUUID){
        this.visible(true);
        this.doClear();
        this._restBinder.bindConfig( this.getMenuItemViewConfig(storeUUID) );
        this.doSend();
    }

    getMenuItemViewConfig(storeUUID){
        const   requestType = {...HTTP.RequestType };
                requestType.method = HTTP.ERequestMethod.GET;
                requestType.URL = "http://localhost:8082/store-menus/"
                                + storeUUID;
                requestType.responseType = HTTP.EResponseType.JSON;

        const   config = {...RestBinder.RestBinderConfig };
                config.key = menuItemView;
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

    doClear(){
        this._generator.clearWidgets("menu-item");
        this._restBinder.packerClear();
    }

    doSend(){
        this._restBinder.send(menuItemView, (items)=>{
            console.log(items);
            this._generator.makeElements("container", "menu-item", items);
        });
    }

    click(target, event){
        const buttonBack = this.key.concat('-', backButton);
        const buttonPlus = this.key.concat('-', plusButton);

        if( target.classList.contains(buttonBack) ) 
            this.visible(false);

        if( target.classList.contains(buttonPlus) ) 
            this.visibleSellerMenuRegisterView();
    }

    async menuItemSelect(target, menuData){
        if(Util.getSubID() === "buyer"){
            const buyerMenuOrderBox = await this.spawnBuyerMenuOrderBox();
            buyerMenuOrderBox.visible(true);
            buyerMenuOrderBox.update(this._storeObject, menuData);
        }
    }

    visible(value){
        const frame = this.findElements("frame")[0];
        frame.style.display = (value) ? "block" : "none";
    }

    async visibleSellerMenuRegisterView(){
        const view = await this.spawnSellerMenuRegisterView();
        view.visible(true);
    }

    async spawnSellerMenuRegisterView(){
        const htmlPipeLine = DocEngine.instance.htmlPipeLine;
        if(!this._sellerMenuRegisterView){
            const frame = this.findElements("frame")[0];
            const widget = await htmlPipeLine.asyncRunTimeSpawnWidget(frame, "seller-menu-register-view");
            this._sellerMenuRegisterView = widget.widgetResource;
        }
        return this._sellerMenuRegisterView;
    }

    async spawnBuyerMenuOrderBox(){
        const htmlPipeLine = DocEngine.instance.htmlPipeLine;
        if(!this._buyerMenuOrderBox){
            const frame = this.findElements("frame")[0];
            const widget = await htmlPipeLine.asyncRunTimeSpawnWidget(frame, "buyer-menu-order-box");
            this._buyerMenuOrderBox = widget.widgetResource;
        }
        return this._buyerMenuOrderBox;
    }

    bindStoreObject(storeObject){
        this._storeObject = storeObject;
    }

    get storeObject(){
        return this._storeObject;
    }
}