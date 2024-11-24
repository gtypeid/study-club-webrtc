

import DocEngine from "../../../js/doc/DocEngine.js";
import WidgetResource from "../../../js/doc/WidgetResource.js";
import DocEventHandler from "../../../js/comp/DocEventHandler.js";
import DataGenerator from "../../../js/doc/DataGenerator.js";
import HTTP from "../../../js/doc/HTTP.js";
import WindowPanel from "../../../js/comp/WindowPanel.js";

import * as Util from "../../../js/doc/Util.js";
import Board from "../../../js/data/board/Board.js";

const session = "user-session";
const postButton = "post-edit-button";

export default class PostEditView extends WidgetResource{
    constructor(cwrd){
        super(cwrd);   
        this._eventHandler;  
        this._windowPanel;
    }

    rConstructor(){
        super.rConstructor();
        this._eventHandler = this.addComp(DocEventHandler);
        this._windowPanel = this.addComp(WindowPanel);

        this._eventHandler.bindEvent(DocEventHandler.EEvent.CLICK, postButton, this);
        this._windowPanel.bindWindowPanel(this._eventHandler);   
        
    }

    click(event, target){
        const eleTitle = this.findElements("post-edit-title-input")[0];
        const eleContents = this.findElements("post-edit-content-input")[0];
        const title = eleTitle.value;
        const contents = eleContents.value;
        const cookieSession = Util.getCookie(session);

        if(!Util.isEmpty(title) && !Util.isEmpty(contents) && !Util.isEmpty(cookieSession)){
            const http = DocEngine.instance.http;
            const htmlPipeLine = DocEngine.instance.htmlPipeLine;

            const sessionObject = JSON.parse(cookieSession);
            
            const newBoard = new Board().set(sessionObject.id, title, contents);
            const   requestType = {...HTTP.RequestType};
                    requestType.URL =   "http://localhost:8081/board";
                    requestType.method = HTTP.ERequestMethod.POST;
                    requestType.responseType = HTTP.EResponseType.JSON;
                    requestType.body = JSON.stringify(newBoard);

            http.doRequest(requestType, (response)=>{
                console.log(response);
                const { msg, statusCode, data } = response;
                if(statusCode === 201){
                    eleTitle.value = "";
                    eleContents.value = "";
                    const result = htmlPipeLine.isGetWidgets("main-view");
                    if(result.isValid)
                        result.widget.widgetResource.spawnBoardWidget(JSON.parse(data));
                }
            });
        }
        else{
            console.error("POST ERROR");
        }
    }
}