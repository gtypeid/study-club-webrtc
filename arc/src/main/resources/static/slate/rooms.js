import RoomInformer from "./frame/RoomInformer.js"


document.addEventListener("DOMContentLoaded", (event)=>{

    const bindURL = "/cam-room.html?type=client&room=";
    const roomInformer = new RoomInformer(bindURL);
    const button = document.getElementsByClassName("refresh")[0];
    button.addEventListener("click", (event)=>{
        roomInformer.roomSync();
    });
    roomInformer.roomSync();
})