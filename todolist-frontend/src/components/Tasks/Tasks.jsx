import React, { useEffect, useState } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import axios from 'axios';
import { format } from 'date-fns';
import {Alert, Snackbar } from '@mui/material';

import AddSharpIcon from '@mui/icons-material/AddSharp';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import DensityMediumOutlinedIcon from '@mui/icons-material/DensityMediumOutlined';

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';

import './Tasks.scss';
import Task from './Task/Task';
import TaskForm from './TaskForm/TaskForm';
import { DateTextField } from '../Inputs/Inputs';
import { IMPORTANT, PLANNED } from '../../constants/taskListId';

var  completedTasks = [], pendingTasks = [];

const Tasks = ({ taskLists, setTaskLists, tasks, setTasks, taskListId, setTaskListId, user }) => {
   const initialTaskState = {name: '', state: false, createdAt: '', taskListId: taskListId, dueDate: ''};
   const navbar = document.getElementById('navbar');
   const [showCompletedTasks, setShowCompletedTasks] = useState(false);
   const [taskData, setTaskData] = useState(initialTaskState);
   const [taskFormId, setTaskFormId] = useState(0);
   const [isMoreClicked, setIsMoreClicked] = useState(false);
   const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
   const [openEditAlert, setOpenEditAlert] = useState(false);
   const [taskListName, setTaskListName] = useState(tasks?.taskListName);
   const [dueDate, setDueDate] = useState(null);
   const [showDatePicker, setShowDatePicker] = useState(false);
   const [taskListForCreate, setTaskListForCreate] = useState({ name: '', id: undefined});
   const [showTaskListMenu, setShowTaskListMenu] = useState(false);
   const [showWarningCreateTask, setShowWarningCreateTask] = useState(false);

   const darkCalendar = createTheme({
      palette: {
         mode: 'dark',
         primary: {
            main: "#262b51",
            light: '#363e74'
         },
         secondary: {
            main: '#E65F2B'
         },
         error: {main: '#e23a23'},
         background: {
            default: '#1b1f3a',
            paper: '#242d60'
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
      setTaskListForCreate({ name: taskLists[0]?.name, id: taskLists[0]?.taskListId });
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
      if (taskListForCreate.id === undefined) {
         setShowWarningCreateTask(true);
         return;
      }
      axios.post('https://spring-tstodolist.herokuapp.com/api/task', 
         {
            ...taskData, 
            taskListId: (taskListId === IMPORTANT || taskListId === PLANNED) ? taskListForCreate.id : taskData.taskListId,
            createdAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
            dueDate: dueDate ? format(dueDate, 'yyyy-MM-dd'): null
         })
      .then((response) => {
         setTaskData(initialTaskState);
         setTasks({...tasks, tasks: [...tasks.tasks, response.data]});
         cleanCreateTaskFields();
      })
      .catch(error => {
         console.log(error);
      });
   }

   const cleanCreateTaskFields = () => {
      setDueDate(null);
      setShowDatePicker(false);
      setShowTaskListMenu(false);
   }

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

            <div className='tasks__create-task'>
               <AddSharpIcon fontSize='small' />
               <input
                  type='text'
                  placeholder='New Task'
                  onChange={(e) => setTaskData({...taskData, name: e.target.value})}
                  value={taskData.name}
               />
               {(taskListId === IMPORTANT || taskListId === PLANNED) && (
                  <div className='tasks__select-tasklist'>
                     <div
                        className='tasks__selected-tasklist'
                        onClick={() => {
                           setShowTaskListMenu(prev => !prev)
                           setShowDatePicker(false);
                        }}
                     >
                        <DensityMediumOutlinedIcon  fontSize='small' />
                        <p>{taskListForCreate.name}</p>
                     </div>
                     {showTaskListMenu && (
                        <div className='tasks__tasklists'>
                        {taskLists && taskLists.map((taskList) => (
                           <div 
                              key={taskList?.taskListId}
                              onClick={()=>  {
                                 setTaskListForCreate({name: taskList?.name, id: taskList?.taskListId});
                                 setShowTaskListMenu(false);
                              }}
                           >
                              <DensityMediumOutlinedIcon  fontSize='small' />
                              <p>{taskList.name}</p>
                           </div>
                        ))}
                        </div>
                     )}
                  </div>
               )}

               <div className='duedate'>
                  <div
                     className='duedate-content'
                     onClick={() => {
                        setShowDatePicker(prev => !prev);
                        setShowTaskListMenu(false);
                     }} 
                  >
                     {dueDate && (
                     <div className='duedate-text'>
                        {format(dueDate, "ccc',' MMM d',' y")}
                     </div>
                     )}

                     <div className='calendar-icon'>
                        <CalendarMonthOutlinedIcon />
                     </div>
                  </div>

                  {showDatePicker && (
                  <div className={'duedate-date-picker' + (dueDate ? '': ' no-date')}>
                     <ThemeProvider theme={darkCalendar}>
                     <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <StaticDatePicker
                           displayStaticWrapperAs='desktop'
                           value={dueDate}                     
                           onChange={(newDate) => {
                              setDueDate(newDate);
                           }}
                           renderInput={(params) => <DateTextField {...params} />}
                        />
                     </LocalizationProvider>
                     </ThemeProvider>
                     {dueDate && (
                     <div
                        className='clean-duedate' 
                        onClick={() => {
                           setShowDatePicker(false);
                           setDueDate(null);
                        }}
                     >
                        <CloseOutlinedIcon />
                     </div>
                     )}
                  </div>
                  )}
               </div>

               <button type='button' onClick={createTask} >Create</button>
            </div>
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