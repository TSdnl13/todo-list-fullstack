import React, { useState, useEffect } from 'react';
import { FormControl, Input, TextField, InputLabel, IconButton } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { red } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
   const [errorMessages, setErrorMessages] = useState({ email: '', password: '', status: 0});

   const navigate = useNavigate();

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
         if (isSignUp) {
            setNameError(true);
         }else {
            setNameError(false);
         }
      }
      if (formData.email.trim() === '') {
         setEmailError(true);
         setErrorMessages({...errorMessages, email: "Cannot be empty"})
      }
      if (formData.password === '') {
         setPasswordError(true);
      }

      if (!nameError && !passwordError && !emailError) return true;
      return false;
   }

   const handleSubmit = async () => {
      if (!validateInputs()) return;

      try {
         const response = await axios.post(`http://localhost:8080/api/user${isSignUp ? '': '/signIn'}`, formData);
           
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
      }
   }

   useEffect(() => {
      
      setErrorMessages({ 
         ...errorMessages, 
         email: errorMessages.status === 409 ? 'Email already taken':'User with this email doesn\'t exist' 
      });
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