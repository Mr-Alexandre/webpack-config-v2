const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const ip = require("ip");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(upload.array());


app.post('/test', function (req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.send('<p>Test successful</p>');
});


const server = app.listen(8181, ip.address(), function () {
    console.log(`API server started, Available on: ${ip.address()}:8181`);
});

