import React, { useState, useEffect } from 'react';
import { FormControl, Input, TextField, InputLabel, IconButton, FormHelperText } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { MyLoadingButton } from '../Buttons/Buttons';
import './Auth.scss';

const initialState = { email: '', password: '', name: ''}

const Auth = () => {
   const [isSignUp, setIsSignUp] = useState(false);
   const [emailError, setEmailError] = useState(false);
   const [nameError, setNameError] = useState(false);
   const [passwordError, setPasswordError] = useState(false);
   const [formData, setFormData] = useState(initialState);
   const [showPassword, setShowPassword] = useState(false);
   const [errorMessages, setErrorMessages] = useState({ email: '', password: '', status: 0});
   const [loadingSubmit, setLoadingSubmit] = useState(false);

   const navigate = useNavigate();

   useEffect(() => {
      const user  =JSON.parse(localStorage.getItem('user'))
      if (user) navigate('/dashboard')
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

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
            main: '#f44336'
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
      let isErrors = {password: false, name: false, email: false }
      if (formData.name === '') {
         if (isSignUp) {
            setNameError(true);
            isErrors = { ...isErrors, name: true }
         }else {
            setNameError(false);
         }
      }
      if (formData.email.trim() === '') {
         setEmailError(true);
         isErrors = { ...isErrors, email: true }
         setErrorMessages({...errorMessages, email: "Cannot be empty"})
      } else {
         // eslint-disable-next-line no-useless-escape
         const emailFormat = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

         if (!emailFormat.test(formData.email)) {
            setEmailError(true);
            isErrors = { ...isErrors, email: true }
            setErrorMessages({...errorMessages, email: "Invalid email"});
         } 
      }
      if (formData.password === '') {
         setPasswordError(true);
         isErrors = { ...isErrors, password: true }
      }

      if (isErrors.email || isErrors.password || isErrors.name) return false;
      return true;
   }

   const handleSubmit = async () => {
      if (!validateInputs()) return;

      try {
         setLoadingSubmit(true);
         const response = await axios.post(`https://spring-tstodolist.herokuapp.com/api/user${isSignUp ? '': '/signIn'}`, formData);
           
         const user = { email: response.data?.email, userId: response.data?.userId, name: response.data?.name }
         localStorage.setItem('user', JSON.stringify(user));
         navigate('/dashboard');
         
      } catch(error) {
         if (error.response?.status === 404) {
            setEmailError(true);
         } else if(error.response?.status === 400 ) {
            setPasswordError(true);
         } else if (error.response?.status === 409) {
            setErrorMessages({...errorMessages, status: 409});
            setEmailError(true);
         }
      } finally {
         setLoadingSubmit(false);
      }
   }

   useEffect(() => {
      if (errorMessages.status === 409) {
         setErrorMessages({ 
            ...errorMessages, 
            email: 'Email already taken'
         });   
      } else if (errorMessages.status === 404) {
         setErrorMessages({ 
            ...errorMessages, 
            email: 'User with this email doesn\'t exist' 
         });
      }
      // eslint-disable-next-line
   }, [emailError]);
   

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
      <div className='auth'>
         <h1 className='h1'>{isSignUp ? 'Sign Up':'Log In'}</h1>
         <div className='auth__container'>
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
                     helperText={emailError ? errorMessages.email : ''}
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
                     {passwordError && <FormHelperText id="filled-weight-helper-text">Incorrect Password</FormHelperText>}
                  </FormControl>
               </ThemeProvider>

               <MyLoadingButton 
                  variant='contained' 
                  onClick={() => {
                     handleSubmit();
                  }} 
                  loading={loadingSubmit} 
               >
                  {isSignUp ? 'Sign Up' : 'Sign In'}
               </MyLoadingButton>
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