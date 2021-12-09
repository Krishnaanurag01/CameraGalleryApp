setTimeout(() => {

    if (db) {

        // accessing videos.

        let VideoDbTransaction = db.transaction("video", "readonly");
        let videoStored = VideoDbTransaction.objectStore("video");
        let allVideoReq = videoStored.getAll(); // event driven

        allVideoReq.onsuccess = (e) => {

            let allVideos = allVideoReq.result;

            let gallery_cont = document.querySelector(".gallery-cont");

            allVideos.forEach((videoReqObj) => {

                let videoId = videoReqObj.id;
                let videoUrl = URL.createObjectURL(videoReqObj.blobData);

                let media_cont = document.createElement("div");

                media_cont.setAttribute("class", "media-cont");
                media_cont.setAttribute("id", `${videoId}`);

                media_cont.innerHTML = `
                
                <div class="media">
                <video autoplay loop src="${videoUrl}"></video>
                </div>
                <div class="download action-btn">Download</div>
                <div class="delete action-btn">Delete</div>
                `;

                gallery_cont.appendChild(media_cont);

                // using listner
                
                let deleteBtn = media_cont.querySelector(".delete");
                deleteBtn.addEventListener("click", deleteListner );

                let downloadBtn = media_cont.querySelector(".download");
                downloadBtn.addEventListener("click", downloadListner );


            });
        }


        /// accessing images.

        let ImageDbTransaction = db.transaction("image", "readonly");
        let ImagesStored = ImageDbTransaction.objectStore("image");
        let allImageReq = ImagesStored.getAll(); // event driven

        allImageReq.onsuccess = (e) => {

            let allImages = allImageReq.result;

            let gallery_cont = document.querySelector(".gallery-cont");

            allImages.forEach((ImageReqObj) => {

                let imgId = ImageReqObj.id;
                let imgUrl = ImageReqObj.Url;

                let media_cont = document.createElement("div");

                media_cont.setAttribute("class", "media-cont");
                media_cont.setAttribute("id", `${imgId}`);

                media_cont.innerHTML = `
                
                <div class="media">
                <img  src="${imgUrl}" />
                </div>
                <div class="download action-btn">Download</div>
                <div class="delete action-btn">Delete</div>
                `;

                gallery_cont.appendChild(media_cont);


                /// using listner.

                let deleteBtn = media_cont.querySelector(".delete");
                deleteBtn.addEventListener("click", deleteListner );

                let downloadBtn = media_cont.querySelector(".download");
                downloadBtn.addEventListener("click", downloadListner );


            });
        }

    }}
, 100);


function deleteListner(e) {
    
    let id = e.target.parentElement.getAttribute("id");
    
    if(id.slice(0,3) === "vid"){

        let VideoDbTransaction = db.transaction("video", "readwrite");
        let videoStored = VideoDbTransaction.objectStore("video");
        videoStored.delete(id) ;

    }
    else{
       
        let ImageDbTransaction = db.transaction("image", "readwrite");
        let ImagesStored = ImageDbTransaction.objectStore("image");
        ImagesStored.delete(id) ;

    }

    e.target.parentElement.remove() ;
}


function downloadListner(e) {

    let id = e.target.parentElement.getAttribute("id");
    let type = id.slice(0,3) ;

    if(type === "vid"){

        let VideoDbTransaction = db.transaction("video", "readwrite");
        let videoStored = VideoDbTransaction.objectStore("video");
        let video = videoStored.get(id) ;
        video.onsuccess = (e) => {
            let videoResult = video.result ;

            let videoUrl = URL.createObjectURL(videoResult.blobData) ;

            let a = document.createElement("a");
            a.href = videoUrl ;
            a.download = "stream.mp4" // name of the file
            a.click() ;
        }

    }
    else{

          let imageDbTransaction = db.transaction("image", "readwrite");
        let imageStored = imageDbTransaction.objectStore("image");
        let image = imageStored.get(id) ;
        image.onsuccess = (e) => {
            let imageResult = image.result ;

            let imageUrl = imageResult.Url ;

            let a = document.createElement("a");
            a.href = imageUrl ;
            a.download = "image.jpg" // name of the file
            a.click() ;

    }
}
}