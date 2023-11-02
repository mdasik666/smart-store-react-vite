import { styled, Stack } from "@mui/material";

export const CustomStack = styled(Stack)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    overflowX: "auto",
    height: "100vh",
  },
  [theme.breakpoints.up("sm")]: {
    height: "100vh",
    backgroundImage: `url('../src/assets/images/login_bg.jpg')`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backdropFilter: 'blur(3px)',
    '&::before': {
      content: '""',
      backgroundColor: `rgba(46, 8, 8, 0.5)`,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backdropFilter: 'blur(3px)',
      position: 'absolute',
    }
  }
}));
