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
  query pairDayDatas($reserveUSD: Int!, $dailyVolumeUSD: Int!, $dailyTxns: Int!, $timeStampLt: Int!, $timeStampGt: Int!){
    pairDayDatas(where: {reserveUSD_gt: $reserveUSD, dailyVolumeUSD_gt: $dailyVolumeUSD, dailyTxns_gt: $dailyTxns, date_gt: $timeStampGt, date_lt: $timeStampLt} first: 100, 
    orderBy: dailyVolumeUSD, orderDirection: desc) {
      id
      pairAddress
      dailyTxns
      reserveUSD
      dailyVolumeUSD
      date
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

function YestDayTable() {

  function handleClick(e) {
        e.preventDefault();
    
        //const provider = await web3Modal.connect();
        //const web3 = new Web3(provider);
        console.log('The link was clicked.');
  }    

  const [filtersState, setFilters] = useState({
    reserveState: 5000,
    dailyVolumeUSDState: 5000, 
    txCountState: 100,
  });

  const { loading, data } = useQuery(NEW_PAIRS, {
    variables: {
      reserveUSD: filtersState.reserveState,
      dailyTxns: filtersState.txCountState,
      dailyVolumeUSD: filtersState.dailyVolumeUSDState,
      timeStampLt : Math.floor(Date.now() / 1000) - 86400*1,
      timeStampGt : Math.floor(Date.now() / 1000) - 86400*2,
    }
  })

  const pairs = data && data.pairDayDatas

  const classes = useStyles();
  var rowNumber = 0;

  const SelectReserveUSD = () => (
    <FormControl className={classes.formControl}>
    <InputLabel id="demo-simple-select-label">Liquidity USD &gt;</InputLabel>
    <Select     
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      value={filtersState.reserveState} 
      onChange={(event) => setFilters({reserveState: event.target.value, dailyVolumeUSDState: filtersState.dailyVolumeUSDState, txCountState: filtersState.txCountState})} >

          <MenuItem value={100}>$100</MenuItem>
          <MenuItem value={1000}>$1,000</MenuItem>
          <MenuItem value={5000}>$5,000</MenuItem>
          <MenuItem value={10000}>$10,000</MenuItem>    
          <MenuItem value={100000}>$100,000</MenuItem>                    
      </Select>
    </FormControl>
  )

  const SelectTxCount = () => (
    <FormControl className={classes.formControl}>
    <InputLabel id="demo-simple-select-label">Tx Count &gt;</InputLabel>
    <Select     
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      value={filtersState.txCountState} 
      onChange={(event) => setFilters({reserveState: filtersState.reserveState, dailyVolumeUSDState: filtersState.dailyVolumeUSDState, txCountState: event.target.value})} >

          <MenuItem value={1}>1</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={100}>100</MenuItem>
          <MenuItem value={1000}>1000</MenuItem>    
          <MenuItem value={10000}>10000</MenuItem>                    
      </Select>
    </FormControl>
  )

  const SelectVolumeUSD = () => (

    <FormControl className={classes.formControl}>
    <InputLabel id="demo-simple-select-label">Volume USD</InputLabel>
    <Select     
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      value={filtersState.dailyVolumeUSDState} 
      onChange={(event) => setFilters({reserveState: filtersState.reserveState, dailyVolumeUSDState: event.target.value, txCountState: filtersState.txCountState})} >

          <MenuItem value={100}>$100</MenuItem>
          <MenuItem value={1000}>$1,000</MenuItem>
          <MenuItem value={5000}>$5,000</MenuItem>
          <MenuItem value={10000}>$10,000</MenuItem>    
          <MenuItem value={100000}>$100,000</MenuItem>                    
      </Select>         
    </FormControl>
  )

  return (
    <Grid container spacing={3} direction="row"  direction="column" justify="center" alignItems="center">
      <Grid item xl={10} xs={12}>
      <CssBaseline />

      <div className={classes.paper}>
      <Typography variant="h2" color="inherit" className={classes.toolbarTitle}>Uniswap LP yesterday (UTC)</Typography>

      <div className={classes.root}>
      <SelectReserveUSD/>
      <SelectTxCount/>
      <SelectVolumeUSD/>    
      <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
      <TableHead>
          <TableRow>
          <StyledTableCell></StyledTableCell>
          <StyledTableCell>Token 1 Uniswap/Etherscan</StyledTableCell>
          <StyledTableCell>Token 2 Uniswap/Etherscan</StyledTableCell>
          <StyledTableCell>Daily TX count</StyledTableCell>
          <StyledTableCell>Daily Volume USD</StyledTableCell>
          <StyledTableCell>Current liquidity</StyledTableCell>
          <StyledTableCell>Volume/Liq ratio</StyledTableCell>
          <StyledTableCell>Daily Fees</StyledTableCell>
          <StyledTableCell>Fees per $1000 invested</StyledTableCell>
          <StyledTableCell>Uniswap</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {
          loading
          ? 'Loading pairs data...'
          :(pairs.length?
          pairs.map(function(item, key) {
            
            var d = new Date(item.date * 1000);
            var formattedDate = d.getDate() + "/" + (d.getMonth() + 1); // + "-" + d.getFullYear();
            var hours = (d.getHours() < 10) ? "0" + d.getHours() : d.getHours();
            var minutes = (d.getMinutes() < 10) ? "0" + d.getMinutes() : d.getMinutes();
            var formattedTime = hours + ":" + minutes;
            
            formattedDate = formattedDate + " " + formattedTime;
            rowNumber++;

            var fees = item.dailyVolumeUSD * 0.003
            var feesDollar = fees / item.reserveUSD * 1000
            var volumeLiqRatio = item.dailyVolumeUSD / item.reserveUSD
            
            return (
               <TableRow key = {key}>
                   <TableCell>{rowNumber}</TableCell>
                   <TableCell>{item.token0.name} <Link href= {"https://uniswap.info/token/" + item.token0.id} target="_blank" variant="body2">1</Link>  <Link href= {"https://etherscan.io/address/" + item.token0.id} target="_blank">2</Link></TableCell>  
                   <TableCell>{item.token1.name} <Link href= {"https://uniswap.info/token/" + item.token1.id} target="_blank" variant="body2">1</Link>  <Link href= {"https://etherscan.io/address/" + item.token1.id} target="_blank">2</Link></TableCell>                  
                   <TableCell>{item.dailyTxns}</TableCell>
                   <TableCell>{numberFormat(item.dailyVolumeUSD)}</TableCell>
                   <TableCell>{numberFormat(item.reserveUSD)}</TableCell>
                   <TableCell>{volumeLiqRatio.toFixed(2)}</TableCell>
                   <TableCell>{numberFormat(fees)}</TableCell>       
                   <TableCell>{numberFormat(feesDollar)}</TableCell>                                 
                   <TableCell><Link href= {"https://uniswap.info/pair/" + item.pairAddress} target="_blank" variant="body2">View pair</Link></TableCell> 
               </TableRow>
             )          
          })
          : 'No results for this query')}
        </TableBody>
        </Table>

      </TableContainer>     
      <Alert severity="info" className={classes.infoTop}>Search for pairs with $2-$3 with fees per $1000, more then that are usualy risky scams and possible rug pulls or very new and have lots of entry demand. Pairs with ETH get more fees then those with stables. Pairs with low liq/volume ratio are those that have liquidity mining and you get more if you stake them on projects site.</Alert> 
      <Alert severity="success" className={classes.infoBottom}>Donate if helpful 0x777a7dC0c7CC331ac0D8A99f723F547EBCC7B366</Alert>   
      </div>       
      </div>
        </Grid>
      </Grid>
  )
}


export default YestDayTable