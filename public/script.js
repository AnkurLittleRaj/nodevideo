const socket =io('/')
const videoGrid =document.getElementById('video-grid');
const myVideo = document.createElement('video');
const peers ={}
myVideo.muted=true;
const myPeer = new Peer(undefined,{
   
    host:'/',
    port:'3031'
}); 
let myVideoStream;
navigator.mediaDevices.getUserMedia(
   { video:true,
    audio:true}
).then(stream=>{
myVideoStream=stream;
addVideoStream(myVideo,stream);
socket.on('user-connect',(userId)=>{
    newUserConnected(userId,stream);
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
    socket.emit('join-room',Room_Id,id);
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
// peer.listen('3001')