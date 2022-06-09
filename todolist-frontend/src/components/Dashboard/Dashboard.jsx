import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import Tasks from '../Tasks/Tasks';

import './Dashboard.scss';

const Dashboard = () => {
   const user = JSON.parse(localStorage.getItem('user'));

   const importantTasks = [];
   const [taskLists, setTaskLists] = useState([]);
   const [taskListId, setTaskListId] = useState(0);
   
   useEffect(() => {
      axios.get(`http://localhost:8080/api/taskList/user?id=${user?.userId}`)
         .then((response) => {
            setTaskLists(response.data);
            response.data.forEach(taskList => {
               const importants = taskList?.tasks?.filter(task => task.important === true);
               importants.forEach(imp => importantTasks.push(imp));
            });
         }).catch(error => {
            console.log(error);
         });

      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [taskListId]);
   
   const [tasks, setTasks] = useState({taskListName: 'Important', tasks: importantTasks});

   return (
      <div className='dashboard'>
         <Sidebar
            taskLists={taskLists}
            setTaskLists={setTaskLists}
            setTasks={setTasks}
            setTaskListId={setTaskListId} 
            taskListId={taskListId}
         />
         <div className='dashboard__panel'>
            <Navbar user={user} />
            <Tasks tasks={tasks} setTasks={setTasks} taskListId={taskListId} />
         </div>
      </div>
   )
}

export default Dashboard;