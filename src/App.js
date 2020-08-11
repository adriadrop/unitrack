import React, {} from 'react'
import './App.css'
import AppTable from './AppTable'
import HuntTable from './HuntTable'

import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'

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



function App() {

  function Home() {
    return (
      <div>
        <h2>Degen Alpha Home</h2>
      </div>
    );
  }
  
  document.title = 'Degen Alpha'
  return (

    <Router>
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/app">Overview</Link>
          </li>
          <li>
            <Link to="/hunt">Hunt</Link>
          </li>          
        </ul>

        <hr />

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
          <Route path="/app">
            <AppTable />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App