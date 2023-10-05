import { Alert, AlertColor, Button, CircularProgress, Paper, Snackbar, Stack, TextField, Typography } from "@mui/material";
import React, { useState } from 'react';
import { adminRegister } from "../../../services/Adminservice";
import { useForm } from "react-hook-form";

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
        console.log(data)
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


    return (
        <Stack alignItems={"center"} justifyContent={"center"} height={"100%"} bgcolor={"#eeeeee"}>
            <Stack width={{ xs: "80%", sm: "50%", md: "30%" }} component={Paper} direction={"column"} alignItems={"center"} justifyContent={"center"} p={2}>
                <form style={{ width: "100%" }} onSubmit={handleSubmit(registerValidate)}>
                    <Stack width={"100%"}>
                        <Typography variant={"h5"} gutterBottom textAlign={"center"}>Admin Register Form</Typography>
                        <Stack spacing={2} direction="column">
                            <TextField error={Boolean(errors?.username)} helperText={errors?.username && errors.username?.message?.toString() || ""} {...register("username", { required: "Username is mandatory" })} label="Username" size="small" variant="outlined" required />
                            <TextField error={Boolean(errors?.email)} helperText={errors?.email && errors.email?.message?.toString() || ""} {...register("email", { required: "Email is mandatory" })} label="Email" type="email" size="small" variant="outlined" required />
                            <TextField error={Boolean(errors?.password)} helperText={errors?.password && errors.password?.message?.toString() || ""} {...register("password", { required: "Password is mandatory" })} label="Password" type="password" size="small" variant="outlined" required />
                            <TextField error={Boolean(errors?.confirmPassword)} helperText={errors?.confirmPassword && errors.confirmPassword?.message?.toString() || ""} {...register("confirmPassword", { required: "Confirm Password is mandatory" })} label="Confirm Password" type="password" size="small" variant="outlined" required />
                            <Button variant="contained" type="submit" disabled={!isValid || isLoading} endIcon={isLoading && <CircularProgress color="primary" size={20} thickness={6} sx={{ color: 'white' }} />}>Sign Up</Button>
                        </Stack>
                    </Stack>
                </form>
            </Stack>
            {snackopen.open && <Snackbar open={snackopen.open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert onClose={handleClose} severity={snackopen.severity} sx={{ width: '100%' }}>
                    {snackopen.message}
                </Alert>
            </Snackbar>}
        </Stack>
    )
}

export default Aregister;