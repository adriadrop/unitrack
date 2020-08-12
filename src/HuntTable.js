import React, { useState, useEffect, useRef } from 'react';
import './App.css'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import useSound from 'use-sound';
import alarm from './media/alarm.mp3';
import Alert from '@material-ui/lab/Alert';

import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react"
import Loading from './Loading'


const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

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
  toolbarTitle: {
    flexGrow: 1,
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
  infoBottom: {
    marginTop: theme.spacing(2),
    width: '50%', 
  },
}));


export const numberFormat = (value) =>
  new Intl.NumberFormat('en-EN', {
    style: 'currency',
    currency: 'USD'
  }).format(value);


// Graph https://thegraph.com/docs/graphql-api#queries
// Uniswap queries https://uniswap.org/docs/v2/API/queries/

const NEW_PAIRS = gql `
  query pairs($reserveUSD: Int!, $timeStamp: Int!, $txCount: Int!){
    pairs(where: {reserveUSD_gt: $reserveUSD, createdAtTimestamp_gt: $timeStamp, txCount_gt: $txCount} first: 250, 
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

 // from https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

function HuntTable() {

  // 20 under first 5 minutes
  // 25 under 10 minutes
  // 50 under 15 minutes
  // 100 under 30 minutes
  // 100 under 60 minutes


  let [count, setCount] = useState(0);

  useInterval(() => {
    // Your custom logic here
    setCount(count + 1);
  }, 14000);

  const { loading: newLoading5, data: data5 } = useQuery(NEW_PAIRS, {
    variables: {
      reserveUSD: 5000,
      timeStamp: Math.floor(Date.now() / 1000) - 300,  // 5 minutes
      txCount: 20
    }
  })


  const { loading: newLoading50, data: data50 } = useQuery(NEW_PAIRS, {
    variables: {
      reserveUSD: 5000,
      timeStamp: Math.floor(Date.now() / 1000) - 900,  // 15 minutes
      txCount: 50
    }
  })

  const { loading: newLoading100, data: data100 } = useQuery(NEW_PAIRS, {
    variables: {
      reserveUSD: 5000,
      timeStamp: Math.floor(Date.now() / 1000) - 3800,  // an hour
      txCount: 100
    }
  })

  const { loading: newLoading200, data: data200 } = useQuery(NEW_PAIRS, {
    variables: {
      reserveUSD: 5000,
      timeStamp: Math.floor(Date.now() / 1000) - 7200,  // 2 hours
      txCount: 300
    }
  })

  const [play] = useSound(alarm,{ volume: 0.95 });

  const pairs5 = data5 && data5.pairs
  const pairs50 = data50 && data50.pairs
  const pairs100 = data100 && data100.pairs
  const pairs200 = data200 && data200.pairs
  
  const classes = useStyles();
  var rowNumber = 0;

  return (
    <Container component="main" maxWidth="xl">
      <CssBaseline />
      <div className={classes.paper}>
      <Typography variant="h1" color="inherit" noWrap className={classes.toolbarTitle}>Alpha Degen Hunt</Typography>

      <div className={classes.root}>
      <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
      <TableHead>
          <TableRow>
          <StyledTableCell>20/5</StyledTableCell>
          <StyledTableCell>Token 1 Uniswap/Etherscan</StyledTableCell>
          <StyledTableCell>Token 2 Uniswap/Etherscan</StyledTableCell>
          <StyledTableCell>TX count</StyledTableCell>
          <StyledTableCell>Volume USD</StyledTableCell>
          <StyledTableCell>Current liquidty</StyledTableCell>
          <StyledTableCell>Creation date</StyledTableCell>
          <StyledTableCell>Uniswap</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {
          newLoading5
          ? 'Loading pairs data...'
          : (pairs5.length?  
          pairs5.map(function(item, key) {
            
            var d = new Date(item.createdAtTimestamp * 1000);
            var formattedDate = d.getDate() + "/" + (d.getMonth() + 1); // + "-" + d.getFullYear();
            var hours = (d.getHours() < 10) ? "0" + d.getHours() : d.getHours();
            var minutes = (d.getMinutes() < 10) ? "0" + d.getMinutes() : d.getMinutes();
            var formattedTime = hours + ":" + minutes;
            
            formattedDate = formattedDate + " " + formattedTime;
            rowNumber++;

            return (
               <TableRow key = {key}>
                    <TableCell>{rowNumber}</TableCell>
                   <TableCell>{item.token0.name} <Link href= {"https://uniswap.info/token/" + item.token0.id} target="_blank" variant="body2">1</Link>  <Link href= {"https://etherscan.io/address/" + item.token0.id} target="_blank">2</Link></TableCell>  
                   <TableCell>{item.token1.name} <Link href= {"https://uniswap.info/token/" + item.token1.id} target="_blank" variant="body2">1</Link>  <Link href= {"https://etherscan.io/address/" + item.token1.id} target="_blank">2</Link></TableCell>                  
                   <TableCell>{item.txCount}</TableCell>
                   <TableCell>{numberFormat(item.volumeUSD)}</TableCell>
                   <TableCell>{numberFormat(item.reserveUSD)}</TableCell>
                   <TableCell>{formattedDate}</TableCell>                  
                   <TableCell><Link href= {"https://uniswap.info/pair/" + item.id} target="_blank" variant="body2">View pair</Link></TableCell> 
               </TableRow>
             )
          })
          : 'No results for this hunt')
        }
        </TableBody>
        </Table>

      <Table className={classes.table} size="small" aria-label="a dense table">
      <TableHead>
          <TableRow>
          <StyledTableCell>50/15</StyledTableCell>
          <StyledTableCell>Token 1 Uniswap/Etherscan</StyledTableCell>
          <StyledTableCell>Token 2 Uniswap/Etherscan</StyledTableCell>
          <StyledTableCell>TX count</StyledTableCell>
          <StyledTableCell>Volume USD</StyledTableCell>
          <StyledTableCell>Current liquidty</StyledTableCell>
          <StyledTableCell>Creation date</StyledTableCell>
          <StyledTableCell>Uniswap</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {
          newLoading50
          ? 'Loading pairs data...'
          : (pairs50.length?  
          pairs50.map(function(item, key) {
            
            var d = new Date(item.createdAtTimestamp * 1000);
            var formattedDate = d.getDate() + "/" + (d.getMonth() + 1); // + "-" + d.getFullYear();
            var hours = (d.getHours() < 10) ? "0" + d.getHours() : d.getHours();
            var minutes = (d.getMinutes() < 10) ? "0" + d.getMinutes() : d.getMinutes();
            var formattedTime = hours + ":" + minutes;
            
            formattedDate = formattedDate + " " + formattedTime;
            rowNumber++;

            return (
               <TableRow key = {key}>
                    <TableCell>{rowNumber}</TableCell>
                   <TableCell>{item.token0.name} <Link href= {"https://uniswap.info/token/" + item.token0.id} target="_blank" variant="body2">1</Link>  <Link href= {"https://etherscan.io/address/" + item.token0.id} target="_blank">2</Link></TableCell>  
                   <TableCell>{item.token1.name} <Link href= {"https://uniswap.info/token/" + item.token1.id} target="_blank" variant="body2">1</Link>  <Link href= {"https://etherscan.io/address/" + item.token1.id} target="_blank">2</Link></TableCell>                  
                   <TableCell>{item.txCount}</TableCell>
                   <TableCell>{numberFormat(item.volumeUSD)}</TableCell>
                   <TableCell>{numberFormat(item.reserveUSD)}</TableCell>
                   <TableCell>{formattedDate}</TableCell>                  
                   <TableCell><Link href= {"https://uniswap.info/pair/" + item.id} target="_blank" variant="body2">View pair</Link></TableCell> 
               </TableRow>
             )
          })
          : 'No results for this hunt')
        }
        </TableBody>
        </Table>

        <Table className={classes.table} size="small" aria-label="a dense table">
      <TableHead>
          <TableRow>
          <StyledTableCell>100/60</StyledTableCell>
          <StyledTableCell>Token 1 Uniswap/Etherscan</StyledTableCell>
          <StyledTableCell>Token 2 Uniswap/Etherscan</StyledTableCell>
          <StyledTableCell>TX count</StyledTableCell>
          <StyledTableCell>Volume USD</StyledTableCell>
          <StyledTableCell>Current liquidty</StyledTableCell>
          <StyledTableCell>Creation date</StyledTableCell>
          <StyledTableCell>Uniswap</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {
          newLoading100
          ? 'Loading pairs data...'
          : (pairs100.length?  
          pairs100.map(function(item, key) {
            
            var d = new Date(item.createdAtTimestamp * 1000);
            var formattedDate = d.getDate() + "/" + (d.getMonth() + 1); // + "-" + d.getFullYear();
            var hours = (d.getHours() < 10) ? "0" + d.getHours() : d.getHours();
            var minutes = (d.getMinutes() < 10) ? "0" + d.getMinutes() : d.getMinutes();
            var formattedTime = hours + ":" + minutes;
            
            formattedDate = formattedDate + " " + formattedTime;
            rowNumber++;

            return (
               <TableRow key = {key}>
                    <TableCell>{rowNumber}</TableCell>
                   <TableCell>{item.token0.name} <Link href= {"https://uniswap.info/token/" + item.token0.id} target="_blank" variant="body2">1</Link>  <Link href= {"https://etherscan.io/address/" + item.token0.id} target="_blank">2</Link></TableCell>  
                   <TableCell>{item.token1.name} <Link href= {"https://uniswap.info/token/" + item.token1.id} target="_blank" variant="body2">1</Link>  <Link href= {"https://etherscan.io/address/" + item.token1.id} target="_blank">2</Link></TableCell>                  
                   <TableCell>{item.txCount}</TableCell>
                   <TableCell>{numberFormat(item.volumeUSD)}</TableCell>
                   <TableCell>{numberFormat(item.reserveUSD)}</TableCell>
                   <TableCell>{formattedDate}</TableCell>                  
                   <TableCell><Link href= {"https://uniswap.info/pair/" + item.id} target="_blank" variant="body2">View pair</Link></TableCell> 
               </TableRow>
             )
          
          })
          : 'No results for this hunt')
        }
        </TableBody>
        </Table>
      
        <Table className={classes.table} size="small" aria-label="a dense table">
      <TableHead>
          <TableRow>
          <StyledTableCell>300/120</StyledTableCell>
          <StyledTableCell>Token 1 Uniswap/Etherscan</StyledTableCell>
          <StyledTableCell>Token 2 Uniswap/Etherscan</StyledTableCell>
          <StyledTableCell>TX count</StyledTableCell>
          <StyledTableCell>Volume USD</StyledTableCell>
          <StyledTableCell>Current liquidty</StyledTableCell>
          <StyledTableCell>Creation date</StyledTableCell>
          <StyledTableCell>Uniswap</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {
          newLoading200
          ? 'Loading pairs data...'
          : (pairs200.length?  
          pairs200.map(function(item, key) {
            
            var d = new Date(item.createdAtTimestamp * 1000);
            var formattedDate = d.getDate() + "/" + (d.getMonth() + 1); // + "-" + d.getFullYear();
            var hours = (d.getHours() < 10) ? "0" + d.getHours() : d.getHours();
            var minutes = (d.getMinutes() < 10) ? "0" + d.getMinutes() : d.getMinutes();
            var formattedTime = hours + ":" + minutes;
            
            formattedDate = formattedDate + " " + formattedTime;
            rowNumber++;

            return (
               <TableRow key = {key}>
                   <TableCell>{rowNumber}</TableCell>
                   <TableCell>{item.token0.name} <Link href= {"https://uniswap.info/token/" + item.token0.id} target="_blank" variant="body2">1</Link>  <Link href= {"https://etherscan.io/address/" + item.token0.id} target="_blank">2</Link></TableCell>  
                   <TableCell>{item.token1.name} <Link href= {"https://uniswap.info/token/" + item.token1.id} target="_blank" variant="body2">1</Link>  <Link href= {"https://etherscan.io/address/" + item.token1.id} target="_blank">2</Link></TableCell>                  
                   <TableCell>{item.txCount}</TableCell>
                   <TableCell>{numberFormat(item.volumeUSD)}</TableCell>
                   <TableCell>{numberFormat(item.reserveUSD)}</TableCell>
                   <TableCell>{formattedDate}</TableCell>                  
                   <TableCell><Link href= {"https://uniswap.info/pair/" + item.id} target="_blank" variant="body2">View pair</Link></TableCell> 
               </TableRow>
             )
          
          })
          : 'No results for this hunt')
        }
        </TableBody>
        </Table>

      </TableContainer>  
        </div>   
        <Alert severity="info" className={classes.infoBottom}>What does this page do? It searches uniswap for newly listed GEMS and displays them in grouped trajectories. 20/5 means 20 trx in first 5 minutes after uniswap listing, 50/15 means 50 trx in 15 minutes, 100/60 means 100 trx in 1 hour, 300/120 means 300 trx in 2 hours</Alert>  
        <Alert severity="warning" className={classes.infoBottom}>Page is refreshed every 14 seconds (or one eth block)</Alert> 
        <Alert severity="success" className={classes.infoBottom}>Donate if helpful 0x777a7dC0c7CC331ac0D8A99f723F547EBCC7B366</Alert>       
      </div>
    </Container>
  )
}

export default HuntTable
