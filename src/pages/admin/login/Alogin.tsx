import { Alert,AlertColor, Button, CircularProgress, Paper, Snackbar, Stack, TextField, Typography } from "@mui/material";
import React, { useState, useEffect } from 'react';
import { adminLogin } from "../../../services/Adminservice";
import { useNavigate } from "react-router-dom";
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

    const nav = useNavigate()
    const [isLoading, setLoading] = useState<boolean>(false)
    const [snackopen, setSnackOpen] = useState<IPropsError>({ open: false, severity: undefined, message: "" })

    useEffect(()=>{
        (async function(){
            const verify = await adminLoginVerify();
            if(verify.data.status === "Success"){                
                nav("/admin/dashboard/sspanel")
            }
        })();  
    },[])

    const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackOpen({ open: false, severity: undefined, message: "" });
    };

    const loginValidate = async (data:any) => {        
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
        } catch (err:any) {
            setSnackOpen({ open: false, severity: "info", message: err?.messsage })
            setLoading(false)
        }
    }

    return (
        <Stack alignItems={"center"} justifyContent={"center"} height={"100%"} bgcolor={"#eeeeee"}>
            <Stack width={{ xs: "80%", sm:"50%", md: "30%" }} component={Paper} direction={"column"} alignItems={"center"} justifyContent={"center"} p={2}>
                <form style={{width:"100%"}} onSubmit={handleSubmit(loginValidate)}>
                    <Stack width={"100%"}>
                        <Typography variant={"h5"} gutterBottom textAlign={"center"}>Admin Login Form</Typography>
                        <Stack spacing={2} direction="column">
                            <TextField error={Boolean(errors?.username_email)} helperText={errors?.username_email && errors.username_email?.message?.toString() || ""} {...register("username_email",{required:"Username or Email is mandatory"})} label="Username or Email" size="small" variant="outlined" required />
                            <TextField error={Boolean(errors?.password)} helperText={errors?.password && errors.password?.message?.toString() || ""} {...register("password",{required:"Password is mandatory"})} label="Password" type="password" size="small" variant="outlined" required />
                            <Button variant="contained" type="submit" disabled={!isValid || isLoading} endIcon={isLoading && <CircularProgress color="primary" size={20} thickness={6} sx={{ color: 'white' }} />}>Sign In</Button>
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

export default Alogin;