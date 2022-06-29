import React, { useEffect, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import axios from 'axios';
import {Alert, Snackbar } from '@mui/material';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';

import './Tasks.scss';
import Task from './Task/Task';
import TaskForm from './TaskForm/TaskForm';
import { IMPORTANT, PLANNED } from '../../constants/taskListId';
import CreateTaskForm from './CreateTaskForm/CreateTaskForm';

var  completedTasks = [], pendingTasks = [];

const Tasks = ({ taskLists, setTaskLists, tasks, setTasks, taskListId, setTaskListId, user }) => {
   const navbar = document.getElementById('navbar');
   const [showCompletedTasks, setShowCompletedTasks] = useState(false);
   const [taskFormId, setTaskFormId] = useState(0);
   const [isMoreClicked, setIsMoreClicked] = useState(false);
   const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
   const [openEditAlert, setOpenEditAlert] = useState(false);
   const [taskListName, setTaskListName] = useState(tasks?.taskListName);
   const [showWarningCreateTask, setShowWarningCreateTask] = useState(false);

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

   const deleteTaskList = () => {
      axios.delete(`https://spring-tstodolist.herokuapp.com/api/taskList/delete/${taskListId}`)
         .then(response => {
            setTaskListId(0);
            const currentTaskLists = taskLists.filter(list => list.taskListId !== taskListId);
            setTaskLists(currentTaskLists);
            
            const importantTasks = [];
            currentTaskLists.forEach(taskList => {
               const importants = taskList?.tasks?.filter(task => task.important === true);
               importants.forEach(imp => importantTasks.push(imp));
            });
            setTasks({ taskListName: 'Important', tasks: importantTasks })
         })
         .catch(error => {
            console.log(error);
         }).then( () => {
            setOpenDeleteAlert(false);
            setIsMoreClicked(false);
         });
   }

   const updateTaskList = () => {
      axios.put(`https://spring-tstodolist.herokuapp.com/api/taskList/${taskListId}`, { name: taskListName, userId: user?.userId})
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

   const handleCloseWarning = () => {
      setShowWarningCreateTask(false);
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

               {(pendingTasks?.length === 0 && completedTasks?.length === 0) && (
                  <h3 className='h3'>There is no taks yet</h3>
               )}

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

            <CreateTaskForm 
               setShowWarningCreateTask={setShowWarningCreateTask} 
               setTasks={setTasks}
               taskListId={taskListId}
               taskLists={taskLists}
            />
         </div>
      </div>

      <Snackbar
         anchorOrigin={{ vertical: 'bottom', horizontal: 'right'}}
         open={showWarningCreateTask}
         autoHideDuration={4000}
         onClose={handleCloseWarning}
      >
         <Alert
            onClose={handleCloseWarning}
            severity="warning"
            variant='filled'
            elevation={6}
            sx={{ backgroundColor: '#b74316', color: '#F0f0f0', fontSize: '16px'}}
         >
            You must choose or create a list.
         </Alert>
      </Snackbar>

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