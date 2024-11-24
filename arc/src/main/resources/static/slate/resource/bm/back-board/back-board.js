import WidgetResource from "../../../js/doc/WidgetResource.js";
import DocEngine from "../../../js/doc/DocEngine.js";

export default class BackBoard extends WidgetResource{
    constructor(cwrd){
        super(cwrd);   
        this._loginView;
        this._buyerCategoryView;
    }

    async spawnLoginView(){
        const htmlPipeLine = DocEngine.instance.htmlPipeLine;
        if(!this._loginView){
            const board = this.findElements("board")[0];
            const widget = await htmlPipeLine.asyncRunTimeSpawnWidget(board, "login-view");
            this._loginView = widget;
        }
    }

    async spawnBuyerCategroyView(){
        const htmlPipeLine = DocEngine.instance.htmlPipeLine;
        if(!this._buyerCategoryView){
            const board = this.findElements("board")[0];
            const widget = await htmlPipeLine.asyncRunTimeSpawnWidget(board, "buyer-category-view");
            this._buyerCategoryView = widget;
        }
    }

    visible(value){
        const frame = this.findElements("frame")[0];
        const board = this.findElements("board")[0];
        if(value){
            frame.style.height = "100%";
            board.style.height = "100%";
        }
        else{
            board.style.height = "0%"; 
            frame.style.height = "0%";
        }
    }

    visibleBuyerCategoryView(value){
        this.visible(value);
        if(value){
            this.spawnBuyerCategroyView();
        }
    }

    visibleLoginView(value){
        this.visible(value);
        if(value){
            this.spawnLoginView();
        }
    }
}