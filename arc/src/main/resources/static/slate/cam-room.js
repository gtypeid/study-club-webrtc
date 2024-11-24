
import RTCClient from "./frame/RTCClient.js";
import Sever from "./frame/Server.js";


document.addEventListener("DOMContentLoaded", (e)=>{
    const urlSearch = new URLSearchParams(location.search);
    const type = urlSearch.get('type');
    const room = urlSearch.get('room');

    if(type === "host"){
        new RTCClient().createRoom();
    }
    else if(type === "client"){
        new RTCClient().joinRoom(room);
    }

});

