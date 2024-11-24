
import WidgetResource from "../../../js/doc/WidgetResource.js";
import DocEventHandler from "../../../js/comp/DocEventHandler.js";
import EntityGenerator from "../../../js/comp/EntityGenerator.js"
import DocEngine from "../../../js/doc/DocEngine.js";
import HTTP from "../../../js/doc/HTTP.js";
import * as Util from "../../../js/doc/Util.js";
import Reply from "../../../js/data/board/Reply.js";

const session = "user-session";

const closeButton = "window-close-button";
const sendButton = "send-button";

const userNameP = "user-name-p";
const boardTitle = "board-title";
const boardContents = "container-contents"
const replyContainer = "container-replys";

const replyWidgetKey = "n-reply";

export default class BoardView extends WidgetResource {
    constructor(cwrd){
        super(cwrd);

        this._bindBoardData;
        this._frame;
        this._eventHandler;
        this._generator;
    }

    rConstructor(){
        super.rConstructor();
        this._frame = this.findElements("frame")[0];
        this._eventHandler = this.addComp(DocEventHandler);
        this._generator = this.addComp(EntityGenerator);

        const eh = this._eventHandler;
     
        eh.bindEvent(DocEventHandler.EEvent.CLICK, closeButton);
        eh.bindEvent(DocEventHandler.EEvent.CLICK, sendButton);
    }


    click(target, event){

        const className = target.className;
        const keyCloseButton = this.key.concat('-', closeButton);
        const keySendButton = this.key.concat('-', sendButton);

        if(className === keyCloseButton){
            this.close();
        }
        else if(className === keySendButton){
            this.send();
        }

    }

    open(boardData){
        this._bindBoardData = boardData;

        this._frame.style.display = "block";
        const eleUserNameP = this.findElements(userNameP)[0];
        const eleBoardTitle = this.findElements(boardTitle)[0];
        const eleBoardContents = this.findElements(boardContents)[0];
        const eleReplyContainer = this.findElements(replyContainer)[0];

        const { owner, title, contents, uuid } = boardData;

        eleUserNameP.innerHTML = owner;
        eleBoardTitle.innerHTML = title;
        eleBoardContents.innerHTML = contents;     
    
        this.updateThumbnail(owner);

        const http = DocEngine.instance.http;
        const   requestType = {...HTTP.RequestType };
                requestType.method = HTTP.ERequestMethod.GET;
                requestType.URL = "http://localhost:8081/replies/" + uuid;
                requestType.responseType = HTTP.EResponseType.JSON;

        http.doRequest(requestType, (response)=>{
            if (!Util.isEmpty(response)){
                this._generator.makeElements("container-replys", replyWidgetKey, response);
            }
        });
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

    send(){
        const eleInputBox = this.findElements("input-box")[0];
        const eleContainer = this.findElements("container")[0];

        const value = eleInputBox.value;
        const cookieSession = Util.getCookie(session);

        if(!Util.isEmpty(value) && !Util.isEmpty(cookieSession)){
            const http = DocEngine.instance.http;
            const sessionObject = JSON.parse(cookieSession);
            const { seq, uuid, contents } = this._bindBoardData;

            const newReply = new Reply().set(sessionObject.id, uuid, value);

            const   requestType = {...HTTP.RequestType };
                    requestType.method = HTTP.ERequestMethod.POST;
                    requestType.URL = "http://localhost:8081/reply"
                    requestType.responseType = HTTP.EResponseType.JSON;
                    requestType.body = JSON.stringify(newReply);
    
            http.doRequest(requestType, (response)=>{
                console.log(response);
                const { msg, statusCode, data } = response;
                if(statusCode == 201){
                    eleInputBox.value = "";
                    const array = [JSON.parse(data), ];
                    this._generator.makeElements("container-replys", replyWidgetKey, array);
                    eleContainer.scrollTop = eleContainer.scrollHeight;
                }
            });
        }
        else{
            if(Util.isEmpty(value)){
                console.error("INPUT EMPTY");
            }
            else if(Util.isEmpty(cookieSession)){
                console.error("LOGIN COOKIE EMPTY");
            }
        }
    }


    close(){
        this._bindBoardData = null;
        this._generator.clearWidgets(replyWidgetKey);
        this._frame.style.display = "none";
    }
}