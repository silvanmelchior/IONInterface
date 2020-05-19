import React from 'react';
import axios from "axios";
import './App.css';

function App() {
  return (
    <div className="App">Hello World</div>
  );
}

export default App;

axios.get('/api/test').then(response => console.log(response.data));
