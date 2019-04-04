const express = require('express');
const path = require('path');

const bodyParser = require('body-parser');
const morgan = require('morgan');

const apiRouter = require('./router/api_v1');
const app = express();

//middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());

//routes
app.use('/', apiRouter);


 //static files
app.use(express.static(path.join(__dirname,'/dist/calendario-app')))

app.listen(3000, () =>{

    console.log('server on port 3000');

}); 