import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import Tasks from '../Tasks/Tasks';

import './Dashboard.scss';

const Dashboard = () => {
   const user = JSON.parse(localStorage.getItem('user'));

   const [taskLists, setTaskLists] = useState([]);
   const [tasks, setTasks] = useState({taskListName: '', tasks: []});
   
   useEffect(() => {
      const getUserTaskLists = async () => {
         try {
            const response = await axios.get(`http://localhost:8080/api/taskList/user?id=${user?.userId}`);
            setTaskLists(response.data);
         } catch (error) {
            console.log(error);
         }
      }
      
      getUserTaskLists();
   
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);
   
   return (
      <div className='dashboard'>
         <Sidebar taskLists={taskLists} setTaskLists={setTaskLists} setTasks={setTasks} />
         <div className='dashboard__panel'>
            <Navbar user={user} />
            <Tasks tasks={tasks} />
         </div>
      </div>
   )
}

export default Dashboard;