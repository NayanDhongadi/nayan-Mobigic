const express = require('express')
const app = express();
const router = require('./routes/router')
const bodyParser = require('body-parser');

require('./db/conn')
const cors = require('cors');
app.use(bodyParser.json());

require('dotenv').config(); 

const port = 5000;


    
app.use(cors());
app.use(express.json());
app.use(router);




app.listen(port
    , () => {
    console.log(`Server started on port ${port}`);
})














