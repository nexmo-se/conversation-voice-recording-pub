
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import {
  Grid,
  makeStyles,
  Paper,
  Typography,
  withStyles
} from "@material-ui/core";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "grey", // theme.palette.common.black
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

export default function CustomizedTables({ tableData }) {

  const classes = useStyles();
  return (
    <div>
      <Grid item sm={12} xs={12} style={{ padding: '12px' }}>
        <Typography variant="h5" component="h5" align="center">
          Event/Status Messages
        </Typography>

        <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Time</StyledTableCell>
            <StyledTableCell align="right">Event</StyledTableCell>
            <StyledTableCell align="right">Phone</StyledTableCell>
            <StyledTableCell align="right">Status</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((row) => (
            <StyledTableRow key={row.date}>
            <StyledTableCell component="th" scope="row">
              {row.date}
            </StyledTableCell>
            <StyledTableCell align="right">{row.endPoint}</StyledTableCell>
            <StyledTableCell align="right">{row.fromNumber}</StyledTableCell>
            <StyledTableCell align="right">{row.status}</StyledTableCell>
          </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </Grid>
    </div>
  );
}
