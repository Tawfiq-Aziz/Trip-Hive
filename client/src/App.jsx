import React from "react";
import { Routes, Route } from 'react-router-dom';//Lopa
import Home from './pages/Home.jsx';//Lopa
//everything under second <div>

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
