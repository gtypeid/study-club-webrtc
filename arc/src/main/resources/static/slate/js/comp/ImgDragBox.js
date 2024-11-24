import DocEngine from "../doc/DocEngine.js";
import Component from "./Component.js";
import DocEventHandler from "./DocEventHandler.js";

export default class ImgDragBox extends Component{
    constructor(parent){
        super(parent);

        this._attachElement;
        this._eventHandler;
        this._config;

        this._activeReadFile;
        this._activeBlob;
    }

    bindImgDragBox(bindElement, eventHandler, config){
        const wr = this.parent;

        this._attachElement = wr.findElements(bindElement)[0];
        this._eventHandler = eventHandler;
        this._config = config;
        const eh = this._eventHandler;

        eh.changeCalller(this);
        eh.bindEvent(DocEventHandler.EEvent.CLICK, this._attachElement);
        this._attachElement.innerHTML = "<br>클릭 업로드";
    }


    activeFileAndBlob(file, blob){
        this._activeReadFile = file;
        this._active = blob;
    }

    async click(target, event){
        this.activeFileAndBlob(null, null);

        const maxSize = this._config.maxSize;
        const file = await this.openWindowPicker();
        if(file == null) return;

        this.readImageFile(file, async (result)=>{
            if(result.width <= maxSize && result.height <= maxSize){
                const arrayBuffer = await file.arrayBuffer();
                const imgType = "image";
                const blob = new Blob( [ arrayBuffer ], {
                    type: imgType
                });
                const fileName = "<br>file : " + file.name;
                this._attachElement.style.color = "green";
                this._attachElement.innerHTML = fileName;

                this.activeFileAndBlob(file, blob);
            }
            else{
                this._attachElement.style.color = "red";
                this._attachElement.innerHTML = "<br>파일 사이즈 최대 " + maxSize + " * " + maxSize;
            }
        });



        /*
        const cookieSession = Util.getCookie(session);
        const sessionObject = JSON.parse(cookieSession);

        const http = DocEngine.instance.http;
        const   requestType = {...HTTP.RequestType};
                requestType.URL =   "http://localhost:8081/user-profile-update/" + sessionObject.uuid;
                requestType.method = HTTP.ERequestMethod.POST;
                requestType.acceptHeader = "image";
                requestType.responseType = HTTP.EResponseType.JSON;
                requestType.body = blob;
        http.doRequest(requestType, this.getResponseFile);
        */

    }

    getResponseFile(httpResulter) {
        const fileUUID = httpResulter.data;
        if (Util.isEmpty(fileUUID)) return;

        const http = DocEngine.instance.http;
        const requestType = { ...HTTP.RequestType };
        requestType.URL = "http://localhost:8081/file/" + fileUUID;
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

    readImageFile(file, cb) {
        const reader = new FileReader();
        reader.readAsDataURL(file); 

        reader.onload = (e)=>{
            const img = new Image();
            img.src = e.target.result;
            img.onload = function() {
                cb( {   width : this.width,
                        height : this.height } );
            }
        }
    };

    async openWindowPicker() {
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

        try {
            const [fileBuffers] = await window.showOpenFilePicker(pickerOpts);
            return fileBuffers.getFile();
        }
        catch (err) {
            console.log(err);
        }
    }

    static ImgDragBoxConfig = {
        maxSize : 150
    }

    get activeReadFile(){
        return this._activeReadFile;
    }

    get activeBlob(){
        return this._activeBlob;
    }

}