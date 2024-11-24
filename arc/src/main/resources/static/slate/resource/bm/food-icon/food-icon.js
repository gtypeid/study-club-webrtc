import WidgetResource from "../../../js/doc/WidgetResource.js";
import DocEventHandler from "../../../js/comp/DocEventHandler.js";

export default class FoodIcon extends WidgetResource{
    constructor(cwrd){
        super(cwrd);   
        this._eventHandler;
        this._entityData;
    }

    rConstructor(){
        super.rConstructor();
        this._eventHandler = this.addComp(DocEventHandler);
        const eh = this._eventHandler;
        eh.bindEvent(DocEventHandler.EEvent.CLICK, "food-icon");
    }

    click(target, event){
        const comp = this._entityData.comp;
        const parent = comp.parent;
        const wr = parent.widget.widgetResource;
        wr.foodIconSelect(target, this._entityData.item);
    }

    entityBind(entityData){
        this._entityData = entityData;
        const item = this._entityData.item;

        const foodIcon = this.findElements("food-icon")[0];
        const foodTitle = this.findElements("food-title")[0];

        foodIcon.style.backgroundPositionX = String(item.x) + 'px';
        foodIcon.style.backgroundPositionY = String(item.y) + 'px';
        foodTitle.innerHTML = item.title;
    }
}