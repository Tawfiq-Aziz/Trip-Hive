import React from "react";
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';

const App = () => {
  return (
    <div>
      <div className='min-h-[70vh]'>
        <Routes>
          <Route path='/' element={<Home />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
