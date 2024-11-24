
import Component from "./Component.js";
import DocEventHandler from "./DocEventHandler.js";


export default class WindowPanel extends Component{
    constructor(parent){
        super(parent);
        
        // comp
        this._eventHandler;

        // element
        this._parentDocNode;            // 기본 부모 
        this._frame;                    // 기본 view 프레임, 콘텐츠
        this._wBox;                     // 골격
        this._wBoxContent;              // 골격 내 콘텐츠
        this._window;                   // 마우스 움직일 윈도우 헤더
        this._navBar;                   // 아이템 박스
        this._selfNav;                  // 본인 네브

        this._parentWindowPanel;        // 부모 패널
        this._childs = new Array();     // 자식들, 혹은 자기 자신 포함 (본인, 자식, 자식)

        // status
        this._isWindowClick;
        this._isDragClick;
        this._isHover = false;
        this._isAttached = false;
        this._activeIndex = 0;
    }

    bindWindowPanel(eventHandler, frame = "frame"){
        const wr = this.parent;
        const eh = eventHandler;
        const uIndex = this.parent.widget.uIndex;
        this._eventHandler = eventHandler;

        this._frame = wr.findElements(frame)[0];
        this._parentDocNode = this._frame.parentElement;
        
        // create
        this._wBox = this.newWBox();
        this._wBoxContent = this.newWBoxContent();
        this._window = this.newWindow();
        this._navBar = this.newNavBar();
        this._selfNav = this.newNavItem(this);

        // attach
        this._wBox.setAttribute("comp", WindowPanel.name);
        this._wBox.setAttribute(WindowPanel.name, uIndex);

        this._parentDocNode.appendChild(this._wBox);
        this._wBox.appendChild(this._window);
        this._wBox.appendChild(this._navBar);
        this._wBox.appendChild(this._wBoxContent);
        this._wBoxContent.appendChild(this._frame);

        //event
        eh.changeCalller(this);
        eh.bindEvent(DocEventHandler.EEvent.MOUSE_DOWN, this._window);
        eh.bindEvent(DocEventHandler.EEvent.MOUSE_UP, document);
        eh.bindEvent(DocEventHandler.EEvent.MOUSE_MOVE, document);

        eh.bindEvent(DocEventHandler.EEvent.DRAG_ENTER, this._navBar);
        eh.bindEvent(DocEventHandler.EEvent.DRAG_LEAVE, this._navBar);
        eh.bindEvent(DocEventHandler.EEvent.DRAG_START, this._navBar);
        eh.bindEvent(DocEventHandler.EEvent.DRAG_END, this._navBar);
        
        eh.bindEvent(DocEventHandler.EEvent.DRAG_OVER, this._navBar);
        eh.bindEvent(DocEventHandler.EEvent.DRAG_DROP, this._navBar);
        
        
    

    }

    newWBox(){
        const wBox = document.createElement("div");
        const makeName = this.key.concat('-', "w-box");
        wBox.className = makeName;

        wBox.style.minWidth = "300px";
        wBox.style.minHeight = "400px";
        wBox.style.maxWidth = "500px";
        wBox.style.maxHeight = "800px";
        wBox.style.overflow = "auto";
        wBox.style.resize = "both";
        wBox.style.position = "fixed";
        wBox.style.left = "600px";
        wBox.style.top = "15px";
        wBox.style.overflow = "hidden";
        wBox.style.borderStyle = "solid";
        wBox.style.borderColor = "aliceblue";
        wBox.style.borderWidth = "5px";
        wBox.style.boxShadow = "0 14px 28px rgba(0,0,0,0.75), 0 10px 10px rgba(0,0,0,0.15)";

        return wBox;
    }

    newWBoxContent(){
        const wBoxContent = document.createElement("div");
        const makeName = this.key.concat('-', "w-box-content");
        wBoxContent.className = makeName;
        wBoxContent.style.width = "100%";
        wBoxContent.style.height = "calc(100% - 60px)";

        return wBoxContent;
    }

    newWindow(){
        const window = document.createElement("div");
        const makeName = this.key.concat('-', "window");
        window.className = makeName;

        window.style.height = "30px";
        window.style.width = "100%";
        window.style.cursor = "pointer";
        window.style.backgroundColor = "orange";
        
        return window;
    }


    newNavBar(){
        const navBar = document.createElement("div");
        const makeName = this.key.concat('-', "nav-bar");
        navBar.className = makeName;

        navBar.style.display = "flex";
        navBar.style.flexWrap = "wrap";
        navBar.style.height = "30px";
        navBar.style.width = "100%";
        navBar.style.backgroundColor = "aliceblue"; 

        return navBar;
    }


    newNavItem(targetPanel){
        const navItem = document.createElement("div");
        this._navBar.appendChild(navItem);

        navItem.style.display = "inline-block";
        navItem.style.flexGrow = 1;
        navItem.style.height = "100%";
        navItem.style.cursor = "pointer";
        navItem.setAttribute("draggable", true);
        navItem.style.backgroundColor = "aliceblue"; 

        navItem.innerHTML = targetPanel.key;

        this._eventHandler.bindEvent(DocEventHandler.EEvent.CLICK, navItem, this);
        return navItem;
    }

