import WidgetResource from "../../../js/doc/WidgetResource.js";
import EntityGenerator from "../../../js/comp/EntityGenerator.js";
import DocEventHandler from "../../../js/comp/DocEventHandler.js";
import HTTP from "../../../js/doc/HTTP.js";
import * as FoodCategory from "../../../js/data/bm/FoodCategory.js"
import * as Util from "../../../js/doc/Util.js";
import Store from "../../../js/data/bm/Store.js";
import DocEngine from "../../../js/doc/DocEngine.js";
import ImgDragBox from "../../../js/comp/ImgDragBox.js"

export default class MainView extends WidgetResource{
    constructor(cwrd){
        super(cwrd);   
        this._generator;
        this._eventHandler;
        this._mainView;
        this._imgDragBox;
        this._activeIcon;
        this._activeCategory;
    }

    rConstructor(){
        super.rConstructor();
        this._generator = this.addComp(EntityGenerator);
        this._imgDragBox = this.addComp(ImgDragBox);
        this._eventHandler = this.addComp(DocEventHandler);
        this._eventHandler.bindEvent(DocEventHandler.EEvent.CLICK, "store-box-button", this);
        this._imgDragBox.bindImgDragBox("store-logo-box", this._eventHandler, this.getImgBoxConfig());

        this.spawnFoodIconWidget();
    }

    spawnFoodIconWidget(){
        const items = FoodCategory.getCategoryItem("seller");
        this._generator.makeElements("store-category-icon-box", "food-icon", items );
    }

    foodIconSelect(target, foodIconData){
        if(this._activeIcon){
            this._activeIcon.style.border = "none";
        }
        this._activeIcon = target;
        target.style.border = "solid";
        target.style.borderWidth = "4px";
        target.style.borderColor = "red";

        this._activeCategory = foodIconData.category;
    }

    click(target, event){
        const titleInput = this.findElements("store-title-input")[0];
        const comentsInput = this.findElements("store-comments-input")[0];
        const cookieSession = Util.getBMCookie();
        const blob = this._imgDragBox.activeBlob;

        const isInputValue = !Util.isEmpty(titleInput.value);
        const isComentsValue = !Util.isEmpty(comentsInput.value);
        const isActiveCategory = !Util.isEmpty(this._activeCategory);
        const isLoginSession = !Util.isEmpty(cookieSession);
        const isBlob = !Util.isEmpty(blob);

        if( isInputValue && isComentsValue && isActiveCategory && isLoginSession && isBlob ){
            this.sendStoreRegister(titleInput.value, comentsInput.value, this._activeCategory, cookieSession, blob);
        }
        else{
            console.error("INPUT EMPTY");
        }
    }

    sendStoreRegister(title, coments, activeCategory, cookieSession, blob){
        const http = DocEngine.instance.http;

        const sessionObject = JSON.parse( cookieSession );

        console.log(sessionObject);

        const newStore = new Store().set(sessionObject.uuid, title, coments, activeCategory);
        const requestType = { ...HTTP.RequestType };
        requestType.URL = "http://localhost:8082/store/"
                        + sessionObject.uuid;

        requestType.method = HTTP.ERequestMethod.POST;
        requestType.responseType = HTTP.EResponseType.JSON;
        requestType.body = JSON.stringify(newStore);

        http.doRequest(requestType, (response)=>{
            console.log(response);
            const { msg, statusCode, data } = response;
            if(statusCode == 201){
                this.sendStoreLogo(data, blob);
            }
        });
    }

    sendStoreLogo(responseStoreJson, blob){
        const http = DocEngine.instance.http;
        const store = JSON.parse(responseStoreJson);
        console.log(store);

        const requestType = { ...HTTP.RequestType };
        requestType.URL = "http://localhost:8082/store-logo/"
                        + store.uuid;

        requestType.method = HTTP.ERequestMethod.POST;
        requestType.acceptHeader = "image";
        requestType.responseType = HTTP.EResponseType.JSON;
        requestType.body = blob;
        http.doRequest(requestType, (response)=>{
            console.log(response);
            const { msg, statusCode, data } = response;
            if(statusCode == 201){
                this.completeRegStoreAndLogo();
            }
        });
    }

    completeRegStoreAndLogo(){
        const mainView = this.getMainView();
        const frame = this.findElements("frame")[0];
        frame.style.display = "none";
        mainView.checkSellerStore();
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

    getImgBoxConfig(){
        const config = { ...ImgDragBox.ImgDragBoxConfig };
        config.maxSize = 150;

        return config;
    }

}