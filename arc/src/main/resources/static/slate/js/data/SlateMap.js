import ComCam from "./cam/ComCam.js";

const SlateMap = {
    "main-id" : "",
    "sub-id" : "",
    "resource-path" : "/resource",
    "widget-replace" : true,
    "mobile" : 376,
    "tablet" : 576,
    "end-point" : "",

    getCommon : ()=>{
        const comCam = new ComCam();
        return comCam;
    }
};

export default SlateMap;