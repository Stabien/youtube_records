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
  let nbRecursiveCalls = 0;
  let handleRequest = (req, res, next) => {
    getInfo(req.body.url)
      .catch(err => {
        console.log(err);
        if (nbRecursiveCalls <= 10)
          handleRequest(req, res, next);
        nbRecursiveCalls++;
      })
      .then((info) => {
        const title = info.items[0].title;
        const titleServerSide = title + Date.now();
        // Create file
        ytdl(req.body.url, { filter: 'audioonly' })
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
                next();
              });
          });
        // Delete files after 15 minutes
        setTimeout(() => {
          if (fs.existsSync(titleServerSide + '.mp4'))
            fs.unlink(titleServerSide + '.mp4', () => console.log(titleServerSide + '.mp4'));
          if (fs.existsSync(titleServerSide + '.mp3'))
            fs.unlink(titleServerSide + '.mp3', () => console.log('mp3 file deleted'));
        }, 900000);
      });
  }
  handleRequest(req, res, next);
});

app.post('/download', (req, res) => {
  res.download(req.body.fileNameServerSide + '.mp4');
});
