import { userGetCategoryList, userGetCountryList, userLoginVerify } from "@/services/Userservice";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

interface IPropsUserData {
  _id: string,
  fullName: string,
  email: string
}

const Ucheckout = () => {
  const nav = useNavigate()
  const [userData, setUserData] = useState<IPropsUserData>({ _id: "", fullName: "", email: "" })
  const [countryData, setCountryData] = useState<Array<any>>([])
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
            var country = countryList.data.sort((a:any, b:any) => a.name.common.localeCompare(b.name.common)).filter((c:any)=>c.name.common.toLowerCase() === "india");
            if(country.length){
              setCountryData(country)
            }
          }
        } catch (error: any) {
          alert(error.message)
        }
      }
    })();
  }, [])
  return (
    <>
      <Helmet>
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Smart Store | Checkout</title>
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
                <button id="userProf" className="transBtn">
                  <i className="fa-regular fa-user"></i>
                  <span>Profile</span>
                </button>
                <button id="ordersMenu" className="transBtn">
                  <i className="fa-regular fa-file-lines"></i>
                  <span>Orders</span>
                </button>
                <button id="cartAdd" className="transBtn">
                  <b>5</b>
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
                              <form>
                                <div>
                                  <div className="row">
                                    <div className="col-lg-4">
                                      <div className="mb-3">
                                        <label className="form-label"
                                          htmlFor="billing-name">Name</label>
                                        <input type="text" className="form-control"
                                          id="billing-name" placeholder="Enter name" />
                                      </div>
                                    </div>
                                    <div className="col-lg-4">
                                      <div className="mb-3">
                                        <label className="form-label"
                                          htmlFor="billing-email-address">Email
                                          Address</label>
                                        <input type="email" className="form-control"
                                          id="billing-email-address"
                                          placeholder="Enter email" />
                                      </div>
                                    </div>
                                    <div className="col-lg-4">
                                      <div className="mb-3">
                                        <label className="form-label"
                                          htmlFor="billing-phone">Phone</label>
                                        <input type="text" className="form-control"
                                          id="billing-phone"
                                          placeholder="Enter Phone no." />
                                      </div>
                                    </div>
                                  </div>

                                  <div className="mb-3">
                                    <label className="form-label"
                                      htmlFor="billing-address">Address</label>
                                    <textarea className="form-control" id="billing-address" rows={3} placeholder="Enter full address"></textarea>
                                  </div>

                                  <div className="row">
                                    <div className="col-lg-4">
                                      <div className="mb-4 mb-lg-0">
                                        <label className="form-label">Country</label>
                                        <select className="form-control form-select"
                                          title="Country">
                                          <option value="0">Select Country</option>
                                          {
                                            countryData.length && 
                                            countryData.map((country,i)=>{
                                              return (
                                                <option value={country.flag} key={i}>{country.name.common}</option>
                                              )
                                            })
                                          }
                                        </select>
                                      </div>
                                    </div>

                                    <div className="col-lg-4">
                                      <div className="mb-4 mb-lg-0">
                                        <label className="form-label"
                                          htmlFor="billing-city">City</label>
                                        <input type="text" className="form-control"
                                          id="billing-city" placeholder="Enter City" />
                                      </div>
                                    </div>

                                    <div className="col-lg-4">
                                      <div className="mb-0">
                                        <label className="form-label" htmlFor="zip-code">Zip /
                                          Postal
                                          code</label>
                                        <input type="text" className="form-control"
                                          id="zip-code"
                                          placeholder="Enter Postal code" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li className="checkout-item">
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
                                <div className="col-lg-4 col-sm-6">
                                  <div data-bs-toggle="collapse">
                                    <label className="card-radio-label mb-4">
                                      <input type="radio" name="address"
                                        id="info-address1" className="card-radio-input"
                                        defaultChecked />
                                      <div className="card-radio text-truncate p-3">
                                        <span className="fs-14 mb-4 d-block">Address 1</span>
                                        <span className="fs-14 mb-2 d-block">Bradley McMillian</span>
                                        <span className="text-muted fw-normal text-wrap mb-1 d-block">109 Clarksburg Park Road Show Low, AZ 85901</span>
                                        <span className="text-muted fw-normal d-block">Mo. 012-345-6789</span>
                                      </div>
                                    </label>
                                    <div className="edit-btn bg-light  rounded">
                                      <a href="#" data-bs-toggle="tooltip"
                                        data-placement="top" title=""
                                        data-bs-original-title="Edit">
                                        <i
                                          className="fa-solid fa-pen-to-square font-size-16"></i>
                                      </a>
                                    </div>
                                  </div>
                                </div>

                                <div className="col-lg-4 col-sm-6">
                                  <div>
                                    <label className="card-radio-label mb-4">
                                      <input type="radio" name="address"
                                        id="info-address2" className="card-radio-input" />
                                      <div className="card-radio text-truncate p-3">
                                        <span className="fs-14 mb-4 d-block">Address
                                          2</span>
                                        <span className="fs-14 mb-2 d-block">Bradley
                                          McMillian</span>
                                        <span
                                          className="text-muted fw-normal text-wrap mb-1 d-block">109
                                          Clarksburg Park Road Show Low, AZ
                                          85901</span>
                                        <span className="text-muted fw-normal d-block">Mo.
                                          012-345-6789</span>
                                      </div>
                                    </label>
                                    <div className="edit-btn bg-light  rounded">
                                      <a href="#" data-bs-toggle="tooltip"
                                        data-placement="top" title=""
                                        data-bs-original-title="Edit">
                                        <i
                                          className="fa-solid fa-pen-to-square font-size-16"></i>
                                      </a>
                                    </div>
                                  </div>
                                </div>
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
                              <div className="col-lg-3 col-sm-6">
                                <div data-bs-toggle="collapse">
                                  <label className="card-radio-label mb-3">
                                    <input type="radio" name="pay-method"
                                      id="pay-methodoption1" className="card-radio-input" />
                                    <span className="card-radio py-3 text-center text-truncate">
                                      <i
                                        className=" fa-regular fa-credit-card d-block h2 mb-3"></i>
                                      Credit / Debit Card
                                    </span>
                                  </label>
                                </div>
                              </div>

                              <div className="col-lg-3 col-sm-6">
                                <div>
                                  <label className="card-radio-label">
                                    <input type="radio" name="pay-method"
                                      id="pay-methodoption3" className="card-radio-input"
                                      defaultChecked />

                                    <span className="card-radio py-3 text-center text-truncate">
                                      <i
                                        className="fa-solid fa-money-bill d-block h2 mb-3"></i>
                                      <span>Cash on Delivery</span>
                                    </span>
                                  </label>
                                </div>
                              </div>
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
                      <a href="#" className="btn btn-success">
                        <i className="mdi mdi-cart-outline me-1"></i> Procced </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-4">
                <div className="card checkout-order-summary">
                  <div className="card-body">
                    <div className="p-3 bg-light mb-3">
                      <h5 className="font-size-16 mb-0">Order Summary <span
                        className="float-end ms-2">#MN0124</span></h5>
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
                          <tr>
                            <th scope="row"><img src="images/prod4.jpg" alt="product-img"
                              title="product-img" className="avatar-lg rounded" />
                            </th>
                            <td>
                              <h5 className="font-size-16 text-truncate"><a href="#"
                                className="text-dark">Tata Sampann Spice</a></h5>
                              <p className="text-muted mb-0">
                                <i className="bx bxs-star text-warning"></i>
                                <i className="bx bxs-star text-warning"></i>
                                <i className="bx bxs-star text-warning"></i>
                                <i className="bx bxs-star text-warning"></i>
                                <i className="bx bxs-star-half text-warning"></i>
                              </p>
                              <p className="text-muted mb-0 mt-1">&#8377; 260 x 2</p>
                            </td>
                            <td>&#8377; 520</td>
                          </tr>
                          <tr>
                            <th scope="row"><img src="images/prod2.jpg" alt="product-img"
                              title="product-img" className="avatar-lg rounded" />
                            </th>
                            <td>
                              <h5 className="font-size-16 text-truncate"><a href="#"
                                className="text-dark">Ceylon CINNAMON</a></h5>
                              <p className="text-muted mb-0">
                                <i className="bx bxs-star text-warning"></i>
                                <i className="bx bxs-star text-warning"></i>
                                <i className="bx bxs-star text-warning"></i>
                                <i className="bx bxs-star text-warning"></i>
                              </p>
                              <p className="text-muted mb-0 mt-1">&#8377; 260 x 1</p>
                            </td>
                            <td>&#8377; 260</td>
                          </tr>
                          <tr>
                            <td colSpan={2}>
                              <h5 className="font-size-14 m-0">Sub Total :</h5>
                            </td>
                            <td>
                              &#8377; 780
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={2}>
                              <h5 className="font-size-14 m-0">Discount :</h5>
                            </td>
                            <td>
                              - &#8377; 78
                            </td>
                          </tr>

                          <tr>
                            <td colSpan={2}>
                              <h5 className="font-size-14 m-0">Shipping Charge :</h5>
                            </td>
                            <td>
                              &#8377; 25
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={2}>
                              <h5 className="font-size-14 m-0">Estimated Tax :</h5>
                            </td>
                            <td>
                              &#8377; 18.20
                            </td>
                          </tr>

                          <tr className="bg-light">
                            <td colSpan={2}>
                              <h5 className="font-size-14 m-0">Total:</h5>
                            </td>
                            <td>
                              &#8377; 745.2
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
    </>

  )
}

export default Ucheckout;