const express = require('express');
const bodyParser = require('body-parser');
const ytdl = require('ytdl-core');
const fs = require('fs');

const app = express();
const PORT = 8080;

app.listen(PORT, () =>
  console.log('Serveur lancé')
);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());

app.post('/', (req, res, next) => {
    console.log(req.body.url);
    ytdl(req.body.url, {filter: 'audioonly'})
      .pipe(fs.createWriteStream('video.mp4'));
    res.send(req.body);
    next();
  }
);
