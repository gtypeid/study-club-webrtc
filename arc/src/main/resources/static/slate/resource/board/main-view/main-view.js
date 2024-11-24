import WidgetResource from "../../../js/doc/WidgetResource.js";
import HTTP from "../../../js/doc/HTTP.js";
import WindowPanel from "../../../js/comp/WindowPanel.js"
import DocEngine from "../../../js/doc/DocEngine.js";
import RestBinder from "../../../js/comp/RestBinder.js"
import EntityGenerator from "../../../js/comp/EntityGenerator.js"
import DocEventHandler from "../../../js/comp/DocEventHandler.js";
import * as Util from "../../../js/doc/Util.js";

const nBoardHTTPKey = "nboard";
const nBoardWidgetKey = "n-board";
const session = "user-session";
const postButton = "post-button";
const postEditViewWidgetKey = "post-edit-view";
const boardView = "board-view";

export default class MainView extends WidgetResource{
    constructor(cwrd){
        super(cwrd);   
        this._eventHandler;  
        this._restBinder;
        this._generator;

        this._postEditView;
        this._boardView;
    }

    rConstructor(){
        super.rConstructor();
        this._eventHandler = this.addComp(DocEventHandler);
        this._restBinder = this.addComp(RestBinder);
        this._generator = this.addComp(EntityGenerator);

        const eh = this._eventHandler;
        const rb = this._restBinder;
        eh.bindEvent(DocEventHandler.EEvent.SCROLL, "container");
        eh.bindEvent(DocEventHandler.EEvent.MOUSE_ENTER, "frame");
        eh.bindEvent(DocEventHandler.EEvent.MOUSE_LEAVE, "frame");
        eh.bindEvent(DocEventHandler.EEvent.CLICK, postButton);
        rb.bindConfig( this.getNBoardConfig() );

        this.preGenerateBoardView();
        this.refresh();
    }

    preGenerateBoardView(){
        const htmlPipeLine = DocEngine.instance.htmlPipeLine;
        const eleFrame = this.findElements("frame")[0];
        htmlPipeLine.runTimeSpawnWidget(eleFrame, boardView, (widget)=>{
            this._boardView = widget.widgetResource;
            this._boardView.close();
        });
    }

    spawnBoardWidget(boardData){
        const eleContainer = this.findElements("container")[0];
        const array = [boardData,];
        this._generator.makeElements("container", nBoardWidgetKey, array);
        eleContainer.scrollTop = eleContainer.scrollHeight;
    }

    refresh(){
        const isLogin = (!Util.isEmpty( Util.getCookie(session) ));
        const progress = this._restBinder.getProgress(nBoardHTTPKey);
        if(isLogin){
            if(progress == 0){
                this.doSend();
            }
        }
        else{
            if(progress != 0){
                this.doClear();
            }
        }
    }

    getNBoardConfig(){
        const   requestType = {...HTTP.RequestType };
                requestType.method = HTTP.ERequestMethod.GET;
                requestType.URL = "http://localhost:8081/boards";
                requestType.responseType = HTTP.EResponseType.JSON;

        const   config = {...RestBinder.RestBinderConfig };
                config.key = nBoardHTTPKey;
                config.RequestType = requestType;
                config.itemSize = 9;
                config.packageLoc = RestBinder.ERBCPackageLoc.client;
                config.progressing = true;
                
        return config;
    }

    scroll(target, event){
        const pes = Util.getScrollPes(target)
        const div = 98.0;
        if(pes >= div){
            this.doSend();
        }
    }


    mouseEnter(target, event){
        const elePostButton = this.findElements(postButton)[0];
        if( !Util.isEmpty( Util.getCookie(session) )) {
            elePostButton.style.display = "block";
        }
        else{
            elePostButton.style.display = "none";
        }

        
    }

    mouseLeave(target, event){
        if( !Util.isEmpty(Util.getCookie(session))) {
            const elePostButton = this.findElements(postButton)[0];
            elePostButton.style.display = "none";
        }

    }

    click(target, event){
        if( !Util.isEmpty (Util.getCookie(session))) {
            this.spawnPostEditView((view) => {
                const postView = view;
                const htmlPipeLine = DocEngine.instance.htmlPipeLine;
                const result = htmlPipeLine.isGetWidgets("login-view");
                if(result.isValid){
                    const wr = result.widget.widgetResource;
                    const compResult = wr.getComps(WindowPanel);
                    if(compResult.isValid){
                        const loginViewWP = compResult.comps[0];
                        const eventResult = {
                            isValid : true,
                            eventElement : null,
                            eventWindowPanel : loginViewWP,
                            dragActivePanel : loginViewWP };
                        }
                    }
                }
            )
        }
    }

    spawnPostEditView(cb){
        if(this._postEditView)
            cb(this._postEditView);
        
        const htmlPipeLine = DocEngine.instance.htmlPipeLine;
        const result = htmlPipeLine.isGetWidgets(postEditViewWidgetKey);
        if(result.isValid){
            this._postEditView = result.widget.widgetResource;
            cb(this._postEditView);
        } 
        else{
            htmlPipeLine.runTimeSpawnWidget(document.body, postEditViewWidgetKey, (widget)=>{
                this._postEditView = widget.widgetResource;
                cb(this._postEditView);
            });
        }
    }


    doSend(){
        this._restBinder.send(nBoardHTTPKey, (items)=>{
            this._generator.makeElements("container", nBoardWidgetKey, items);
        });
    }

    doClear(){
        this._generator.clearWidgets(nBoardWidgetKey);
        this._restBinder.packerClear();
    }

    get boardView(){
        return this._boardView;
    }
} 
