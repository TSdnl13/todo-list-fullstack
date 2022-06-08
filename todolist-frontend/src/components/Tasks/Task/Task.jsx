import React, { useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import RadioButtonUncheckedTwoToneIcon from '@mui/icons-material/RadioButtonUncheckedTwoTone';
import GradeOutlinedIcon from '@mui/icons-material/GradeOutlined';
import GradeIcon from '@mui/icons-material/Grade';
import { blue, indigo } from '@mui/material/colors';
import axios from 'axios';

import './Task.scss';

const Task = ({ task, setTasks, tasks }) => {
   const [formData, setFormData] = useState({...task});

   const updateTask = async (e) => {
      const url = `http://localhost:8080/api/task/${formData.taskId}`;
      try {
         if (e.target.name === 'state') {
            setFormData({ ...formData, state: e.target.checked });
            
            const response = await axios.put(url, { ...formData, state: e.target.checked });
            const updatedTask = await response.data;
            const filteredTask = await tasks.tasks.filter(tsk => tsk.taskId !== updatedTask.taskId );
            setTasks({...tasks, tasks: [...filteredTask, updatedTask]});
         } else if (e.target.name === 'important'){
            setFormData({ ...formData, important: e.target.checked});
            
            const response = await axios.put(url, { ...formData, important: e.target.checked });
            const updatedTask = await response.data;
            const filteredTask = await tasks.tasks.filter(tsk => tsk.taskId !== updatedTask.taskId );
            setTasks({...tasks, tasks: [...filteredTask, updatedTask]});
         }
      } catch (error) {
         console.log(error);
      }
   }

   return (
      <div className='task'>
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
            onChange={(e) => updateTask(e)}
         />

         <div className='task__details'>
            <p>{formData.name}</p>
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
            onChange={(e) => updateTask(e)}
         />
      </div>
   )
}

export default Task;