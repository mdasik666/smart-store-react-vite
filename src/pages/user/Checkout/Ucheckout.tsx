import { userGetCart, userGetCheckOut, userGetCountryList, userGetShippingAddress, userLoginVerify, userPaymentOrders, userPaymentVerify, userPostShippingAddress } from "@/services/Userservice";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useForm } from 'react-hook-form'
import { EditNoteSharp } from "@mui/icons-material";
import { AlertColor, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from "@mui/material";
import SnackbarAlert from "@/custom/components/SnackbarAlert";

interface IPropsUserData {
  _id: string,
  fullName: string,
  email: string
}

interface IPropsQTP {
  price: number,
  quantity: string,
  type: string,
  userQuantity?: number
}

interface IPropsProductOrderList {
  _id: string,
  productName: string,
  productDescription: string,
  category: string,
  title: string,
  quantityAndTypeAndPrice: Array<IPropsQTP>,
  minOrder: number,
  image: string,
  isSelect?: boolean
}

interface IPropsError {
  open: boolean,
  severity: AlertColor | undefined,
  message: string
}

const Ucheckout = () => {
  const nav = useNavigate()
  const { register, handleSubmit, formState: { errors, isValid }, reset, getValues, setValue } = useForm({
    mode: "onChange"
  })
  const [userData, setUserData] = useState<IPropsUserData>({ _id: "", fullName: "", email: "" })
  const [countryData, setCountryData] = useState<Array<any>>([])
  const [shippingAddressList, setShippingAddressList] = useState<Array<any>>([])
  const [updateState, setUpdateState] = useState<boolean>(false)
  const [updateId, setUpdateId] = useState<string>("")
  const [orderCartData, setOrderCartData] = useState<IPropsProductOrderList[]>([])
  const [checkoutList, setCheckoutList] = useState<IPropsProductOrderList[]>([])
  const [checkoutListWithTotal, setCheckoutListWithTotal] = useState<any>({})
  const [selectedAddress, setSelectedAddress] = useState<Array<any>>([])
  const [paymentOption, setPaymentOption] = useState<string>("razorpay")
  const [isLoading, setLoading] = useState<boolean>(false)
  const [snackopen, setSnackOpen] = useState<IPropsError>({ open: false, severity: undefined, message: "" })

  useEffect(() => {
    (async function () {
      if (Cookies.get("usertoken")) {
        try {
          const verify = await userLoginVerify();
          if (verify.data.status === "Failed") {
            nav("/user/login")
          } else {
            const { _id, fullName, email } = verify.data.userData
            setUserData({ _id, fullName, email })
            const countryList = await userGetCountryList()
            var country = countryList.data.sort((a: any, b: any) => a.name.common.localeCompare(b.name.common)).filter((c: any) => c.name.common.toLowerCase() === "india");
            if (country.length) {
              setCountryData(country)
            }
            setLoading(true)
            const getCart = await userGetCart(_id);
            if (getCart.data.status === "Success") {
              var cart = getCart.data.cartData
              setOrderCartData(cart)
            }
            const shippingData = await userGetShippingAddress(_id)
            if (shippingData.data.status === "Success") {
              var addressList = shippingData.data.shippingAddress
              setShippingAddressList(addressList)
            }
            const getCheckout = await userGetCheckOut(_id)
            if (getCheckout.data.status === "Success") {
              var checkout = getCheckout.data.lastCheckoutProducts;
              if (getCheckout.data.lastCheckoutProducts.checkOutProducts.length) {
                setCheckoutList(checkout.checkOutProducts)
                setCheckoutListWithTotal(checkout)
              } else {
                nav('/user/dashboard/cart')
              }
            } else {
              nav('/user/dashboard/cart')
            }
            setLoading(false)
          }
        } catch (error: any) {
          setLoading(false)
          setSnackOpen({ open: true, severity: "warning", message: error.message })
        }
      }
    })();
  }, [nav])

  const addOrUpdateAddress = async (data: any) => {
    try {
      var finalAddress;
      if (updateState) {
        const newShipping = shippingAddressList.map((sa) => {
          if (sa._id === updateId) {
            return { ...sa, ...data }
          } else {
            return sa;
          }
        })
        finalAddress = {
          userId: userData._id,
          shippingAddress: newShipping
        }
      } else {
        finalAddress = {
          userId: userData._id,
          shippingAddress: [...shippingAddressList, data]
        }
      }
      setLoading(true)
      var addShippingAddress = await userPostShippingAddress(userData._id, finalAddress)
      if (addShippingAddress.data.status === "Success") {
        setShippingAddressList(addShippingAddress.data.shippingAddress)
        setUpdateState(false)
        reset()
      } else {
        setSnackOpen({ open: true, severity: "error", message: addShippingAddress.data.message })
      }
      setLoading(false)
    } catch (error: any) {
      setLoading(false)
      setSnackOpen({ open: true, severity: "warning", message: error.message })
    }
  }

  const updateShippingAddress = (id: string) => {
    setUpdateState(true)
    setUpdateId(id)
    const { fullName, phoneNumber, houseNoOrBuildingName, areaOrColony, country, city, zipOrPostalCode } = shippingAddressList.filter((a) => a._id === id)[0]
    setValue("fullName", fullName)
    setValue("phoneNumber", phoneNumber)
    setValue("houseNoOrBuildingName", houseNoOrBuildingName)
    setValue("areaOrColony", areaOrColony)
    setValue("country", country)
    setValue("city", city)
    setValue("zipOrPostalCode", zipOrPostalCode)
  }

  const chooseAddress = (id: string) => {
    const selectAddress = shippingAddressList.filter((sa) => sa._id === id)
    setSelectedAddress(selectAddress)
  }

  const choosePayment = (type: string) => {
    setPaymentOption(type)
  }

  const [openDialog, setOpenDialog] = useState<boolean>(false)

  const handleDialogClose = () => {    
    setOpenDialog(false)
    nav('/user/dashboard/products')
  }

  const placeOrder = async () => {
    if (selectedAddress.length) {
      if (paymentOption === 'razorpay') {
        try {
          setLoading(true)
          const resOrder = await userPaymentOrders(checkoutListWithTotal)
          if (resOrder.data.status === "Success") {
            var options = {
              "key": "rzp_test_hIjVUMXvTlfQ1Z",
              "amount": resOrder.data.order.amount,
              "currency": resOrder.data.order.currency,
              "name": "SS",
              "description": "SS Testing",
              "image": "../../src/assets/images/logo.png",
              "order_id": resOrder.data.order.id,
              "handler": async function (response: any) {
                try {
                  const resVerify = await userPaymentVerify(userData._id, { ...response, ...{orderedProducts:checkoutList, paymentType: 'razorpay', paid:"Yes", deliveryStatus:"Ordered"} })
                  if (resVerify.data.status === "Success") {
                    setOpenDialog(true)                    
                  }
                } catch (error: any) {
                  console.log(error.message)
                }
              },
              "prefill": {
                "name": userData.fullName,
                "email": userData.email
                /* "contact": "9000090000" */
              },
              "notes": {
                "address": "Razorpay Corporate Office"
              },
              "theme": {
                "color": "#3399cc"
              }
            };
            var rzp1 = new (window as any).Razorpay(options);            
            rzp1.on('payment.failed', function (response: any) {
              setSnackOpen({ open: true, severity: "error", message: response.error.reason })
            });
            rzp1.open();            
            setLoading(false)            
          }
        } catch (error: any) {
          setLoading(false)
          setSnackOpen({ open: true, severity: "warning", message: error.message })
        }
      } else {
      }
    } else {
      setSnackOpen({ open: true, severity: "warning", message: "Select delivery address" })
    }
  }

  return (
    <>
      <Helmet>
        <title>Checkout</title>
        <link rel="stylesheet" type="text/css" href="../../src/pages/User/Checkout/Checkout.css" />
      </Helmet>
      <section id="wrapper">
        <header className="shadow ">
          <div className="container">
            <div className="d-flex flex-wrap align-items-center justify-content-between justify-content-lg-between">
              <div className="col-md-5">
                <h1 className="cartTitle">
                  <div className="d-flex align-items-center mb-2 mb-lg-0 text-dark text-decoration-none">
                    <span><i className="fa-solid fa-arrow-left" onClick={() => nav("/user/dashboard/cart")}></i> Checkout</span>
                  </div>
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
                <button id="cartAdd" className="transBtn" onClick={() => nav('/user/dashboard/cart')}>
                  <b>{orderCartData.length}</b>
                  <i className="fa-solid fa-cart-shopping"></i>
                  <span>Cart</span>
                </button>
                <div className="dropdown show">
                  <button id="toggleMenu dropdown-toggle" className="transBtn" data-toggle="dropdown"
                    data-bs-toggle="dropdown" aria-expanded="false">
                    <i className="fa-solid fa-bars"></i>
                  </button>

                  <div className="dropdown-menu" aria-labelledby="optBar" role="menu">
                    <a className="dropdown-item" href="#">Settings</a>
                    <a className="dropdown-item" href="#">Signout</a>
                    <a className="dropdown-item" href="#">Checkout</a>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </header>

        <section className="checkout-section mt-5 mb-3">
          <div className="container">

            <div className="row">
              <div className="col-xl-8">

                <div className="card">
                  <div className="card-body">
                    <ol className="activity-checkout mb-0 px-4 mt-3">
                      <li className="checkout-item">
                        <div className="avatar checkout-icon p-1">
                          <div className="avatar-title rounded-circle bg-primary">
                            <i className="fa-solid fa-file-invoice"></i>
                          </div>
                        </div>
                        <div className="feed-item-list">
                          <div>
                            <h5 className="font-size-16 mb-1">Billing Info</h5>
                            <div className="mb-3">
                              <form onSubmit={handleSubmit(addOrUpdateAddress)}>
                                <div>
                                  <div className="row">
                                    <div className="col-lg-6">
                                      <div className="mb-3">
                                        <label className="form-label" htmlFor="billing-name">Name</label>
                                        <input {...register("fullName", { required: "Name is mandatory" })} type="text" className="form-control" id="billing-name" placeholder="Enter name" />
                                        {Boolean(errors?.fullName) && <small className="form-text text-danger" style={{ color: "red !important" }}>{errors?.fullName && errors.fullName?.message?.toString() || ""}</small>}
                                      </div>
                                    </div>
                                    <div className="col-lg-6">
                                      <div className="mb-3">
                                        <label className="form-label" htmlFor="billing-phone">Phone</label>
                                        <input {...register("phoneNumber", { required: "Phone Number is mandatory", minLength: { value: 10, message: "Phone Number must be exactly 10 characters" }, maxLength: { value: 10, message: "Phone Number must be exactly 10 characters" } })} type="number" className="form-control" id="billing-phone" placeholder="Enter Phone no." />
                                        {Boolean(errors?.phoneNumber) && <small className="form-text text-danger" style={{ color: "red !important" }}>{errors?.phoneNumber && errors.phoneNumber?.message?.toString() || ""}</small>}
                                      </div>
                                    </div>
                                    <div className="col-lg-6">
                                      <div className="mb-3">
                                        <label className="form-label" htmlFor="billing-houseno-building-name">House No., Building Name</label>
                                        <input {...register("houseNoOrBuildingName", { required: "House No Or Building Name is mandatory" })} type="text" className="form-control" id="billing-houseno-building-name" placeholder="Enter House No.,Building Name" />
                                        {Boolean(errors?.houseNoOrBuildingName) && <small className="form-text text-danger" style={{ color: "red !important" }}>{errors?.houseNoOrBuildingName && errors.houseNoOrBuildingName?.message?.toString() || ""}</small>}
                                      </div>
                                    </div>
                                    <div className="col-lg-6">
                                      <div className="mb-3">
                                        <label className="form-label" htmlFor="billing-area-colony">Area, Colony</label>
                                        <input {...register("areaOrColony", { required: "Area Or Colony is mandatory" })} type="text" className="form-control" id="billing-area-colony" placeholder="Enter Area, Colony" />
                                        {Boolean(errors?.areaOrColony) && <small className="form-text text-danger" style={{ color: "red !important" }}>{errors?.areaOrColony && errors.areaOrColony?.message?.toString() || ""}</small>}
                                      </div>
                                    </div>
                                    <div className="col-lg-6">
                                      <div className="mb-4 mb-lg-3">
                                        <label className="form-label">Country</label>
                                        <select value={getValues("country") || "India"} {...register("country", { required: "Country is mandatory" })} className="form-control form-select" title="Country">
                                          <option value="">Select Country</option>
                                          {
                                            countryData.length ?
                                              countryData.map((country, i) => {
                                                return (
                                                  <option value={country.name.common} key={i}>{country.name.common}</option>
                                                )
                                              }) : <option>Loading...</option>
                                          }
                                        </select>
                                        {Boolean(errors?.country) && <small className="form-text text-danger" style={{ color: "red !important" }}>{errors?.country && errors.country?.message?.toString() || ""}</small>}
                                      </div>
                                    </div>

                                    <div className="col-lg-6">
                                      <div className="mb-4 mb-lg-3">
                                        <label className="form-label" htmlFor="billing-city">City</label>
                                        <input {...register("city", { required: "City is mandatory" })} type="text" className="form-control" id="billing-city" placeholder="Enter City" />
                                        {Boolean(errors?.city) && <small className="form-text text-danger" style={{ color: "red !important" }}>{errors?.city && errors.city?.message?.toString() || ""}</small>}
                                      </div>
                                    </div>

                                    <div className="col-lg-12">
                                      <div className="mb-4 mb-lg-3">
                                        <label className="form-label" htmlFor="zip-code">Zip / Postal code</label>
                                        <input {...register("zipOrPostalCode", { required: "City is mandatory" })} type="number" className="form-control" id="zip-code" placeholder="Enter Postal code" />
                                        {Boolean(errors?.zipOrPostalCode) && <small className="form-text text-danger" style={{ color: "red !important" }}>{errors?.zipOrPostalCode && errors.zipOrPostalCode?.message?.toString() || ""}</small>}
                                      </div>
                                    </div>
                                    <div className="col-sm-12 col-md-6 mb-4">
                                      <button style={{ width: "100%" }} disabled={!isValid || isLoading} type="submit" className="btn btn-primary">{!updateState ? "Add Address" : "Update Address"}{updateState}</button>
                                    </div>
                                    <div className="col-sm-12 col-md-6 mb-4">
                                      <button style={{ width: "100%" }} disabled={!isValid || isLoading} className="btn btn-primary" type="reset" onClick={() => setUpdateState(false)}>Reset</button>
                                    </div>
                                  </div>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li className="checkout-item" style={{ borderLeft: "2px solid #ff5901" }}>
                        <div className="avatar checkout-icon p-1">
                          <div className="avatar-title rounded-circle bg-primary">
                            <i className="fa-solid fa-truck-plane"></i>
                          </div>
                        </div>
                        <div className="feed-item-list">
                          <div>
                            <h5 className="font-size-16 mb-1">Shipping Info</h5>
                            <div className="mb-3">
                              <div className="row">
                                {
                                  shippingAddressList.length ?
                                    shippingAddressList.map((sa, i) => {
                                      return (
                                        <div key={i} className="col-lg-4 col-md-6" >
                                          <div data-bs-toggle="collapse">
                                            <label className="card-radio-label mb-4">
                                              <input type="radio" name="address" id="info-address1" className="card-radio-input" />
                                              <div className="card-radio text-truncate p-3" onClick={() => chooseAddress(sa._id)}>
                                                <span className="fs-14 mb-4 d-block">Address {i + 1}</span>
                                                <span className="fs-14 mb-2 d-block">{sa.fullName}</span>
                                                <span className="text-muted fw-normal text-wrap mb-1 d-block">{sa.houseNoOrBuildingName} {sa.areaOrColony} {sa.zipOrPostalCode}</span>
                                                <span className="text-muted fw-normal d-block">Mo. {sa.phoneNumber}</span>
                                                <div className="text-end" onClick={() => updateShippingAddress(sa._id)}><IconButton><EditNoteSharp color="warning" /></IconButton></div>
                                              </div>
                                            </label>
                                          </div>
                                        </div>
                                      )
                                    })
                                    : isLoading ? <div>Loading...</div> : <div>Address Not Found</div>
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li className="checkout-item">
                        <div className="avatar checkout-icon p-1">
                          <div className="avatar-title rounded-circle bg-primary">
                            <i className="fa-solid fa-wallet"></i>
                          </div>
                        </div>
                        <div className="feed-item-list">
                          <div>
                            <h5 className="font-size-16 mb-1">Payment Info</h5>
                          </div>
                          <div>
                            <h5 className="font-size-14 mb-3">Payment method :</h5>
                            <div className="row">
                              <div className="col-sm-12 col-md-6" onClick={() => choosePayment('razorpay')}>
                                <div data-bs-toggle="collapse">
                                  <label className="card-radio-label mb-3">
                                    <input type="radio" name="pay-method" defaultChecked id="pay-methodoption1" className="card-radio-input" />
                                    <span className="card-radio py-3 text-center text-truncate">
                                      <i
                                        className=" fa-regular fa-credit-card d-block h2 mb-3"></i>
                                      Credit / Debit Card
                                    </span>
                                  </label>
                                </div>
                              </div>

                              {/* <div className="col-lg-3 col-sm-6" onClick={() => choosePayment('cod')}>
                                <div>
                                  <label className="card-radio-label">
                                    <input type="radio" name="pay-method" id="pay-methodoption3" className="card-radio-input" />
                                    <span className="card-radio py-3 text-center text-truncate">
                                      <i className="fa-solid fa-money-bill d-block h2 mb-3"></i>
                                      <span>Cash on Delivery</span>
                                    </span>
                                  </label>
                                </div>
                              </div> */}
                            </div>
                          </div>
                        </div>
                      </li>
                    </ol>
                  </div>
                </div>

                <div className="row my-4">
                  <div className="col">
                    <Link to={"/user/dashboard/products"} className="btn btn-link text-muted">
                      <i className="mdi mdi-arrow-left me-1" ></i> Continue Shopping </Link>
                  </div>
                  <div className="col">
                    <div className="text-end mt-2 mt-sm-0">
                      <button className="btn btn-success" onClick={placeOrder} disabled={isLoading}>
                        <i className="mdi mdi-cart-outline me-1"></i> Procced </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-4">
                <div className="card checkout-order-summary">
                  <div className="card-body">
                    <div className="p-3 bg-light mb-3">
                      <h5 className="font-size-16 mb-0">Order Summary <span
                        className="float-end ms-2">#</span></h5>
                    </div>
                    <div className="table-responsive">
                      <table className="table table-centered mb-0 table-nowrap">
                        <thead>
                          <tr>
                            <th className="border-top-0" style={{ width: "110px" }} scope="col">Product</th>
                            <th className="border-top-0" scope="col">Product Desc</th>
                            <th className="border-top-0" scope="col">Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            checkoutList.length ?
                              checkoutList.map((cl, i) => {
                                return (
                                  <tr key={i}>
                                    <th scope="row"><img src={cl.image.toString()} alt="product-img"
                                      title="product-img" className="avatar-lg rounded" />
                                    </th>
                                    <td>
                                      <h5 className="font-size-16 text-truncate"><a href="#"
                                        className="text-dark">{cl.productName}</a></h5>
                                      <p className="text-muted mb-0">
                                        <i className="bx bxs-star text-warning"></i>
                                        <i className="bx bxs-star text-warning"></i>
                                        <i className="bx bxs-star text-warning"></i>
                                        <i className="bx bxs-star text-warning"></i>
                                        <i className="bx bxs-star-half text-warning"></i>
                                      </p>
                                      <p className="text-muted mb-0 mt-1">{
                                        cl.quantityAndTypeAndPrice.map((qtp: IPropsQTP, i: number) => {
                                          return (
                                            <span key={i} className="measure">&#8377; {qtp.price} x {qtp.userQuantity}<br /></span>
                                          )
                                        })
                                      }</p>
                                    </td>
                                    <td>&#8377; {
                                      cl.quantityAndTypeAndPrice.reduce((stotal: number, qtp: IPropsQTP) => {
                                        return stotal + (qtp.userQuantity as number) * qtp.price
                                      }, 0)
                                    }</td>
                                  </tr>)
                              }) : <div>Loading...</div>
                          }
                          <tr>
                            <td colSpan={2}>
                              <h5 className="font-size-14 m-0">Sub Total :</h5>
                            </td>
                            <td>
                              &#8377; {
                                checkoutList.reduce((total: number, ocd: IPropsProductOrderList) => {
                                  return total + (ocd.isSelect ? ocd.quantityAndTypeAndPrice.reduce((stotal: number, qtp: IPropsQTP) => {
                                    return stotal + (qtp.userQuantity as number) * qtp.price
                                  }, 0) : 0)
                                }, 0)
                              }
                            </td>
                          </tr>

                          <tr>
                            <td colSpan={2}>
                              <h5 className="font-size-14 m-0">Shipping Charge :</h5>
                            </td>
                            <td>
                              &#8377; 500
                            </td>
                          </tr>

                          <tr className="bg-light">
                            <td colSpan={2}>
                              <h5 className="font-size-14 m-0">Total:</h5>
                            </td>
                            <td>
                              &#8377; {
                                checkoutList.reduce((total: number, ocd: IPropsProductOrderList) => {
                                  return total + (ocd.isSelect ? ocd.quantityAndTypeAndPrice.reduce((stotal: number, qtp: IPropsQTP) => {
                                    return stotal + (qtp.userQuantity as number) * qtp.price
                                  }, 0) : 0)
                                }, 0) + 500
                              }
                            </td>
                          </tr>
                        </tbody>
                      </table>

                    </div>
                  </div>
                </div>
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
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>
          Order Confirmed
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Order Placed Sccessfully
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Ok</Button>                      
        </DialogActions>
      </Dialog>
    </>

  )
}

export default Ucheckout;