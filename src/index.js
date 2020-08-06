import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as serviceWorker from './serviceWorker';
import './index.css'
import { ApolloProvider } from 'react-apollo'
import { ApolloProvider as ApolloHooksProvider } from '@apollo/react-hooks'
import { client } from './App'

ReactDOM.render(

<ApolloProvider client={client}>
  <ApolloHooksProvider client={client}>
    <App />
  </ApolloHooksProvider>
</ApolloProvider>,
  document.getElementById('root')
)
// reloade window for new info
setTimeout(function () {  window.location.reload(1); }, 55000);
serviceWorker.register();
