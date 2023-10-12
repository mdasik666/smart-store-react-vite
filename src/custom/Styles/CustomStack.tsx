import { styled, Stack, Button } from "@mui/material";

export const CustomStack = styled(Stack)(({ theme }) => ({  
  [theme.breakpoints.down("sm")]:{    
    backgroundColor: `darkred`,
    backgroundImage:"unset",        
  },
  [theme.breakpoints.up("sm")]:{
  backgroundImage: `url('../src/asserts/login_bg.jpg')`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',    
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

export const CustomButton1 = styled(Button)(({ theme }) => ({  
  [theme.breakpoints.down("sm")]:{    
    background: "white",
    color: "darkred",
    fontWeight: "bold",
    border: "1px solid white",
    borderRadius: 25,
    "&:hover": {
      background: "darkred",
      color: "white"
    }
  },
  [theme.breakpoints.up("sm")]:{
    background: "white",
    color: "darkred",
    fontWeight: "bold",
    border: "1px solid",
    borderRadius: 25,
    "&:hover": {
      background: "darkred",
      color: "white"
    }
}  
}));

export const CustomButton3 = styled(Button)(({ theme }) => ({  
  [theme.breakpoints.down("sm")]:{    
    background: "white",
    color: "darkred",
    fontWeight: "bold",
    border: "1px solid",
    borderRadius: 25,
    "&:hover": {
      background: "darkred",
      color: "white"
    }
  },
  [theme.breakpoints.up("sm")]:{
    background: "white",
    color: "darkred",
    fontWeight: "bold",
    border: "1px solid",
    borderRadius: 25,
    "&:hover": {
      background: "darkred",
      color: "white"
    }
}  
}));