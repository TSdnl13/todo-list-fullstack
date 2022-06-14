import React, { useEffect, useState } from 'react';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import axios from 'axios';
import { format, isValid } from 'date-fns';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';

import './Tasks.scss';
import { DueDateTextField } from '../Inputs/Inputs';
import Task from './Task/Task';
import TaskForm from './TaskForm/TaskForm';
import { IMPORTANT, PLANNED } from '../../constants/taskListId';

var  completedTasks = [], pendingTasks = [];

const Tasks = ({ tasks, setTasks, taskListId }) => {
   const initialTaskState = {name: '', state: false, createdAt: '', taskListId: taskListId, dueDate: ''};
   const navbar = document.getElementById('navbar');
   const [showCompletedTasks, setShowCompletedTasks] = useState(false);
   const [taskData, setTaskData] = useState(initialTaskState);
   const [taskFormId, setTaskFormId] = useState(0);
   const [isMoreClicked, setIsMoreClicked] = useState(false);
   
   const darkDatePicker = createTheme({
      palette: {
         mode: 'dark',
         error: {main: '#292f58'}
      }
   });
   
   useEffect(() => {
      setTaskData({...taskData, taskListId: taskListId});
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [taskListId]);
   
   useEffect(() => {
      completedTasks = tasks.tasks?.filter(task => task.state === true);
      pendingTasks = tasks.tasks?.filter(task => task.state === false);
      if (taskListId === IMPORTANT) {
         completedTasks = completedTasks.filter(task => task.important === true);
         pendingTasks = pendingTasks.filter(task => task.important === true);
      } else if (taskListId === PLANNED) {
         completedTasks = completedTasks.filter(task => task.dueDate !== null);
         pendingTasks = pendingTasks.filter(task => task.dueDate !== null);
      }
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [tasks]);

   const createTask = () => {
      let postData = {};
      if (isValid(taskData.dueDate)) {
         postData = {...taskData, dueDate: format(taskData.dueDate, 'yyyy-MM-dd')};
      } else {
         postData = {...taskData, dueDate: null};
      }
      axios.post('http://localhost:8080/api/task', {...postData, createdAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss")})
      .then((response) => {
         setTaskData(initialTaskState);
         setTasks({...tasks, tasks: [...tasks.tasks, response.data]});
      })
      .catch(error => {
         console.log(error);
      });
   }

   const deleteTaskList = () => {
      console.log("delete");
   }

   return (
      <>
      <div className='tasks' style={{ height: `calc(100vh - ${navbar?.offsetHeight}px)`}}>
         <div className='tasks__container'>
            <div className='tasks__list'>
               <div className='tasks__list-tittle'>
                  <h2>{tasks?.taskListName}</h2>
                  <div className='more-button'>
                     <div className='more-button-icon' onClick={() => setIsMoreClicked(prev => !prev)}>
                        <MoreHorizOutlinedIcon/>
                     </div>
                     { isMoreClicked && (
                        <div className='tasklist__menu'>
                        <p>Edit name</p>
                        <p onClick={deleteTaskList}>Delete task list</p>
                     </div>
                     )}
                  </div>
                  {isMoreClicked && <span className='overlay__more-icon' onClick={() => setIsMoreClicked(false)}></span>}
               </div>

               {pendingTasks?.length > 0 && (
                  <ul>
                     {pendingTasks.map(task => (
                        <li key={task.taskId}>
                           <Task task={task} setTasks={setTasks} tasks={tasks} setTaskFormId={setTaskFormId} />
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
                           <Task task={task} setTasks={setTasks} tasks={tasks} setTaskFormId={setTaskFormId} />
                        </li>
                     ))}
                  </ul>
               </div>
               )}

            </div>

            <div className='tasks__create-task'>
               <AddSharpIcon fontSize='small' />
               <input
                  type='text'
                  placeholder='New Task'
                  onChange={(e) => setTaskData({...taskData, name: e.target.value})}
                  value={taskData.name}
               />
               <ThemeProvider theme={darkDatePicker}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                     <DatePicker
                        value={taskData.dueDate}
                        onChange={(newDate) => {
                           setTaskData({...taskData, dueDate: newDate});
                        }}
                        renderInput={(params) => (
                           <DueDateTextField size='small' {...params} />
                        )}
                     />
                  </LocalizationProvider>
               </ThemeProvider>
               <button type='button' onClick={createTask} >Create</button>
            </div>
         </div>

         </div>
         {taskFormId !== 0 && (
            <>
            <TaskForm 
               setTaskFormId={setTaskFormId}
               task={tasks.tasks.find(tsk => tsk.taskId === taskFormId)}
               setTasks={setTasks} 
               tasks={tasks}
            />
            <div className='overlay__taskform' onClick={() => setTaskFormId(0)} />
            </>
         )}
      </>
   )
}

export default Tasks;