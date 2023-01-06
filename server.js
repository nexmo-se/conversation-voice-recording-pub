require('dotenv').config();
let express = require('express');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let app = express();
let port = process.env.SERVER_PORT;
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/', express.static('build'));
const { exec } = require('child_process');

const NGROK_URL = process.env.NGROK_URL;

const Vonage = require('@vonage/server-sdk');
const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET,
  applicationId: process.env.VONAGE_APPLICATION_ID,
  privateKey: process.env.VONAGE_APPLICATION_PRIVATE_KEY,
});

const Pusher = require('pusher');
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: process.env.PUSHER_USE_TLS,
});

var date,
  fromNumber,
  pusherID,
  CONVERSATION_ID,
  done = '';

app.get('/', () => {
  console.log('🚚 convrec');
});

app.post('/recording', (req, res) => {
  console.log('🚚 recording', req.body);
  console.log('🎙️', req.body.recording_url);
  let fileName = `./public/files/${req.body.timestamp}.mp3`;
  vonage.files.save(req.body.recording_url, fileName, (err, res) => {
    if (err) {
      console.error('\n🔥 Error Saving MP3', err);
    } else {
      console.log('\n✅ ', res);
    }
  });
  res.status(200).send();
});

app.post('/startDemo', (req, res) => {
  console.log('🚚  startDemo', req.body);

  // Remove all MP3 from public and public/files
  exec(
    'rm -rf public/files/*.mp3 && rm -rf public/*.mp3',
    (error, data, getter) => {
      if (error) {
        console.log('🔥 Exec Error', error.message);
        return;
      }
      if (getter) {
        console.log('✅ Exec Getter Data');
        return;
      }
      console.log('✅ Purged MP3');
    }
  );

  date = new Date();
  pusherID = req.body.pusherID;
  pusher.trigger('answer', pusherID, {
    pushData: {
      date: date.toString(),
      fromNumber: req.body.from,
      pusherID: req.body.pusherID,
      status: req.body.status,
      convID: CONVERSATION_ID,
      endPoint: req.body.endPoint,
    },
  });
  res.status(200).send();
});

app.post('/webhooks/answer', async (req, res) => {
  console.log('🚚  answer - req.body', req.body);
  let request = req.body;
  fromNumber = req.body.from;
  status = req.body.status;

  const createCallConversationPromise = (ConvName, ConvDisplayName) =>
    new Promise((resolve, reject) => {
      vonage.conversations.create(
        {
          name: ConvName,
          display_name: ConvDisplayName,
        },
        (error, result) => (error ? reject(error) : resolve(result))
      );
    });

  try {
    // CREATE A CONVERSATION_NAME, USED IN NCCO AND TO MAKE CONVERSATION_ID
    // CONVERSATION_ID IS ALSO USED TO START/STOP RECORDING
    let ConvName = request.from + request.to + request.conversation_uuid;
    let ConvDisplayName = request.from + request.to + request.conversation_uuid;
    const conversation = await createCallConversationPromise(
      ConvName,
      ConvDisplayName
    );
    CONVERSATION_ID = conversation.id;
    console.log('\n✅ CONVERSATION_ID', CONVERSATION_ID);
    console.log('✅ ConvName', ConvName);
    console.log('✅ eventUrl', `${NGROK_URL}/recording`);

    let ncco = [
      {
        action: 'talk',
        text: "<speak><lang xml:lang='en-US'>Welcome to Vonage Conversation Recording Demo. Press Start and Stop to control recording. Press Done when finished.</lang></speak>",
        voiceName: 'Emma',
      },
      {
        action: 'conversation',
        name: ConvName,
        startOnEnter: true,
        endOnExit: true,
        eventMethod: 'POST',
        eventUrl: [`${NGROK_URL}/recording`],
      },
    ];
    res.json(ncco);

    pusher.trigger('answer', pusherID, {
      pushData: {
        date: date.toString(),
        fromNumber: req.body.from,
        pusherID: pusherID,
        status: req.body.status,
        convID: CONVERSATION_ID,
        endPoint: 'answer',
      },
    });
  } catch (error) {
    console.log('🔥 Error', error);
    let ncco = [
      {
        action: 'talk',
        text: "<speak><lang xml:lang='en-US'>Error on Process Answer</lang></speak>",
        voiceName: 'Emma',
      },
    ];
    res.json(ncco);
    pusher.trigger('answer', pusherID, {
      pushData: {
        date: date.toString(),
        fromNumber: fromNumber,
        pusherID: pusherID,
        status: 'error',
        convID: CONVERSATION_ID,
        endPoint: 'answer',
      },
    });
  }
});

