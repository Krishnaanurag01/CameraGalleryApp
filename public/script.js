let video = document.querySelector("video") ;

let record_btn_cont = document.querySelector(".record-btn-cont");
let record_btn = document.querySelector(".record-btn");

let capture_btn_cont = document.querySelector(".capture-btn-cont");
let capture_btn = document.querySelector(".capture-btn");

let record_flag = false ;
let color = "transparent" ;


let constraints = {
    video : true,
    audio : true
}

let recorder ;
let chunks = [] ; // this will store video in the form  of chunks.

// navigator is global object that has every info of browser


//The MediaDevices interface provides access to connected media input devices like cameras and microphones, as well as screen sharing. In essence, it lets you obtain access to any hardware source of media data.

//getUserMedia() = >
// With the user's permission through a prompt, turns on a camera and/or a microphone on the system and provides a MediaStream containing a video track and/or an audio track with the input.


navigator.mediaDevices.getUserMedia(constraints)
.then( (stream) => {
    video.srcObject = stream ;
    recorder = new MediaRecorder(stream) ;

    recorder.addEventListener("start", (e)=> {
        chunks = [] ;
    });

    recorder.addEventListener("dataavailable", (e) => {
        chunks.push(e.data) ;// saving video chunk wise.
    })

    recorder.addEventListener("stop", (e) => {

        let blob = new Blob(chunks , {type : "video/mp4" }) ;


        if(db){
            let videoId = shortid() ;
            let Dbtransaction = db.transaction("video","readwrite");
            let videoStore = Dbtransaction.objectStore("video") ;

            let videoEntry = {
                id :`vid-${videoId}`,
                blobData : blob
            }

            videoStore.add(videoEntry) ;

        }



        // let videoUrl = URL.createObjectURL(blob) ;

        // let a = document.createElement("a");
        // a.href = videoUrl ;
        // a.download = "stream.mp4" // name of the file
        // a.click() ;
    })


} ) ;


record_btn_cont.addEventListener("click", (e) => {
    if(!recorder) return ;

    record_flag = !record_flag ;

    if(record_flag) // when recorder start
    {
        recorder.start() ;
        record_btn.classList.add("scale-record") ;
        startTimer();

    }// when stoped
    else{

        recorder.stop() ;
        record_btn.classList.remove("scale-record") ;
        stopTimer();
    }

}) ;



capture_btn_cont.addEventListener("click", (e) => {


    capture_btn.classList.add("scale-capture");
    let canvas  = document.createElement("canvas");
    canvas.width = video.videoWidth ;
    canvas.height = video.videoHeight ;

    let tool = canvas.getContext("2d");

    tool.drawImage(video,0,0,canvas.width,canvas.height); // drawing image on video , from 0 , 0 (x,y) to width,heigh(y,z)

    tool.fillStyle = color ;
    tool.fillRect(0,0,canvas.width,canvas.height) ;

    let imageUrl = canvas.toDataURL() ;

    if(db){
        let imageId = shortid() ;
        let Dbtransaction = db.transaction("image","readwrite");
        let imageStore = Dbtransaction.objectStore("image") ;

        let imageEntry = {
            id : `img-${imageId}`,
            Url : imageUrl 
        }

        imageStore.add(imageEntry) ;

    }

    setTimeout( ()=>{
    capture_btn.classList.remove("scale-capture") } , 1000) ;
})


let counter = 0 ;
let intervalId ;
let timer = document.querySelector(".timer");

function startTimer() {
    

    function displayTime() {
    timer.style.display= "block" ;

        
        let totalSeconds = counter ;

        let hours = Number.parseInt( totalSeconds / 3600 ) ;
        totalSeconds = totalSeconds % 3600 ;

        let mins = Number.parseInt( totalSeconds / 60 ) ;
        totalSeconds = totalSeconds % 60 ;

        let second = totalSeconds ;

        hours = (hours < 10 ) ? `0${hours}` : hours ;
        mins = (mins < 10 ) ? `0${mins}` : mins ;
        second = (second < 10 ) ? `0${second}` : second ;

        timer.innerText = `${hours}:${mins}:${second}`
        counter++ ;
    }

    intervalId = setInterval( displayTime , 1000) ;
}


function stopTimer() {
    clearInterval(intervalId) ;
    timer.innerText = `00:00:00` ;
    timer.style.display= "none" ;
}



// filtering logic
let filter_layer = document.querySelector(".filter-layer");
let allFilters = document.querySelectorAll(".filter");

allFilters.forEach( (filterElem) => {
    
    filterElem.addEventListener("click", (e) => {

        // getting colours
        color = getComputedStyle(filterElem).getPropertyValue("background-color") ;
        filter_layer.style.backgroundColor = color ;
    })
});

