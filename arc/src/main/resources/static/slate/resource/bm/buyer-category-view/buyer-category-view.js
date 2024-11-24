import WidgetResource from "../../../js/doc/WidgetResource.js";
import DocEventHandler from "../../../js/comp/DocEventHandler.js";
import EntityGenerator from "../../../js/comp/EntityGenerator.js";
import DocEngine from "../../../js/doc/DocEngine.js";
import * as FoodCategory from "../../../js/data/bm/FoodCategory.js"

const buttonCategory = "button-category";
const buttonSort = "button-sort";
const buttonCommit = "button-commit";
const controlBox = "control-box";
const controlBoxBack = "control-box-back";
const controlBoxTypeCategory = "control-box-category";
const controlBoxTypeCategoryView = "control-box-category-view";
const controlBoxTypeSort = "control-box-sort";
const sortItem = "sort-item";


export default class BuyerCategoryView extends WidgetResource{
    constructor(cwrd){
        super(cwrd);   
        this._backBoard;
        this._mainView;
        this._eventHandler;
        this._generator;
        this._activeFoodCategoryData;
        this._sortItems;
        this._activeSortItem;
    }
    
    rConstructor(){
        super.rConstructor();
        this._eventHandler = this.addComp(DocEventHandler);
        this._generator = this.addComp(EntityGenerator);
        const eh = this._eventHandler;

        eh.bindEvent(DocEventHandler.EEvent.CLICK, buttonCategory);
        eh.bindEvent(DocEventHandler.EEvent.CLICK, buttonSort);
        eh.bindEvent(DocEventHandler.EEvent.CLICK, buttonCommit);
        eh.bindEvent(DocEventHandler.EEvent.CLICK, controlBoxBack);

        this._activeFoodCategoryData = {
            category : "default"
        };

        this._sortItems = this.findElements(sortItem);
        for(let it of this._sortItems){
            eh.bindEvent(DocEventHandler.EEvent.CLICK, it);
        }
        this.sortItemSelect(this._sortItems[0]);
        this.spawnFoodIconWidget();
    }

    click(target, event){

        const category = this.key.concat('-', buttonCategory);
        const sort = this.key.concat('-', buttonSort);
        const commit = this.key.concat('-', buttonCommit);
        const boxBack = this.key.concat('-', controlBoxBack);
        const sItem = this.key.concat('-', sortItem);

        if( target.classList.contains(category) ) {
            this.visibleControlBox(true);
            this.openCategoryView(buttonCategory);
        }
        
        if( target.classList.contains(sort) ){
            this.visibleControlBox(true);
            this.openCategoryView(buttonSort);
        }

        if( target.classList.contains(commit) ){
            this.commitButton();
        }

        if( target.classList.contains(boxBack) ){
            this.visibleControlBox(false);
        }

        if( target.classList.contains(sItem) ){
            this.sortItemSelect(target);
        }
    }

    openCategoryView(buttonType){
        const category = this.findElements(controlBoxTypeCategory)[0];
        const categoryView = this.findElements(controlBoxTypeCategoryView)[0];

        const sort = this.findElements(controlBoxTypeSort)[0];

        if(buttonType === buttonCategory){
            categoryView.style.display = "block";
            category.style.height = "325px";
        }
        if(buttonType === buttonSort){
            sort.style.height = "325px";
        }
    }

    visibleControlBox(value){
        const boxControl = this.findElements(controlBox)[0];
        const boxBackControl = this.findElements(controlBoxBack)[0];
        const category = this.findElements(controlBoxTypeCategory)[0];
        const categoryView = this.findElements(controlBoxTypeCategoryView)[0];
        const sort = this.findElements(controlBoxTypeSort)[0];

        if(value){
            boxControl.style.height = "100%";
            setTimeout(()=>{ 
                boxBackControl.style.height = "100%";
            } 
            , 150);
        }
        else{
            boxControl.style.height = "0%";
            boxBackControl.style.height = "0%";
            category.style.height = "0px";
            categoryView.style.display = "none";
            sort.style.height = "0px";
        }
    }

    spawnFoodIconWidget(){
        const items = FoodCategory.getCategoryItem();
        this._generator.makeElements("control-box-category-view", "food-icon", items );
    }


    foodIconSelect(target, foodIconData){
        const category = this.findElements(buttonCategory)[0];
        category.innerHTML = foodIconData.title + " ▼";
        this._activeFoodCategoryData = foodIconData;
        this.visibleControlBox(false);
    }

    sortItemSelect(target){
        if(this._activeSortItem){
            this._activeSortItem.style.color = "black";
        }

        target.style.color = "#2ac1bc";
        this._activeSortItem = target;

        const sortB = this.findElements(buttonSort)[0];
        sortB.innerHTML = this._activeSortItem.innerHTML + " ▼";
        this.visibleControlBox(false);
    }

    commitButton(){
        const backBoard = this.getBackBoard();
        backBoard.visibleBuyerCategoryView(false);

        const mainView = this.getMainView();
        mainView.storeItemViewRequest(this._activeFoodCategoryData);
    }

    getBackBoard(){
        if(this._backBoard){
            return this._backBoard;
        }
        else{
            const htmlPipeLine = DocEngine.instance.htmlPipeLine;
            const result = htmlPipeLine.isGetWidgets("back-board");
            if(result.isValid){
                const widget = result.widget.widgetResource;
                this._backBoard = widget;
                return this._backBoard;
            }
        }
        return null;
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