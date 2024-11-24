import WidgetResource from "../../../js/doc/WidgetResource.js";
import DocEventHandler from "../../../js/comp/DocEventHandler.js";
import HTTP from "../../../js/doc/HTTP.js";
import Order from "../../../js/data/bm/Order.js";
import DocEngine from "../../../js/doc/DocEngine.js";
import * as Util from "../../../js/doc/Util.js";

const commitButton = "commit-button";
const cancelButton = "cancel-button";

export default class BuyerMenuOrderBox extends WidgetResource{
    constructor(cwrd){
        super(cwrd);   
        this._eventHandler;
        this._activeStoreObjectData;
        this._activeMenuData;
    }

    rConstructor(){
        super.rConstructor();
        this._eventHandler = this.addComp(DocEventHandler);
        const eh = this._eventHandler;
        eh.bindEvent(DocEventHandler.EEvent.CLICK, commitButton);
        eh.bindEvent(DocEventHandler.EEvent.CLICK, cancelButton);
    }

    visible(value){
        const frame = this.findElements("frame")[0];
        frame.style.display = (value) ? "block" : "none";
    }

    update(storeObjectData, menuData){
        this._activeStoreObjectData = storeObjectData;
        this._activeMenuData = menuData;

        const eleValues = this.findElements("value-h");
        eleValues[0].innerHTML = storeObjectData.title;
        eleValues[1].innerHTML = menuData.title;
        eleValues[2].innerHTML = menuData.price.toLocaleString() + "원";
    }

    click(target, event){

        const buttonCommit = this.key.concat('-', commitButton);
        const buttonCancel = this.key.concat('-', cancelButton);
        const cookieSession = Util.getBMCookie();

        if(!Util.isEmpty(cookieSession)){
            if( target.classList.contains(buttonCommit) ){
                this.requestOrder();
            }
        }

        if( target.classList.contains(buttonCancel) ){
            this.visible(false);
        }       
    }

    getOrder(){
        const cookieSession = Util.getBMCookie();
        const sessionObject = JSON.parse( cookieSession );

        const buyerUUID = sessionObject.uuid;
        const sellerUUID = this._activeStoreObjectData.ownerSellerUuid;
        const storeUUID = this._activeStoreObjectData.uuid;
        const menuUUID = this._activeMenuData.uuid;

        const order = new Order();
        order.set(
            buyerUUID,
            sellerUUID,
            storeUUID,
            menuUUID
        )
        return order;
    }

    requestOrder(){
        const http = DocEngine.instance.http;

        const   order = this.getOrder();
        const   requestType = {...HTTP.RequestType};
        requestType.URL =   "http://localhost:8083/orders";
        requestType.method = HTTP.ERequestMethod.POST;
        requestType.responseType = HTTP.EResponseType.JSON;
        requestType.body = JSON.stringify(order);

        http.doRequest(requestType, (response)=>{
            console.log(response);
            const { msg, statusCode, data } = response;
            if(statusCode == 201){

            }
        });
    }
}