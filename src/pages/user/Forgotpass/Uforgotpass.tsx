import SnackbarAlert from "@/custom/components/SnackbarAlert";
import { userForgotPassword } from "@/services/Userservice";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { FieldValues, useForm } from 'react-hook-form'
import { useNavigate } from "react-router-dom";
import { IPropsError } from "../Interface";
import { AxiosError } from "axios";

const Uforgotpassword = () => {
  const nav = useNavigate()
  const { handleSubmit, register, formState: { errors, isValid } } = useForm({
    mode: "onChange",
  })

  const [isLoading, setLoading] = useState<boolean>(false)
  const [snackopen, setSnackOpen] = useState<IPropsError>({ open: false, severity: undefined, message: "" })
  const forgotPassword = async (data: FieldValues) => {
    try {
      setLoading(true)
      const forgot = await userForgotPassword(data.email)
      if (forgot.data.status === "Success") {
        setSnackOpen({ open: true, severity: "success", message: forgot.data.message })
        nav("/user/reset")
      } else {
        setSnackOpen({ open: true, severity: "error", message: forgot.data.message })
        console.log(forgot.data.message)
      }
      setLoading(false)
    } catch (error: unknown) {
      setSnackOpen({ open: true, severity: "warning", message: (error as AxiosError).message })
      setLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Forgot Password</title>
        <link rel="stylesheet" type="text/css" href="../src/pages/User/Forgotpass/Forgotpass.css" />
      </Helmet>
      <section id="login">
        <div className="logWrapper">
          <div className="login-wrap pt-5 pb-3">
            <div className="img d-flex align-items-center justify-content-center"
              style={{ backgroundImage: 'url("images/logo.png")' }}></div>
            <h1 className="text-left mb-0">Forgot Password</h1>
            <form onSubmit={handleSubmit(forgotPassword)} className="login-form">
              <div className="Wrap_white">
                <div className="form-group">
                  <div className="mb-3">
                    <label htmlFor="forgotMail" className="form-label text-bold">Email</label>
                    <input type="email" {...register('email', { required: 'Email is mandatory' })} className="form-control" id="forgotMail" placeholder="Enter your Email" />
                    {Boolean(errors?.email) && <small className="form-text text-danger" style={{ color: "red 1important" }}>{errors?.email && errors.email?.message?.toString() || ""}</small>}
                  </div>
                  <div className="d-flex justify-content-center align-items-center mt-4 pt-2" id="btnsWrap">
                    <button type="submit" disabled={!isValid || isLoading} className="btn btn-primary btn-lg">Submit</button>
                  </div>
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

export default Uforgotpassword;