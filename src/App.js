import React, {} from 'react'
import './App.css'
import AppTable from './AppTable'
import HuntTable from './HuntTable'
import Home from './Home'
import Profile from './Profile'

import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'

import { withStyles, makeStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import { useAuth0 } from "@auth0/auth0-react";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';

export const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2'
  }),
  fetchOptions: {
    mode: 'no-cors'
  },
  cache: new InMemoryCache()
})

const LogoutButton = () => {
  const { logout } = useAuth0();
  return (
    <Button
      onClick={() =>
        logout({
          returnTo: window.location.origin,
        })
      }
      variant="danger"
      className="btn-margin"
    >
      Log Out
    </Button>
  );
};

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  root: {
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
  menuTop: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
}));


function App() {

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const classes = useStyles();


  const { isAuthenticated } = useAuth0();

  const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();
    return (
      <MenuItem
        onClick={() => loginWithRedirect()}
        variant="contained" color="primary">
        Log In
      </MenuItem>
    );
  };

  const LogoutButton = () => {
    const { logout } = useAuth0();
    return (
      <MenuItem
        onClick={() => logout({returnTo: window.location.origin,})}
        variant="contained" color="primary">
        Log Out
      </MenuItem>
    );
  };

  const ProfileItem = () => {
    const { logout } = useAuth0();
    return (
      <MenuItem onClick={handleClose} component={Link} to="/profile">Profile</MenuItem>  
    );
  };


  document.title = 'Alpha Degen'
  return (

    <Router>
      <div className={classes.menuTop}>
      <Button     
        variant="contained" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
        Open Menu
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose} component={Link} to="/">Home</MenuItem>
        <MenuItem onClick={handleClose} component={Link} to="/filter">Filter</MenuItem>
        <MenuItem onClick={handleClose} component={Link} to="/hunt">Hunt</MenuItem>
        
        {isAuthenticated ? <ProfileItem />: "" } 
        {isAuthenticated ? <LogoutButton /> : <LoginButton />}  
      </Menu>

        {/*
          A <Switch> looks through all its children <Route>
          elements and renders the first one whose path
          matches the current URL. Use a <Switch> any time
          you have multiple routes, but you want only one
          of them to render at a time
        */}
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/hunt">
            <HuntTable />
          </Route>
          <Route path="/filter">
            <AppTable />
          </Route>
          <Route path="/profile">
            <Profile />
          </Route>          
        </Switch>
      </div>
    </Router>
  )
}

export default App