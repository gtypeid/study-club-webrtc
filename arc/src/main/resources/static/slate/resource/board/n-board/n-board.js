
import WidgetResource from "../../../js/doc/WidgetResource.js";
import DocEventHandler from "../../../js/comp/DocEventHandler.js";
import DocEngine from "../../../js/doc/DocEngine.js";
import HTTP from "../../../js/doc/HTTP.js";
import * as Util from "../../../js/doc/Util.js";


const session = "user-session";
const frame = "frame";
const deleteButton = "delete-button";

export default class NBoard extends WidgetResource {
    constructor(cwrd){
        super(cwrd);  
        this._eventHandler;  

        this._entityData;

        this._userNameElement;
        this._popBoxElement;
        this._deleteSpan0;
        this._deleteSpan1;
    }


    rConstructor(){
        super.rConstructor();

        this._eventHandler = this.addComp(DocEventHandler);
        this._eventHandler.bindEvent(DocEventHandler.EEvent.MOUSE_ENTER, frame);
        this._eventHandler.bindEvent(DocEventHandler.EEvent.MOUSE_LEAVE, frame);

        this._eventHandler.bindEvent(DocEventHandler.EEvent.MOUSE_ENTER, deleteButton);
        this._eventHandler.bindEvent(DocEventHandler.EEvent.MOUSE_LEAVE, deleteButton);

        this._eventHandler.bindEvent(DocEventHandler.EEvent.CLICK, frame);
        this._eventHandler.bindEvent(DocEventHandler.EEvent.CLICK, deleteButton);

        this._userNameElement = this.findElements("user-name-p")[0];
        this._popBoxElement = this.findElements("pop-box")[0];
        this._deleteSpan0 = this.findElements("delete-button-span0")[0];
        this._deleteSpan1 = this.findElements("delete-button-span1")[0];
    }

    entityBind(entityData){
        this._entityData = entityData;

        const item = this._entityData.item;
        const userNameP = this.findElements("user-name-p")[0];
        const timeP = this.findElements("time-p")[0];
        const contentTitle = this.findElements("content-title")[0];
        const contentP = this.findElements("content-multiple-p")[0];
        
        userNameP.innerHTML =  item.owner;
        timeP.innerHTML = item.mdate;
        contentTitle.innerHTML = item.title;
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

    click(target, event){
        event.stopPropagation();

        const className = target.className;
        const keyFrameType = this.key.concat('-', frame);
        const keyDeleteButtonType = this.key.concat('-', deleteButton);

        if(className === keyFrameType){
            this.clickNBoard();
        }
        else if(className === keyDeleteButtonType){
            this.clickDeleteButton();
        }
    }

    clickNBoard(){
        const htmlPipeLine = DocEngine.instance.htmlPipeLine;
        const result = htmlPipeLine.isGetWidgets("main-view");
        if(result.isValid){
            const mainView = result.widget.widgetResource;
            const boardView = mainView.boardView;
            boardView.open(this._entityData.item);
        }
    }

    clickDeleteButton(){
        const { widgetKey, comp, item } = this._entityData;
        const http = DocEngine.instance.http;
        const   requestType = {...HTTP.RequestType};
                requestType.URL = "http://localhost:8081/board-delete/"
                                + item.uuid;
                        
                requestType.method = HTTP.ERequestMethod.POST;
                requestType.responseType = HTTP.EResponseType.JSON;
                requestType.body = JSON.stringify(item);

        http.doRequest(requestType, (response)=>{
            console.log(response);
            const { msg, statusCode, data } = response;
            if(statusCode == 200){
                comp.entitiyDelete(widgetKey, this.uIndex);
            }
        });
    }

    mouseEnter(target, event){

        const keyFrame = this.key.concat('-', frame);
        const keyDeleteButton = this.key.concat('-', deleteButton);
        
        if(target.classList.contains(keyFrame)){
            const cookieSession = Util.getCookie(session);
            if(!Util.isEmpty(cookieSession)){
                const userNameP = this._userNameElement.innerHTML;
                const sessionObject = JSON.parse(cookieSession);
                if(userNameP === sessionObject.id){
                    this._popBoxElement.style.display = "block";
                }
            }
        }

        if(target.classList.contains(keyDeleteButton)){
            this._deleteSpan0.style.backgroundColor = "red";
            this._deleteSpan1.style.backgroundColor = "red";
        }
    }

    mouseLeave(target, event){
        const keyFrame = this.key.concat('-', frame);
        const keyDeleteButton = this.key.concat('-', deleteButton);

        if(target.classList.contains(keyFrame)){
            this._popBoxElement.style.display = "none";
        }

        if(target.classList.contains(keyDeleteButton)){
            this._deleteSpan0.style.backgroundColor = "rgba(255,0,0,0.15)";  
            this._deleteSpan1.style.backgroundColor = "rgba(255,0,0,0.15)";
        }
    }

    get entityData(){
        return this._entityData;
    }
}
