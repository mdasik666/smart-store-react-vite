import { AlertColor } from "@mui/material";
import { useState, useEffect } from 'react';
import { userLogin, userLoginVerify } from "@/services/Userservice";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet";
import Cookies from "js-cookie";
import SnackbarAlert from "@/custom/components/SnackbarAlert";

interface IPropsError {
  open: boolean,
  severity: AlertColor | undefined,
  message: string
}

const Ulogin = () => {
  const { register, handleSubmit, formState: { errors, isValid } } = useForm({
    mode: "onChange"
  })

  const nav = useNavigate()
  const [isLoading, setLoading] = useState<boolean>(false)
  const [snackopen, setSnackOpen] = useState<IPropsError>({ open: false, severity: undefined, message: "" })

  useEffect(() => {
    (async function () {
      if (Cookies.get("usertoken")) {
        const verify = await userLoginVerify();
        if (verify.data.status === "Success") {
          nav("/user/dashboard/")
        }
      }
    })();
  }, [])

  

  const loginValidate = async (data: any) => {
    try {
      setLoading(true)
      const res = await userLogin(data)
      if (res.data.status === "Success") {
        setSnackOpen({ open: true, severity: "success", message: res.data.message })
        nav("/user/dashboard/")
      } else {
        setSnackOpen({ open: true, severity: "error", message: res.data.message })
      }
      setLoading(false)
    } catch (err: any) {
      setSnackOpen({ open: true, severity: "warning", message: err.messsage })
      setLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Login</title>
        <link rel="stylesheet" type="text/css" href="../src/pages/User/Login/Login.css" />
      </Helmet>
      <section id="login">
        <div className="logWrapper">
          <div className="login-wrap pt-5 pb-3">
            <div className="img d-flex align-items-center justify-content-center"
              style={{ backgroundImage: "url(../src/asserts/images/logo.png)" }}></div>
            <h1 className="text-left mb-0">Login</h1>
            <p className="text-left">Enter your username and password
              to get access your account
            </p>
            <form onSubmit={handleSubmit(loginValidate)} className="login-form">
              <div className="Wrap_white">
                <div className="form-group">
                  <div className="mb-3">
                    <label htmlFor="usermail" className="form-label text-bold">Login</label>
                    <input type="email" {...register("email", { required: "Email is mandatory" })} className="form-control" id="usermail" placeholder="youremail@mail.com" />
                    {Boolean(errors?.email) && <small className="form-text text-danger" style={{ color: "red 1important" }}>{errors?.email && errors.email?.message?.toString() || ""}</small>}
                  </div>
                </div>
                <div className="form-group">
                  <div className="mb-3">
                    <label htmlFor="userpass" className="form-label text-bold">Password</label>
                    <input type="password" {...register("password", { required: "Password is mandatory" })} className="form-control" id="userpass" placeholder="********" />
                    {Boolean(errors?.password) && <small className="form-text text-danger" style={{ color: "red !important" }}>{errors?.password && errors.password?.message?.toString() || ""}</small>}
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center rememberWrap">
                  <div className="form-check mb-0">
                    <input className="form-check-input me-2" type="checkbox" value="" id="rememberMe" />
                    <label className="form-check-label" htmlFor="rememberMe">
                      Remember me
                    </label>
                  </div>
                  <Link to={"/user/forgotpassword"} className="text-body">Forgot password</Link>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center mt-4 pt-2" id="btnsWrap">
                <Link to="/user/register" className="btn btn-secondary btn-lg">Sign Up</Link>
                <button type="submit" id="loginBrn" disabled={isLoading || !isValid} className="btn btn-primary btn-lg">Login</button>
              </div>
            </form>
          </div>
        </div>
      </section>
      <SnackbarAlert snackopen={snackopen} setSnackOpen={setSnackOpen} />
    </>
  )
}

export default Ulogin;