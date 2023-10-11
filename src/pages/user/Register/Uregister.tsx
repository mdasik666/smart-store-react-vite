import { Alert, AlertColor, Button, CircularProgress, IconButton, InputAdornment, Snackbar, Stack, TextField, Typography } from "@mui/material";
import React, { useState } from 'react';
import { userRegister } from "../../../services/Userservice";
import { useForm } from "react-hook-form";
import { CustomStack } from "../../../custom/Styles/CustomStack";
import { ArrowBack } from "@mui/icons-material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Link } from "react-router-dom";

interface IPropsError {
  open: boolean,
  severity: AlertColor | undefined,
  message: string
}

const Uregister = () => {
  const { register, handleSubmit, formState: { errors, isValid }, reset } = useForm({
    mode: "onChange"
  })

  const [isLoading, setLoading] = useState<boolean>(false)
  const [snackopen, setSnackOpen] = useState<IPropsError>({ open: false, severity: undefined, message: "" })

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackOpen({ open: false, severity: undefined, message: "" });
  };

  const registerValidate = async (data: any) => {
    console.log(data)
    try {
      setLoading(true)
      var res = await userRegister(data)
      setLoading(false)
      if (res.data.status === "Failed") {
        setSnackOpen({ open: true, severity: "error", message: res.data.message })
      } else {
        setSnackOpen({ open: true, severity: "success", message: res.data.message })
        reset();
      }
    } catch (err: any) {
      setSnackOpen({ open: false, severity: "info", message: err?.messsage })
      setLoading(false)
    }
  }

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <CustomStack alignItems={"center"} justifyContent={{ xs: "start", sm: "center" }} width={"100%"} height={"100%"} bgcolor={{ xs: "darkred" }}>
      <Stack component={"form"} onSubmit={handleSubmit(registerValidate)} width={{ xs: "100%", sm: "50%", md: "25%" }} zIndex={1} bgcolor={{ xs: "darkred", sm: "white" }} p={{ sm: 6 }}>
        <IconButton component={Link} to={"/user/login"} sx={{ position: "absolute", top: 0, left: 0, m: 1 }}>
          <ArrowBack />
        </IconButton>
        <Stack spacing={2} borderRadius={{ xs: "0 0 50px 50px", sm: "0 0 0 0" }} bgcolor={"white"} p={{ xs: 6, sm: 0 }}>
          <Typography variant={"h3"} gutterBottom textAlign={"left"} fontWeight={"bold"} color={"orangered"}>SIGN UP</Typography>
          <Typography gutterBottom textAlign={"left"}>Enter your information to get activate your account</Typography>
          <Stack spacing={1}>
            <Typography fontWeight={"bold"}>Name</Typography>
            <TextField error={Boolean(errors?.fullName)} helperText={errors?.fullName && errors.fullName?.message?.toString() || ""} {...register("fullName", { required: "Name is mandatory" })} placeholder="your name" size="small" variant="standard" />
          </Stack>
          <Stack spacing={1}>
            <Typography fontWeight={"bold"}>Email</Typography>
            <TextField error={Boolean(errors?.email)} helperText={errors?.email && errors.email?.message?.toString() || ""} {...register("email", { required: "Email is mandatory" })} placeholder="youremail@mail.com" type="email" size="small" variant="standard" />
          </Stack>
          <Stack spacing={1}>
            <Typography fontWeight={"bold"}>Mobile No.</Typography>
            <TextField error={Boolean(errors?.phoneNumber)} helperText={errors?.phoneNumber && errors.phoneNumber?.message?.toString() || ""} {...register("phoneNumber", { required: "Phone Number is mandatory", minLength: { value: 10, message: "Phone Number must be exactly 10 characters" } })} placeholder="999999 999999" type="number" size="small" variant="standard" />
          </Stack>
          <Stack spacing={1}>
            <Typography fontWeight={"bold"}>Password</Typography>
            <TextField error={Boolean(errors?.password)} helperText={errors?.password && errors.password?.message?.toString() || ""} {...register("password", { required: "Password is mandatory" })} placeholder="************" type={showPassword ? "text" : "password"} size="small" variant="standard"
              InputProps={{
                endAdornment: (<InputAdornment position="end"><IconButton onClick={togglePasswordVisibility} edge="end">
                  {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton></InputAdornment>)
              }} />
          </Stack>
        </Stack>
        <Stack spacing={1} m={{ xs: "20px 80px",sm:"0" }} mt={{sm:2}} justifyContent={"center"} direction={{ xs: "column-reverse", sm: "row" }} >
          <Button fullWidth type="reset" variant="contained" disabled={isLoading} endIcon={isLoading && <CircularProgress color="primary" size={20} thickness={6} />}
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
            }}>Reset</Button>
          <Button fullWidth variant="contained" type="submit" disabled={!isValid || isLoading} endIcon={isLoading && <CircularProgress color="primary" size={20} thickness={6} />}
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
            }}>Register</Button>
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

export default Uregister;