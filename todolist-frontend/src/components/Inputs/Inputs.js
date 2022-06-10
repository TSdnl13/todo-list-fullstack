import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

export const DueDateTextField = styled(TextField)({
   color: '#e8e8e8',
   borderBlockColor: 'transparent',
   '& .MuiInput-underline:after': {
      borderColor: 'transparent',
   },
   '& .MuiInputAdornment-root': {
      height: '100%'
   },
   '& .MuiOutlinedInput-root': {
      '& fieldset': {
         borderColor: 'transparent',
      },
      '&:hover fieldset': {
         borderColor: 'transparent',
      },
      '&.Mui-focused fieldset': {
         borderColor: 'transparent',
      },
   },
   maxWidth: '140px',
   "&:hover": {
      backgroundColor: '#313868'
   },
   "&:after": {
      content: `''`,
      position: 'absolute',
      top: '-0.25rem',
      left: '50%',
      transform: 'translateX(-50%) translateY(0) scale(0)',
      transition: '100ms transform',
      transformOrigin: 'bottom center',
      border: '10px solid transparent',
      borderTopColor: '#313868',
      opacity: '0'
   },
   "&:before": {
      position: 'absolute',
      top: '-0.25rem',
      left: '50%',
      transform: 'translateX(-50%) translateY(0) scale(0)',
      content: `'Add Due Date'`,
      color: '#e9e9e9',
      padding: '.3rem .4rem',
      borderRadius: '2px',
      textAlign: 'center',
      width: 'max-content',
      maxWidth: '100%',
      backgroundColor: '#313868',
      transition: '100ms transform',
      transformOrigin: 'bottom center',
      opacity: '0'      
   },
   "&:hover:before": {
      transform: 'translateX(-50%) translateY(-120%) scale(1)',
      opacity: '1'
   },
   "&:hover:after": {
      transform: 'translateX(-50%) translateY(-50%) scale(1)',
      opacity: '1'
   }
});

export const DateTextField = styled(TextField)({
   color: '#e8e8e8',
   borderRadius: '.3rem',
   backgroundColor: 'transparent',
   '&:hover': {
      backgroundColor: 'rgba(54, 62, 116, 0.8)'
   },
   borderBlockColor: 'transparent',
   '& .MuiInput-underline:after': {
      borderColor: 'transparent',
   },
   '& .MuiInputAdornment-root': {
      height: '100%'
   },
   '& .MuiOutlinedInput-root': {
      '& fieldset': {
         borderColor: 'transparent',
      },
      '&:hover fieldset': {
         borderColor: 'transparent',
      },
      '&.Mui-focused fieldset': {
         borderColor: 'transparent',
      },
   }
});


