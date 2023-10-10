import { Alert, AlertColor, Button, CircularProgress, Paper, Snackbar, Stack, TextField, Typography, IconButton, InputAdornment } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import React, { useState, useEffect } from 'react';
import { adminLogin } from "../../../services/Adminservice";
import { Link, useNavigate } from "react-router-dom";
import { adminLoginVerify } from "../../../services/Adminservice";
import { useForm } from "react-hook-form";

interface IPropsError {
  open: boolean,
  severity: AlertColor | undefined,
  message: string
}

const Alogin = () => {
  const { register, handleSubmit, formState: { errors, isValid } } = useForm({
    mode: "onChange"
  })

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const nav = useNavigate()
  const [isLoading, setLoading] = useState<boolean>(false)
  const [snackopen, setSnackOpen] = useState<IPropsError>({ open: false, severity: undefined, message: "" })

  useEffect(() => {
    (async function () {
      const verify = await adminLoginVerify();
      if (verify.data.status === "Success") {
        nav("/admin/dashboard/sspanel")
      }
    })();
  }, [])

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackOpen({ open: false, severity: undefined, message: "" });
  };

  const loginValidate = async (data: any) => {
    try {
      setLoading(true)
      const res = await adminLogin(data)
      setLoading(false)
      if (res.data.status === "Failed") {
        setSnackOpen({ open: true, severity: "error", message: res.data.message })
      } else {
        setSnackOpen({ open: true, severity: "success", message: res.data.message })
        nav("/admin/dashboard/sspanel")
      }
    } catch (err: any) {
      setSnackOpen({ open: true, severity: "info", message: err?.messsage })
      setLoading(false)
    }
  }

  return (
    <Stack alignItems={"center"} justifyContent={"center"} height={"100%"} bgcolor={"#eeeeee"} sx={{
      backgroundImage:"url('../src/asserts/login_bg.jpg')",
      backgroundSize: "cover",
      backgroundRepeat:"no-repeat",
      backgroundPosition:"center"        
    }}>
      <Stack width={{ xs: "80%", sm: "80%", md: "30%" }} component={Paper} direction={"column"} alignItems={"center"} justifyContent={"center"} p={2}>
        <Stack width={"100%"}>
          <form style={{ width: "100%" }} onSubmit={handleSubmit(loginValidate)}>
            <Typography variant={"h5"} gutterBottom textAlign={"center"}>Admin Login Form</Typography>
            <Stack spacing={2} direction="column">
              <TextField error={Boolean(errors?.un_email_pn)} helperText={errors?.un_email_pn && errors.un_email_pn?.message?.toString() || ""} {...register("un_email_pn", { required: "Username or Email or Ph.Number is mandatory" })} label="Username or Email or Phone Number" size="small" variant="outlined" required />
              <TextField error={Boolean(errors?.password)} helperText={errors?.password && errors.password?.message?.toString() || ""} {...register("password", { required: "Password is mandatory" })} label="Password" type={showPassword ? "text" : "password"} size="small" variant="outlined" required
                InputProps={{
                  endAdornment: (<InputAdornment position="end"><IconButton onClick={togglePasswordVisibility} edge="end">
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton></InputAdornment>)
                }} />
              <Button variant="contained" type="submit" disabled={!isValid || isLoading} endIcon={isLoading && <CircularProgress color="primary" size={20} thickness={6} sx={{ color: 'white' }} />}>Sign In</Button>
            </Stack>
          </form>
          <Typography variant="h6" textAlign={"center"} p={1}>Create a new user? <Link to={"/admin/register"}>Sign Up</Link></Typography>
        </Stack>
      </Stack>
      {snackopen.open && <Snackbar open={snackopen.open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={handleClose} severity={snackopen.severity} sx={{ width: '100%' }}>
          {snackopen.message}
        </Alert>
      </Snackbar>}
    </Stack>
  )
}

export default Alogin;