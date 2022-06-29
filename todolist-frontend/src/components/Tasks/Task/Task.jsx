import React, { useEffect, useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import RadioButtonUncheckedTwoToneIcon from '@mui/icons-material/RadioButtonUncheckedTwoTone';
import GradeOutlinedIcon from '@mui/icons-material/GradeOutlined';
import GradeIcon from '@mui/icons-material/Grade';
import StickyNote2OutlinedIcon from '@mui/icons-material/StickyNote2Outlined';
import { blue, indigo } from '@mui/material/colors';
import axios from 'axios';
import { format, isBefore } from 'date-fns';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';

import './Task.scss';

const initialState = {
   completedAt: null, 
   createdAt: "",
   dueDate: null,
   important: false,
   name: "",
   note: "",
   state: false,
   taskId: 0,
   taskListId: 0
}

const Task = ({ task, setTasks, tasks,  setTaskFormId  }) => {
   const [formData, setFormData] = useState(initialState);

   const updateTask = async (e) => {
      const url = `https://spring-tstodolist.herokuapp.com/api/task/${formData.taskId}`;

      setFormData({ ...formData, [e.target.name]: e.target.checked });
      let completedDate = (e.target.name === 'state') ? format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"): formData.completedAt;
      if (e.target.name === 'state' && formData.state === true) {
         completedDate = null;
      }
      axios.put(url, {
            ...formData, 
            [e.target.name]: e.target.checked,
            completedAt: completedDate
         })
         .then((response) => {
            const updatedTask = response.data;
            const filteredTask = tasks.tasks.filter(tsk => tsk.taskId !== updatedTask.taskId );
            setTasks({...tasks, tasks: [...filteredTask, updatedTask]});
         })
         .catch(error => {
            console.log(error)
         });
   }

   useEffect(() => {
      setFormData({...task});
   }, [task]);

   return (
      <div className='task' onClick={() => setTaskFormId(task.taskId)}>
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
            onClick={e => e.stopPropagation()}
            onChange={(e) => updateTask(e)}
         />

         <div className='task__details'>
            <p style={{ textDecoration: formData.state ? 'line-through':'none'  }}>{ formData.name}</p>

            {(formData.dueDate || formData.note) && (
            <p className='task__details-more-info'>
               {formData.dueDate && (
               <span className={isBefore(new Date(formData.dueDate.concat(' 23:59:59')), new Date()) && formData.state === false ? 'date-expired':''}>
                  <CalendarTodayOutlinedIcon sx={{ color: 'primary.main', fontSize: '13px' }} /> 
                  {format(new Date(formData.dueDate.concat(' 00:00:00')), "eee',' MMM d")}
               </span>
               )}
               <span>{formData.note ? <StickyNote2OutlinedIcon sx={{ color: 'primary.main', fontSize: '14px' }} />: ''}</span>
            </p>
            )}
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
            onClick={e => e.stopPropagation()}
            checked={formData.important}
            onChange={(e) => updateTask(e)}
         />
      </div>
   )
}

export default Task;