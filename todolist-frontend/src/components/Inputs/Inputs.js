import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

export const MyTextField = styled(TextField)({
   '& label.Mui-focused': {
      color: '#FF925E',
   },
   '& .MuiInput-underline:after': {
      borderBottomColor: '#FF925E',
   },
   '& .MuiOutlinedInput-root': {
      '& fieldset': {
         borderColor: '#FF7844',
      },
      '&:hover fieldset': {
         borderColor: '#FF925E',
      },
      '&.Mui-focused fieldset': {
         borderColor: '#E65F2B',
      },
   },
});


