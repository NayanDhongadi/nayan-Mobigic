const mongoose = require('mongoose')

require('dotenv').config();

// mongo db url
const mongoDBUrl = 'mongodb+srv://nayandhongadi26:nayandhongadi@cluster0.z8xv8.mongodb.net/assignment';




mongoose.connect(mongoDBUrl).then(()=> console.log("Database Connected")).catch((err)=>console.log(err))

