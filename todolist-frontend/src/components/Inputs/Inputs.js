import { TextField } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
   palette: {
      mode: 'dark',
      primary: {
         light: '#FF925E',
         main: '#FF7844',
         dark: '#E65F2B',
         contrastText: '#e9e9e9',
      }
   },
});

export const MyTextField = ({ label,
               variant,
               helperText,
               error=false,
               size,
               onChange,
               name,
             }) => {

   return (
      <ThemeProvider theme={darkTheme}>
         <TextField
            label={label}
            variant={variant}
            helperText={helperText}
            error={error}
            size={size}
            onChange={onChange}
            name={name}
         />
      </ThemeProvider>
   );
}

