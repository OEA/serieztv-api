import express from 'express';
import vhost from 'vhost';
import bluebird from 'bluebird';
import mongoose from 'mongoose';


let app = express();
app.enable('trust proxy');

mongoose.connect('mongodb://localhost/serieztv');
mongoose.promise = bluebird;
// mongoose.connect('mongodb://52.90.67.168:3000/');
let db = mongoose.connection;

db.afterOpen = function (next) {
    db.once('open', next);
};

app.db = db;
let api = require('./Api/api').app;

//app.use(express.errorHandler(config.get('errorHandler')));

module.exports = app;