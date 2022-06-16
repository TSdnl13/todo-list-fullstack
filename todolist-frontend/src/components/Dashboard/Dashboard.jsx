import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import Tasks from '../Tasks/Tasks';

import './Dashboard.scss';

const Dashboard = () => {
   const user = JSON.parse(localStorage.getItem('user'));

   const [taskLists, setTaskLists] = useState([]);
   const [taskListId, setTaskListId] = useState(0);
   
   const [tasks, setTasks] = useState({taskListName: '', tasks: []});

   useEffect(() => {
      axios.get(`http://localhost:8080/api/task/important/${user?.userId}`)
      .then(response => {
         setTasks({ taskListName: 'Important', tasks: response.data });
      })
      .catch(error => {
         console.log(error);
      });
   }, [user?.userId]);
   

   useEffect(() => {
      axios.get(`http://localhost:8080/api/taskList/user?id=${user?.userId}`)
         .then((response) => {
            setTaskLists(response.data);
         }).catch(error => {
            console.log(error);
         });

      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [taskListId, tasks]);

   return (
      <div className='dashboard'>
         <Sidebar
            taskLists={taskLists}
            setTaskLists={setTaskLists}
            setTasks={setTasks}
            setTaskListId={setTaskListId} 
            taskListId={taskListId}
            user={user}
         />
         <div className='dashboard__panel'>
            <Navbar user={user} />
            <Tasks
               tasks={tasks}
               setTasks={setTasks}
               taskListId={taskListId}
               setTaskListId={setTaskListId} 
               user={user}
            />
         </div>
      </div>
   )
}

export default Dashboard;