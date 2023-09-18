import React from 'react';
import BarChart from './containers/BarChartD3';
import logo from './logo.svg';
import './App.css';
import { Grid } from '@mui/material';
import LineChart from './containers/LineChartStock';

function App() {
  return (
    <React.Fragment>
      <Grid container>
        <Grid item xs={6} sx={{ padding: "50px" }}>
          <BarChart />
        </Grid>
        <Grid item xs={6} sx={{ padding: "50px" }}>
          <LineChart />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default App;