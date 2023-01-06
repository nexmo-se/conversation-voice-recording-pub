import React from "react";

import {
  Grid,
  makeStyles,
  Typography,
  withStyles
} from "@material-ui/core";

// import 'react-phone-number-input/style.css';
// import PhoneInput from 'react-phone-number-input';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 100
  }
}));

function InputPhone({toNumber, setToNumber}) {

  return (
    <div style={{ textAlign: "center" }}>
          <Grid item sm={12} style={{ padding: '12px' }}>
            <Typography variant="h5" component="h5" align="center">
              Send a Verification Code
            </Typography>
          </Grid>

          <Grid
            item
            style={{ padding: '12px', textAlign: 'left' }}
          >
            <Typography variant="subtitle1">To Number</Typography>
            <PhoneInput
              country={"us"}
              placeholder="Enter phone number"
              value={toNumber}
              onChange={setToNumber}
              inputStyle={{height: "40px"}}
            />
          </Grid>
    </div>
  );
};

export default withStyles(useStyles)(InputPhone);
