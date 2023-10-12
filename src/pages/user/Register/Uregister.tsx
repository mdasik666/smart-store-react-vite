import { Alert, AlertColor, Snackbar, CircularProgress } from "@mui/material";
import React, { useState } from 'react';
import { userRegister } from "../../../services/Userservice";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import './Uregister.css'

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

  return (
    <>
      <section id="register">
        <div className="logWrapper">
          <div className="register-wrap pt-5 pb-3">
            <Link id="backtoLogin" to={"/user/login"}>
              <img src="../../../src/asserts/images/arrow-left.svg" alt="back Arrow" />
            </Link>
            <h1 className="text-left mb-0">SIGN UP</h1>
            <p className="text-left">
              Enter your informations to get activate your account
            </p>
            <form onSubmit={handleSubmit(registerValidate)} className="register-form">
              <div className="Wrap_white">
                <div className="form-group">
                  <div className="mb-3">
                    <label htmlFor="rName" className="form-label text-bold">Name</label>
                    <input type="text" {...register("fullName", { required: "Name is mandatory" })} className="form-control" id="rName" placeholder="Your Name" />
                    {Boolean(errors?.fullName) && <small className="form-text text-danger" style={{ color: "red !important" }}>{errors?.fullName && errors.fullName?.message?.toString() || ""}</small>}
                  </div>
                </div>
                <div className="form-group">
                  <div className="mb-3">
                    <label htmlFor="rEmail" className="form-label text-bold">Email</label>
                    <input type="email" {...register("email", { required: "Email is mandatory" })} className="form-control" id="rEmail" placeholder="youremail@mail.com" />
                    {Boolean(errors?.email) && <small className="form-text text-danger" style={{ color: "red !important" }}>{errors?.email && errors.email?.message?.toString() || ""}</small>}
                  </div>
                </div>
                <div className="form-group">
                  <div className="mb-3">
                    <label htmlFor="rMobile" className="form-label text-bold">Mobile No.</label>
                    <input type="text" {...register("phoneNumber", { required: "Phone Number is mandatory", minLength: { value: 10, message: "Phone Number must be exactly 10 characters" } })} className="form-control" id="rMobile" placeholder="99999 99999" />
                    {Boolean(errors?.phoneNumber) && <small className="form-text text-danger" style={{ color: "red !important" }}>{errors?.phoneNumber && errors.phoneNumber?.message?.toString() || ""}</small>}
                  </div>
                </div>
                <div className="form-group">
                  <div className="mb-3">
                    <label htmlFor="rAddress" className="form-label text-bold">Password</label>
                    <input type="text" {...register("password", { required: "Password is mandatory" })} className="form-control" id="rAddress" placeholder="********" />
                    {Boolean(errors?.password) && <small className="form-text text-danger" style={{ color: "red !important" }}>{errors?.password && errors.password?.message?.toString() || ""}</small>}
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center mt-4 pt-2" id="btnsWrap">
                <button type="reset" className="btn btn-secondary btn-lg">Reset {isLoading && <CircularProgress color="primary" size={20} thickness={6} />}</button>
                <button type="submit" disabled={!isValid} className="btn btn-primary btn-lg">Register {isLoading && <CircularProgress color="primary" size={20} thickness={6} />}</button>
              </div>
            </form>
          </div>
        </div>
      </section>
      {snackopen.open && <Snackbar open={snackopen.open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={handleClose} severity={snackopen.severity} sx={{ width: '100%' }}>
          {snackopen.message}
        </Alert>
      </Snackbar>}
    </>
  )
}

export default Uregister;