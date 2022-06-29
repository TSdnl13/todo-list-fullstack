import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

export const PrimaryButton = styled(Button)(() => ({
   color: "#F1f1f1",
   fontWeight: 'bold',
   wordSpacing: '1px',
   backgroundColor: "#E65F2B",
   '&:hover' : {
      backgroundColor: "#CC4511"
   }
}));

export const MyLoadingButton = styled(LoadingButton)(() => ({
   color: "#F1f1f1",
   fontWeight: 'bold',
   wordSpacing: '1px',
   backgroundColor: "#E65F2B",
   '&:hover' : {
      backgroundColor: "#CC4511"
   },
   "&:disabled": {
      backgroundColor: "#ba4316"
   }
}));