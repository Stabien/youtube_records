module.exports = {
  conversion: (nbRecursiveCalls, req, title, titleServerSide) => {
    if (nbRecursiveCalls >= 4) {
     io.sockets.emit('error', { error: 'Problème durant la conversion, veuillez réessayer' });
     throw new Error('Impossible to create file');
    }
    const d = domain.create();
    // Create file and rerun function if error
    d.run(() => {
     ytdl(req.body.url, { filter: 'audioonly' })
       .pipe(fs.createWriteStream(titleServerSide + '.mp4'))
       .on('finish', () => {
         // Convert from mp4 to mp3
         ffmpeg.setFfmpegPath(ffmpegPath);
         new ffmpeg({ source: titleServerSide + '.mp4' })
           .saveToFile(titleServerSide + '.mp3')
           .on('end', () => {
             // Send Socket.io response
             io.sockets.emit('fileUpload', {
               fileName: title + '.mp3',
               fileNameServerSide: titleServerSide
             });
           });
       });
    });
    nbRecursiveCalls += 1;
    d.on('error', () => conversion(nbRecursiveCalls, req, title, titleServerSide));
  }
}
