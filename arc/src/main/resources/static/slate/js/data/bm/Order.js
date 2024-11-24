

export default class Order{
    constructor(){
        this.seq;
        this.uuid;
        this.ownerBuyerUuid;
        this.ownerSellerUuid;
        this.ownerStoreUuid;
        this.ownerMenuUuid;
        this.requestOrder;
        this.responseOrder;
        this.completeOrder;
    }

    set(ownerBuyerUuid, ownerSellerUuid, ownerStoreUuid, ownerMenuUuid){
        this.ownerBuyerUuid = ownerBuyerUuid;
        this.ownerSellerUuid = ownerSellerUuid;
        this.ownerStoreUuid = ownerStoreUuid;
        this.ownerMenuUuid = ownerMenuUuid;
        return this;
    }
}