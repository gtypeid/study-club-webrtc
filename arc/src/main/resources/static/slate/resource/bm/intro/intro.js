
import WidgetResource from "../../../js/doc/WidgetResource.js";
import DocEngine from "../../../js/doc/DocEngine.js";
import DocEventHandler from "../../../js/comp/DocEventHandler.js";
import * as Util from "../../../js/doc/Util.js";

export default class Intro extends WidgetResource{
    constructor(cwrd){
        super(cwrd);   
        this._eventHandler;
        this._mainView;
    }

    rConstructor(){
        super.rConstructor();

        this._eventHandler = this.addComp(DocEventHandler);
        this.introRun();
    }

    introRun(){
        const docEngine = DocEngine.instance;
        const slateMap = docEngine.slateMap;

        const eleSubTitle = this.findElements("sub-title")[0];
        eleSubTitle.innerHTML = slateMap["sub-id"].toUpperCase();
        this._eventHandler.bindEvent(DocEventHandler.EEvent.CLICK, eleSubTitle, this);

        const eleTitleImg = this.findElements("title-img")[0];
        eleTitleImg.style.left = "0px";
    
        const eleCWrap = this.findElements("character-wrap")[0];
        eleCWrap.style.right = "-90px";
        eleCWrap.style.top = "260px";
    
        Util.timeTodo(0.02, 0.9, 
            ()=> this.eleStyle(eleTitleImg, "left", -32), 
            ()=>this.complate(),
        );
        Util.timeTodo(0.04, 1, ()=> this.eleStyle(eleCWrap, "right", 10.5)  );
        Util.timeTodo(0.04, 1, ()=> this.eleStyle(eleCWrap, "top", 1.6)  );
        Util.timeTodo(0.08, 1, ()=> this.eleStyle(eleCWrap, "top", -2.0)  );
    }

    complate(){
        const eleTitle = this.findElements("title")[0];
        eleTitle.style.fontSize = "93px";

        const eleSubTitle = this.findElements("sub-title")[0];
        eleSubTitle.style.fontSize = "38px";
    }

    eleStyle(target, position, value, persent){
        let per = 'px';
        if(typeof persent != "undefined")
            per = '%';
        target.style[position] = (value + parseInt(target.style[position]) ) + per;
    }

    click(target, event){
        const mainView = this.getMainView();
        if ( this.isLogin() ){
            mainView.completeIntro();
        }
        else{
            mainView.visibleLoginView(true);
        }

    }

    isLogin(){
        const cookieSession = Util.getBMCookie();
        if(!Util.isEmpty(cookieSession)){
            return true;
        }
        return false;
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

    visible(value){
        const frame = this.findElements("frame")[0];
        frame.style.display = "none";
    }
}