import React, {} from 'react'
import './App.css'
import AppTable from './AppTable'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'

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

 
  document.title = 'Degen Alpha'
  return (
    <AppTable/>
  )
}

export default App