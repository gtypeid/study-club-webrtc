
import WidgetResource from "../../../js/doc/WidgetResource.js";
import RestBinder from "../../../js/comp/RestBinder.js"
import EntityGenerator from "../../../js/comp/EntityGenerator.js"
import HTTP from "../../../js/doc/HTTP.js";
import DocEventHandler from "../../../js/comp/DocEventHandler.js";
import DocEngine from "../../../js/doc/DocEngine.js";
import * as Util from "../../../js/doc/Util.js";

const orderItemView = "orderItemView"
const backButton = "back-button";

export default class OrderItemView extends WidgetResource{
    constructor(cwrd){
        super(cwrd); 
        this._eventHandler;
        this._restBinder;
        this._generator;
        this._sellerManagerView;
        this._orderMatchMenus;
    }

    rConstructor(){
        super.rConstructor();
        this._restBinder = this.addComp(RestBinder);
        this._generator = this.addComp(EntityGenerator);
        this._eventHandler = this.addComp(DocEventHandler);
        this._eventHandler.bindEvent(DocEventHandler.EEvent.CLICK, backButton);
        this._eventHandler.bindEvent(DocEventHandler.EEvent.SCROLL, "container");

        if (Util.getSubID() === "seller")
            this.getOrderMatchMenus();
    }

    click(target, event){
        const buttonBack = this.key.concat('-', backButton);

        if( target.classList.contains(buttonBack) ) {

            if(Util.getSubID() === "order"){
                this.orderItemViewDoRequest();
            }
            else{
                this.visible(false);
            }
        }


    }

    orderItemSelect(target, orderData, orderItemEntity){
        const http = DocEngine.instance.http;
        const orderUUID = orderData.uuid;

        const   requestType = {...HTTP.RequestType };
        requestType.method = HTTP.ERequestMethod.GET;
        requestType.URL = "http://localhost:8083/order-response/"
                    + orderUUID;
        requestType.responseType = HTTP.EResponseType.JSON;

        http.doRequest(requestType, (response)=>{
            const { msg, statusCode, data } = response;
            if(statusCode == 201){
                const object = JSON.parse(data);
                orderItemEntity.setBmElements(object);
            }
        });
    }

    orderItemViewDoRequest(){
        this.visible(true);
        this.doClear();
        this._restBinder.bindConfig( this.getOrderItemViewConfig() );
        this.doSend();
    }

    visible(value){
        const frame = this.findElements("frame")[0];
        frame.style.display = (value) ? "block" : "none";
    }

    scroll(target, event){
        const pes = Util.getScrollPes(target)
        const div = 98.0;
        if(pes >= div){
            this.doSend();
        }
    }

    doClear(){
        this._generator.clearWidgets("order-item");
        this._restBinder.packerClear();
    }

    doSend(){
        this._restBinder.send(orderItemView, (items)=>{
            this._generator.makeElements("container", "order-item", items);
        });
    }


    getOrderItemViewConfig(){
        const   requestType = this.getBMOrderRequest();
        const   config = {...RestBinder.RestBinderConfig };
                config.key = orderItemView;
                config.RequestType = requestType;
                config.itemSize = 9;
                config.packageLoc = RestBinder.ERBCPackageLoc.client;
                config.progressing = true;
                
        return config;
    }


    getBMOrderRequest(){
        if(Util.getSubID() === "order"){
            const   requestType = {...HTTP.RequestType };
            requestType.method = HTTP.ERequestMethod.GET;
            requestType.URL = "http://localhost:8083/orders";
            requestType.responseType = HTTP.EResponseType.JSON;
            return requestType;
        }

        if(Util.getSubID() === "seller"){
            const sellerManagerView = this.getSellerManagerView();
            const storeObject = sellerManagerView.storeObject;
            const sellerUUID = storeObject.ownerSellerUuid;

            const   requestType = {...HTTP.RequestType };
            requestType.method = HTTP.ERequestMethod.GET;
            requestType.URL = "http://localhost:8083/order/"
                        + sellerUUID;
            requestType.responseType = HTTP.EResponseType.JSON;
            return requestType;
        }
    }

    getSellerManagerView(){
        if(this._sellerManagerView){
            return this._sellerManagerView;
        }
        else{
            const htmlPipeLine = DocEngine.instance.htmlPipeLine;
            const result = htmlPipeLine.isGetWidgets("seller-manager-view");
            if(result.isValid){
                const widget = result.widget.widgetResource;
                this._sellerManagerView = widget;
                return this._sellerManagerView;
            }
        }
        return null;
    }

    getOrderMatchMenus(){
        if(this._orderMatchMenus){
            return this._orderMatchMenus;
        }
        else{
            const http = DocEngine.instance.http;
            const sellerManagerView = this.getSellerManagerView();
            const storeObject = sellerManagerView.storeObject;
            const storeUUID = storeObject.uuid;

            const   requestType = {...HTTP.RequestType };
            requestType.method = HTTP.ERequestMethod.GET;
            requestType.URL = "http://localhost:8082/store-menus/"
                                + storeUUID;

            requestType.responseType = HTTP.EResponseType.JSON;
            http.doRequest(requestType, (response)=>{
                const { msg, statusCode, data } = response;
                this._orderMatchMenus = response;
            });
        }
        return null;
    }

    getMenuTitle(menuUUID){
        if(this._orderMatchMenus){
            for(let it of this._orderMatchMenus){
                if(it.uuid === menuUUID){
                    return it.title;
                }
            }
        }
        return null;
    }
}