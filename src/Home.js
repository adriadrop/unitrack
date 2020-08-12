import React, {} from 'react'
import './App.css'
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
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
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
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
      </div>
      </div>
      <div className={classes.root}>
      Use special promotion price of 0.1 ETH, in a week, price will be double.
      Send 0.1 ETH to this address, fill out ggl form with your email and trx so that your account is approved
      0x9A7c90967915d8FB37BcA77F21a0878a2694EAB8

      For other info check telegram : <a href="https://t.me/alphadegen">LINK</a>
      </div>
      </div>

      </Container>
  );
  }

  export default Home