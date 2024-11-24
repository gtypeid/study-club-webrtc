import WidgetResource from "../../../js/doc/WidgetResource.js";
import DocEventHandler from "../../../js/comp/DocEventHandler.js";
import ImgDragBox from "../../../js/comp/ImgDragBox.js"
import Menu from "../../../js/data/bm/Menu.js";
import DocEngine from "../../../js/doc/DocEngine.js";
import HTTP from "../../../js/doc/HTTP.js";
import * as Util from "../../../js/doc/Util.js";

const backButton = "back-button";
const registerButton = "menu-box-button-h";

export default class SellerMenuRegisterView extends WidgetResource{
    constructor(cwrd){
        super(cwrd);   
        this._eventHandler;
        this._imgDragBox;
        this._sellerManagerView;
    }

    rConstructor(){
        super.rConstructor();
        this._eventHandler = this.addComp(DocEventHandler);
        this._eventHandler.bindEvent(DocEventHandler.EEvent.CLICK, backButton, this);
        this._eventHandler.bindEvent(DocEventHandler.EEvent.CLICK, registerButton, this);
        this._imgDragBox = this.addComp(ImgDragBox);
        this._imgDragBox.bindImgDragBox("menu-img-box", this._eventHandler, this.getImgBoxConfig());
    }

    click(target, event){
        const buttonBack = this.key.concat('-', backButton);
        const buttonRegister = this.key.concat('-', registerButton);

        if( target.classList.contains(buttonBack) ) 
            this.visible(false);

        if( target.classList.contains(buttonRegister) ) 
            this.registerMenu();
    }

    registerMenu(){
        const titleInput = this.findElements("menu-title-input")[0];
        const comentsInput = this.findElements("menu-comments-input")[0];
        const priceInput = this.findElements("menu-price-input")[0];

        const cookieSession = Util.getBMCookie();
        const blob = this._imgDragBox.activeBlob;

        const isInputValue = !Util.isEmpty(titleInput.value);
        const isComentsValue = !Util.isEmpty(comentsInput.value);
        const isPriceValue = !Util.isEmpty(priceInput.value);

        const isLoginSession = !Util.isEmpty(cookieSession);
        const isBlob = !Util.isEmpty(blob);

        if( isInputValue && isComentsValue && isPriceValue && isLoginSession && isBlob ){
            this.sendMenuRegister(titleInput.value, comentsInput.value, priceInput.value, blob);
        }
        else{
            console.error("INPUT EMPTY");
        }
    }

    sendMenuRegister(title, coments, price, blob){
        const http = DocEngine.instance.http;
        const sellerManagerView = this.getSellerManagerView();
        const storeObject = sellerManagerView.storeObject;

        const newMenu = new Menu().set(storeObject.uuid, title, coments, price);
        const requestType = { ...HTTP.RequestType };
        requestType.URL = "http://localhost:8082/store-menus/"
                        + storeObject.uuid;

        requestType.method = HTTP.ERequestMethod.POST;
        requestType.responseType = HTTP.EResponseType.JSON;
        requestType.body = JSON.stringify(newMenu);

        http.doRequest(requestType, (response)=>{
            console.log(response);
            const { msg, statusCode, data } = response;
            if(statusCode == 201){
                this.sendMenuImg(data, blob);
            }
        });
    }

    sendMenuImg(responseMenuJson, blob){
        const http = DocEngine.instance.http;
        const menu = JSON.parse(responseMenuJson);
        console.log(menu);

        const requestType = { ...HTTP.RequestType };
        requestType.URL = "http://localhost:8082/menu-img/"
                        + menu.uuid;

        requestType.method = HTTP.ERequestMethod.POST;
        requestType.acceptHeader = "image";
        requestType.responseType = HTTP.EResponseType.JSON;
        requestType.body = blob;
        http.doRequest(requestType, (response)=>{
            console.log(response);
            const { msg, statusCode, data } = response;
            if(statusCode == 201){
                this.completeRegMenuAndImg();
            }
        });
    }

    completeRegMenuAndImg(){
        this.visible(false);
        this._sellerManagerView.requestMenuItemView();
    }

    visible(value){
        const frame = this.findElements("frame")[0];
        frame.style.display = (value) ? "block" : "none";

        if(!value){
            this.clearInputs();
        }
    }

    clearInputs(){

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

    getImgBoxConfig(){
        const config = { ...ImgDragBox.ImgDragBoxConfig };
        config.maxSize = 150;

        return config;
    }
}