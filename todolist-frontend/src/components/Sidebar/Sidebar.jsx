import React from 'react';
import AddSharpIcon from '@mui/icons-material/AddSharp';

import './Sidebar.scss';

const Sidebar = ({className, taskLists, setTaskLists}) => {

   return (
      <div className={className} >
         <h1>Projects</h1>
         <div>
            <ul>
               <li>
                  <p>Important</p>
               </li>
               <li>
                  <p>Planed</p>
               </li> 
               <li>
                  <p>Tasks</p>
               </li>
            </ul>
         </div>
         <div>
            <ul>
               {taskLists && taskLists.map((taskList) => (
                  <li key={taskList.taskListId}>
                     <p>{taskList.name}</p>
                  </li>
               ))}
            </ul>         
         </div>
         <div>
            <button><AddSharpIcon /> New List</button>
         </div>
      </div>
   )
}

export default Sidebar;