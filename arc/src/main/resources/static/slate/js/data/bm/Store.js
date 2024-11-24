

export default class Store{
    constructor(){
        this.seq;
        this.uuid;
        this.ownerSellerUuid;
        this.title;
        this.comments;
        this.storeCategory;
        this.logo = "default";
        this.mdate;
    }

    set(ownerSellerUuid, title, comments, storeCategory){
        this.ownerSellerUuid = ownerSellerUuid;
        this.title = title;
        this.comments = comments;
        this.storeCategory = storeCategory;
        return this;
    }
}
