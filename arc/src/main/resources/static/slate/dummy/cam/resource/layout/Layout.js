
import DocEngine from "../../../js/doc/DocEngine.js";
import WidgetResource from "../../../js/doc/WidgetResource.js";
import EntityGenerator from "../../../js/comp/EntityGenerator.js"

export default class Layout extends WidgetResource {
    constructor(cwrd){
        super(cwrd);
        this._generator;
        this._ownerWidgetVideo;

        this._test;
    }

    rConstructor(){
        super.rConstructor();
        this._generator = this.addComp(EntityGenerator);
    }


    visible(value){
        const frame = this.findElements("frame")[0];
        if(value){
            frame.style.display = "block";
        }
        else{
            frame.style.display = "none";
        }
    }

    stream(cb){
        const store = this._generator.getStore("widget-video");
        store.forEach(cb);
    }

    spawnWidgetVideo(clients){
        this.visible(true);
        // this._generator.makeElements("frame", "widget-video", clients);

        const common = DocEngine.instance.common;
        const cs = [common.getClientID(), "remote"];
        this._generator.makeElements("frame", "widget-video", cs);
    }

    setOwnerWidgetVideo(widgetVideo){
        this._ownerWidgetVideo = widgetVideo;
    }

    get ownerWidgetVideo(){
        return this._ownerWidgetVideo;
    }

    set test (test){
        this._test = test;
    }

    get test(){
        return this._test;
    }

    
}