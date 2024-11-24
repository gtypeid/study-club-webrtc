

export default class BuyerUser{
    constructor(){
        this.seq;
        this.uuid;
        this.id;
        this.passWord;
        this.nickName;
        this.profile;
        this.location;
        this.mdate;
    }

    set(id, passWord){
        this.id = id;
        this.passWord = passWord;
        return this;
    }
}