app.post('/startRecording', (req, res) => {
  console.log('🚚  startRecording - req.body', req.body);
  console.log('CONVERSATION_ID', CONVERSATION_ID);

  vonage.conversations.record(
    CONVERSATION_ID,
    {
      action: 'start',
      event_url: [`${NGROK_URL}/recording`],
      event_method: 'POST',
      split: 'conversation',
      format: 'mp3',
    },
    (error, response) => {
      if (error) {
        console.log('\n🔥 Error Start Recording', error);
        pusher.trigger('answer', pusherID, {
          pushData: {
            date: date.toString(),
            fromNumber: fromNumber,
            pusherID: pusherID,
            status: 'Error Starting',
            convID: CONVERSATION_ID,
            endPoint: 'startRecording',
          },
        });
      } else {
        console.log('\n✅ Sucess Start Recording', response);
        pusher.trigger('answer', pusherID, {
          pushData: {
            date: date.toString(),
            fromNumber: fromNumber,
            pusherID: pusherID,
            status: 'Recording Started',
            convID: CONVERSATION_ID,
            endPoint: 'startRecording',
          },
        });
      }
    }
  );
});

app.post('/stopRecording', (req, res) => {
  console.log('🚚 stopRecording - req.body', req.body);
  console.log('CONVERSATION_ID', CONVERSATION_ID);

  vonage.conversations.record(
    CONVERSATION_ID,
    {
      action: 'stop',
      event_url: [`${NGROK_URL}/recording`],
      event_method: 'POST',
      split: 'conversation',
      format: 'mp3',
    },
    (error, response) => {
      if (error) {
        console.log('\n🔥 Error Stop Recording', error);
        pusher.trigger('answer', pusherID, {
          pushData: {
            date: date.toString(),
            fromNumber: fromNumber,
            pusherID: pusherID,
            status: 'Error Stopping',
            convID: CONVERSATION_ID,
            endPoint: 'stopRecording',
          },
        });
      } else {
        console.log('\n✅ Sucess Stop Recording', response);
        pusher.trigger('answer', pusherID, {
          pushData: {
            date: date.toString(),
            fromNumber: fromNumber,
            pusherID: pusherID,
            status: 'Recording Stop',
            convID: CONVERSATION_ID,
            endPoint: 'stopRecording',
          },
        });
      }
    }
  );
});

app.post('/doneRecording', (req, res) => {
  console.log('🚚  doneRecording - req.body', req.body);
  done = true;
  if (req.body.status === 'Done' && done === true) {
    exec('node rename.js', (error, data, getter) => {
      if (error) {
        console.log('🔥 Exec Error', error.message);
        return;
      }
      if (getter) {
        console.log('✅ Exec Getter Data');
        return;
      }
      console.log('✅ Exec node rename.js');
    });
  }

  pusher.trigger('answer', pusherID, {
    pushData: {
      date: date.toString(),
      fromNumber: fromNumber,
      pusherID: pusherID,
      status: 'Done Recording',
      convID: CONVERSATION_ID,
      endPoint: 'doneRecording',
    },
  });
});

app.post('/webhooks/event', (req, res) => {
  console.log('🚚  event', req.body);

  if (req.body.status === 'answered') {
    pusher.trigger('answer', pusherID, {
      pushData: {
        date: date.toString(),
        fromNumber: fromNumber,
        pusherID: pusherID,
        status: req.body.status,
        convID: CONVERSATION_ID,
        endPoint: 'event',
      },
    });
  }

  if (req.body.status === 'completed' && done === true) {
    exec('rm -rf public/files/*.mp3', (error, data, getter) => {
      if (error) {
        console.log('🔥 Exec Error', error.message);
        return;
      }
      if (getter) {
        console.log('✅ Exec Getter Data');
        return;
      }
      console.log('✅ Exec Purged MP3');
    });
  }
  res.status(200).end();
});

app.post('/webhooks/fallback', (req, res) => {
  console.log('🚚 fallback', req.query);
  res.status(200).end();
});

app.listen(port, () => {
  console.log(`\n🌏 Server running at http://localhost:${port}\n`);
});
