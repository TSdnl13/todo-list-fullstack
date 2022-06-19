import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Auth from './components/Auth/Auth';
import './App.scss';
import Dashboard from './components/Dashboard/Dashboard';

const App = () => {
   const user = JSON.parse(localStorage.getItem('user'));

   return (
      <Router>
         <Routes>
            <Route path='/' element={<Navigate to='/auth' />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/auth' element={!user ? <Auth />:<Navigate to='/dashboard' />} />
         </Routes>
      </Router>
   );
}

export default App;
