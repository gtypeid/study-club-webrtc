
import Component from "./Component.js";
import WindowPanel from "./WindowPanel.js";

export default class DocEventHandler extends Component{
    constructor(parent){
        super(parent);
        this._changeTarget;
    }

    changeCalller(target){
        this._changeTarget = target;
    }
    
    bindEvent(eventType, element, overTarget = null){
        let target = null;
        if( typeof element === "string"){
            target = this.parent.findElements(element)[0];
        }
        else if (typeof element === "object"){
            target = element;
        }
        let call = (!this._changeTarget) ? this.parent : this._changeTarget;

        if(overTarget != null){
            call = overTarget;
        }

        if(target){
            target.addEventListener(eventType, (event)=>{
                if(eventType === DocEventHandler.EEvent.SCROLL)             call.scroll(target, event);
                if(eventType === DocEventHandler.EEvent.CLICK)              call.click(target, event);

                if(eventType === DocEventHandler.EEvent.MOUSE_DOWN)         call.mouseDown(target, event);
                if(eventType === DocEventHandler.EEvent.MOUSE_UP)           call.mouseUp(target, event);
                if(eventType === DocEventHandler.EEvent.MOUSE_MOVE)         call.mouseMove(target, event);
                if(eventType === DocEventHandler.EEvent.MOUSE_OVER)         call.mouseOver(target, event);
                if(eventType === DocEventHandler.EEvent.MOUSE_ENTER)        call.mouseEnter(target, event);
                if(eventType === DocEventHandler.EEvent.MOUSE_LEAVE)        call.mouseLeave(target, event);

                if(eventType === DocEventHandler.EEvent.DRAG)               call.drag(target, event);
                if(eventType === DocEventHandler.EEvent.DRAG_START)         call.dragStart(target, event);
                if(eventType === DocEventHandler.EEvent.DRAG_END)           call.dragEnd(target, event);
                if(eventType === DocEventHandler.EEvent.DRAG_OVER)          call.dragOver(target, event);
                if(eventType === DocEventHandler.EEvent.DRAG_ENTER)         call.dragEnter(target, event);
                if(eventType === DocEventHandler.EEvent.DRAG_LEAVE)         call.dragLeave(target, event);

                // drag drop은 Over,Drop 둘 다 있어야 함
                if(eventType === DocEventHandler.EEvent.DRAG_OVER)          call.dragOver(target, event);
                if(eventType === DocEventHandler.EEvent.DRAG_DROP)          call.dragDrop(target, event);
            });
        }
    }

    static EEvent = {
        MOUSE_DOWN : "mousedown",
        MOUSE_UP : "mouseup",
        MOUSE_MOVE : "mousemove",
        MOUSE_ENTER : "mouseenter",
        MOUSE_OVER : "mouseover",
        MOUSE_LEAVE : "mouseleave",

        CLICK : "click",
        DOUBLE_CLICK : "dblclick",
        SCROLL : "scroll",

        DRAG : "drag",
        DRAG_START : "dragstart",
        DRAG_END : "dragend",
        DRAG_ENTER : "dragenter",
        DRAG_LEAVE : "dragleave",
        DRAG_OVER : "dragover",
        DRAG_DROP : "drop"
    }
}   