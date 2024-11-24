
import WidgetResource from "../../../js/doc/WidgetResource.js";
import DocEngine from "../../../js/doc/DocEngine.js";
import HTTP from "../../../js/doc/HTTP.js";
import * as Util from "../../../js/doc/Util.js";

export default class MainView extends WidgetResource{
    constructor(cwrd){
        super(cwrd);   
        this._intro;
        this._backBoard;
        this._buyerMyBox;
        this._buyerStoreItemView;
        this._sellerStoreRegisterView;
        this._sellerManagerView;
        this._menuItemView;
        this._orderItemView;
    }

    rConstructor(){
        super.rConstructor();
        this.spawnIntroWidget();
        this.spawnBackBoardWidget();
    }


    async spawnIntroWidget(){
        const htmlPipeLine = DocEngine.instance.htmlPipeLine;
        if(!this._intro){
            const frame = this.findElements("frame")[0];
            const widget = await htmlPipeLine.asyncRunTimeSpawnWidget(frame, "intro");
            this._intro = widget.widgetResource;
        }
        return this._intro;
    }

    async spawnBackBoardWidget(){
        const htmlPipeLine = DocEngine.instance.htmlPipeLine;
        if(!this._backBoard){
            const frame = this.findElements("frame")[0];
            const widget = await htmlPipeLine.asyncRunTimeSpawnWidget(frame, "back-board");
            this._backBoard = widget.widgetResource;
        }
        return this._backBoard;
    }

    async spawnBuyerMyBoxWidget(){
        const htmlPipeLine = DocEngine.instance.htmlPipeLine;
        if(!this._buyerMyBox){
            const frame = this.findElements("frame")[0];
            const widget = await htmlPipeLine.asyncRunTimeSpawnWidget(frame, "buyer-my-box");
            this._buyerMyBox = widget.widgetResource;
        }
        return this._buyerMyBox;
    }

    async spawnBuyerStoreItemViewWidget(){
        const htmlPipeLine = DocEngine.instance.htmlPipeLine;
        if(!this._buyerStoreItemView){
            const frame = this.findElements("frame")[0];
            const widget = await htmlPipeLine.asyncRunTimeSpawnWidget(frame, "buyer-store-item-view");
            this._buyerStoreItemView = widget.widgetResource;
        }
        return this._buyerStoreItemView;
    }

    async spawnSellerStoreRegisterViewWidget(){
        const htmlPipeLine = DocEngine.instance.htmlPipeLine;
        if(!this._sellerStoreRegisterView){
            const frame = this.findElements("frame")[0];
            const widget = await htmlPipeLine.asyncRunTimeSpawnWidget(frame, "seller-store-register-view");
            this._sellerStoreRegisterView = widget.widgetResource;
        }
        return this._sellerStoreRegisterView;
    }

    async spawnSellerManagerViewWidget(storeObject){
        const htmlPipeLine = DocEngine.instance.htmlPipeLine;
        if(!this._sellerManagerView){
            const frame = this.findElements("frame")[0];
            const widget = await htmlPipeLine.asyncRunTimeSpawnWidget(frame, "seller-manager-view");
            this._sellerManagerView = widget.widgetResource;
        }
        this._sellerManagerView.bindStoreObject(storeObject);
        return this._sellerManagerView;
    }

    async spawnMenuItemView(storeItemData){
        const htmlPipeLine = DocEngine.instance.htmlPipeLine;
        if(!this._menuItemView){
            const frame = this.findElements("frame")[0];
            const widget = await htmlPipeLine.asyncRunTimeSpawnWidget(frame, "menu-item-view");
            this._menuItemView = widget.widgetResource;
        }
        this._menuItemView.bindStoreObject(storeItemData);
        return this._menuItemView;
    }

    async spawnOrderItemViewWidget(){
        const htmlPipeLine = DocEngine.instance.htmlPipeLine;
        if(!this._orderItemView){
            const frame = this.findElements("frame")[0];
            const widget = await htmlPipeLine.asyncRunTimeSpawnWidget(frame, "order-item-view");
            this._orderItemView = widget.widgetResource;
        }
        return this._orderItemView;
    }

    visibleLoginView(value){
        this._backBoard.visibleLoginView(value);
    }

    async storeItemViewRequest(activeFoodCategoryData){
        const widget = await this.spawnBuyerStoreItemViewWidget();
        widget.storeItemDoRequest(activeFoodCategoryData);
    }

    async menuItemViewRequest(storeItemData){
        const storeUUID = storeItemData.uuid;
        const widget = await this.spawnMenuItemView(storeItemData);
        widget.menuItemDoRequest(storeUUID);
    }

    async orderItemViewRequest(){
        const widget = await this.spawnOrderItemViewWidget();
        widget.orderItemViewDoRequest();
    }

    completeIntro(){
        const cookieSession = Util.getBMCookie();
        if(!Util.isEmpty(cookieSession)){
            this._intro.visible(false);
            this.visibleLoginView(false);
            this.contentsLoad();
        }
    }

    contentsLoad(){
        const subID = Util.getSubID();
        if(subID === "buyer"){
            this.spawnBuyerMyBoxWidget();
        }

        if(subID === "seller"){
            this.checkSellerStore();
        }

        if(subID === "order"){
            this.orderItemViewRequest();
        }
    }

    checkSellerStore(){
        const http = DocEngine.instance.http;
        const cookieSession = Util.getBMCookie();
        const sessionObject = JSON.parse( cookieSession );

        const   requestType = {...HTTP.RequestType};
                requestType.URL =   "http://localhost:8082/store/"
                                    + sessionObject.uuid;
                requestType.method = HTTP.ERequestMethod.GET;
                requestType.responseType = HTTP.EResponseType.JSON;

        http.doRequest(requestType, (response) => {
            const { msg, statusCode, data } = response;
            if (statusCode == 200) {
                const storeObject = JSON.parse(data); 
                this.spawnSellerManagerViewWidget(storeObject);
            }
            else{
                this.spawnSellerStoreRegisterViewWidget();
            }
        });
    }

    get intro(){
        return this._intro;
    }

    get backBoard(){
        return this._backBoard;
    }

    get buyerMyBox(){
        return this._buyerMyBox;
    }
}