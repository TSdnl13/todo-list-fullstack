import React, { useState } from 'react';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import Checkbox from '@mui/material/Checkbox';
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
import { format } from 'date-fns';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import axios from 'axios';

import './TaskForm.scss';
import { DateTextField } from '../../Inputs/Inputs';

const TaskForm = ({ task, setTaskFormId, setTasks,  tasks }) => {
   const [formData, setFormData] = useState({...task});
   const [newDate, setNewDate] = useState(task.dueDate ? new Date(task.dueDate):null);
   const [showCalendar , setShowCalendar] = React.useState(false);
   const [prevState] = useState(task.state);

   const darkDatePicker = createTheme({
      palette: {
         mode: 'dark',
         error: {main: '#292f58'}
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
      const url = `http://localhost:8080/api/task/${putData.taskId}`;
      axios.put(url, {...putData, dueDate: newDate ? format(newDate, 'yyyy-MM-dd') : null})
         .then(response => {
            const updatedTask = response.data;
            console.log(response.data);
            const filteredTask = tasks.tasks.filter(tsk => tsk.taskId !== updatedTask.taskId );
            setTasks({...tasks, tasks: [...filteredTask, updatedTask]});
            setTaskFormId(0);
         })
         .catch(error => {
            console.log(error);
         });
   }

   console.log(task);
   console.log(newDate);

   return (
      <div className='task-form'>
         <div className='task-form__close'>
            <CloseOutlinedIcon onClick={() => setTaskFormId(0)} />
         </div>
         <div className='flex flex-col justify-between h-full'>
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
                     className='duedate-content'
                     onClick={() => {
                        setShowCalendar(prev => !prev);
                     }} 
                  >
                     <div className='duedate-text'>
                        {newDate ? ('Due ' + format(newDate, "ccc',' MMM d ','y")): 'Add due date'}
                     </div>

                     <div className='calendar-icon'>
                        {showCalendar ? <KeyboardArrowUpRoundedIcon className='animate-arrow' />:<CalendarMonthOutlinedIcon />}
                     </div>
                  </div>

                  {showCalendar && (
                  <div className='duedate-date-picker'>
                     <ThemeProvider theme={darkDatePicker}>
                     <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <StaticDatePicker
                           displayStaticWrapperAs="desktop"
                           value={formData.dueDate}                     
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
                  <div>
                     <DeleteOutlinedIcon sx={{color: '#b9b9b9'}} />
                  </div>
               </div>
            </div>
         </div>

      </div>
   )
}

export default TaskForm;