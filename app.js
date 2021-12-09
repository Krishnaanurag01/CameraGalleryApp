let express = require("express") ;

let app = express() ;
app.use(express.static("public"));
let port = process.env.PORT || 5000 ;

let server = app.listen(port , () => {
    console.log(`listening to port- ${port}.`);
})