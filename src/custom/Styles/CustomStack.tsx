import { styled, Stack } from "@mui/material";

export const CustomStack = styled(Stack)(({ theme }) => ({  
  [theme.breakpoints.down("sm")]:{    
    backgroundColor: `darkred`,
    backgroundImage:"unset"
  },
  [theme.breakpoints.up("sm")]:{
  backgroundImage: `url('../src/asserts/login_bg.jpg')`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    backgroundColor: `rgba(46, 8, 8, 0.5)`,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backdropFilter: 'blur(3px)',
    position: 'absolute',
  }}  
}));