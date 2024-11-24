

export default class OrderUser{
    constructor(){
        this.id;
        this.passWord;
    }

    set(id, passWord){
        this.id = id;
        this.passWord = passWord;
        return this;
    }
}
