
import * as Util from "./Util.js";


export default class NicknameGenerator{
    constructor(){

    }

    generatorNickName(){
        const pAdjective = new Promise(resolve => {
            this.getAdjectives( arr =>{
                resolve(arr);
            })
        });

        const pNoun = new Promise(resolve => {
            this.getNouns( arr =>{
                resolve(arr);
            })
        });

        return Promise.all([pAdjective, pNoun]).then((value) => {
            const promiseResult = {
                adjectives: value[0],
                nouns: value[1],
            };

            return this.randNickName(promiseResult);
        });
    }

    randNickName(promiseResult){
        const { adjectives, nouns } = promiseResult;
        const adjectivesLength = adjectives.length;
        const nounLength = nouns.length;

        const rand0 = Util.getRandomInt(adjectivesLength);
        const rand1 = Util.getRandomInt(nounLength);

        const nickName = adjectives[rand0] + " " + nouns[rand1];
        return nickName;
    }

    getAdjectives(cb){
        let arr = [];

        const adjectiveSite = "https://ko.wiktionary.org/w/index.php?title=%EB%B6%84%EB%A5%98:%ED%95%9C%EA%B5%AD%EC%96%B4_%EA%B4%80%ED%98%95%EC%82%AC%ED%98%95(%ED%98%95%EC%9A%A9%EC%82%AC)&from=%EA%B0%80";
        const category = "mw-category";

        fetch(adjectiveSite)
        .then((response) => {
            return response.text();
        })
        .then((html) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const eleCategory = doc.getElementsByClassName(category)[0];
            const lis = eleCategory.getElementsByTagName("li");
            for(let it of lis){
                arr.push(it.firstChild.title);
            }

            cb(arr);
            arr = null;
        })
    }

    getNouns(cb){
        let arr = [];

        const nounSite = "https://ko.wiktionary.org/wiki/%EB%B6%80%EB%A1%9D:%EC%9E%90%EC%A3%BC_%EC%93%B0%EC%9D%B4%EB%8A%94_%ED%95%9C%EA%B5%AD%EC%96%B4_%EB%82%B1%EB%A7%90_5800";
        fetch(nounSite)
        .then((response) => {
            return response.text();
        })
        .then((html) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const table = doc.getElementsByClassName("prettytable")[0];
            const dds = table.getElementsByTagName("dd");
            for(let it of dds){
                arr.push(it.firstChild.title);
            }

            cb(arr);
            arr = null;
        })
    }
}