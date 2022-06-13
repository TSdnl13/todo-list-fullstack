import React from 'react';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import GradeOutlinedIcon from '@mui/icons-material/GradeOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import DensityMediumOutlinedIcon from '@mui/icons-material/DensityMediumOutlined';

import './Sidebar.scss';

const Sidebar = ({taskLists, setTaskLists, setTasks, setTaskListId, taskListId }) => {

   
   const findImportantTasks = () => {
      const importantTasks = [];
      taskLists.forEach(taskList => {
         const importants = taskList?.tasks?.filter(task => task.important === true);
         importants.forEach(imp => importantTasks.push(imp));
      });
      return importantTasks;
   }

   const findPlanedTasks = () => {
      const plannedTasks = [];
      taskLists.forEach(taskList => {
         const planned = taskList?.tasks?.filter(task => task.dueDate !== null);
         planned.forEach(imp => plannedTasks.push(imp));
      });
      return plannedTasks;
   }

   return (
      <div className="sidebar" >
         <h1 className='h1 sidebar-container'>Ts To Do</h1>
         <div className='sidebar__menu'>
            <ul>
               <li 
                  className={taskListId === 0 ? 'sidebar-container active': 'sidebar-container'} 
                  onClick={() => {
                     setTasks({ taskListName: 'Importants', tasks: findImportantTasks() });
                     setTaskListId(0);
                  }}
               >
                  <GradeOutlinedIcon fontSize='small' />
                  <p>Important</p>
               </li>
               <li 
                  className={taskListId === -1 ? 'sidebar-container active': 'sidebar-container'} 
                  onClick={() => {
                     setTasks({ taskListName: 'Planed', tasks: findPlanedTasks() });
                     setTaskListId(-1);
                  }}
               >
                  <CalendarMonthOutlinedIcon fontSize='small' />
                  <p>Planed</p>
               </li> 
               <li className='sidebar-container'>
                  <HomeOutlinedIcon fontSize='small' />
                  <p>Tasks</p>
               </li>
            </ul>
         </div>
         <div className='sidebar__tasklists'>
            <ul>
               {taskLists && taskLists.map((taskList) => (
                  <li
                     key={taskList.taskListId}
                     className={'sidebar-container ' + (taskList.taskListId === taskListId ? 'active': '')}
                     onClick={() => {
                        setTasks({ taskListName: taskList.name, tasks: taskList.tasks})
                        setTaskListId(taskList.taskListId);
                     }}
                  >
                     <DensityMediumOutlinedIcon  fontSize='small' />
                     <p>{taskList.name}</p>
                     {taskList?.tasks.length > 0 && 
                     (<span>{taskList.tasks?.filter(task => task.state === false).length}</span>)}
                  </li>
               ))}
            </ul>         
         </div>
         <div className='sidebar__create-tasklist'>
            <button type='button'>
               <AddSharpIcon fontSize='small' /> New List
            </button>
         </div>
      </div>
   )
}

export default Sidebar;