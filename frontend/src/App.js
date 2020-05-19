import React from 'react';
import axios from "axios";
import { Button } from '@material-ui/core';
import './App.css';

function App() {
  return (
    <React.Fragment>
      <h1>Test</h1>
      <Button variant="contained" color="primary">Hello World</Button>
    </React.Fragment>
  );
}

export default App;

axios.get('/api/test').then(response => console.log(response.data));
