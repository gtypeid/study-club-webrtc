
import DocEngine from "./js/doc/DocEngine.js"
import SlateMap from "./js/data/SlateMap.js";

document.addEventListener("DOMContentLoaded", (ev)=>{
    const docEngine = DocEngine.instance;
    const slateMap = {...SlateMap };
    slateMap["main-id"] = "bm";
    slateMap["sub-id"] = "buyer";
    docEngine.run(slateMap);
});
