import WidgetResource from "../../../js/doc/WidgetResource.js";
import DocEventHandler from "../../../js/comp/DocEventHandler.js";
import DocEngine from "../../../js/doc/DocEngine.js";
import * as Util from "../../../js/doc/Util.js";

export default class BuyerMyBox extends WidgetResource{
    constructor(cwrd){
        super(cwrd);   
        this._eventHandler;
        this._mainView;
    }

    rConstructor(){
        super.rConstructor();
        this._eventHandler = this.addComp(DocEventHandler);
        const eh = this._eventHandler;
        eh.bindEvent(DocEventHandler.EEvent.CLICK, "my");

        setTimeout(()=>{ 
            this.animPlay();
        } 
        , 100);
    }

    animPlay(){
        const frame = this.findElements("frame")[0];
        const my = this.findElements("my")[0];
        my.style.display = "block";
        frame.style.width = "100%";
    }

    click(target, event){
        const mainView = this.getMainView();
        const backBoard = mainView.backBoard;
        this.contentsLoad(backBoard);
    }

    contentsLoad(backBoard){
        const subID = Util.getSubID();
        if(subID === "buyer"){
            backBoard.visibleBuyerCategoryView(true);
        }
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
}