import NicknameGenerator from "../js/doc/NicknameGenerator.js"

export default class SyncChat{
    constructor(clientSyncer){
        this._clientSyncer = clientSyncer;
        this._sendButton;
        this._chatInput;
        this._nicknameGenerator;
        this._nickName;

        this._clients = new Map();

        //this._inputFocus;
        this.inIt();
    }

    async inIt(){
        this._nicknameGenerator = new NicknameGenerator();
        //this._nickName = await this._nicknameGenerator.generatorNickName()

        const urlSearch = new URLSearchParams(location.search);
        const nickName = urlSearch.get('nickname');
        this._nickName = nickName;

        this._chatInput = document.getElementsByClassName("chat-input")[0];
        // this._sendButton = document.getElementsByClassName("chat-button")[0];

        // this._sendButton.addEventListener("click", (event)=>{
        // });

        this._chatInput.addEventListener('focusout', () => {
        });

        this._chatInput.addEventListener('focus', () => {
        });

        this._chatInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') { 
                event.preventDefault(); 
                this.buttonClick();
            }
        });
    }

    receive(data){
        const { type } = data;
        if( !this._nickName || type !== "chat") return

        this.spawn(data);
    }

    buttonClick(){
        if(!this._nickName) return;
        
        const value = this._chatInput.value;
        this._chatInput.value = "";

        const data = {
            owner : this._clientSyncer.clientUuid,
            nickName : this._nickName,
            type : "chat", 
            msg : value
        }

        this.spawn(data);
        this._clientSyncer.sendData("all", data);
    }

    spawn(data){
        const { owner, nickName, msg, type} = data;
        const clientUuid = this._clientSyncer.clientUuid;
        const box = document.getElementsByClassName("chat-spawn-box")[0];
        this.checkClinetJoin(owner, nickName, box);

        const chatScroll = document.getElementsByClassName("chat")[0];
        const position = (owner === clientUuid) ? "right" : "left";
        const li = this.createMessageItem(nickName, msg, position);

        box.appendChild(li);
        chatScroll.scrollTop = chatScroll.scrollHeight;
    }

    createMessageItem(senderName, messageContent, position) {
        const li = document.createElement("li");
        li.className = position;

        const senderDiv = document.createElement("div");
        senderDiv.className = "sender";
    
        const senderSpan = document.createElement("span");
        senderSpan.textContent = senderName;
    
        senderDiv.appendChild(senderSpan);
    
        const messageDiv = document.createElement("div");
        messageDiv.className = "message";
    
        const messageSpan = document.createElement("span");
        messageSpan.textContent = messageContent;
    
        messageDiv.appendChild(messageSpan);
    
        li.appendChild(senderDiv);
        li.appendChild(messageDiv);
    
        return li;
    }

    createBroadMessageItem(senderName) {
        console.log("createBroadMessageItem");
        const li = document.createElement("li");

        const senderDiv = document.createElement("div");
        senderDiv.className = "sender";
        senderDiv.style.paddingBottom = "30px";
        senderDiv.style.textAlign = "center";
        senderDiv.style.fontSize = "medium";
        senderDiv.style.color = "#F18C7E";
    
        const senderSpan = document.createElement("span");
        senderSpan.textContent = senderName + " 채팅 입장";
    
        senderDiv.appendChild(senderSpan);
    
        li.appendChild(senderDiv);
        return li;
    }
    
    checkClinetJoin(owner, nickName, box){
        const hasKey = this._clients.has(owner);
        if(!hasKey){
            const li = this.createBroadMessageItem(nickName);
            box.appendChild(li);
            this._clients.set(owner, nickName);
        }
    }
}