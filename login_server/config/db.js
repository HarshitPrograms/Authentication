//2
require('dotenv').config();
const mongoose = require("mongoose"); //we use mongoose to connect to our database

mongoose
     .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true, useUnifiedTopology:true,
    })
    .then(()=> {
      console.log('Connected to MongoDB');
    })
    .catch((err) => console.log(err));
