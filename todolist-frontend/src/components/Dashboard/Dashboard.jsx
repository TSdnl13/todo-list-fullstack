import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import Tasks from '../Tasks/Tasks';

import './Dashboard.scss';

const Dashboard = () => {
   const user = JSON.parse(localStorage.getItem('user'));

   const [taskLists, setTaskLists] = useState([]);
   
   
   useEffect(() => {
      const getUserTaskLists = async () => {
         try {
            const response = await axios.get(`http://localhost:8080/api/taskList/user?id=${user?.userId}`);
            setTaskLists(response.data);
            console.log(taskLists);
         } catch (error) {
            console.log(error);
         }
      }
      
      getUserTaskLists();
   
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);
   
   
   
   return (
      <div className='dashboard'>
         <Sidebar className='sidebar' taskLists={taskLists} setTaskLists={setTaskLists} />
         <div className='dashboard__panel'>
            <Navbar user={user} />
            <Tasks />
         </div>
      </div>
   )
}

export default Dashboard;