
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import { userLoginVerify } from "@/services/Userservice";
import {useEffect} from 'react'


const Ucart = () => {
  const nav = useNavigate()
  useEffect(() => {
    (async function () {
      const verify = await userLoginVerify();
      if (verify.data.status === "Failed") {
        nav("/user/login")
      } else {
        
      }
    })();
  }, [])
  return (
    <>
      <Helmet>
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Cart</title>
        <link rel="stylesheet" type="text/css" href="../../../src/pages/User/Cart/Cart.css" />
      </Helmet>
      <section id="wrapper">
        <header className="shadow ">
          <div className="container">
            <div className="row justify-content-between align-items-center">
              <div className="col-md-5">
                <h1 className="cartTitle">
                  <Link to={"/user/dashboard"}
                    className="d-flex align-items-center mb-2 mb-lg-0 text-dark text-decoration-none">
                    <span><i className="fa-solid fa-arrow-left"></i> Shopping Cart</span>
                    <span> (<span id="cartItem">4</span> Items In Cart)</span>
                  </Link >
                </h1>
              </div>
              <div className="col-md-2">
                <ul className="usermenu">
                  <li>
                    <a href="#">
                      <i className="fa-regular fa-circle-user"></i>
                      <span>Profile</span>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="fa-regular fa-file-lines"></i>
                      <span>Orders</span>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <b>5</b>
                      <i className="fa-solid fa-cart-shopping"></i>
                      <span>Cart</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

        </header>

        <section id="plWrap">
          <div className="container">
            <div className="row">
              <div className="col-md-9">
                <div className="form-check rememberWrap">
                  <input className="form-check-input" type="checkbox" value="" id="selectAllitems"/>
                    <label className="form-check-label" htmlFor="selectAllitems">
                      Select all 4 items
                    </label>
                </div>

                <div className="row cart-list">
                  <div className="col-md-12">
                    <div className="cart-item shadow">

                      <img src="../../../src/asserts/images/prod2.jpg" alt="Product 1"/>
                        <div className="cart-detail">
                          <span className="title">Ceylon CINNAMON Weight 100g Packing</span>
                          <span className="count"><b id="nos">10</b> x 500</span>
                          <span className="price">₹ 5000</span>
                        </div>

                    </div>

                    <div className="cart-item shadow">

                      <img src="../../../src/asserts/images/prod3.jpg" alt="Product 1"/>
                        <div className="cart-detail">
                          <span className="title">Keya Penne Pasta 100% Wheat Pasta, 1kg
                          </span>
                          <span className="count"><b id="nos">10</b> x 1000</span>
                          <span className="price">₹ 10000</span>
                        </div>

                    </div>

                    <div className="cart-item shadow">

                      <img src="../../../src/asserts/images/prod4.jpg" alt="Product 4"/>
                        <div className="cart-detail">
                          <span className="title">Tata Sampann Spice Chilli Powder 600g</span>
                          <span className="count"><b id="nos">10</b> x 600</span>
                          <span className="price">₹ 6000</span>
                        </div>

                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <section id="sideWrap" className="shadow cartside">
                  <section className="cartpanel">
                    <div className="panel-head">
                      invoice
                    </div>
                    <div className="panel-body">
                      <span className="subTitle">
                        Cart subtotal
                      </span>
                      <ul>
                        <li>
                          <span>Item(s) total</span>
                          <span>₹ 13,500</span>
                        </li>
                        <li>
                          <span>Shipping fee</span>
                          <span>₹ 500</span>
                        </li>

                        <li>
                          <span>Cart Total</span>
                          <span>₹ 14,000</span>
                        </li>
                      </ul>

                    </div>
                  </section>
                  <div className="d-flex justify-content-center">
                    <a href="#" className="btn btn-primary">Checkout 5 items
                    </a>
                  </div>
                </section>
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

export default Ucart;