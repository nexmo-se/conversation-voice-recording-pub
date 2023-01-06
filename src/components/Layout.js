import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button,
  Grid,
  Icon,
  makeStyles,
  Paper,
  withStyles,
  Typography,
  TextField
} from "@material-ui/core";
import { Pause, Stop, Mic, Done, PlayArrow, CloudDownload } from '@material-ui/icons';
import Response from './Response';
import Pusher from 'pusher-js';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { v4 as uuidv4 } from 'uuid';
import { ClassNames } from '@emotion/react';
var uuid = uuidv4();

const useStyles = makeStyles((theme) => ({
  outerContainer: {
    padding: '12px'
  },
  innerContainer: {
    width: '100%',
    // backgroundColor: "lightblue"
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  checkCode: {
    margin: "80px 0px 0px 0px"
  },
  buttonDone: {
    backgroundColor: "grey",
    color: "black"
  },
}));

// From 0 to 600px wide (smart-phones), I take up 12 columns, or the whole device width!
// From 600-690px wide (tablets), I take up 6 out of 12 columns, so 2 columns fit the screen.
// From 960px wide and above, I take up 25% of the device (3/12), so 4 columns fit the screen.

function Layout() {
  const { outerContainer, innerContainer, paper, buttonDone } = useStyles();
  const [pusherID, setPusherID] = useState(uuid);
  const [pusherAnswer, setPusherAnswer] = useState(
    [{ endpoint: '', pusherID: '', status: '', date: ''}]);
  const [requestID, setRequestID] = useState('');
  const [toNumber, setToNumber] = useState('');
  const [virtualNumber, setVirtualNumber] = useState('12013779080'); // 12019758605
  const [tableData, setTableData] = useState([]);
  const [status, setStatus] = useState('');
  const [disableStartDemo, setdisableStartDemo] = useState(false);
  const [disableStart, setdisableStart] = useState(true);
  const [disableStop, setdisableStop] = useState(true);
  const [disableDone, setdisableDone] = useState(true);
  const [disableDownload, setdisableDownload] = useState(true);
  // Subscribe to all Channels when Component mounted
  // Problem is state id is not set until ButtonClicked
  useEffect(() => {
    console.log("pusherID:", pusherID);
    Pusher.logToConsole = true;
    // pusher key
    var pusher = new Pusher('70a80d4e6027ca36af18', {
      cluster: 'us2',
      forceTLS: true,
    });

    // webhooks/answer endpoint
    var channelAnswer = pusher.subscribe('answer');
    channelAnswer.bind(pusherID, function (data) {
      console.log('✅ channel answer received - data.pushData', data.pushData);
      setPusherAnswer(data.pushData);
      setTableData([data.pushData]);

      if (data.pushData.endPoint === 'answer') setdisableStart(false);
    });
    
    return () => {
      pusher.unsubscribe('answer');
    };
  }, [pusherID]);

  async function startDemo(e) {
    e.preventDefault();
    setdisableStartDemo(true);
    
    const object = {
      pusherID: pusherID,
      status: 'Demo Started',
      endPoint: 'startDemo'
    };

    await axios
      .post('startDemo', object)
      .then((response) => {
        console.log('✅ startDemo - response.data', response.data);

      })
      .catch((error) => {
        console.log('🔥 startDemo ', error);
      });
  };

  async function startRecording(e) {
    e.preventDefault();
    setdisableStart(true);
    setdisableStop(false);
    const object = {
      pusherID: pusherID,
      status: 'Started'
    };

    await axios
      .post('startRecording', object)
      .then((response) => {
        console.log('✅ startRecording - response.data', response.data);
        
      })
      .catch((error) => {
        console.log('🔥 startRecording ', error);
      });
  };

  async function stopRecording(e) {
    e.preventDefault();
    setdisableStart(false);
    setdisableStop(true);
    setdisableDone(false);
    const object = {
      pusherID: pusherID,
      status: 'Stopped'
    };

    await axios
      .post('stopRecording', object)
      .then((response) => {
        console.log('✅ stopRecording - response.data', response.data);
        
      })
      .catch((error) => {
        console.log('🔥 stopRecording ', error);
      });
  };

  async function doneRecording(e) {
    e.preventDefault();
    setdisableStop(true);
    setdisableStart(true);
    setdisableDownload(false);
    const object = {
      pusherID: pusherID,
      status: 'Done'
    };

    await axios
      .post('doneRecording', object)
      .then((response) => {
        console.log('✅ doneRecording - response.data', response.data);
        
      })
      .catch((error) => {
        console.log('🔥 doneRecording ', error);
      });
  };

  return (
    <div>
      {/* MAIN CONTAINER */}
      <Grid container spacing={2} className={outerContainer}>

      {/* INNER - CONTAINER */}
        <Grid item xs={12} sm={12} md={4} lg={4} className={innerContainer}>
          <Paper className={paper}>

            {/* ITEM */}
            <Typography variant="h5" component="h5" align="left">
              1. Click Start Demo
            </Typography>

            {/* ITEM */}
            <Grid style={{ padding: '12px' }} align="left">
              <Button variant="contained" color="primary" startIcon={<PlayArrow />} 
                disabled={disableStartDemo} onClick={startDemo}>Start Demo</Button>
            </Grid>

            {/* ITEM */}
            <Typography variant="h5" component="h5" align="left">
              2. Call the number Number
            </Typography>

            {/* ITEM*/}
            <Grid item>
              <Grid
                item
                style={{ padding: '12px', textAlign: 'left' }}
              >
                <Typography variant="subtitle1">Virtual Number</Typography>
                <PhoneInput
                  country={"us"}
                  value={virtualNumber}
                  inputStyle={{height: "40px"}}
                  disabled
                />
              </Grid>
            </Grid>

            {/* ITEM */}
            <Typography variant="h5" component="h5" align="left">
              2. Alternately Click Start and Stop to Record
            </Typography>

            {/* ITEM */}
            <Grid container>
              <Grid style={{ padding: '12px' }}>
                <Button variant="contained" color="primary" startIcon={<Mic />} 
                disabled={disableStart} onClick={startRecording}>Start</Button>
              </Grid>
              <Grid style={{ padding: '12px' }}>
                <Button variant="contained" color="secondary" startIcon={<Stop />} 
                disabled={disableStop} onClick={stopRecording}>Stop</Button>
              </Grid>
            </Grid>

            {/* ITEM */}
            <Typography variant="h5" component="h5" align="left">
              3. When Finished, Click Done then Hangup.
            </Typography>

            {/* ITEM */}
            <Grid container>
              <Grid style={{ padding: '12px' }}>
                <Button variant="contained" color="primary" startIcon={<Done />} 
                  disabled={disableDone} onClick={doneRecording}>Done</Button>
              </Grid>
            </Grid>

            {/* ITEM */}
            <Typography variant="h5" component="h5" align="left">
              4. Download the Recording
            </Typography>

            {/* ITEM */}
            <Grid container>
              <Grid style={{ padding: '12px' }}>
                <Button variant="contained" color="primary" startIcon={<CloudDownload />} 
                  download href="/final.mp3" disabled={disableDownload}>Download</Button>
              </Grid>
            </Grid>

          </Paper>
        </Grid>
      {/* INNER - CONTAINER - END */}

      {/* INNER - CONTAINER */}
      <Grid item xs={12} sm={12} md={8} lg={8} className={innerContainer}>
        <Paper className={paper}>
          {/* ITEM - RESPONSE */}
          <Response tableData={tableData}/>
        </Paper>
      </Grid>
      {/* INNER - CONTAINER - END */}

      {/* MAIN CONTAINER END*/}
      </Grid>
    </div>
  );
};

export default withStyles(useStyles)(Layout);
