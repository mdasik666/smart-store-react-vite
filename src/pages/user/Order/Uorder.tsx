import SnackbarAlert from "@/custom/components/SnackbarAlert"
import { useState } from "react"
import { Helmet } from "react-helmet"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useEffect } from 'react';
import { userGetOrder, userLoginVerify } from "@/services/Userservice"
import Cookies from "js-cookie"
import { IPropsError, IPropsOrders, IPropsProductList, IPropsQTP, IPropsUserData } from "../Interface";
import { AxiosError } from "axios";

const Uorder = () => {
    const nav = useNavigate()
    const { id } = useParams()

    const [orderData, setOrderData] = useState<IPropsOrders>({} as IPropsOrders)
    const [_, setUserData] = useState<IPropsUserData>({} as IPropsUserData)
    const [snackopen, setSnackOpen] = useState<IPropsError>({ open: false, severity: undefined, message: "" })    

    useEffect(() => {
        (async function () {
            if (Cookies.get("usertoken")) {
                try {
                    const verify = await userLoginVerify();
                    if (verify.data.status === "Success") {
                        const { _id, fullName, email }:IPropsUserData = verify.data.userData
                        setUserData({ _id, fullName, email })
                        const getOrderData = await userGetOrder(id)
                        if (getOrderData.data.status === "Success") {
                            setOrderData(getOrderData.data.orderData)
                        } else {
                            setSnackOpen({ open: true, severity: "error", message: getOrderData.data.message })
                        }
                    } else {
                        nav("/user/login")
                    }
                } catch (error: unknown) {
                    setSnackOpen({ open: true, severity: "warning", message: (error as AxiosError).message })
                }
            } else {
                nav("/user/login")
            }
        })();
    }, [nav])

    const getTotal = (orders: IPropsOrders) => {
        return orders.orderedProducts.reduce((total: number, ocd: IPropsProductList) => {
            return total + ocd.quantityAndTypeAndPrice.reduce((stotal: number, qtp: IPropsQTP) => {
                return stotal + (qtp.userQuantity as number) * qtp.price
            }, 0)
        }, 0)
    }

    return (
        <>
            <Helmet>
                <title>Order</title>
                <link rel="stylesheet" type="text/css" href="../../../src/pages/User/Order/Order.css" />
            </Helmet>
            <section id="wrapper">
                <header className="shadow ">
                    <div className="container">
                        <div className="d-flex flex-wrap align-items-center justify-content-between justify-content-lg-between">
                            <div className="col-md-5">
                                <h1 className="cartTitle">
                                    <Link to={"/user/dashboard/orders"}
                                        className="d-flex align-items-center mb-2 mb-lg-0 text-dark text-decoration-none">
                                        <span><i className="fa-solid fa-arrow-left"></i> My Orders</span>
                                    </Link>
                                </h1>
                            </div>
                            <div className="mobiBar">
                                <button className="btn btn-primary" onClick={() => nav("/user/dashboard")}>
                                    <i className="fa-regular fa-compass"></i> Explore
                                </button>
                                <button id="userProf" className="transBtn" onClick={() => nav("/user/dashboard/profile")}>
                                    <i className="fa-regular fa-user"></i>
                                    <span>Profile</span>
                                </button>
                                <button id="ordersMenu" className="transBtn" onClick={() => nav("/user/dashboard/orders")}>
                                    <i className="fa-regular fa-file-lines"></i>
                                    <span>Orders</span>
                                </button>
                                <button id="cartAdd" className="transBtn" onClick={() => nav("/user/dashboard/cart")}>
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

                <section className="order-section mt-5 mb-3">
                    <div className="container">

                        <div className="container">
                            {
                                orderData ?
                                    <>
                                        <div className="d-flex justify-content-between align-items-center py-3">
                                            <h2 className="h5 mb-0"><a href="#" className="text-muted"></a> Order {orderData._id}</h2>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-8">
                                                <div className="card mb-4">
                                                    <div className="card-body">
                                                        <div className="mb-3 d-flex justify-content-between">
                                                            <div>
                                                                <span className="me-3">{orderData.deliveryStatus === "Ordered" ? convertDate(orderData.createdAt) : convertDate(orderData.updatedAt)}</span>
                                                                <span className="me-3">{orderData.paymentType}</span>
                                                                <span className="badge rounded-pill bg-danger">{orderData.deliveryStatus}</span>
                                                            </div>
                                                            <div className="d-flex">
                                                                <button className="btn btn-link p-0 me-3 d-none d-lg-block btn-icon-text"><i
                                                                    className="bi bi-download"></i> <span
                                                                        className="text">Invoice</span></button>
                                                                <div className="dropdown">
                                                                    <button className="btn btn-link p-0 text-muted" type="button"
                                                                        data-bs-toggle="dropdown">
                                                                        <i className="bi bi-three-dots-vertical"></i>
                                                                    </button>
                                                                    <ul className="dropdown-menu dropdown-menu-end">
                                                                        <li><a className="dropdown-item" href="#"><i className="bi bi-pencil"></i>
                                                                            Edit</a></li>
                                                                        <li><a className="dropdown-item" href="#"><i className="bi bi-printer"></i>
                                                                            Print</a></li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <table className="table table-borderless">
                                                            <tbody>
                                                                {
                                                                    orderData.orderedProducts.map((op: IPropsProductList, i: number) => {
                                                                        return (
                                                                            <tr key={i}>
                                                                                <td>
                                                                                    <div className="d-flex mb-2">
                                                                                        <div className="flex-shrink-0">
                                                                                            <img src={op.image.toString()} alt="" width="65"
                                                                                                className="img-fluid" />
                                                                                        </div>
                                                                                        <div className="flex-lg-grow-1 ms-3">
                                                                                            <h6 className="mb-0"><a href="#" className="text-reset">{op.productName}</a>
                                                                                            </h6>
                                                                                        </div>
                                                                                    </div>
                                                                                </td>
                                                                                {
                                                                                    op.quantityAndTypeAndPrice.map((qtp: IPropsQTP, j: number) => {
                                                                                        return (
                                                                                            <td key={j}>{qtp.quantity} {qtp.type} x {qtp.userQuantity}</td>
                                                                                        )
                                                                                    })
                                                                                }
                                                                                <td className="text-end">&#8377; {
                                                                                    op.quantityAndTypeAndPrice.reduce((stotal: number, qtp: IPropsQTP) => {
                                                                                        return stotal + (qtp.userQuantity as number) * qtp.price
                                                                                    }, 0)
                                                                                }</td>
                                                                            </tr>
                                                                        )
                                                                    })
                                                                }
                                                            </tbody>
                                                            <tfoot>
                                                                <tr>
                                                                    <td colSpan={2}>Subtotal</td>
                                                                    <td className="text-end">&#8377; {getTotal(orderData)}.00</td>
                                                                </tr>
                                                                <tr>
                                                                    <td colSpan={2}>Shipping</td>
                                                                    <td className="text-end">&#8377; 500.00</td>
                                                                </tr>
                                                                {/* <tr>
                                                                    <td colSpan={2}>Discount (Code: PMGDiwaliOffer)</td>
                                                                    <td className="text-danger text-end">-&#8377; 30.00</td>
                                                                </tr> */}
                                                                <tr className="fw-bold">
                                                                    <td colSpan={2}>TOTAL</td>
                                                                    <td className="text-end">&#8377; {getTotal(orderData) + 500}.00</td>
                                                                </tr>
                                                            </tfoot>
                                                        </table>
                                                    </div>
                                                </div>

                                                <div className="card mb-4">
                                                    <div className="card-body">
                                                        <div className="row">
                                                            <div className="col-lg-6">
                                                                <h3 className="h6">Payment Method</h3>
                                                                <p>{orderData.paymentType}</p>
                                                                <p>Total: &#8377; {getTotal(orderData) + 500}.00 <span
                                                                    className="badge bg-success rounded-pill">{orderData.paid === "Yes" ? "PAID" : "UNPAID"}</span>
                                                                </p>
                                                            </div>
                                                            <div className="col-lg-6">
                                                                <h3 className="h6">Billing address</h3>
                                                                <address>
                                                                    <strong>{orderData.shippingAddress.fullName}</strong><br />
                                                                    {orderData.shippingAddress.houseNoOrBuildingName} {orderData.shippingAddress.areaOrColony}, <br />
                                                                    {orderData.shippingAddress.city}, {orderData.shippingAddress.country} {orderData.shippingAddress.zipOrPostalCode}<br />
                                                                    <abbr title="Phone">P:</abbr> {orderData.shippingAddress.phoneNumber}
                                                                </address>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-4">
                                                <div className="card mb-4">
                                                    <div className="card-body">
                                                        <h3 className="h6">Shipping Information</h3>
                                                        <strong>FedEx</strong>
                                                        <span><a href="#" className="text-decoration-underline" target="_blank">FD5424512230</a>
                                                            <i className="bi bi-box-arrow-up-right"></i> </span>
                                                        <hr />
                                                        <h3 className="h6">Address</h3>
                                                        <address>
                                                            <strong>{orderData.shippingAddress.fullName}</strong><br />
                                                            {orderData.shippingAddress.houseNoOrBuildingName} {orderData.shippingAddress.areaOrColony}, <br />
                                                            {orderData.shippingAddress.city}, {orderData.shippingAddress.country} {orderData.shippingAddress.zipOrPostalCode}<br />
                                                            <abbr title="Phone">P:</abbr> {orderData.shippingAddress.phoneNumber}
                                                        </address>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                    :
                                    <div>Loading...</div>

                            }
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

function convertDate(dateData: string) {
    const date: Date = new Date(dateData);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
}

export default Uorder;