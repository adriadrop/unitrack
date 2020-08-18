import React, {} from 'react'
import './App.css'
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import chad from './media/Chad.jpg' 
import Grid from '@material-ui/core/Grid';


import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
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
  },

}));



  function Home() {
    const classes = useStyles();

  return (
    <Grid container spacing={3} direction="row"  direction="column" justify="center"alignItems="center">
      <Grid item xl={10} xs={12}>
      <CssBaseline />

      <div className={classes.paper}>
      <Typography variant="h1" color="inherit" className={classes.toolbarTitle}>Welcome Alpha Degen </Typography>

      <div className={classes.root}>
      <div className={classes.root}>
      <img height="500" src={chad} alt="chad" />
      <br />  
      <strong>To get info about official launch, <a href="https://docs.google.com/forms/d/199Dsxbk1OHdoyo3xxsrA-5oJ9PEkYtp6pbM7U428EiU" target="_blank">sign up here</a> or follow on telegram  <a href="https://t.me/alphadegen">here</a></strong>
      <br />  
      <br />  
      </div>
      </div>
      </div>
      </Grid>
      </Grid>
  );
  }

  export default Home