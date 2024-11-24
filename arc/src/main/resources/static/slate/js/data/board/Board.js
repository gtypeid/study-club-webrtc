

export default class Board{
    constructor(){
        this.seq;
        this.uuid;
        this.owner;
        this.title;
        this.contents;
        this.mdate;
    }

    set(owner, title, contents){
        this.owner = owner;
        this.title = title;
        this.contents = contents;
        return this;
    }
}