import React from 'react';

import './Sidebar.scss';

const Sidebar = () => {

   const user = JSON.parse(localStorage.getItem('user'));

   return (
      <div>
         <h1>Projects</h1>
         <div>
            <p>{user?.name}</p>
         </div>
      </div>
   )
}

export default Sidebar;