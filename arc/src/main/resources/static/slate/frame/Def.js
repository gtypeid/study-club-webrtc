import Sever from "./Server.js"

export default class Def{
    static styles = [
        'background: linear-gradient(#B0B0B0, #404040)', 
        'border: 1px solid #3E0E02',
        'color: white',
        'display: block',
        'text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3)',
        'box-shadow: 0 1px 0 rgba(255, 255, 255, 0.4) inset, 0 5px 3px -5px rgba(0, 0, 0, 0.5), 0 -13px 5px -10px rgba(255, 255, 255, 0.4) inset',
        'line-height: 20px',
        'text-align: center',
        'font-weight: bold'
    ].join(';');
    
    static stylesBeat = [
        'background: linear-gradient(#FFA500, #FF6347)', 
        'border: 1px solid #3E0E02',
        'color: white',
        'display: block',
        'text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3)',
        'box-shadow: 0 1px 0 rgba(255, 255, 255, 0.4) inset, 0 5px 3px -5px rgba(0, 0, 0, 0.5), 0 -13px 5px -10px rgba(255, 255, 255, 0.4) inset',
        'line-height: 20px',
        'text-align: center',
        'font-weight: bold'
    ].join(';');

    static stylesServer = [
        'background: linear-gradient(#D33106, #571402)', 
        'border: 1px solid #3E0E02',
        'color: white',
        'display: block',
        'text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3)',
        'box-shadow: 0 1px 0 rgba(255, 255, 255, 0.4) inset, 0 5px 3px -5px rgba(0, 0, 0, 0.5), 0 -13px 5px -10px rgba(255, 255, 255, 0.4) inset',
        'line-height: 20px',
        'text-align: center',
        'font-weight: bold'
    ].join(';');

    static styles2 = [
        'border: 1px solid #3E0E02',
        'color: green',
        'font-weight: bold'
    ].join(';');

    static rtcClients = [];

    static endPoint = "https://192.168.0.107:8081";
    static server = new Sever();
}