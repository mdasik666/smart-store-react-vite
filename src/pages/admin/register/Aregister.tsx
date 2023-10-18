import { Alert, AlertColor, Box, Button, CircularProgress, IconButton, InputAdornment, Paper, Snackbar, Stack, TextField, Typography } from "@mui/material";
import React, { useState } from 'react';
import { adminRegister } from "@/services/Adminservice";
import { useForm } from "react-hook-form";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Link } from "react-router-dom";
import { CustomStack } from "@/custom/Styles/CustomStack";
import { ArrowBack } from "@mui/icons-material";

interface IPropsError {
  open: boolean,
  severity: AlertColor | undefined,
  message: string
}

const Aregister = () => {
  const { register, handleSubmit, formState: { errors, isValid }, setError, reset } = useForm({
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
    data["phoneNumber"] = {
      "code": data["code"],
      "number": data["number"]
    }
    delete data["code"]
    delete data["number"]
    try {
      if (data.password !== data.confirmPassword) {
        setError("confirmPassword", {
          type: 'manual',
          message: 'Password not matched',
        })
        return;
      }
      setLoading(true)
      var res = await adminRegister(data)
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
    <CustomStack alignItems={"center"} justifyContent={"center"} height={"100%"} >
      <Stack position={"relative"} p={6} width={{ xs: "80%", sm: "60%", md: "30%" }} zIndex={1} component={Paper} direction={"column"} alignItems={"center"} justifyContent={"center"}>
        <IconButton component={Link} to={"/admin/login"} sx={{position:"absolute",top:0,left:0,m:1}}>
            <ArrowBack/>
        </IconButton>
        <form style={{ width: "100%"}} onSubmit={handleSubmit(registerValidate)}>
          <Typography variant={"h5"} gutterBottom textAlign={"center"}>Admin Register Form</Typography>
          <Stack spacing={2} direction="column" mt={2}>
            <TextField error={Boolean(errors?.fullName)} helperText={errors?.fullName && errors.fullName?.message?.toString() || ""} {...register("fullName", { required: "Name is mandatory" })} label="Full Name" size="small" variant="outlined" required />
            <TextField error={Boolean(errors?.username)} helperText={errors?.username && errors.username?.message?.toString() || ""} {...register("username", { required: "Username is mandatory" })} label="Username" size="small" variant="outlined" required />
            <TextField error={Boolean(errors?.email)} helperText={errors?.email && errors.email?.message?.toString() || ""} {...register("email", { required: "Email is mandatory" })} label="Email" type="email" size="small" variant="outlined" required />
            <Stack spacing={2} direction="row">
              <TextField sx={{ flex: 1 }} error={Boolean(errors?.code)} helperText={errors?.code && errors.code?.message?.toString() || ""} {...register("code", { required: "Phone Code is mandatory" })} label="Code" type="number" size="small" variant="outlined" required />
              <TextField sx={{ flex: 3 }} error={Boolean(errors?.number)} helperText={errors?.number && errors.number?.message?.toString() || ""} {...register("number", { required: "Phone Number is mandatory", minLength: { value: 10, message: "Phone Number must be exactly 10 characters" } })} label="Phone Number" type="number" size="small" variant="outlined" required />
            </Stack>
            <TextField error={Boolean(errors?.password)} helperText={errors?.password && errors.password?.message?.toString() || ""} {...register("password", { required: "Password is mandatory" })} label="Password" type="password" size="small" variant="outlined" required />
            <TextField error={Boolean(errors?.confirmPassword)} helperText={errors?.confirmPassword && errors.confirmPassword?.message?.toString() || ""} {...register("confirmPassword", { required: "Confirm Password is mandatory" })} label="Confirm Password" type={showPassword ? "text" : "password"} size="small" variant="outlined" required
              InputProps={{
                endAdornment: (<InputAdornment position="end"><IconButton onClick={togglePasswordVisibility} edge="end">
                  {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton></InputAdornment>)
              }} />
            <Stack spacing={2} direction="row" >
              <Button fullWidth type="reset" variant="contained" disabled={isLoading} endIcon={isLoading && <CircularProgress color="primary" size={20} thickness={6} sx={{ color: 'white' }} />}>Reset</Button>
              <Button fullWidth variant="contained" type="submit" disabled={!isValid || isLoading} endIcon={isLoading && <CircularProgress color="primary" size={20} thickness={6} sx={{ color: 'white' }} />}>Register</Button>
            </Stack>
          </Stack>
        </form>
      </Stack>
      {snackopen.open && <Snackbar open={snackopen.open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={handleClose} severity={snackopen.severity} sx={{ width: '100%' }}>
          {snackopen.message}
        </Alert>
      </Snackbar>}
    </CustomStack>
  )
}

export default Aregister;