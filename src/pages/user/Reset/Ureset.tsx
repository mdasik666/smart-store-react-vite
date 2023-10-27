import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form'
import { userUpdatePassword, userVerifyForgotPassword } from "@/services/Userservice";
import { AlertColor } from "@mui/material";
import SnackbarAlert from "@/custom/components/SnackbarAlert";

interface IPropsError {
  open: boolean,
  severity: AlertColor | undefined,
  message: string
}

const Ureset = () => {
  const nav = useNavigate()
  const { handleSubmit, register, formState: { errors, isValid }, getValues } = useForm({
    mode: "onChange",
  })
  const [userData, setUserData] = useState<any>({})
  const [isLoading, setLoading] = useState<boolean>(false)
  const [snackopen, setSnackOpen] = useState<IPropsError>({ open: false, severity: undefined, message: "" })

  useEffect(() => {
    (async function () {
      if (Cookies.get('forgottoken')) {
        try {
          setLoading(true)
          const verify = await userVerifyForgotPassword()
          if (verify.data.status === "Failed") {
            nav('/user/forgotpassword')
          } else {
            const { email } = verify.data.userData
            setUserData({ email })
          }
          setLoading(false)
        } catch (error: any) {
          setLoading(false)
          setSnackOpen({ open: true, severity: "warning", message: error.messsage })
        }
      } else {
        nav('/user/forgotpassword')
      }
    })()
  }, [])

  const updatePassword = async (data: any) => {
    try {
      const update = await userUpdatePassword({ email: userData.email, password: data.password })
      if (update.data.status === "Success") {
        Cookies.remove("forgottoken")
        nav('/')
      } else {
        setSnackOpen({ open: true, severity: "error", message: update.data.messsage })
      }
    } catch (error: any) {
      setSnackOpen({ open: true, severity: "warning", message: error.messsage })
    }
  }

  return (
    <>
      <Helmet>
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Reset</title>
        <link rel="stylesheet" type="text/css" href="../src/pages/User/Reset/Reset.css" />
      </Helmet>
      <section id="login">
        <div className="logWrapper">
          <div className="login-wrap pt-5 pb-3">
            <div className="img d-flex align-items-center justify-content-center"
              style={{ backgroundImage: 'url("images/logo.png")' }}></div>
            <h1 className="text-left mb-0">Reset Password</h1>
            <form onSubmit={handleSubmit(updatePassword)} className="login-form">
              <div className="Wrap_white">
                <div className="form-group">
                  <div className="mb-3">
                    <label htmlFor="forgotMail" className="form-label text-bold">New Password</label>
                    <input {...register('password', { required: 'Password is mandatory' })} type="password" className="form-control" id="newPass" placeholder="***************" />
                    {Boolean(errors?.password) && <small className="form-text text-danger" style={{ color: "red 1important" }}>{errors?.password && errors.password?.message?.toString() || ""}</small>}
                  </div>
                </div>
                <div className="form-group">
                  <div className="mb-3">
                    <label htmlFor="forgotMail" className="form-label text-bold">Confirm New Password</label>
                    <input {...register('confirmPassword', {
                      required: 'Confirm password is mandatory',
                      validate: (data) => {
                        if (data !== getValues('password')) {
                          return "Password not matched"
                        }
                      }
                    })} type="password" className="form-control" id="newConPass" placeholder="***************" />
                    {Boolean(errors?.confirmPassword) && <small className="form-text text-danger" style={{ color: "red 1important" }}>{errors?.confirmPassword && errors.confirmPassword?.message?.toString() || ""}</small>}
                  </div>
                </div>
                <div className="d-flex justify-content-center align-items-center mt-4 pt-2" id="btnsWrap">
                  <button type="submit" disabled={!isValid || isLoading} className="btn btn-primary btn-lg">Reset Password</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
      <SnackbarAlert snackopen={snackopen} setSnackOpen={setSnackOpen} />
    </>
  )
}

export default Ureset;