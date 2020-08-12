import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as serviceWorker from './serviceWorker';
import './index.css'
import { ApolloProvider } from 'react-apollo'
import { ApolloProvider as ApolloHooksProvider } from '@apollo/react-hooks'
import { client } from './App'

import ReactGA from 'react-ga';
ReactGA.initialize('UA-175331036-1');
ReactGA.pageview(window.location.pathname + window.location.search);

ReactDOM.render(

<ApolloProvider client={client}>
  <ApolloHooksProvider client={client}>
    <App />
  </ApolloHooksProvider>
</ApolloProvider>,
  document.getElementById('root')
)

serviceWorker.register();
