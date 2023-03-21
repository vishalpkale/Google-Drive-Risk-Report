const express = require('express');
const route = require('./routes/route.js');
const mongoose  = require('mongoose');
const app = express();
const cors=require('cors')


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


mongoose.connect("mongodb+srv://vishalkale:vishalpkale@cluster0.ofyxk.mongodb.net/18Labs", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

app.use('/', route);


app.listen(process.env.PORT || 5001, function () {
    console.log('Express app running on port ' + (process.env.PORT || 5001))
})