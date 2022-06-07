import React, { useState } from 'react';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import './Tasks.scss';
import { DueDateTextField } from '../Inputs/Inputs';

const Tasks = ({ tasks }) => {
   const [value, setValue] = useState('');
   const completedTasks = tasks.tasks?.filter(task => task.state === true);
   const pendingTasks = tasks.tasks?.filter(task => task.state === false);
   const navbar = document.getElementById('navbar');

   const darkDatePicker = createTheme({
      palette: {
         mode: 'dark',
         error: {main: '#292f58'}
      }
    });

   return (
      <div className='tasks' style={{ height: `calc(100vh - ${navbar?.offsetHeight}px)`}}>
         <div className='tasks__container'>
            <h2>{tasks?.taskListName}</h2>
            {pendingTasks?.length > 0 && (
               <ul>
                  {pendingTasks.map(task => (
                     <li key={task.taskId}>
                        <p>{task.name}</p>
                     </li>
                  ))}
               </ul>
            )}

            {completedTasks?.length > 0 && (
            <div>
               <p className='tasks-subtile'>Completed <span>{completedTasks.length}</span></p>
               <ul>
                  {completedTasks.map(task => (
                     <li key={task.taskId}>
                        <p>{task.name}</p>
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