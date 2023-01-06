# Conversation Voice Recording

This application uses Node.js and React.js with usage of Vonage Voice and Conversations API to make and record a conversation with start and stop feature and downloading a final mp3 file.

## Account Prerequisites

- Vonage Account
- Vonage Virtual Number
- Vonage Application with Voice enabled
- Heroku Account

## How to use

You can either clone and run the project locally or deploy the application to Heroku.

Options:

1. [Deploy to Heroku](#deploy-to-heroku)
2. [Run Locally](#run-locally)

### Deploy to Heroku

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
