

export default class Menu{
    constructor(){
        this.seq;
        this.uuid;
        this.ownerStoreUuid;
        this.title;
        this.comments;
        this.price;
        this.img = "default";
        this.mdate;
    }

    set(ownerStoreUuid, title, comments, price){
        this.ownerStoreUuid = ownerStoreUuid;
        this.title = title;
        this.comments = comments;
        this.price = price;
        return this;
    }
}