import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Tasks from '../Tasks/Tasks';

import './Dashboard.scss';

const Dashboard = () => {
   return (
      <div>
         <Sidebar />
         <Tasks />
      </div>
   )
}

export default Dashboard;