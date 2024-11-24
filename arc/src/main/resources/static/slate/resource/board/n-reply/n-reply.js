

import WidgetResource from "../../../js/doc/WidgetResource.js";
import DocEngine from "../../../js/doc/DocEngine.js";
import HTTP from "../../../js/doc/HTTP.js";
import * as Util from "../../../js/doc/Util.js";

export default class NReply extends WidgetResource {
    constructor(cwrd){
        super(cwrd);  

        this._entityData;
    }

    rConstructor(){
        super.rConstructor();
    }

    entityBind(entityData){
        this._entityData = entityData;

        const item = this._entityData.item;
        const userNameP = this.findElements("user-name-p")[0];
        const timeP = this.findElements("time-p")[0];
        const contentP = this.findElements("content-multiple-p")[0];

        userNameP.innerHTML =  item.owner;
        timeP.innerHTML = item.mdate;
        contentP.innerHTML = item.contents;

        this.updateThumbnail(item.owner);
    }

    updateThumbnail(ownerUserName){
        const http = DocEngine.instance.http;
        const   requestType = {...HTTP.RequestType};
                requestType.URL = "http://localhost:8081/user-profile/"
                                + ownerUserName;
            
                requestType.method = HTTP.ERequestMethod.GET;
                requestType.responseType = HTTP.EResponseType.Blob;

        http.doRequest(requestType, (response) => {
            if(!Util.isEmpty(response)){
                const url = URL.createObjectURL(response);
                const img = this.findElements("user-thumbnail-img")[0];
                img.src = url;
            }
        });
    }
}