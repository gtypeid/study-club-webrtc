import WidgetResource from "../../../js/doc/WidgetResource.js";
import DocEventHandler from "../../../js/comp/DocEventHandler.js";
import * as Util from "../../../js/doc/Util.js";

export default class MenuItem extends WidgetResource{
    constructor(cwrd){
        super(cwrd);   
        this._entityData;
        this._eventHandler;
    }

    rConstructor(){
        super.rConstructor();
        this._eventHandler = this.addComp(DocEventHandler);
        this._eventHandler.bindEvent(DocEventHandler.EEvent.CLICK, "frame");
    }

    entityBind(entityData){
        this._entityData = entityData;
        const item = this._entityData.item;
        this.setBmElements(item);
    }

    setBmElements(item){
        const { seq, uuid, ownerBuyerUuid, ownerSellerUuid, ownerStoreUuid, ownerMenuUuid,
            requestOrder, responseOrder, completeOrder
        } = item;

        const lEles = this.findElements("item-p");
        const rEles = this.findElements("item-p-r");

        rEles[0].innerHTML = seq;
        rEles[1].innerHTML = uuid;
        rEles[2].innerHTML = ownerBuyerUuid;
        rEles[3].innerHTML = ownerSellerUuid;
        rEles[4].innerHTML = ownerStoreUuid;
        rEles[5].innerHTML = ownerMenuUuid;
        rEles[6].innerHTML = requestOrder;
        if(!Util.isEmpty(responseOrder)){
            rEles[7].innerHTML = responseOrder;

            const frame = this.findElements("frame")[0];
            frame.style.backgroundColor = "gray";
            frame.style.color = "white";
        }

        if(Util.getSubID() === "seller"){
            const hiddens = [0, 1, 3, 4];
            for(let i of hiddens){
                lEles[i].style.display = "none";
                rEles[i].style.display = "none";
            }

            this.setMenuTitle(ownerMenuUuid)
        }
    }

    setMenuTitle(ownerMenuUuid){
        const wr = this.getParentWr();
        const title = wr.getMenuTitle(ownerMenuUuid);

        console.log(wr);
        console.log(title);

        if ( !Util.isEmpty(title) ){
            const lEles = this.findElements("item-p");
            const rEles = this.findElements("item-p-r");
    
            lEles[5].innerHTML = "메뉴";
            rEles[5].innerHTML = title;
        }
    }

    click(target, event){
        if( Util.getSubID() != "seller") return;
        
        const comp = this._entityData.comp;
        const parent = comp.parent;
        const wr = parent.widget.widgetResource;
        wr.orderItemSelect(target, this._entityData.item, this);
    }

    getParentWr(){
        const comp = this._entityData.comp;
        const parent = comp.parent;
        const wr = parent.widget.widgetResource;
        return wr;
    }
}