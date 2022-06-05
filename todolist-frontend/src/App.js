import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Auth from './components/Auth/Auth';
import './App.scss';
import Dashboard from './components/Dashboard/Dashboard';

const App = () => {
   return (
      <Router>
         <Routes>
            <Route path='/' element={<Navigate to='/auth' />} />
            <Route path='/auth' element={<Auth />} />
            <Route path='/dashboard' element={<Dashboard />} />
         </Routes>
      </Router>
   );
}

export default App;
