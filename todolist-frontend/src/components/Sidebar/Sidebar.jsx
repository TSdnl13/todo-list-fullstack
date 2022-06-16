import React, { useState } from 'react';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import GradeOutlinedIcon from '@mui/icons-material/GradeOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import DensityMediumOutlinedIcon from '@mui/icons-material/DensityMediumOutlined';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import './Sidebar.scss';
import { IMPORTANT, PLANNED } from '../../constants/taskListId';
import axios from 'axios';

const Sidebar = ({taskLists, setTaskLists, setTasks, setTaskListId, taskListId, user }) => {

   const [openFormList, setOpenFormList] = useState(false);
   const [taskListName, setTaskListName] = useState('');

   const dark = createTheme({
      palette: {
         mode: 'dark',
         primary: {
            main: "#454f94",
         },
         secondary: {
            main: '#E65F2B'
         },
         error: {main: '#e23a23'},
         background: {
            default: '#1b1f3a',
            paper: '#292f57'
         }
      }
   });  

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

   const createNewTaskList = () => {
      axios.post('http://localhost:8080/api/taskList', { name: taskListName, userId: user?.userId })
         .then(response => {
            setTaskLists(prev => [...prev, response.data]);
         })
         .catch(error => {
            console.log(error);
         })
         .then(() => {
            setTaskListName('');
            setOpenFormList(false)
         });
   }

   const handleFormListClose = () => {
      setOpenFormList(false);
   }

   return (
      <div className="sidebar" >
         <h1 className='h1 sidebar-container'>Ts To Do</h1>
         <div className='sidebar__menu'>
            <ul>
               <li 
                  className={taskListId === IMPORTANT ? 'sidebar-container active': 'sidebar-container'} 
                  onClick={() => {
                     setTasks({ taskListName: 'Important', tasks: findImportantTasks() });
                     setTaskListId(IMPORTANT);
                  }}
               >
                  <GradeOutlinedIcon fontSize='small' />
                  <p>Important</p>
               </li>
               <li 
                  className={taskListId === PLANNED ? 'sidebar-container active': 'sidebar-container'} 
                  onClick={() => {
                     setTasks({ taskListName: 'Planed', tasks: findPlanedTasks() });
                     setTaskListId(PLANNED);
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
                     {taskList?.tasks?.length > 0 && 
                     (<span>{taskList.tasks?.filter(task => task.state === false).length}</span>)}
                  </li>
               ))}
            </ul>         
         </div>
         <div className='sidebar__create-tasklist'>
            <button type='button' onClick={() => setOpenFormList(true)}>
               <AddSharpIcon fontSize='small' /> New List
            </button>
         </div>

         <ThemeProvider theme={dark}>
         <Dialog
            open={openFormList}
            onClose={handleFormListClose}
            fullWidth
            color='primary'
         >
            <DialogTitle>Create new Task List</DialogTitle>
            <DialogContent>
               <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  label="Task List Name"
                  type="text"
                  fullWidth
                  color='secondary'
                  variant='standard'
                  value={taskListName}
                  onChange={(e) => setTaskListName(e.target.value)}
               />
            </DialogContent>
            <DialogActions>
               <Button onClick={handleFormListClose} color='secondary' variant='contained' >Cancel</Button>
               <Button onClick={createNewTaskList} color='primary' variant='contained'>Create</Button>
            </DialogActions>
         </Dialog>
         </ThemeProvider>
      </div>
   )
}

export default Sidebar;