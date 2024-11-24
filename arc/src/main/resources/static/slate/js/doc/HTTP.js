import * as Util from "./Util.js";

export default class HTTP{
    constructor(){
    }

    

    // fetch
    doRequest(requestType, cb) {
        
        const { method, URL, responseType, body, acceptHeader} = requestType;
        const httpRequest = new XMLHttpRequest();
        
        httpRequest.onreadystatechange = (event) => {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status <= 399) {
                    cb(httpRequest.response);
                }
                
            }
        };

        httpRequest.open(method, URL, true);
        httpRequest.responseType = responseType;
        httpRequest.setRequestHeader('Access-Control-Allow-origin', '*');
        httpRequest.setRequestHeader('Accept', acceptHeader);
        
        if(method === HTTP.ERequestMethod.GET) {
            httpRequest.send();
        }
        else if(method === HTTP.ERequestMethod.POST) {
            // httpRequest.setRequestHeader("Content-Type", "application/json, text/plain");
            httpRequest.setRequestHeader("Content-Type", "application/json");
            httpRequest.send(body);
        }
    }

    asyncRequest(requestType){
        return new Promise(resolve =>{
            this.doRequest(requestType, (response)=>{
                resolve(response);
            });
        })
    }

    static ERequestMethod = {
        GET : "Get",
        POST : "Post"
    }
    
    static EResponseType = {
        Document : "document",
        Text : "text",
        JSON : "json",
        Blob : "blob"
    }

    static RequestType = {
        method : HTTP.ERequestMethod,
        responseType : HTTP.EResponseType,
        URL : '',
        body : '',
        acceptHeader : ''
    };
}   