import { userGetCart, userLoginVerify } from "@/services/Userservice";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { userProfileupdate } from "@/services/Userservice";
import { useForm, FieldValues } from "react-hook-form";
import SnackbarAlert from "@/custom/components/SnackbarAlert";
import { IPropsError, IPropsUserData } from "../Interface";
import { AxiosError } from "axios";

const Uprofile = () => {
  const nav = useNavigate()
  const [userData, setUserData] = useState<IPropsUserData>({} as IPropsUserData)
  const [profileImage, setProfileImage] = useState<string>("")
  const { register, handleSubmit, formState: { errors, isValid }, unregister, setValue } = useForm({
    mode: "onChange"
  })

  const [isLoading, setLoading] = useState<boolean>(false)
  const [snackopen, setSnackOpen] = useState<IPropsError>({ open: false, severity: undefined, message: "" })
  const [cartData, setCartDate] = useState<Array<any>>([])

  useEffect(() => {
    (async function () {
      if (Cookies.get("usertoken")) {
        try {
          const verify = await userLoginVerify();
          if (verify.data.status === "Failed") {
            nav("/user/login")
          } else {
            const { _id, fullName, email, phoneNumber, image }: Required<IPropsUserData> = verify.data.userData
            setUserData({ _id, fullName, email, phoneNumber, image})
            setProfileImage(image)
            unregister("image")
            setValue("fullName", fullName)
            setValue("email", email)
            setValue("phoneNumber", phoneNumber)
            getCartDate(_id)
          }
        } catch (error: unknown) {
          setSnackOpen({ open: true, severity: "warning", message: (error as AxiosError).message })
        }
      } else {
        nav("/user/login")
      }
    })();
  }, [nav])

  const getCartDate = async (id: string) => {
    try {
      const getCart = await userGetCart(id);
      if (getCart.data.status === "Success") {
        var cart = getCart.data.cartData
        setCartDate(cart)
      }
    } catch (error: unknown) {
      setSnackOpen({ open: true, severity: "warning", message: (error as AxiosError).message })
    }
  }

  const updateProfileData = async (data: FieldValues) => {
    try {
      setLoading(true)
      var res;
      if (data.image[0]) {
        data.image = await convertToBase64(data.image[0])
        res = await userProfileupdate(userData._id, data)
      } else {
        data.image = ""
        res = await userProfileupdate(userData?._id, data)
      }
      if (res.data.status === "Failed") {
        setSnackOpen({ open: true, severity: "error", message: res.data.message })
      } else {
        setSnackOpen({ open: true, severity: "success", message: res.data.message })
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
        <title>Profile</title>
        <link rel="stylesheet" type="text/css" href="../../src/pages/User/Cart/Cart.css" />
      </Helmet>
      <section id="wrapper">
        <header className="shadow ">
          <div className="container">
            <div className="d-flex flex-wrap align-items-center justify-content-between justify-content-lg-between">
              <div className="col-md-5">
                <h1>
                  <Link to={"/user/dashboard"} className="d-flex align-items-center mb-2 mb-lg-0 text-dark text-decoration-none">
                    <span className="logo_ic"></span>
                    <span className="logo_txt">SMART STORE</span>
                  </Link>
                </h1>
              </div>
              <div className="mobiBar">
                <button className="btn btn-primary">
                  <i className="fa-regular fa-compass"></i> Explore
                </button>
                <button id="userProf" className="transBtn" onClick={() => nav('/user/dashboard/profile')}>
                  <i className="fa-regular fa-user"></i>
                  <span>Profile</span>
                </button>
                <button id="ordersMenu" className="transBtn" onClick={() => nav('/user/dashboard/orders')}>
                  <i className="fa-regular fa-file-lines"></i>
                  <span>Orders</span>
                </button>
                <button id="cartAdd" className="transBtn" onClick={() => nav("/user/dashboard/cart")}>
                  <b>{cartData.length}</b>
                  <i className="fa-solid fa-cart-shopping"></i>
                  <span>Cart</span>
                </button>
                <button id="toggleMenu" className="transBtn">
                  <i className="fa-solid fa-bars"></i>
                </button>

              </div>
            </div>
          </div>

        </header>

        <section id="userProfile">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <form className="file-upload" onSubmit={handleSubmit(updateProfileData)}>
                  <div className="row mb-2 gx-5">
                    <div className="col-xxl-8 mb-5 mb-xxl-0">
                      <div className="bg-secondary-soft px-4 py-5 rounded">
                        <div className="row g-3">
                          <h4 className="mb-4 mt-0">Contact detail</h4>
                          <div className="col-md-6">
                            <label className="form-label">Full Name</label>
                            <input type="text" {...register("fullName", { required: "Name is required" })} className="form-control" placeholder="" aria-label="First name" />
                            {Boolean(errors?.fullName) && <small className="form-text text-danger" style={{ color: "red 1important" }}>{errors?.fullName && errors.fullName?.message?.toString() || ""}</small>}
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Phone number</label>
                            <input type="number" {...register("phoneNumber", { required: "Phone Number is required", minLength: { value: 10, message: "Phone Number must be exactly 10 characters" } })} className="form-control" placeholder="" aria-label="Phone number" />
                            {Boolean(errors?.phoneNumber) && <small className="form-text text-danger" style={{ color: "red 1important" }}>{errors?.phoneNumber && errors.phoneNumber?.message?.toString() || ""}</small>}

                          </div>
                          <div className="col-md-6">
                            <label htmlFor="inputEmail4" className="form-label">Email</label>
                            <input type="email" {...register("email", { required: "Email is required" })} className="form-control" id="inputEmail4" />
                            {Boolean(errors?.email) && <small className="form-text text-danger" style={{ color: "red 1important" }}>{errors?.email && errors.email?.message?.toString() || ""}</small>}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xxl-4">
                      <div className="bg-secondary-soft px-4 py-5 rounded">
                        <div className="row g-3">
                          <h4 className="mb-4 mt-0">Upload your profile photo</h4>
                          <div className="text-center">
                            <div className="square position-relative display-2 mb-3">
                              <label htmlFor="customFile">
                                {
                                  profileImage.length > 0 ?
                                    <img src={profileImage.toString()} className="position-absolute top-50 start-50 translate-middle text-secondary" width={"100px"} height={"auto"} style={{ border: "1px solid", borderRadius: "100px" }} />
                                    :
                                    <i className="fas fa-fw fa-user position-absolute top-50 start-50 translate-middle text-secondary"></i>
                                }
                              </label>
                            </div>
                            <input hidden type="file" id="customFile" accept=".jpg,.jpeg,.png" {...register("image", {
                              validate: {
                                isImage: async (file) => {
                                  if (file.length === 0) return true;
                                  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
                                  if (allowedTypes.includes(file[0].type)) {
                                    var con: unknown = await convertToBase64(file[0])
                                    setProfileImage((con as string))
                                    return true;
                                  } else {
                                    return 'Please upload a PNG or JPG image';
                                  }
                                },
                              },
                            })} />
                            {Boolean(errors?.image) && <small className="form-text text-danger" style={{ color: "red 1important" }}>{errors?.image && errors.image?.message?.toString() || ""}</small>}
                            {/* <button type="button" className="btn btn-danger-soft">Remove</button> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="gap-3 m-3 d-md-flex justify-content-md-end text-center">
                    <button disabled={!isValid || isLoading} type="submit" className="btn btn-primary ">Update</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
        <section id="copyrights">
          <div className="container">
            <div className="copywrap">
              <p>&copy; 2023 <a href="https://www.pmgsuperstore.com">pmgsuperstore.com</a>. All rights reserved
              </p>
              <ul>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Use</a></li>
              </ul>
            </div>
          </div>
        </section>
      </section>
      <SnackbarAlert snackopen={snackopen} setSnackOpen={setSnackOpen} />
    </>
  )
}

const convertToBase64 = (file: File) => {
  return new Promise((res, rej) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      res(fileReader.result)
    }
    fileReader.onerror = (err) => {
      rej(err)
    }
  })
}

export default Uprofile;