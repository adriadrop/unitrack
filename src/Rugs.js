import React, { useEffect, useState } from 'react'
import './App.css'

import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

// Styles and tablee
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

import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';


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
    marginTop: theme.spacing(2),
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
    marginBottom: theme.spacing(3),
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
    flexGrow: 1,
  },
  extendedButton: {
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(1),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 220,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
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


  // Fetch ETH price for further calculations
  var priceEth = 0;
  fetch('https://api.etherscan.io/api?module=stats&action=ethprice&apikey=15K8UEKJJ7XNPEIBESJ9BUVQI7R76ASHIK')
  .then(response => response.json())
  .then(data=> {priceEth = data.result.ethusd; });



// Graph https://thegraph.com/docs/graphql-api#queries
// Uniswap queries https://uniswap.org/docs/v2/API/queries/

const NEW_PAIRS = gql `
  query pairs($reserveUSD: Int!, $timeStamp: Int!, $txCount: Int!){
    pairs(where: {reserveUSD_lt: $reserveUSD, createdAtTimestamp_gt: $timeStamp, txCount_gt: $txCount} first: 1000, 
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
      derivedETH
    }
    token1 {
      name
      id
      derivedETH
    }
    }
  }
 `

function AppTable() {

  function handleClick(e) {
        e.preventDefault();
    
        //const provider = await web3Modal.connect();
        //const web3 = new Web3(provider);
        console.log('The link was clicked.');
  }    

  const [filtersState, setFilters] = useState({
    reserveState: 10,
    timeStampState: 604800,  // 1 year   should be 20.5.2020 since this is uniswap 2 launch date
    txCountState: 100,
  });

  const { loading, data } = useQuery(NEW_PAIRS, {
    variables: {
      reserveUSD: filtersState.reserveState,
      txCount: filtersState.txCountState,
      timeStamp: Math.floor(Date.now() / 1000) - filtersState.timeStampState  
    }
  })

  const pairs = data && data.pairs

  const classes = useStyles();
  var rowNumber = 0;



  const SelectTxCount = () => (
    <FormControl className={classes.formControl}>
    <InputLabel id="demo-simple-select-label">Tx Count &lt;</InputLabel>
    <Select     
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      value={filtersState.txCountState} 
      onChange={(event) => setFilters({reserveState: filtersState.reserveState, timeStampState: filtersState.timeStampState, txCountState: event.target.value})} >

          <MenuItem value={1}>1</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={100}>100</MenuItem>
          <MenuItem value={1000}>1000</MenuItem>    
          <MenuItem value={10000}>10000</MenuItem>                    
      </Select>
    </FormControl>
  )

  const SelectTimeStamp = () => (

    <FormControl className={classes.formControl}>
    <InputLabel id="demo-simple-select-label">Added on Uniswap ago</InputLabel>
    <Select     
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      value={filtersState.timeStampState} 
      onChange={(event) => setFilters({reserveState: filtersState.reserveState, timeStampState: event.target.value, txCountState: filtersState.txCountState})} >

          <MenuItem value={300}>5 Minutes</MenuItem>
          <MenuItem value={900}>15 Minutes</MenuItem>
          <MenuItem value={1800}>30 Minutes</MenuItem>
          <MenuItem value={3600}>60 Minutes</MenuItem>    
          <MenuItem value={7200}>120 Minutes</MenuItem>    
          <MenuItem value={86400}>1 Day</MenuItem>     
          <MenuItem value={172800}>2 Days</MenuItem>     
          <MenuItem value={604800}>A week</MenuItem>   
          <MenuItem value={2592000}>A month</MenuItem>   
          <MenuItem value={31536000}>Since UNI2 launch</MenuItem>   
          </Select>          
    </FormControl>
  )

  return (
    <Grid container spacing={3} direction="row" alignItems="center" >
      <Grid item xl={12}>
      <CssBaseline />

      <div className={classes.paper}>
      <Typography variant="h1" color="inherit" noWrap className={classes.toolbarTitle}>Rug pulls or failed</Typography>
      <div className={classes.root}>
      <SelectTxCount/>
      <SelectTimeStamp/>    
      <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
      <TableHead>
          <TableRow>
          <StyledTableCell></StyledTableCell>
          <StyledTableCell>Token 1 Uniswap/Etherscan</StyledTableCell>
          <StyledTableCell>Token 2 Uniswap/Etherscan</StyledTableCell>
          <StyledTableCell>Total TX count</StyledTableCell>
          <StyledTableCell>Volume USD</StyledTableCell>
          <StyledTableCell>Current liquidity</StyledTableCell>
          <StyledTableCell>Creation date</StyledTableCell>
          <StyledTableCell>Price T1/T2</StyledTableCell>
          <StyledTableCell>Uniswap</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {
          loading
          ? 'Loading pairs data...'
          :(pairs.length?
          pairs.map(function(item, key) {
            
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
                   <TableCell>{numberFormat(priceEth * item.token0.derivedETH) + " / " + numberFormat(priceEth * item.token1.derivedETH)}</TableCell>                                     
                   <TableCell><Link href= {"https://uniswap.info/pair/" + item.id} target="_blank" variant="body2">View pair</Link></TableCell> 
               </TableRow>
             )          
          })
          : 'No results for this query')}
        </TableBody>
        </Table>

      </TableContainer>     
      <Alert severity="warning" className={classes.infoTop}>Maximum 1000 results</Alert>
      <Alert severity="success" className={classes.infoBottom}>Donate if helpful 0x777a7dC0c7CC331ac0D8A99f723F547EBCC7B366</Alert>   
      </div>       
      </div>
       </Grid>
      </Grid>
  )
}


export default AppTable