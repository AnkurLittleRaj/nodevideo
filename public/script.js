const socket =io('/')
const videoGrid =document.getElementById('video-grid');
const myVideo = document.createElement('video');
//const child_process = require("child_process");
const peers ={}
myVideo.muted=true;
const myPeer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '443'
  })
let myVideoStream;
navigator.mediaDevices.getUserMedia(
   { video:true,
    audio:true}
).then(stream=>{
myVideoStream=stream;
//child_process.execSync("sleep 5");

addVideoStream(myVideo,stream);
socket.on('user-connect',(userId)=>{
     setTimeout(function() {
        newUserConnected(userId,stream);
        console.log('Blah blah blah blah extra-blah');
    }, 1000);
   
})
myPeer.on('call',call=>{
    call.answer(stream); 
    const video = document.createElement('video');
    
    call.on('stream', userVideoStream=> {
        addVideoStream(video,userVideoStream);
    
    });

})

});
socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close()
  })
myPeer.on('open',id=>{
    socket.emit('join-room',ROOM_ID,id);
})

const newUserConnected=(userId,stream)=>{
    const call = myPeer.call(userId,stream);
    const video = document.createElement('video');
    call.on('stream',(uservideoStream)=>{
        addVideoStream(video,uservideoStream)
    })
    call.on('close', () => {
        video.remove()
      })
    
      peers[userId] = call
    
console.log("new User connected")
}
const addVideoStream = (video,stream)=>{

    video.srcObject=stream;
    video.addEventListener('loadedmetadata',()=>{
        video.play()
    });
    videoGrid.append(video)   
    
}
// var url = document.location.href;

// var clipboard =  new Clipboard('#inviteButton', {
//   text: function() {
//     return url;
//   }
// });


function myFunction() {
        var dummy = document.createElement('input'),
        text = window.location.href;
    
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
  }
// var InviteButton = document.getElementById("inviteButton");
// document.execCommand("copy");
// var muteButton = document.getElementById("muteButton");
// if(muteButton){
// muteButton.addEventListener('click',()=>{
//     debugger
//     if(video.muted){
//         video.muted=false
//     }
//     else{
//         video.muted=true;
//     }
// })}
// peer.listen('3001')

