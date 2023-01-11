# Conversation Voice Recording

## Code logic

1. A Mobile Outbound (MO) call is made to the Vonage Virtual Number (LVN).
   - Route `/webhooks/answer` creats a Conversation ID via `vonage.conversations.create` function.
   - The NCCO is configured with the `Conversation Name` and an `eventUrl` to trigger route `/recording` to start/stop recording the conversation. The recordings are saved as an MP3 via `voange.files.save` function with the parameters `recording url` and `name`. In our case we used timestamp as the name.
2. Since the recording has started, we can use the `/stopRecordig` route to stop the recording by passing the `Conversation ID`, `stop` action and `event_url` to stop the recording via `vonage.conversations.record` function.
3. Since the recording has stopped, we can use the `/startRecording` route to start the recording by passing the `Conversation ID`, `start` action and `event_url` to start the recording via  `vonage.conversations.record` function.
4. Stop the recording when finished recording.
5. As an added bonus, we've added a `/doneRecording` route which combines all the seperate MP3 recordings together into one file.

## To Deploy Application

This application uses Node.js and React.js with usage of Vonage Voice and Conversations API to make and record a conversation with start and stop feature and downloading a final mp3 file via `rename.js` file.

### Account Prerequisites

- Vonage Account
- Vonage Virtual Number
- Vonage Application with Voice enabled
- Heroku Account

### How to use

You can either clone and run the project locally or deploy the application to Heroku.

Options:

1. [Deploy to Heroku](#deploy-to-heroku)
2. [Run Locally](#run-locally)

#### Deploy to Heroku

To easily deploy this repository to Heroku, click the button. You'll need to have a Heroku Account to complete the action.

You will need a Vonage App with Voice enabled and config variables:

```js
REACT_APP_VONAGE_NUMBER=
TO_NUMBER=
VONAGE_API_KEY=
VONAGE_API_SECRET=
VONAGE_APPLICATION_ID=
VONAGE_APPLICATION_PRIVATE_KEY=
```

Steps to Deploy to Heroku:

- Click `Deploy to Heroku` button.
- Enter Environment Variables then click `Deploy app`, then click `View` to see your app.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/nexmo-se/conversation-voice-recording.git)

To run the App:

- Click `Call Number`. After the message click `start` to begin recording (say something), click `stop` to stop the recording. Repeat, then click `Done`, then `Hangup` and `Download` the mp3 file.

> Heroku uses a `Procfile` to put your server online containing the command `web: node server.js`.

> The `app.json` contains the Config Vars (`.env`) required for the app to work.

### Run Locally

Developer Prerequisites

- [Node.js and NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm#using-a-node-version-manager-to-install-node-js-and-npm)
- [React.js v17.0.2+](https://reactjs.org/)

Perform these steps to run locally:

Copy `env-example` and populate environment variables

```js
cp env-example .env
```

Install Dependencies

```js
npm install
```

Start `server.js`

```js
nodemon server.js
```

Start the React.JS Frontend

```js
npm start
```

To run the App:

- Click `Call Number`. After the message click `start` to begin recording (say something), click `stop` to stop the recording. Repeat, then click `Done`, then `Hangup` and `Download` the mp3 file.

### Developer Notes

The app has the following modules:

- [Node.js fs module](https://nodejs.dev/learn/the-nodejs-fs-module) to access and interact with the file system.
- [Node.js Child Process module](https://nodejs.org/docs/latest-v17.x/api/child_process.html#child_processexeccommand-options-callback) to purge MP3 recordings.
