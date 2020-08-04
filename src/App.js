import React, { useEffect } from 'react'
import './App.css'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

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
  const classes = useStyles();

  //console.table(newData);
  return (
    <Container component="main" maxWidth="xl">
      <CssBaseline />
      <div className={classes.paper}>
      <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
      <TableHead>
          <TableRow>
          <TableCell>Token 1 Uniswap/Etherscan</TableCell>
          <TableCell>Token 2 Uniswap/Etherscan</TableCell>
          <TableCell>TX count</TableCell>
          <TableCell>Volume USD</TableCell>
          <TableCell>Reserve USD</TableCell>
          <TableCell>Creation</TableCell>
          <TableCell>Uniswap</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {
          newLoading
          ? 'Loading pairs data...'
          :   

           newPairs.map(function(item, key) {
            
            var d = new Date(item.createdAtTimestamp * 1000);
            var formattedDate = d.getDate() + "/" + (d.getMonth() + 1); // + "-" + d.getFullYear();
            var hours = (d.getHours() < 10) ? "0" + d.getHours() : d.getHours();
            var minutes = (d.getMinutes() < 10) ? "0" + d.getMinutes() : d.getMinutes();
            var formattedTime = hours + ":" + minutes;
            
            formattedDate = formattedDate + " " + formattedTime;
            return (
               <TableRow key = {key}>
                   <TableCell>{item.token0.name} <a href= {"https://uniswap.info/token/" + item.token0.id} target="_blank">1</a>  <a href= {"https://etherscan.io/address/" + item.token0.id} target="_blank">2</a></TableCell>  
                   <TableCell>{item.token1.name} <a href= {"https://uniswap.info/token/" + item.token1.id} target="_blank">1</a>  <a href= {"https://etherscan.io/address/" + item.token1.id} target="_blank">2</a></TableCell>                  
                   <TableCell>{item.txCount}</TableCell>
                   <TableCell>{item.volumeUSD}</TableCell>
                   <TableCell>{item.reserveUSD}</TableCell>
                   <TableCell>{formattedDate}</TableCell>                  
                   <TableCell><a href= {"https://uniswap.info/pair/" + item.id} target="_blank">View pair</a></TableCell> 
               </TableRow>
             )
          
          })
        }
        </TableBody>
        </Table>
      </TableContainer>             
      </div>
    </Container>
  )
}

export default App