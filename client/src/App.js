import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import Register from "./components/Register"

function App() {
  return (
    <div className="App">
      <Router>
        <Routes> 

          <Route path="/" element={<Register/>}/>
          <Route path="/home"/>

        </Routes>
      </Router>
    </div>
  );
} 

export default App;
