import React, { useState } from 'react';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { Checkbox, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import RadioButtonUncheckedTwoToneIcon from '@mui/icons-material/RadioButtonUncheckedTwoTone';
import GradeOutlinedIcon from '@mui/icons-material/GradeOutlined';
import GradeIcon from '@mui/icons-material/Grade';
import { blue, indigo } from '@mui/material/colors';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { format, isBefore } from 'date-fns';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import axios from 'axios';

import './TaskForm.scss';
import { DateTextField } from '../../Inputs/Inputs';

const TaskForm = ({ task, setTaskFormId, setTasks,  tasks }) => {
   const [formData, setFormData] = useState({...task});
   const [newDate, setNewDate] = useState(task?.dueDate ? new Date(task.dueDate.concat(' 00:00:00')):null);
   const [showCalendar , setShowCalendar] = React.useState(false);
   const [prevState] = useState(task?.state);
   const [openAlert, setOpenAlert] = useState(false);

   const dark = createTheme({
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
            paper: '#1b1f3a'
         }
      }
   });

   const handleChange = (e) => {
      if (e.target.name === 'state' || e.target.name === 'important') {
         setFormData({...formData, [e.target.name]: e.target.checked });
      } else {
         setFormData({...formData, [e.target.name]: e.target.value });
      }
   }

   const handleUpdate = () => {
      let putData = {...formData }
      if (putData.state === false) {
         putData = {...formData, completedAt: null};
      } else if (!prevState && putData.state === true) {
         putData.completedAt = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss");
      }
      const url = `https://spring-tstodolist.herokuapp.com/api/task/${putData.taskId}`;
      axios.put(url, {...putData, dueDate: newDate ? format(newDate, 'yyyy-MM-dd') : null})
         .then(response => {
            const updatedTask = response.data;
            const filteredTask = tasks.tasks.filter(tsk => tsk.taskId !== updatedTask.taskId );
            setTasks({...tasks, tasks: [...filteredTask, updatedTask]});
            setTaskFormId(0);
         })
         .catch(error => {
            console.log(error);
         });
   }

   const deleteTask = () => {
      const url = `https://spring-tstodolist.herokuapp.com/api/task/delete/${task?.taskId}`;
      axios.delete(url)
      .then(response => {
         const deletedTaskId = task?.taskId;
         const filteredTask = tasks.tasks.filter(tsk => tsk.taskId !== deletedTaskId );
         setTasks({...tasks, tasks: [...filteredTask]});
         setTaskFormId(0);
      })
      .catch(error => {
         console.log(error);
      })
      .then( setOpenAlert(false) );
   }
   
   const closeAlert = () => {
      setOpenAlert(false);
   };

   return (
      <div className='task-form'>
         <div className='task-form__close'>
            <CloseOutlinedIcon onClick={() => setTaskFormId(0)} />
         </div>
         <div className='flex flex-col justify-between flex-1'>
            <div className='task-form__details'>
               <div className='task' >
                  <Checkbox
                     name='state'
                     aria-label='Task state'
                     icon={<RadioButtonUncheckedTwoToneIcon />}
                     checkedIcon={<CheckCircleRoundedIcon />} 
                     sx={{
                        color: blue[50],
                        '&.Mui-checked': {
                           color: indigo[100]
                        },
                        padding: '0'
                     }}
                     checked={formData.state}
                     onChange={(e) => handleChange(e)}
                  />

                  <div className='task__details'>
                     <input
                        name='name'
                        type='text'
                        value={formData.name}
                        onChange={(e => handleChange(e))}
                     />
                  </div>

                  <Checkbox 
                     name='important'
                     aria-label='Task important'
                     icon={<GradeOutlinedIcon />} 
                     checkedIcon={<GradeIcon />}
                     sx={{
                        color: blue[50],
                        '&.Mui-checked': {
                           color: indigo[100]
                        },
                        padding: '0'
                     }}
                     checked={formData.important}
                     onChange={(e) => handleChange(e)}
                  />
               </div>

               <div className='task-form__duedate'>
                  <div
                     className={'duedate-content '  + (isBefore(new Date(newDate?.toDateString() + ' 23:59:59'), new Date()) ? 'date-expired': '')}
                     onClick={() => {
                        setShowCalendar(prev => !prev);
                     }} 
                  >
                     <div className='duedate-text'>
                        {newDate ? ('Due ' + format(newDate, "ccc',' MMM d',' y")): 'Add due date'}
                     </div>

                     <div className='calendar-icon'>
                        {showCalendar ? <KeyboardArrowUpRoundedIcon className='animate-arrow' />:<CalendarMonthOutlinedIcon />}
                     </div>
                  </div>

                  {showCalendar && (
                  <div className='duedate-date-picker'>
                     <ThemeProvider theme={dark}>
                     <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <StaticDatePicker
                           displayStaticWrapperAs="desktop"
                           value={newDate}                     
                           onChange={(newDate) => {
                              setNewDate(newDate);
                           }}
                           renderInput={(params) => <DateTextField {...params} />}
                        />
                     </LocalizationProvider>
                     </ThemeProvider>
                  </div>
                  )}

                  <div className='clean-duedate' onClick={() => setNewDate(null)}>
                     <CloseOutlinedIcon />
                  </div>

               </div>

               <textarea
                  name="note"
                  rows={3}
                  placeholder='Add note'
                  value={formData.note || ''}
                  onChange={(e) => handleChange(e)}
               />
            </div>

            <div className='task-form__footer'>
               <button type='button' className='update-button' onClick={handleUpdate}>Save Changes</button>
               <div className='box'>
                  <p>{formData.state ? 'Completed on': 'Created on'} {format(new Date(formData.createdAt), "eee',' MMM d',' y")}</p>
                  <div onClick={() => setOpenAlert(true)}>
                     <DeleteOutlinedIcon sx={{color: '#b9b9b9'}} />
                  </div>
               </div>
            </div>
         </div>
         
         <ThemeProvider theme={dark}>
         <Dialog
            open={openAlert}
            onClose={closeAlert}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
         >
            <DialogTitle id="alert-dialog-title">
               {"Are you sure you want to delete this task?"}
            </DialogTitle>
            <DialogContent>
               <DialogContentText id="alert-dialog-description">
                  {formData.name}
               </DialogContentText>
            </DialogContent>
            <DialogActions>
               <Button onClick={closeAlert} color='secondary' variant='contained'>Disagree</Button>
               <Button onClick={deleteTask} color='error' variant='contained' autoFocus>Agree</Button>
            </DialogActions>
         </Dialog>
         </ThemeProvider>

      </div>
   )
}

export default TaskForm;