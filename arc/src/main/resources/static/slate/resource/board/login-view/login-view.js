
import WidgetResource from "../../../js/doc/WidgetResource.js";
import DocEventHandler from "../../../js/comp/DocEventHandler.js";
import WindowPanel from "../../../js/comp/WindowPanel.js";
import HTTP from "../../../js/doc/HTTP.js";
import DocEngine from "../../../js/doc/DocEngine.js";
import * as Util from "../../../js/doc/Util.js";
import User from "../../../js/data/board/User.js";

const session = "user-session";

const loginButton = "login-box-button";
const signinBox = "signin-box-button";
const logoutButton = "logout-box-button";
const profileButton = "profile-box-button";
const title = "login-box-title-h";

const loginInput = "login-box-id-input";
const passWordInput = "login-box-password-input";

export default class LoginView extends WidgetResource {
    constructor(cwrd){
        super(cwrd);   
        this._eventHandler;  
        this._windowPanel;
        this._profileView;
    }

    rConstructor(){
        super.rConstructor();
        this._eventHandler = this.addComp(DocEventHandler);
        this._windowPanel = this.addComp(WindowPanel);

        const eh = this._eventHandler;
        const wp = this._windowPanel;

        wp.bindWindowPanel(eh);        
        eh.bindEvent(DocEventHandler.EEvent.CLICK, loginButton, this);
        eh.bindEvent(DocEventHandler.EEvent.CLICK, signinBox, this);
        eh.bindEvent(DocEventHandler.EEvent.CLICK, profileButton, this);
        eh.bindEvent(DocEventHandler.EEvent.CLICK, logoutButton, this);


        this.refresh();
    }

    click(target, event){
        
        const login = this.key.concat('-', loginButton);
        const signin = this.key.concat('-', signinBox);
        const profile = this.key.concat('-', profileButton);
        const logout = this.key.concat('-', logoutButton);
        const id = this.findElements(loginInput)[0].value;
        const passWord = this.findElements(passWordInput)[0].value;

        if( target.classList.contains(login) ) 
            this.loginButtonClick(id, passWord);
        
        if( target.classList.contains(signin) )
            this.siginButtonClick(id, passWord);

        if( target.classList.contains(profile) )
            this.profileButtonClick();

        if( target.classList.contains(logout) )
            this.logoutButtonClick();
    }

    loginButtonClick(id, passWord){

        if( !Util.isEmpty(id) && !Util.isEmpty(passWord)){
            const http = DocEngine.instance.http;
            const newUser = new User().set(id, passWord);
            const   requestType = {...HTTP.RequestType};
                    requestType.URL =   "http://localhost:8081/login";
                    requestType.method = HTTP.ERequestMethod.POST;
                    requestType.responseType = HTTP.EResponseType.JSON;
                    requestType.body = JSON.stringify(newUser);

            http.doRequest(requestType, (response)=>{
                console.log(response);
                const { msg, statusCode, data } = response;
                if(statusCode === 200){
                    Util.setCookie(session, data, 300);
                    this.refresh();
                    this.maiViewRefresh();
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
            const newUser = new User().set(id, passWord);
            const   requestType = {...HTTP.RequestType};
                    requestType.URL =   "http://localhost:8081/user";
                    requestType.method = HTTP.ERequestMethod.POST;
                    requestType.responseType = HTTP.EResponseType.JSON;
                    requestType.body = JSON.stringify(newUser);

            http.doRequest(requestType, (response)=>{
                console.log(response);
            });
        } 
        else{
            console.error("EMPTY INPUT");
        }
    }
    
    profileButtonClick(){
        const cookieSession = Util.getCookie(session);
        if(!Util.isEmpty(cookieSession)){
            this.spawnProfileView( profileView => {
                console.log(profileView);
            });
        }
    }

    spawnProfileView(cb){
        if(this._profileView)
            cb(this._profileView);
        
        const htmlPipeLine = DocEngine.instance.htmlPipeLine;
        const result = htmlPipeLine.isGetWidgets("profile-view");
        if(result.isValid){
            this._profileView = result.widget.widgetResource;
            cb(this._profileView);
        } 
        else{
            htmlPipeLine.runTimeSpawnWidget(document.body, "profile-view", (widget)=>{
                this._profileView = widget.widgetResource;
                cb(this._profileView);
            });
        }
    }


    logoutButtonClick(){
        Util.deleteCookie(session);
        this.refresh();
        this.maiViewRefresh();
    }

    refresh(){
        const eleLoginButton = this.findElements(loginButton)[0];
        const eleSigninButton = this.findElements(signinBox)[0];
        const eleOutButton = this.findElements(logoutButton)[0];
        const eleProfileButton = this.findElements(profileButton)[0];
        
        const eleTitle = this.findElements(title)[0];
        const eleIDInput = this.findElements(loginInput)[0];
        const elePassWordInput = this.findElements(passWordInput)[0];
        const cookieSession = Util.getCookie(session);

        if( Util.isEmpty(cookieSession)){
            eleLoginButton.style.display = "grid";
            eleSigninButton.style.display = "grid";
            eleIDInput.style.display = "block";
            elePassWordInput.style.display ="block";

            eleOutButton.style.display = "none";
            eleProfileButton.style.display = "none";
            eleTitle.innerHTML = "Login";
            
        }
        else{
            const cookieObject = JSON.parse(cookieSession);

            eleLoginButton.style.display = "none";
            eleSigninButton.style.display = "none";
            eleIDInput.style.display = "none";
            elePassWordInput.style.display ="none";

            eleOutButton.style.display = "grid";
            eleProfileButton.style.display = "grid";

            eleTitle.innerHTML = cookieObject.id; 
        }
    }

    maiViewRefresh(){
        const htmlPipeLine = DocEngine.instance.htmlPipeLine;
        const result = htmlPipeLine.isGetWidgets("main-view");
        if(result.isValid)
            result.widget.widgetResource.refresh();

    }
}
