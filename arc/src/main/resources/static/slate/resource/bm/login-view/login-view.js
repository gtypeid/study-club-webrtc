
import WidgetResource from "../../../js/doc/WidgetResource.js";
import DocEventHandler from "../../../js/comp/DocEventHandler.js";
import HTTP from "../../../js/doc/HTTP.js";
import DocEngine from "../../../js/doc/DocEngine.js";
import HTMLPipeLine from "../../../js/doc/HTMLPipeLine.js";
import BuyerUser from "../../../js/data/bm/BuyerUser.js";
import SellerUser from "../../../js/data/bm/SellerUser.js";
import * as Util from "../../../js/doc/Util.js";
import OrderUser from "../../../js/data/bm/OrderUser.js";

const loginButton = "login-box-button";
const signinBox = "signin-box-button";
const loginInput = "login-box-id-input";
const passWordInput = "login-box-password-input";

export default class LoginView extends WidgetResource{
    constructor(cwrd){
        super(cwrd);   
        this._eventHandler;
        this._mainView;
    }

    rConstructor(){
        super.rConstructor();
        this._eventHandler = this.addComp(DocEventHandler);

        const eh = this._eventHandler;
        eh.bindEvent(DocEventHandler.EEvent.CLICK, loginButton);
        eh.bindEvent(DocEventHandler.EEvent.CLICK, signinBox);

        if(Util.getSubID() === "order"){
            const signin = this.findElements(signinBox)[0];
            signin.style.display = "none";
        }
    }

    
    click(target, event){
    
        const login = this.key.concat('-', loginButton);
        const signin = this.key.concat('-', signinBox);
        const id = this.findElements(loginInput)[0].value;
        const passWord = this.findElements(passWordInput)[0].value;

        if( target.classList.contains(login) ) 
            this.loginButtonClick(id, passWord);
        
        if( target.classList.contains(signin) )
            this.siginButtonClick(id, passWord);
    }

    loginButtonClick(id, passWord){

        if( !Util.isEmpty(id) && !Util.isEmpty(passWord)){
            const http = DocEngine.instance.http;
            const newUser = this.bmUser(id, passWord);
            const requestType = this.bmLoginRequest(newUser);

            http.doRequest(requestType, (response)=>{
                console.log(response);
                const { msg, statusCode, data } = response;
                if(statusCode === 200){
                    this.bmLoginResponse(response);
                }
            });
        }
        else{
            console.error("EMPTY INPUT");
        }

    }

    siginButtonClick(id, passWord){
        if( !Util.isEmpty(id) && !Util.isEmpty(passWord) ){
            const http = DocEngine.instance.http;
            const newUser = this.bmUser(id, passWord);
            const requestType = this.bmSiginRequest(newUser);
            http.doRequest(requestType, (response)=>{
                console.log(response);
                const { msg, statusCode, data } = response;
                if(statusCode == 201){
                    this.bmSiginResponse(response);
                }
            });
        } 
        else{
            console.error("EMPTY INPUT");
        }
    }


    bmUser(id, passWord){
        const subID = Util.getSubID();
        if(subID === "buyer"){
            const   buyerUser = new BuyerUser();
                    buyerUser.set(id, passWord);
            return  buyerUser;
        }

        if(subID === "seller"){
            const   sellerUser = new SellerUser();
                    sellerUser.set(id, passWord);
            return  sellerUser;
        }

        if(subID === "order"){
            const   orderUser = new OrderUser();
                    orderUser.set(id, passWord);
            return  orderUser;
        }
    }

    bmLoginRequest(user){
        const subID = Util.getSubID();
        if(subID === "buyer"){
            const   requestType = {...HTTP.RequestType};
            requestType.URL =   "http://localhost:8081/buyer-login";
            requestType.method = HTTP.ERequestMethod.POST;
            requestType.responseType = HTTP.EResponseType.JSON;
            requestType.body = JSON.stringify(user);
            return  requestType;
        }

        if(subID === "seller"){
            const   requestType = {...HTTP.RequestType};
            requestType.URL =   "http://localhost:8082/seller-login";
            requestType.method = HTTP.ERequestMethod.POST;
            requestType.responseType = HTTP.EResponseType.JSON;
            requestType.body = JSON.stringify(user);
            return  requestType;
        }

        if(subID === "order"){
            const   requestType = {...HTTP.RequestType};
            requestType.URL =   "http://localhost:8083/order-login";
            requestType.method = HTTP.ERequestMethod.POST;
            requestType.responseType = HTTP.EResponseType.JSON;
            requestType.body = JSON.stringify(user);
            return  requestType;
        }
    }

    bmSiginRequest(user){
        const subID = Util.getSubID();
        if(subID === "buyer"){
            const   requestType = {...HTTP.RequestType};
            requestType.URL =   "http://localhost:8081/buyer-sign";
            requestType.method = HTTP.ERequestMethod.POST;
            requestType.responseType = HTTP.EResponseType.JSON;
            requestType.body = JSON.stringify(user);
            return  requestType;
        }

        if(subID === "seller"){
            const   requestType = {...HTTP.RequestType};
            requestType.URL =   "http://localhost:8082/seller-sign";
            requestType.method = HTTP.ERequestMethod.POST;
            requestType.responseType = HTTP.EResponseType.JSON;
            requestType.body = JSON.stringify(user);
            return  requestType;
        }
    }

    bmLoginResponse(response){
        const { msg, statusCode, data } = response;
        const subID = Util.getSubID();
        const frame = this.findElements("frame")[0];

        let mainView;
        if(subID === "buyer"){
            Util.setBMCookie(data);
            frame.style.display = "none";
            mainView = this.getMainView();
            mainView.completeIntro();
        }

        if(subID === "seller"){
            Util.setBMCookie(data);
            frame.style.display = "none";
            mainView = this.getMainView();
            mainView.completeIntro();
        }

        if(subID === "order"){
            Util.setBMCookie(data);
            frame.style.display = "none";
            mainView = this.getMainView();
            mainView.completeIntro();
        }
    }

    bmSiginResponse(response){
        const { msg, statusCode, data } = response;

        const subID = Util.getSubID();
        if(subID === "buyer"){
        }

        if(subID === "seller"){
        }
    }


    getMainView(){
        if(this._mainView){
            return this._mainView;
        }
        else{
            const htmlPipeLine = DocEngine.instance.htmlPipeLine;
            const result = htmlPipeLine.isGetWidgets("main-view");
            if(result.isValid){
                const widget = result.widget.widgetResource;
                this._mainView = widget;
                return this._mainView;
            }
        }
        return null;
    }
}