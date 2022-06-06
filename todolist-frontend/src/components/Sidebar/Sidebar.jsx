import React from 'react';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import GradeOutlinedIcon from '@mui/icons-material/GradeOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import DensityMediumOutlinedIcon from '@mui/icons-material/DensityMediumOutlined';

import './Sidebar.scss';

const Sidebar = ({taskLists, setTaskLists}) => {

   return (
      <div className="sidebar" >
         <h1 className='h1 sidebar-container'>Ts To Do</h1>
         <div className='sidebar__menu'>
            <ul>
               <li className='sidebar-container'>
                  <GradeOutlinedIcon fontSize='small' />
                  <p>Important</p>
               </li>
               <li className='sidebar-container'>
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
                  <li key={taskList.taskListId} className='sidebar-container'>
                     <DensityMediumOutlinedIcon  fontSize='small' />
                     <p>{taskList.name}</p>
                  </li>
               ))}
            </ul>         
         </div>
         <div className='sidebar__create-tasklist'>
            <button><AddSharpIcon fontSize='small' /> New List</button>
         </div>
      </div>
   )
}

export default Sidebar;