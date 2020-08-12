import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as serviceWorker from './serviceWorker';
import './index.css'
import { ApolloProvider } from 'react-apollo'
import { ApolloProvider as ApolloHooksProvider } from '@apollo/react-hooks'
import { client } from './App'
import { Auth0Provider } from "@auth0/auth0-react";

ReactDOM.render(

  <Auth0Provider
    domain="degen.eu.auth0.com"
    clientId="3ePPEJuiudaKvXbj446Dpdpp06QkAtIm"
    redirectUri={window.location.origin}
  >
<ApolloProvider client={client}>
  <ApolloHooksProvider client={client}>
    <App />
  </ApolloHooksProvider>
</ApolloProvider>
</Auth0Provider>,
  document.getElementById('root')
)

serviceWorker.register();
