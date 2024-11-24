

    const type = {
        createPeer : 0,
        createOffer : 1,
        setLocalOffer : 2,

        handleOffer : 3,
        remoteCreatePeer : 4,
        setRemoteResponseOffer : 5,
        createAnswer : 6,
        setLocalAnswer : 7,

        handleAnswer : 8,
        setRemoteResponseAnswer : 9,
        data : 10,

        get : 11,
        post : 12,

    }

    // local
    let peerConnection;
    let dataChannel;
    let offer;

    // remote
    let responseOffer;
    let remotePeerConnection;
    let answer;

    // local
    let responseAnswer;


    // vidio
    let video;
    let stream;

    let endPoint = "https://172.30.1.18:8081/memo"
    document.addEventListener("DOMContentLoaded", (event)=>{

        const buttos = document.getElementsByClassName("button");
        for(let i = 0; i < buttos.length; ++i){
            buttos[i].addEventListener("click", (event)=>{
                buttonClick(i);
            });
        }

        video = document.getElementsByClassName("video")[0];
        navigator.mediaDevices.getUserMedia({audio: true, video: true})
        .then( s => {
            stream = s;
            video.srcObject = stream;
        })
        .catch(err => alert(err));

    })

    async function buttonClick(buttonIndex){
        if(buttonIndex === type.createPeer){

            console.log('%c create peer ', styles);
            peerConnection = new RTCPeerConnection();
            console.log(peerConnection);

            console.log('%c create stream ', styles);
            stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

            const rc = (peerConnection) ? peerConnection : remotePeerConnection;
            rc.ontrack = (event) => {
                const remoteVideo = document.getElementsByClassName("video")[1];
                remoteVideo.srcObject = event.streams[0]; // 원격 비디오 스트림을 연결
            };

            console.log('%c create dataChannel ', styles);
            dataChannel = peerConnection.createDataChannel("channel");

            dataChannel.onopen = (event) => {
                console.log('%c connection open ', styles);
            };

            dataChannel.onmessage = (event) => {
                console.log('%c got a message ', styles);
                console.log(event.data);
            };

            peerConnection.onicecandidate = (event) =>{
                console.log('%c new ice candidate ', styles);
                console.log(event);
                console.log(peerConnection.localDescription);
                console.log(JSON.stringify(peerConnection.localDescription));

                // value Offer And Ice
                navigator.clipboard.writeText(JSON.stringify(peerConnection.localDescription));

                console.log('%c add Candidate ', styles);
            }

        }

        if(buttonIndex === type.createOffer){
            console.log('%c create offer ', styles);
            offer = await peerConnection.createOffer();
            console.log('%c create offer - log ', styles);
            console.log(offer);
            console.log(JSON.stringify(offer));
        }

        if(buttonIndex === type.setLocalOffer){
            console.log('%c set Local Offer ', styles);
            await peerConnection.setLocalDescription(offer);
            console.log('%c Success ', styles);
            console.log(peerConnection);
        }

        if(buttonIndex === type.handleOffer){
            const input = document.getElementsByClassName("handle-offer-input")[0];
            const value = input.value;

            console.log('%c handle response offer ', styles);
            responseOffer = JSON.parse(value);
            console.log(responseOffer);
        }

        if(buttonIndex === type.remoteCreatePeer){

            console.log('%c remote create peer ', styles);
            remotePeerConnection = new RTCPeerConnection();
            console.log(remotePeerConnection);

            console.log('%c remote create stream ', styles);
            stream.getTracks().forEach(track => remotePeerConnection.addTrack(track, stream));

            const rc = (peerConnection) ? peerConnection : remotePeerConnection;
            rc.ontrack = (event) => {
                const remoteVideo = document.getElementsByClassName("video")[1];
                remoteVideo.srcObject = event.streams[0]; // 원격 비디오 스트림을 연결
            };

            remotePeerConnection.onicecandidate = (event) =>{
                console.log('%c new ice candidate ', styles);
                console.log(event);
                console.log(remotePeerConnection.localDescription);
                console.log(JSON.stringify(remotePeerConnection.localDescription));

                // value Offer And Ice
                navigator.clipboard.writeText(JSON.stringify(remotePeerConnection.localDescription));
                const input = document.getElementsByClassName("memo-input")[0];
                input.value = JSON.stringify(remotePeerConnection.localDescription);
            }

            remotePeerConnection.ondatachannel = (event)=> {
                remotePeerConnection.dc = event.channel;
                remotePeerConnection.dc.onopen = (event)=>{
                    console.log('%c connection open ', styles);

                    const rc = (peerConnection) ? peerConnection : remotePeerConnection;
                    rc.ontrack = (event) => {
                        const remoteVideo = document.getElementsByClassName("video")[1];
                        remoteVideo.srcObject = event.streams[0]; // 원격 비디오 스트림을 연결
                    };
                }
                remotePeerConnection.dc.onmessage = (event)=>{
                    console.log('%c got a message ', styles);
                    console.log(event.data);
                }
            }
        }

        if(buttonIndex === type.setRemoteResponseOffer){
            console.log('%c set Remote response Offer ', styles);
            await remotePeerConnection.setRemoteDescription(responseOffer);
            console.log('%c Success ', styles);
            console.log(remotePeerConnection);
        } 

        if(buttonIndex === type.createAnswer){
            console.log('%c create Answer ', styles);
            answer = await remotePeerConnection.createAnswer();
            console.log('%c create Answer - log ', styles);
            console.log(answer);
        }

        if(buttonIndex === type.setLocalAnswer){
            console.log('%c set Local answer ', styles);
            await remotePeerConnection.setLocalDescription(answer);
            console.log('%c Success ', styles);
            console.log(remotePeerConnection);
        }

        if(buttonIndex === type.handleAnswer){
            const input = document.getElementsByClassName("handle-answer-input")[0];
            const value = input.value;

            console.log('%c handle response answer ', styles);
            responseAnswer = JSON.parse(value);
            console.log(responseAnswer);
        }

        if(buttonIndex === type.setRemoteResponseAnswer){
            console.log('%c set Remote response answer ', styles);
            await peerConnection.setRemoteDescription(responseAnswer);
        }

        if(buttonIndex === type.data){
            const input = document.getElementsByClassName("data-input")[0];
            const value = input.value;
            if(dataChannel){
                dataChannel.send(value);
            }
            else{
                remotePeerConnection.dc.send(value);
            }
        }

        if(buttonIndex === type.get){
            const input = document.getElementsByClassName("memo-input")[0];
            fetch(endPoint)
            .then(response => {
                return response.text();
            })
            .then(data => {
                input.value = "";
                input.value = data;
            });
        }

        if(buttonIndex === type.post){
            const input = document.getElementsByClassName("memo-input")[0];
            const value = input.value;
            fetch(endPoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain'
                },
                body : value
            })
            .then(response => {
                return response.text();
            })
            .then(data => {
                input.value = "";
                input.value = data;
                const con = document.getElementsByClassName("con")[0];
                const child = document.createElement("li");
                child.innerHTML = value;
                con.appendChild(child);

            })
            .catch(err =>{
                alert(err);
            })
        }

    }

    let styles = [
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