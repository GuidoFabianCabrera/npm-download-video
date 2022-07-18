const fs = require('fs');
const ytdl = require('ytdl-core');

const Innertube = require('youtubei.js');

const downloadVideo = async (url) => {
  let VIDEO_ID = await ytdl.getInfo(url);

  console.log(VIDEO_ID.videoDetails.videoId);

  const youtube = await new Innertube();
  const stream = youtube.download(VIDEO_ID.videoDetails.videoId, {
    format: 'mp4',
    quality: '1080p',
    type: 'videoandaudio',
  });

  stream.pipe(fs.createWriteStream(`./${VIDEO_ID.videoDetails.videoId}.mp4`));

  stream.on('start', () => {
    console.info('[YOUTUBE.JS]', 'Starting now!');
  });

  stream.on('info', (info) => {
    console.info(
      '[YOUTUBE.JS]',
      `Downloading ${info.video_details.title} by ${info.video_details.metadata.channel_name}`
    );
  });

  stream.on('progress', (info) => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(
      `[YOUTUBE.JS] Downloaded ${info.percentage}% (${info.downloaded_size}MB) of ${info.size}MB`
    );
  });

  stream.on('end', () => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    console.info('[YOUTUBE.JS]', 'Done!');
  });

  stream.on('error', (err) => console.error('[ERROR]', err));
};

(async () => {
  console.log('----------\n');

  // await downloadVideo('https://www.youtube.com/watch?v=LXb3EKWsInQ');
  await downloadVideo(
    'https://www.youtube.com/watch?v=tO01J-M3g0U&ab_channel=Jacob%2BKatieSchwarz'
  );

  console.log('\n----------');
})();
