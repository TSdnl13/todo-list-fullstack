import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './components/Home/Home';
import Auth from './components/Auth/Auth';
import './App.scss';

const App = () => {
   return (
      <Router>
         <Routes>
            <Route path='/' element={<Navigate to='/auth' />} />
            <Route path='/auth' element={<Auth />} />
            <Route path='/home' element={<Home />} />
         </Routes>
      </Router>
   );
}

export default App;
