
export function isWidgetTag(htmlTagName){
    if(htmlTagName && htmlTagName.length >= 3){
        const isS0 = ( htmlTagName[0] === 'W');
        const isS1 = ( htmlTagName[1] === ':');

        return isS0 && isS1;
    }
    return false;
}

export function wigetName(htmlTagName){
    const isWidget = isWidgetTag(htmlTagName);

    if(isWidget){
        const subWidget = htmlTagName.substr(2, htmlTagName.length);
        return subWidget;
    }
    return htmlTagName;
}

export function isWidgetAndName(htmlTagName){
    const mv = { 
        isWidget : isWidgetTag(htmlTagName),
        wigetName : wigetName(htmlTagName) }
    return mv;
}

export function sequenceTree(element, cb) {
    for (let cursor of element.children) {
        this.sequenceTree(cursor, cb);
    }
    cb(element);
}

export function widgetDocName(key, className){
    const name = key.concat('-', className);
    return name;
}

export function setCookie(name, value = "", maxAge) {
    /*
    date.setTime(date.getTime() + exp*24*60*60*1000);      
    let makeCookie = name + '=' + value + ';expires=' + date.toUTCString() + ';path=/';
    */
    let inValue = "";
    if (value === "") {
        inValue = new Date();
    }
    else{
        inValue = value;
    }
    const makeCookie = name.concat('=', value, "; Max-Age=", maxAge);
    document.cookie = makeCookie;
};

export function setBMCookie(value = "") {
    const name = "bm-" + getSubID();
    setCookie(name, value, 300);
};

export function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function getBMCookie() {
    const name = "bm-" + getSubID();
    return getCookie(name);
}

export function cookieCheck(){
    const fixedTime = 5;

    let flag = false;
    const cookieName = "http";
    const cookie = getCookie(cookieName);
    if(cookie == null){
        flag = true;
        setCookie(cookieName, fixedTime);
    }
    else{
        flag = false;
        console.error("재 요청 타이머");
    }
    return flag;
}

export function deleteCookie(name) {
	document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

export function tsvJSONParse(tsv){
    if(isEmpty(tsv)) return "";
    
    const lines = tsv.split("\n");
    const result = [];
    for(let it of lines){
        result.push( JSON.parse(it) );
    }
    return result;
}

export function isEmpty(str){
		
    if(typeof str == "undefined" || str == null || str == "")
        return true;
    else
        return false ;
}

export function timeTodo(delta, max, cb, complate){
    const mDelta = delta * 1000;
    const mMax = max * 1000;
    const timerId = setInterval(cb, mDelta);
    setTimeout( ()=>{ 
        clearInterval(timerId); 
        if(typeof complate !== "undefined") 
            complate();
    }, mMax)
}


export function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

export function getScrollPes(target){
    return (target.scrollTop / (target.scrollHeight - target.clientHeight )) * 100;
}