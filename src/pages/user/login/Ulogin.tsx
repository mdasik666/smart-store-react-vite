import { Alert, AlertColor, Button, CircularProgress, Paper, Snackbar, Stack, TextField, Typography, IconButton, InputAdornment, styled, FormGroup, FormLabel, FormControl, InputLabel, Input, FormHelperText } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import React, { useState, useEffect } from 'react';
import { userLogin, userLoginVerify } from "../../../services/Userservice";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { CustomStack } from "../../../custom/Styles/CustomStack";

interface IPropsError {
  open: boolean,
  severity: AlertColor | undefined,
  message: string
}

const Ulogin = () => {
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
      const verify = await userLoginVerify();
      if (verify.data.status === "Success") {
        nav("/user/dashboard/")
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
      const res = await userLogin(data)
      setLoading(false)
      if (res.data.status === "Failed") {
        setSnackOpen({ open: true, severity: "error", message: res.data.message })
      } else {
        setSnackOpen({ open: true, severity: "success", message: res.data.message })
        nav("/user/dashboard/")
      }
    } catch (err: any) {
      setSnackOpen({ open: true, severity: "info", message: err?.messsage })
      setLoading(false)
    }
  }

  return (
    <CustomStack alignItems={"center"} justifyContent={{ xs: "start", sm: "center" }} width={"100%"} height={"100%"}>
      <Stack component={"form"} onSubmit={handleSubmit(loginValidate)} width={{ xs: "100%", sm: "50%", md: "25%" }} height={{ xs: "100%", sm: "auto" }} zIndex={1} bgcolor={{ xs: "darkred", sm: "white" }} p={{ sm: 6 }}>
        <Stack spacing={2} flex={{ xs: 1 }} borderRadius={{ xs: "0 0 50px 50px", sm: "0 0 0 0" }} bgcolor={"white"} p={{ xs: 6, sm: 0 }}>
          <Typography variant={"h3"} gutterBottom textAlign={"left"} fontWeight={"bold"} color={"orangered"}>LOGIN</Typography>
          <Typography gutterBottom textAlign={"left"}>Enter your username and password to get access your account</Typography>
          <Stack spacing={1}>
            <Typography fontWeight={"bold"}>Login</Typography>
            <TextField error={Boolean(errors?.email)} helperText={errors?.email && errors.email?.message?.toString() || ""} {...register("email", { required: "Email is mandatory" })} placeholder="youremail@gmail.com" size="small" variant="standard" required />
          </Stack>
          <Stack spacing={1}>
            <Typography fontWeight={"bold"}>Password</Typography>
            <TextField error={Boolean(errors?.password)} helperText={errors?.password && errors.password?.message?.toString() || ""} {...register("password", { required: "Password is mandatory" })} placeholder="************" type={showPassword ? "text" : "password"} size="small" variant="standard" required
              InputProps={{
                endAdornment: (<InputAdornment position="end"><IconButton onClick={togglePasswordVisibility} edge="end">
                  {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton></InputAdornment>)
              }} />
          </Stack>
          <Stack spacing={2} direction="row" justifyContent={"center"} alignItems={"center"}>
            <Typography>Remember me</Typography>
            <Typography>Forget password</Typography>
          </Stack>
        </Stack>

        <Stack spacing={1} p={{ xs: "0 80px" }} flex={{ xs: 1 }} justifyContent={"center"} direction={{ xs: "column-reverse", sm: "row" }} >
          <Button fullWidth component={Link} to={"/user/register"} variant="contained" disabled={isLoading} endIcon={isLoading && <CircularProgress sx={{ color: "white" }} size={20} thickness={6} />}
            sx={{
              background: "white",
              color: "darkred",
              fontWeight: "bold",
              border: "1px solid",
              borderRadius: 25,
              "&:hover": {
                background: "darkred",
                color: "white"
              }
            }}>Sign Up</Button>
          <Button fullWidth variant="contained" type="submit" disabled={!isValid || isLoading} endIcon={isLoading && <CircularProgress sx={{ color: "white" }} size={20} thickness={6} />}
            sx={{
              backgroundColor: "darkred",
              fontWeight: "bold",
              border: "1px solid white",
              borderRadius: 25,
              "&:hover": {
                border: "1px solid",
                background: "white",
                color: "darkred"
              }
            }}>Login</Button>
        </Stack>
      </Stack>
      {snackopen.open && <Snackbar open={snackopen.open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={handleClose} severity={snackopen.severity} sx={{ width: '100%' }}>
          {snackopen.message}
        </Alert>
      </Snackbar>}
    </CustomStack>
  )
}

export default Ulogin;