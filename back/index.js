const express = require('express');
const bodyParser = require('body-parser');
const ytdl = require('ytdl-core');
const { getInfo } = require('ytdl-getinfo');
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

app.post('/', async (req, res, next) => {
  getInfo(req.body.url)
  .then(async (info) => {
    let title = info.items[0].title + '.mp4';
    await ytdl(req.body.url, { filter: 'audioonly' })
      .pipe(fs.createWriteStream(title));
    res.json({ fileName: title });
    next();
  });
});

app.get('/download', (req, res) => {
  res.download('./video.mp4');
});
