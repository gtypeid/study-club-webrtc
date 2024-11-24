

export default class Reply{
    constructor(){
        this.seq;
        this.uuid;
        this.owner;
        this.bindBoard;
        this.contents;
        this.mdate;
    }

    set(owner, bindBoard, contents){
        this.owner = owner;
        this.bindBoard = bindBoard;
        this.contents = contents;
        return this;
    }
}