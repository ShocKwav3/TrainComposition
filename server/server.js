import express from 'express';
const app = express();
import logger from 'morgan';
import _ from 'lodash';
const http = require('http').Server(app);
const io = require('socket.io')(http);
import path from 'path';
let port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'bundled')));
app.use(logger('dev'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'bundled') + '/index.html');
});

http.listen(port, () => {
  console.log(`Train composition viewer running on port ${port}`);
});
