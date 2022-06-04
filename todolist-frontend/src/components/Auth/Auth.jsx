import React, { useState } from 'react';
import { FormControl, Input, TextField, InputLabel, IconButton } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { red } from '@mui/material/colors';

import { PrimaryButton } from '../Buttons/Buttons';
import './Auth.scss';

const initialState = { email: '', password: '', name: ''}

const Auth = () => {
   const [isSignUp, setIsSignUp] = useState(false);
   const [emailError, setEmailError] = useState(false);
   const [nameError, setNameError] = useState(false);
   const [passwordError, setPasswordError] = useState(false);
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
            main: "#e1e1e1",
         },
         error: {
            main: red[900]
         }
      }
   });
   
   const clearData = () => {
      setFormData({name: '', password: '', email: ''});
   }

   const switchForm = () => {
      setIsSignUp(prev => !prev);
      clearData();
   }

   const validateInputs = () =>{
      if (formData.name === '') {
         setNameError(true);
      }
      if (formData.email === '') {
         setEmailError(true);
      }
      if (formData.password === '') {
         setPasswordError(true);
      }

      if (!nameError && !passwordError && !emailError) return true;
      return false;
   }

   const handleSubmit = () => {
      if (!validateInputs()) return;
      
   }

   const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
      if (e.target.value !== '' && e.target.name === 'name'){
         setNameError(false);
      } else if (e.target.value !== '' && e.target.name === 'password'){
         setPasswordError(false);
      } else if (e.target.value !== '' && e.target.name === 'email') {
         setEmailError(false);
      }
   }

   const handleShowPassword = () => {
      setShowPassword(prev => !prev);
   }

   return (
      <div className='container'>
         <h1 className='h1'>{isSignUp ? 'Sign Up':'Log In'}</h1>
         <div className='min-width-400'>
            <div className='form'>
               <ThemeProvider theme={darkTheme}>
                  <TextField
                     label="Email"
                     variant="standard"
                     error={emailError}
                     onChange={handleChange}
                     name='email'
                     value={formData.email}
                     color='secondary'
                     helperText={emailError ? 'Cannot be empty' : ''}
                  />
                  
                  {isSignUp && (
                     <TextField
                        label="Name"
                        variant="standard"
                        error={nameError}
                        onChange={handleChange}
                        value={formData.name}
                        name='name'
                        color='secondary'
                        helperText={nameError ? 'Cannot be empty' : ''}
                     />
                  )}

                  <FormControl variant="standard" error={passwordError} color='secondary'>
                     <InputLabel
                        htmlFor="standard-adornment-password"
                     >
                        Password
                     </InputLabel>
                     <Input
                        id="standard-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        onChange={handleChange}
                        name='password'
                        error={passwordError}
                        value={formData.password}
                        endAdornment={
                           <InputAdornment position="end">
                              <IconButton
                                 aria-label="toggle password visibility"
                                 onClick={handleShowPassword}
                              >
                                 {showPassword ? <VisibilityOff/> : <Visibility/>}
                              </IconButton>
                           </InputAdornment>
                        }
                     />
                  </FormControl>
               </ThemeProvider>

               <PrimaryButton variant='contained' onClick={handleSubmit}>
                  {isSignUp ? 'Sign Up' : 'Sign In'}
               </PrimaryButton>
            </div>

            <div style={{ textAlign: 'center'}}>
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