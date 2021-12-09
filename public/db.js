let db ;

let openIndexed = indexedDB.open("myDb");

openIndexed.addEventListener("success", (e) => {

    console.log("Success");
    db = openIndexed.result ;

}) ;

openIndexed.addEventListener("error" , (e) => { 

    console.log("error occured");

});

openIndexed.addEventListener("upgradeneeded" , (e) => { 

    console.log("Upgraded Occured");

    db = openIndexed.result ;


    db.createObjectStore("video" , {keyPath : "id" });  // keypath is acting as primary key here.
    db.createObjectStore("image" , {keyPath : "id" });
});