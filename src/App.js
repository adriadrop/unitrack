import React, { useEffect } from 'react'
import './App.css'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

export const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2'
  }),
  fetchOptions: {
    mode: 'no-cors'
  },
  cache: new InMemoryCache()
})


const NEW_PAIRS = gql `
    query pairs{
    pairs(where: {reserveUSD_gt:25000} first: 20, 
    orderBy: createdAtTimestamp, orderDirection: desc) {
      id
      txCount
      totalSupply
      volumeUSD
      reserveUSD
      createdAtTimestamp
    token0 {
      name
      id
    }
    token1 {
      name
      id
    }
    }
  }
 `

function App() {

  const { loading: newLoading, data: newData } = useQuery(NEW_PAIRS)
  const newPairs = newData && newData.pairs

  console.table(newData);
  return (
    <div>
      <div>
        <thead>
          <th>Token 1 Uniswap/Etherscan</th>
          <th>Token 2 Uniswap/Etherscan</th>
          <th>TX count</th>
          <th>Volume USD</th>
          <th>Reserve USD</th>
          <th>Creation</th>
          <th>Uniswap</th>
        </thead>
        <tbody>
        {
          newLoading
          ? 'Loading pairs data...'
          :   

           newPairs.map(function(item, key) {
            
            var d = new Date(item.createdAtTimestamp * 1000);
            var formattedDate = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
            var hours = (d.getHours() < 10) ? "0" + d.getHours() : d.getHours();
            var minutes = (d.getMinutes() < 10) ? "0" + d.getMinutes() : d.getMinutes();
            var formattedTime = hours + ":" + minutes;
            
            formattedDate = formattedDate + " " + formattedTime;
            return (
               <tr key = {key}>
                   <td>{item.token0.name} <a href= {"https://uniswap.info/token/" + item.token0.id} target="_blank">1</a>  <a href= {"https://etherscan.io/address/" + item.token0.id} target="_blank">2</a></td>  
                   <td>{item.token1.name} <a href= {"https://uniswap.info/token/" + item.token1.id} target="_blank">1</a>  <a href= {"https://etherscan.io/address/" + item.token1.id} target="_blank">2</a></td>                  
                   <td>{item.txCount}</td>
                   <td>{item.volumeUSD}</td>
                   <td>{item.reserveUSD}</td>
                   <td>{formattedDate}</td>                  
                   <td><a href= {"https://uniswap.info/pair/" + item.id} target="_blank">View pair</a></td> 
               </tr>
             )
          
          })
        }
        </tbody>
          
      </div>      
    </div>
  )
}

export default App