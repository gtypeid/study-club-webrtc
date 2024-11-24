
export default class Component{
    constructor(parent){
        this._parent = parent;
    }
    
    get parent(){
        return this._parent;
    }
}   