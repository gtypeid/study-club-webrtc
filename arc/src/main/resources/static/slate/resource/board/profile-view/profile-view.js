
import WidgetResource from "../../../js/doc/WidgetResource.js";
import DocEventHandler from "../../../js/comp/DocEventHandler.js";
import WindowPanel from "../../../js/comp/WindowPanel.js";
import ImgDragBox from "../../../js/comp/ImgDragBox.js"
import HTTP from "../../../js/doc/HTTP.js";
import DocEngine from "../../../js/doc/DocEngine.js";
import * as Util from "../../../js/doc/Util.js";

const session = "user-session";
const uploadButton = "profile-button";
const profileImgBox = "profile-img-box";

export default class ProfileView extends WidgetResource{
    constructor(cwrd){
        super(cwrd);   
        this._eventHandler;  
        this._windowPanel;
        this._imgDragBox;
    }

    rConstructor(){
        super.rConstructor();
        this._eventHandler = this.addComp(DocEventHandler);
        this._windowPanel = this.addComp(WindowPanel);
        this._imgDragBox = this.addComp(ImgDragBox);

        this._eventHandler.bindEvent(DocEventHandler.EEvent.CLICK, uploadButton, this);
        this._windowPanel.bindWindowPanel(this._eventHandler);   
        // this._imgDragBox.bindImgDragBox(profileImgBox);

        const t = this.findElements("profile-file-button")[0];
        t.addEventListener("click", async (event)=>{
            const file = await this.openWindowPicker();
            if(file == null) return;

            const arrayBuffer = await file.arrayBuffer();

            const imgType = "image";
            const blob = new Blob( [ arrayBuffer ], {
                type: imgType
            });

            const cookieSession = Util.getCookie(session);
            const sessionObject = JSON.parse(cookieSession);

            const http = DocEngine.instance.http;
            const   requestType = {...HTTP.RequestType};
                    requestType.URL =   "http://localhost:8081/user-profile-update/" + sessionObject.uuid;
                    requestType.method = HTTP.ERequestMethod.POST;
                    requestType.acceptHeader = "image";
                    requestType.responseType = HTTP.EResponseType.JSON;
                    requestType.body = blob;
            http.doRequest(requestType, this.getFile);
        })
    }

    getFile(httpResulter){
      const fileUUID = httpResulter.data;
      if( Util.isEmpty(fileUUID) ) return;

      const http = DocEngine.instance.http;
      const   requestType = {...HTTP.RequestType};
              requestType.URL =   "http://localhost:8081/file/" + fileUUID;
              requestType.method = HTTP.ERequestMethod.GET;
              requestType.acceptHeader = "image";
              requestType.responseType = HTTP.EResponseType.Blob;
      http.doRequest(requestType, (response) => {
        
        /*
        const url = URL.createObjectURL(response);
        const img = document.createElement("img");
        img.classList.add("NEW-IMG-CLASS");
        document.body.appendChild(img);
        img.src = url;
        */
      });

    }


    async openWindowPicker(){
        const pickerOpts = {
            types: [
              {
                description: "Images",
                accept: {
                  "image/*": [".png", ".gif", ".jpeg", ".jpg"],
                },
              },
            ],
            excludeAcceptAllOption: true,
            multiple: false,
          };

          try{
            const [fileBuffers] = await window.showOpenFilePicker(pickerOpts);
            return fileBuffers.getFile();
          }
          catch (err){
            console.log(err);
          }
    }

    click(event, target){

    }
}