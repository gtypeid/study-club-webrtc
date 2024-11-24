import WidgetResource from "../../../js/doc/WidgetResource.js";
import DocEventHandler from "../../../js/comp/DocEventHandler.js";
import DocEngine from "../../../js/doc/DocEngine.js";
import * as Util from "../../../js/doc/Util.js";

const menuButton = "menu-button";
const orderButton = "order-button";

export default class SellerManagerView extends WidgetResource{
    constructor(cwrd){
        super(cwrd);   
        this._eventHandler; 
        this._mainView;
        this._storeObject;
    }

    rConstructor(){
        super.rConstructor();
        this._eventHandler = this.addComp(DocEventHandler);
        const eh = this._eventHandler;
        eh.bindEvent(DocEventHandler.EEvent.CLICK, menuButton);
        eh.bindEvent(DocEventHandler.EEvent.CLICK, orderButton);
    }

    bindStoreObject(storeObject){
        this._storeObject = storeObject;
    }

    click(target, event){
        const buttonMenu = this.key.concat('-', menuButton);
        const buttonOrder = this.key.concat('-', orderButton);
        const cookieSession = Util.getBMCookie();
        if(Util.isEmpty(cookieSession)){
            console.error("Login")
            return;
        }

        if( target.classList.contains(buttonMenu) ) {
            this.requestMenuItemView();
        }
        
        if( target.classList.contains(buttonOrder) ){
            this.requestOrderItemView();
        }
    }

    requestMenuItemView(){
        const mainView = this.getMainView();
        mainView.menuItemViewRequest(this._storeObject);
    }

    requestOrderItemView(){
        const mainView = this.getMainView();
        mainView.orderItemViewRequest();
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

    get storeObject(){
        return this._storeObject;
    }
}