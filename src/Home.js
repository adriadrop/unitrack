import React, {} from 'react'
import './App.css'
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import chad from './media/Chad.jpg' 

import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react"

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

}));

const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();
    return (
      <Button
        onClick={() => loginWithRedirect()}
        variant="contained" color="primary">
        Log In
      </Button>
    );
  };

  const SignupButton = () => {
    const { loginWithRedirect } = useAuth0();
    return (
      <Button
        onClick={() =>
          loginWithRedirect({
            screen_hint: "signup",
          })
        }
        variant="contained" color="primary">
        Sign Up
      </Button>
    );
  }; 

  function Home() {
    const classes = useStyles();

    const { user, isAuthenticated } = useAuth0();
  return (
    <Container component="main" maxWidth="xl">
      <CssBaseline />

      <div className={classes.paper}>
      <Typography variant="h1" color="inherit" noWrap className={classes.toolbarTitle}>Welcome Alpha Degen </Typography>

      <div className={classes.root}>
      {!isAuthenticated ? <div className={classes.buttons}><LoginButton /> <SignupButton /></div>: ""}  
      <div className={classes.root}>
      <img height="500" src={chad} alt="chad" />
      <br />  
      <strong>How does it work? Check <a href="">this video</a></strong>
      <br />  
      <br />  
      </div>

      </div>
      <div className={classes.root}>
      Use special promotion price of <strong>0.1 ETH</strong>, in a week price will be <strong>double</strong>.<br /> 
      Send 0.1 ETH to this address 0x9A7c90967915d8FB37BcA77F21a0878a2694EAB8, fill out <a href="https://docs.google.com/forms/d/199Dsxbk1OHdoyo3xxsrA-5oJ9PEkYtp6pbM7U428EiU" target="_blank">ggl form </a>with your email and trx so that your account is approved
      <br />     
      For other info check telegram: <a href="https://t.me/alphadegen">LINK</a>
      </div>
      </div>

      </Container>
  );
  }

  export default Home