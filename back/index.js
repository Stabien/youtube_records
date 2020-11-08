const express = require('express');
const bodyParser = require('body-parser');
const ytdl = require('ytdl-core');
const { getInfo } = require('ytdl-getinfo');
const fs = require('fs');
const converter = require('video-converter');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');

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
  let handleRequest = (req, res, next) => {
    getInfo(req.body.url)
      .catch(err => {
        console.log(err);
        handleRequest(req, res, next);
      })
      .then(async (info) => {
        const title = info.items[0].title;
        const titleServerSide = title + Date.now();
        // Create file
        ytdl(req.body.url, { filter: 'audioonly'})
          .pipe(fs.createWriteStream(titleServerSide + '.mp4'))
          .on('finish', () => {
            // Convert from mp4 to mp3
            ffmpeg.setFfmpegPath(ffmpegPath);
            new ffmpeg({ source: titleServerSide + '.mp4' })
              .saveToFile(titleServerSide + '.mp3')
              .on('end', () => {
                // Send response
                res.json({
                  fileName: title + '.mp3',
                  fileNameServerSide: titleServerSide
                });
              });
          });
      });
  }
  handleRequest(req, res, next);
});

app.post('/download', (req, res) => {
  res.download(req.body.fileNameServerSide + '.mp3');
  // Delete files
  setTimeout(() => {
    fs.unlink(req.body.fileNameServerSide + '.mp4', err => {
      console.log('mp4 file deleted');
    });
    fs.unlink(req.body.fileNameServerSide + '.mp3', err => {
      console.log('mp3 file deleted');
    });
  }, 300000);
});
