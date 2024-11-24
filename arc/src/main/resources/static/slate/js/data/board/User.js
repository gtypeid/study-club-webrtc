

export default class User{
    constructor(){
        this.seq;
        this.uuid;
        this.id;
        this.passWord;
        this.profile;
        this.mdate;
    }

    set(id, passWord){
        this.id = id;
        this.passWord = passWord;
        return this;
    }
}