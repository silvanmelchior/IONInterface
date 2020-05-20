import React from 'react';
import axios from "axios";
import { Button, Container } from '@material-ui/core';
import './App.css';

function App() {
  return (
    <Container maxWidth="xs">
      <h1>Test</h1>
      <Button variant="contained" color="primary">Hello World</Button>
    </Container>
  );
}

export default App;

axios.get('/api/test').then(response => console.log(response.data));
