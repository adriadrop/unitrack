import React, {} from 'react'
import './App.css'
;
import Button from '@material-ui/core/Button';
import { useAuth0 } from "@auth0/auth0-react";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';

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
  return (
    <div>
      <h2>Degen Alpha Home</h2>
      <LoginButton/>
      <SignupButton/>
    </div>
  );
  }

  export default Home