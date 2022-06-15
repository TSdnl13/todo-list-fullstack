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
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';


import './Tasks.scss';
import { DueDateTextField } from '../Inputs/Inputs';
import Task from './Task/Task';
import TaskForm from './TaskForm/TaskForm';
import { IMPORTANT, PLANNED } from '../../constants/taskListId';

var  completedTasks = [], pendingTasks = [];

const Tasks = ({ tasks, setTasks, taskListId, setTaskListId, user }) => {
   const initialTaskState = {name: '', state: false, createdAt: '', taskListId: taskListId, dueDate: ''};
   const navbar = document.getElementById('navbar');
   const [showCompletedTasks, setShowCompletedTasks] = useState(false);
   const [taskData, setTaskData] = useState(initialTaskState);
   const [taskFormId, setTaskFormId] = useState(0);
   const [isMoreClicked, setIsMoreClicked] = useState(false);
   const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
   const [openEditAlert, setOpenEditAlert] = useState(false);
   const [taskListName, setTaskListName] = useState(tasks?.taskListName);
   
   const darkDatePicker = createTheme({
      palette: {
         mode: 'dark',
         error: {main: '#292f58'},
         background: {
            default: '#1b1f3a',
            paper: '#292f57'
         }
      }
   });

   const dark = createTheme({
      palette: {
         mode: 'dark',
         primary: {
            main: "#454f94",
            light: '#363e74'
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
   }, [tasks, setTaskListId]);

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
      axios.delete(`http://localhost:8080/api/taskList/delete/${taskListId}`)
         .then(response => {
            setTaskListId(0);
            setTasks({taskListName: '', tasks: []});
         })
         .catch(error => {
            console.log(error);
         }).then( () => {
            setOpenDeleteAlert(false);
            setIsMoreClicked(false);
         });
   }

   const updateTaskList = () => {
      axios.put(`http://localhost:8080/api/taskList/${taskListId}`, { name: taskListName, userId: user?.userId})
         .then(response => {
            setTasks({taskListName: response.data?.name, tasks: response.data?.tasks});
         })
         .catch(error => {
            console.log(error)
         }).then( () => {
            setOpenEditAlert(false);
            setIsMoreClicked(false);
         });
   }

   const closeAlert = () => {
      setOpenDeleteAlert(false);
      setOpenEditAlert(false);
   };

   return (
      <>
      <div className='tasks' style={{ height: `calc(100vh - ${navbar?.offsetHeight}px)`}}>
         <div className='tasks__container'>
            <div className='tasks__list'>
               <div className='tasks__list-tittle'>
                  <h2>{tasks?.taskListName}</h2>
                  {(taskListId !== 0 && taskListId !== -1) && (
                  <>
                  <div className='more-button'>
                     <div className='more-button-icon' onClick={() => setIsMoreClicked(prev => !prev)}>
                        <MoreHorizOutlinedIcon/>
                     </div>
                     { isMoreClicked && (
                        <div className='tasklist__menu'>
                        <p onClick={() => setOpenEditAlert(true)}>Edit name</p>
                        <p onClick={() => setOpenDeleteAlert(true)}>Delete task list</p>
                     </div>
                     )}
                  </div>
                  {isMoreClicked && <span className='overlay__more-icon' onClick={() => setIsMoreClicked(false)}></span>}
                  </>
                  )}
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

      <ThemeProvider theme={dark}>
         <Dialog
            open={openDeleteAlert || openEditAlert}
            onClose={closeAlert}
            fullWidth
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
         >
            <DialogTitle id="alert-dialog-title">
               {openDeleteAlert ? 
                  "Are you sure you want to delete this TaskList and all its tasks?":
                  "Update Task List name"
               }
            </DialogTitle>
            <DialogContent>
               {openDeleteAlert && (
               <DialogContentText id="alert-dialog-description">
                  {tasks?.taskListName}
               </DialogContentText>
               )}
               {openEditAlert && (
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
               )}
            </DialogContent>
            <DialogActions>
               <Button onClick={closeAlert} color='secondary' variant='contained'>Cancel</Button>
               {openDeleteAlert ? (
                  <Button onClick={deleteTaskList} color='error' variant='contained' autoFocus>Delete</Button>
               ) : (
                  <Button onClick={updateTaskList} color='primary' variant='contained' autoFocus>Save Changes</Button>
               )}
            </DialogActions>
         </Dialog>
      </ThemeProvider>
      </>
   )
}

export default Tasks;