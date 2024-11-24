

export default class SellerUser{
    constructor(){
        this.seq;
        this.uuid;
        this.id;
        this.passWord;
        this.mdate;
    }

    set(id, passWord){
        this.id = id;
        this.passWord = passWord;
        return this;
    }
}
