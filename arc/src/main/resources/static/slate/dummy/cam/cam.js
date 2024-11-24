/*
 *  Copyright (c) 2021 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

'use strict';

const startButton = document.getElementById('startButton');
const hangupButton = document.getElementById('hangupButton');
hangupButton.disabled = true;

const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');

let pc;
let localStream;

const signaling = new BroadcastChannel('webrtc');
signaling.onmessage = e => {
  if (!localStream) {
    console.log('not ready yet');
    return;
  }
  switch (e.data.type) {
    case 'offer':
      pipeBoxAdd("post - offer - handleOffer", "");
      handleOffer(e.data);
      break;
    case 'answer':
      pipeBoxAdd("post - answer - handleAnswer", "");
      handleAnswer(e.data);
      break;
    case 'candidate':
      pipeBoxAdd("post - candidate - handleCandidate", "");
      handleCandidate(e.data);
      break;
    case 'ready':
      // A second tab joined. This tab will initiate a call unless in a call already.
      if (pc) {
        console.log('already in call, ignoring');
        return;
      }
      pipeBoxAdd("post - ready - makeCall", "");
      makeCall();
      break;
    case 'bye':
      if (pc) {
        hangup();
      }
      break;
    default:
      console.log('unhandled', e);
      break;
  }
};

startButton.onclick = async () => {
  localStream = await navigator.mediaDevices.getUserMedia({audio: true, video: true});
  localVideo.srcObject = localStream;
  pipeBoxAdd("1. create - localStream", localStream.id);


  startButton.disabled = true;
  hangupButton.disabled = false;

  signaling.postMessage({type: 'ready'});
};

hangupButton.onclick = async () => {
  hangup();
  signaling.postMessage({type: 'bye'});
};

async function hangup() {
  if (pc) {
    pc.close();
    pc = null;
  }
  localStream.getTracks().forEach(track => track.stop());
  localStream = null;
  startButton.disabled = false;
  hangupButton.disabled = true;
};

function createPeerConnection() {
  pc = new RTCPeerConnection();
  pipeBoxAdd("2. create - peerConnection",
    { connectionState : pc.connectionState,
      iceConnectionState : pc.iceConnectionState,
      signalingState : pc.signalingState,
      remoteDescription : pc.remoteDescription,
      localDescription : pc.localDescription
    });

  pc.onicecandidate = e => {
    const message = {
      type: 'candidate',
      candidate: null,
    };
    if (e.candidate) {
      message.candidate = e.candidate.candidate;
      message.sdpMid = e.candidate.sdpMid;
      message.sdpMLineIndex = e.candidate.sdpMLineIndex;
    }
    signaling.postMessage(message);
  };

  pc.ontrack = ( e ) => {
    remoteVideo.srcObject = e.streams[0];
    pipeBoxAdd("4. pc2 - videoSrcObject - stream", e.streams[0].id);
    console.log(e);
    pipeBoxAdd("4. pc2 - videoSrcObject - track", e.track.id);
  }

  localStream.getTracks().forEach(track => {
    pc.addTrack(track, localStream);
    pipeBoxAdd("3. add - track", track.id);
    pipeBoxAdd("3. add - track", track.label);
  });

}

async function makeCall() {
  await createPeerConnection();

  const offer = await pc.createOffer();
  pipeBoxAdd("5. pc1 - createOffer", offer);

  signaling.postMessage({type: 'offer', sdp: offer.sdp});
  await pc.setLocalDescription(offer);
  pipeBoxAdd("6. pc1 - setLocalOffer", "");
}

async function handleOffer(offer) {
  if (pc) {
    console.error('existing peerconnection');
    return;
  }
  await createPeerConnection();
  await pc.setRemoteDescription(offer);
  pipeBoxAdd("7. pc2 - setRemoteOffer", offer);
  pipeBoxAdd("@ peerConnection",
    { connectionState : pc.connectionState,
      iceConnectionState : pc.iceConnectionState,
      signalingState : pc.signalingState,
      remoteDescription : pc.remoteDescription,
      localDescription : pc.localDescription
    });

  const answer = await pc.createAnswer();
  pipeBoxAdd("8. pc2 - create - answer", answer);
  pipeBoxAdd("@ peerConnection",
    { connectionState : pc.connectionState,
      iceConnectionState : pc.iceConnectionState,
      signalingState : pc.signalingState,
      remoteDescription : pc.remoteDescription,
      localDescription : pc.localDescription
    });

  signaling.postMessage({type: 'answer', sdp: answer.sdp});
  await pc.setLocalDescription(answer);
  pipeBoxAdd("9. pc2 - setLocalAnswer", answer);
  pipeBoxAdd("@ peerConnection",
    { connectionState : pc.connectionState,
      iceConnectionState : pc.iceConnectionState,
      signalingState : pc.signalingState,
      remoteDescription : pc.remoteDescription,
      localDescription : pc.localDescription
    });
}

async function handleAnswer(answer) {
  if (!pc) {
    console.error('no peerconnection');
    return;
  }
  await pc.setRemoteDescription(answer);
  pipeBoxAdd("10. pc1 - setRemoteAnswer", answer);
  pipeBoxAdd("@ peerConnection",
    { connectionState : pc.connectionState,
      iceConnectionState : pc.iceConnectionState,
      signalingState : pc.signalingState,
      remoteDescription : pc.remoteDescription,
      localDescription : pc.localDescription
    });
}

async function handleCandidate(candidate) {
  if (!pc) {
    console.error('no peerconnection');
    return;
  }
  if (!candidate.candidate) {
    await pc.addIceCandidate(null);
  } else {
    await pc.addIceCandidate(candidate);
    pipeBoxAdd("11. addIceCandidate", candidate);
    pipeBoxAdd("@ peerConnection",
      { connectionState : pc.connectionState,
        iceConnectionState : pc.iceConnectionState,
        signalingState : pc.signalingState,
        remoteDescription : pc.remoteDescription,
        localDescription : pc.localDescription
      });
  }
}

function pipeBoxAdd(title, obj){
  const pipeBox = document.getElementsByClassName("pipe-box")[0];
  const newP = document.createElement("p");
  let append = JSON.stringify(obj);
  if(isEmpty(append) || append === "{}" ){
    console.log(title);
    console.log(obj);
      append = obj;
  }

  let today = new Date();   

  let hours = today.getHours(); // 시
  let minutes = today.getMinutes();  // 분
  let seconds = today.getSeconds();  // 초
  let milliseconds = today.getMilliseconds(); // 밀리초

  const time = hours + ':' + minutes + ':' + seconds + ':' + milliseconds;

  newP.innerHTML = title + ":: " + append + "<br>" + time;
  pipeBox.appendChild(newP);
}

function isEmpty(str){
		
  if(typeof str == "undefined" || str == null || str == "")
      return true;
  else
      return false ;
}