
import DocEngine from "./js/doc/DocEngine.js"
import SlateMap from "./js/data/SlateMap.js";

document.addEventListener("DOMContentLoaded", (ev)=>{
    const docEngine = DocEngine.instance;
    const slateMap = {...SlateMap };
    slateMap["main-id"] = "cam";

    // "https://172.30.1.18:8081";
    // "https://127.0.0.1:8081"
    slateMap["end-point"] = "https://172.30.1.18:8081";
    docEngine.run(slateMap);

    console.log(docEngine);

});