    click(target, event){
        const index = target.getAttribute("index");
        this.setActiveNav(index);
    }

    mouseDown(target, event){
        this._isWindowClick = true;
        this._wBox.style.zIndex = "99";
    }

    mouseUp(target, event){
        if(this._isWindowClick){
            this._isWindowClick = false;
            this._wBox.style.zIndex = "0";
        }
    }

    mouseMove(target, event){
        if(this._isWindowClick){
            const pxX = event.pageX + "px";
            const pxY = event.pageY + "px";

            this._wBox.style.left = pxX;
            this._wBox.style.top = pxY;

        }
    }


    dragStart(target, event){
        this._isDragClick = true;
        this.dragActiveWindow = this;
        this._wBox.style.opacity = 0.5;
    }

    dragEnd(target, event){
        this._isDragClick = false;
        this.dragActiveWindow = null;
        this._wBox.style.opacity = 1.0;
    }

    dragEnter(target, event){
        const result = this.isGetEventElement(event);
        if(result.isValid){
            this.hover(result);
        }
    }

    dragLeave(target, event){
        const result = this.isGetEventElement(event);
        if(result.isValid){
            this.unHover(result);
        }
    }

    dragOver(target, event){
        event.preventDefault();
    }

    dragDrop(target, event){    
        event.preventDefault();
        const result = this.isGetEventElement(event);
        if(result.isValid){
            this.unHover(result);     
            result.eventWindowPanel.appendChildPanel(result);
        }
    }

    appendChildPanel(result){
        const childPanel = result.dragActivePanel;
        childPanel.setParentPanel(this);
        this.setActiveLastNav();
    }

    setChildPanel(childPanel){
        const childFrame = childPanel.frame;
        const childNav = this.newNavItem(childPanel);

        this._wBoxContent.appendChild( childFrame );
        this._navBar.appendChild( childNav );

        // self Check
        if(this._childs.length == 0){
            this._childs.push( {
                frame : this._frame,
                nav : this._selfNav
            } ); 
        }
        
        // append
        this._childs.push( {
            frame : childFrame,
            nav : childNav
        } );
    }

    setParentPanel(parentPanel){
        this._parentWindowPanel = parentPanel;
        this._isAttached = true;

        parentPanel.setChildPanel(this);

        this._selfNav.remove();
        this._navBar.remove();
        this._window.remove();
        this._wBoxContent.remove();
        this._wBox.remove();
    }

    setActiveLastNav(){
        const length = this._childs.length - 1;
        this.setActiveNav(length);
    }

    setActiveNav(index){
        const length = this._childs.length;
        // has Child
        if(length > 1){
            for(let i = 0; i < length; ++i){
                const { frame, nav } = this._childs[i];
                frame.style.display = "none";
                nav.style.fontWeight = "normal";
                nav.style.fontSize = "15px";
                nav.setAttribute("index", i);
            }

            const { frame, nav } = this._childs[index];
            frame.style.display = "block";
            nav.style.fontWeight = "bold";
            nav.style.fontSize = "17px";
        }
    }


    hover(result){
        this._isHover = true;

        const el = result.eventElement;
        const ewp = result.eventWindowPanel;
        ewp.window.style.backgroundColor = "red";

    }

    unHover(result){
        this._isHover = false;

        const el = result.eventElement;
        const ewp = result.eventWindowPanel;
        ewp.window.style.backgroundColor = "orange";
    }

    isGetEventElement(event){
        let result = {        
            isValid : false,
            eventElement : null,
            eventWindowPanel : null,
            dragActivePanel : null };

        result.isValid = false;

        if(this._isDragClick) return result;

        const eventElement = this.getEventElement(event);
        const dragActivePanel = this.dragActiveWindow;
        const WP = "WindowPanel";

        if(eventElement){
            const compAttr = eventElement.getAttribute("comp");
            if(compAttr === WP){
                const selfUIndex = eventElement.getAttribute(WP);
                const dragActiveUIndex = dragActivePanel.uIndex;
                if(selfUIndex != dragActiveUIndex){
                    result.isValid = true;
                    result.eventElement = eventElement;
                    result.eventWindowPanel = this;
                    result.dragActivePanel = dragActivePanel;
                }
            }
        }

        return result;
    }

    getEventElement(event){
        let element;
        element = event.srcElement.offsetParent;

        /*
        if(event.type === DocEventHandler.EEvent.DRAG_ENTER)    element = event.srcElement.offsetParent;
        if(event.type === DocEventHandler.EEvent.DRAG_LEAVE)    element = event.srcElement.offsetParent;
        */

        return element;
    }

    get frame(){
        return this._frame;
    }

    get wBox(){
        return this._wBox;
    }

    get window(){
        return this._window;
    }

    get navBar(){
        return this._navBar;
    }

    get uIndex(){
        return this.parent.widget.uIndex;
    }

    set dragActiveWindow(value){
        WindowPanel._gDragActiveWindow = value;
    }
    
    get dragActiveWindow(){
        return WindowPanel._gDragActiveWindow;
    }

    get key(){
        return this.parent.key;
    }

    static _gDragActiveWindow;
}