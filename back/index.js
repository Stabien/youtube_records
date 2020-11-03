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

app.post('/', (req, res, next) => {
  let title;

  getInfo(req.body.url).then((info) => {
    title = info.items[0].title + '.mp4';
    ytdl(req.body.url, { filter: 'audioonly' })
      .pipe(fs.createWriteStream(title));

    setTimeout(() => {
      fs.unlink(title, err => {
        if (err) throw err;
        console.log('file deleted');
      });
    }, 30000);

    res.json({ fileName: title });
    next();
  });
});

app.post('/download', (req, res) => {
  console.log(req.body.fileName);
  console.log('test');
  res.download(req.body.fileName);
});
