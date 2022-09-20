const express = require("express");
const bodyParser = require('body-parser');
const multer = require('multer');
const route = require('./routes/router.js');
const mongoose = require('mongoose');
const app = express();

app.use(bodyParser.json());
app.use(multer().any())
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect("mongodb+srv://rahul_8651080470:7tvW8IuaU608kdhl@cluster0.zmjtewh.mongodb.net/project2", {
    useNewUrlParser: true,
})
.then( () => console.log("MongoDb is successfully connected!"))
.catch( err => console.log(err) )

app.use('/', route);


app.listen(process.env.PORT || 3001, function(){
    console.log('Express app running on port' + (process.env.PORT || 3001))
});