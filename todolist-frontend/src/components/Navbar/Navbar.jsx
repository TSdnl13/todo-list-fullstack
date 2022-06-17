import React, { useState } from 'react';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';

import './Navbar.scss';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ user, setShowSidebar }) => {
   const [isArrowUp, setIsArrowUp] = useState(false);
   const navigate =  useNavigate();
   
   const signOut = () => {
      localStorage.clear();
      navigate('/auth');
   }

   return (
      <nav className='nav' id='navbar'>
         <div className='nav__navbar relative'>
            <div className='nav__menu-icon' onClick={() => setShowSidebar(true)}>
               <MenuOutlinedIcon />
            </div>

            <div className='nav__profile' onClick={() => setIsArrowUp(prev => !prev)}>
               <div className='nav__profile-img'>
                  {user?.name?.split(' ')[0].charAt(0)}{user?.name?.split(' ')[1]?.charAt(0)}
               </div>
               <div className='nav__profile-user'>{user?.name}</div>
               { isArrowUp ? (
               <KeyboardArrowUpRoundedIcon />
               ):(<KeyboardArrowDownRoundedIcon />)}

            </div>

            { isArrowUp && (
            <div className='nav__profile-menu'>
               <span>{user?.email}</span>
               <p><ManageAccountsOutlinedIcon /> Profile</p>
               <p onClick={signOut}><LogoutRoundedIcon /> Sign out</p>
            </div>
            )}
         </div>
         {isArrowUp && <span className='overlay__more-icon' onClick={() => setIsArrowUp(false)}></span>}
      </nav>
   )
}

export default Navbar;