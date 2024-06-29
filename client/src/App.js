import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import Register from "./components/Register"
import Home from "./components/Home"
import toast, { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes> 

          <Route path="/" element={<Register/>}/>
          <Route path="/home" element={<Home/>}/>

        </Routes>
      </Router>
      <Toaster />
    </div>
  );
} 

export default App;
