import React, {} from 'react'
import './App.css'
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import chad from './media/Chad.jpg' 
import Grid from '@material-ui/core/Grid';


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  buttons:{
    alignItems: 'center',
  },
  root: {
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
    flexGrow: 1,
    alignItems: 'center',
  },

}));



  function Home() {
    const classes = useStyles();

  return (
    <Grid container className={classes.root}spacing={3} direction="row"  direction="column" justify="center" alignItems="center">
      <Grid item xl={10} xs={12}>
      <CssBaseline />

      <Grid container justify="center" >
      <Typography variant="h1" color="inherit" className={classes.toolbarTitle}>Welcome Alpha Degen </Typography>
      <Grid item item xl={5} xs={12}>
          <img height="500" src={chad} alt="chad" />
          <br />  
          <strong>To get info about official launch, <a href="https://docs.google.com/forms/d/199Dsxbk1OHdoyo3xxsrA-5oJ9PEkYtp6pbM7U428EiU" target="_blank">sign up here</a> or follow on telegram  <a href="https://t.me/alphadegen">here</a></strong>
          <br />  
          <br />  
         </Grid>
        </Grid>
      </Grid>
      </Grid>
  );
  }

  export default Home