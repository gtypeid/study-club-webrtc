

export default class DataGenerator{

    constructor(){

    }

    newUserData(userNickName, password){
        const   user = {...DataGenerator.userData };
                user.nickname = userNickName;
                user.password = password;
                user.uid = crypto.randomUUID();
                user.expdate = new Date();
        return user;
    }

    newNBoardData(owneruser, title, content){
        const    nBoard = {...DataGenerator.nBoardData };
                nBoard.owneruser = JSON.parse(owneruser);
                nBoard.title = title;
                nBoard.content = content;
                nBoard.uid = crypto.randomUUID();
                nBoard.expdate = new Date();
        return nBoard;
    }
    
    static nBoardData = {
        uid : "",
        title : "",
        owneruser : DataGenerator.userData,
        content : "",
        expdate : "",
    };
    
    static userData = {
        uid : "",
        nickname : "",
        password : "",
        expdate : ""
    };
}
