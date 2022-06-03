import React, { useState } from 'react';
import { FormControl, Input, TextField, InputLabel, IconButton } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import LocalPostOfficeIcon from '@mui/icons-material/LocalPostOffice';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import { PrimaryButton } from '../Buttons/Buttons';
import './Auth.scss';

const initialState = { email: '', password: '', }

const Auth = () => {
   const [isSignUp, setIsSignUp] = useState(false);
   const [emailError, setEmailError] = useState(false);
   const [formData, setFormData] = useState(initialState);
   const [showPassword, setShowPassword] = useState(false);

   const darkTheme = createTheme({
      palette: {
         mode: 'dark',
         primary: {
            light: '#FF925E',
            main: '#FF7844',
            dark: '#E65F2B',
            contrastText: '#e9e9e9',
         },
         secondary: {
            main: "#e1e1e1"
         }
      },
   });

   const switchForm = () => {

   }

   const handleSubmit = () => {
      if (formData.email === '') {
         setEmailError(true);
      }
   }

   const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
      if (e.target.value !== '') setEmailError(false);
   }

   const handleShowPassword = () => {
      setShowPassword(prev => !prev);
   }

   return (
      <div className='container'>
         <h1 className=''>Log In</h1>
         <div className='min-width-400'>
            <div className='form'>
               <ThemeProvider theme={darkTheme}>
                  <TextField
                     label="Email"
                     variant="standard"
                     error={emailError}
                     onChange={handleChange}
                     name='email'
                     helperText={emailError ? 'Incorrect Entry' : ''}
                     InputProps={{
                        startAdornment: (
                           <InputAdornment position='start'>
                              <LocalPostOfficeIcon color='secondary' />
                           </InputAdornment>
                        )
                     }}
                  />

                  <FormControl variant="standard">
                     <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                     <Input
                        id="standard-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        onChange={handleChange}
                        endAdornment={
                           <InputAdornment position="end">
                              <IconButton
                                 aria-label="toggle password visibility"
                                 onClick={handleShowPassword}
                                 >
                                 {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                           </InputAdornment>
                        }
                        />
                  </FormControl>
               </ThemeProvider>

               <PrimaryButton variant='contained' onClick={handleSubmit}>
                  Sign In
               </PrimaryButton>
            </div>

            <div>
               <div
                  className='link-signin-signup'
                  onClick={switchForm}
               >
                  {isSignUp ? "Already have an Account? Sign In" : "Don't have an account? Sign Up"}
               </div>
            </div>
         </div>
      </div>
   )
}

export default Auth;