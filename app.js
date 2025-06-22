const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const router = require("./src/routes");
require('dotenv').config();


// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'))
app.use(express.urlencoded({ extended: true }));
app.disable('x-powered-by')
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


app.use('/api/v1', router);
app.use('/images', express.static('images'));



app.get("/", (req, res) => {
  res.send("Route is working! YaY!");
});

module.exports = app;