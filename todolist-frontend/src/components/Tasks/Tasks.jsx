import React, { useState } from 'react';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import './Tasks.scss';
import { DueDateTextField } from '../Inputs/Inputs';
import Task from './Task/Task';

const Tasks = ({ tasks, setTasks }) => {
   const [value, setValue] = useState('');
   const completedTasks = tasks.tasks?.filter(task => task.state === true);
   const pendingTasks = tasks.tasks?.filter(task => task.state === false);
   const navbar = document.getElementById('navbar');
   const [showCompletedTasks, setShowCompletedTasks] = useState(true);

   const darkDatePicker = createTheme({
      palette: {
         mode: 'dark',
         error: {main: '#292f58'}
      }
   });

   console.log(tasks);

   return (
      <div className='tasks' style={{ height: `calc(100vh - ${navbar?.offsetHeight}px)`}}>
         <div className='tasks__container'>
            <h2>{tasks?.taskListName}</h2>
            {pendingTasks?.length > 0 && (
               <ul>
                  {pendingTasks.map(task => (
                     <li key={task.taskId}>
                        <Task task={task} setTasks={setTasks} tasks={tasks} />
                     </li>
                  ))}
               </ul>
            )}

            {completedTasks?.length > 0 && (
            <div>
               <div
                  className='tasks-subtile'
                  onClick={() => setShowCompletedTasks(prev => !prev) }
               >
                  { showCompletedTasks ? (
                     <KeyboardArrowDownIcon />
                  ):(
                     <KeyboardArrowRightIcon />
                  )}
                  <p>Completed</p>
                  <span>{completedTasks.length}</span>
               </div>

               <ul className={'tasks__completed ' + (showCompletedTasks ? 'show-tasks':'hide-tasks')}>
                  {completedTasks.map(task => (
                     <li key={task.taskId}>
                        <Task task={task} setTasks={setTasks} tasks={tasks}  />
                     </li>
                  ))}
               </ul>
            </div>
            )}

         </div>

         <div className='tasks__create-task'>
            <AddSharpIcon fontSize='small' />
            <input type='text' placeholder='New Task' />
            <ThemeProvider theme={darkDatePicker}>
               <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                     value={value}
                     onChange={(newValue) => {
                        setValue(newValue);
                     }}
                     renderInput={(params) => (
                        <DueDateTextField size='small' {...params} />
                     )}
                  />
               </LocalizationProvider>
            </ThemeProvider>
            <button type='button'>Create</button>
         </div>
      </div>
   )
}

export default Tasks;