import React from 'react';

import './Tasks.scss';


const Tasks = ({ tasks }) => {
   console.log(tasks);
   const completedTasks = tasks.tasks?.filter(task => task.state === true);
   const pendingTasks = tasks.tasks?.filter(task => task.state === false);

   return (
      <div className='tasks'>
         <div>
            <h2>{tasks?.taskListName}</h2>
            {pendingTasks?.length > 0 && (
               <ul>
                  {pendingTasks.map(task => (
                     <li key={task.taskId}>
                        <p>{task.name}</p>
                     </li>
                  ))}
               </ul>
            )}
            <ul>
            </ul>
            {completedTasks?.length > 0 && (
            <div>
               <h3>Completed {completedTasks.length}</h3>
               <ul>
                  {completedTasks.map(task => (
                     <li key={task.taskId}>
                        <p>{task.name}</p>
                     </li>
                  ))}
               </ul>
            </div>
            )}

         </div>

         <input type='text' placeholder='New Task' />
      </div>
   )
}

export default Tasks;