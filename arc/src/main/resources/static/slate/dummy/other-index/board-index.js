
import DocEngine from "./js/doc/DocEngine.js"
import SlateMap from "./js/data/SlateMap.js";

document.addEventListener("DOMContentLoaded", (ev)=>{
    const docEngine = DocEngine.instance;
    const slateMap = {...SlateMap };
    slateMap["main-id"] = "board";
    docEngine.run(slateMap);
});
