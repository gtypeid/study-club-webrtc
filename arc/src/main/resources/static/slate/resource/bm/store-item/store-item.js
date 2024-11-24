import WidgetResource from "../../../js/doc/WidgetResource.js";
import DocEventHandler from "../../../js/comp/DocEventHandler.js";
import DocEngine from "../../../js/doc/DocEngine.js";
import HTTP from "../../../js/doc/HTTP.js";
import * as Util from "../../../js/doc/Util.js";

export default class StoreItem extends WidgetResource{
    constructor(cwrd){
        super(cwrd);   
        this._entityData;
        this._eventHandler;
    }

    rConstructor(){
        super.rConstructor();       
        this._eventHandler = this.addComp(DocEventHandler);
        this._eventHandler.bindEvent(DocEventHandler.EEvent.CLICK, "box-wrap");
    }

    entityBind(entityData){
        this._entityData = entityData;
        const item = this._entityData.item;

        const eleTitle = this.findElements("title")[0];
        const eleComments = this.findElements("comments")[0];

        eleTitle.innerHTML = item.title;
        eleComments.innerHTML = item.comments;

        this.updateLogo(item.logo);
    }

    updateLogo(logoUUID){
        const   http = DocEngine.instance.http;
        const   requestType = {...HTTP.RequestType};
                requestType.URL = "http://localhost:8082/seller-file/"
                                + logoUUID;
            
                requestType.method = HTTP.ERequestMethod.GET;
                requestType.responseType = HTTP.EResponseType.Blob;

        http.doRequest(requestType, (response) => {
            if(!Util.isEmpty(response)){
                const url = URL.createObjectURL(response);
                const eleImg = this.findElements("img")[0];
                eleImg.src = url;
            }
        });
    }

    click(target, event){
        const comp = this._entityData.comp;
        const parent = comp.parent;
        const wr = parent.widget.widgetResource;
        wr.storeItemSelect(target, this._entityData.item);
    }

}