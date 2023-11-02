import { useEffect, useState } from "react"
import { Helmet } from "react-helmet"
import Cookies from "js-cookie"
import { userGetCart, userLoginVerify, userOrderList } from "@/services/Userservice"
import { useNavigate } from "react-router-dom"
import { AlertColor } from "@mui/material"
import SnackbarAlert from "@/custom/components/SnackbarAlert"

interface IPropsError {
    open: boolean,
    severity: AlertColor | undefined,
    message: string
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

export const Uorders = () => {
    const nav = useNavigate()
    const [orderList, setOrderList] = useState<Array<any>>([])
    const [snackopen, setSnackOpen] = useState<IPropsError>({ open: false, severity: undefined, message: "" })
    const [orderCartData, setOrderCartData] = useState<IPropsProductOrderList[]>([])

    useEffect(() => {
        (async function () {
            if (Cookies.get("usertoken")) {
                try {
                    const verify = await userLoginVerify();
                    if (verify.data.status === "Success") {
                        const { _id } = verify.data.userData
                        const orderList = await userOrderList(_id)
                        if (orderList.data.status === "Success") {
                            setOrderList(orderList.data.orderList)
                        } else {
                            setSnackOpen({ open: true, severity: "error", message: orderList.data.message })
                        }
                        const getCart = await userGetCart(_id);
                        if (getCart.data.status === "Success") {
                            var cart = getCart.data.cartData
                            setOrderCartData(cart)
                        }
                    } else {
                        nav("/user/login")
                    }
                } catch (error: any) {
                    setSnackOpen({ open: true, severity: "warning", message: error.message })
                }
            } else {
                nav("/user/login")
            }
        })();
    }, [nav])

    const getTotal = (orders:any) => {
        return orders.orderedProducts.reduce((total: number, ocd: IPropsProductOrderList) => {
            return total + ocd.quantityAndTypeAndPrice.reduce((stotal: number, qtp: IPropsQTP) => {
                return stotal + (qtp.userQuantity as number) * qtp.price
            }, 0)
        }, 0)
    }

    return (
        <>
            <Helmet>
                <title>Cart</title>
                <link rel="stylesheet" type="text/css" href="../../src/pages/User/Orders/Orders.css" />
            </Helmet>
            <section id="wrapper">
                <header className="shadow">
                    <div className="container">
                        <div className="d-flex flex-wrap align-items-center justify-content-between justify-content-lg-between">
                            <div className="col-md-5">
                                <h1 className="cartTitle">
                                    <a href="cart.html" className="d-flex align-items-center mb-2 mb-lg-0 text-dark text-decoration-none">
                                        <span><i className="fa-solid fa-arrow-left"></i> Order #01091993</span>
                                    </a>
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

                <section className="order-section mt-5 mb-3">
                    <div className="container">
                        <div className="container">
                            <div className="d-flex justify-content-between align-items-center py-3">
                                <h2 className="h5 mb-0"><a href="#" className="text-muted"></a> Order #01091993</h2>
                            </div>

                            <div className="row">
                                <div className="col-lg-8">
                                    {
                                        orderList.length ?
                                            orderList.map((orders: any, i: number) => {
                                                return (
                                                    <div className="card mb-4">
                                                        <div className="card-body">
                                                            <div className="mb-3 d-flex justify-content-between">
                                                                <div>
                                                                    <span className="me-3">{orders.createdAt}</span>
                                                                    <span className="me-3">{orders._id}</span>
                                                                    <span className="me-3">{orders.paymentType}</span>
                                                                    <span className="badge rounded-pill bg-danger">{orders.deliveryStatus}</span>
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
                                                                        orders.orderedProducts.map((op: any, i: number) => {
                                                                            return (
                                                                                <tr>
                                                                                    <td>
                                                                                        <div className="d-flex mb-2">
                                                                                            <div className="flex-shrink-0">
                                                                                                <img src="images/prod4.jpg" alt="" width="65"
                                                                                                    className="img-fluid" />
                                                                                            </div>
                                                                                            <div className="flex-lg-grow-1 ms-3">
                                                                                                <h6 className="mb-0"><a href="#" className="text-reset">{op.productName}</a>
                                                                                                </h6>
                                                                                                {
                                                                                                    op.quantityAndTypeAndPrice.map((qtp: any, k: number) => {
                                                                                                        return (
                                                                                                            <span className="small">{qtp.quantity} {qtp.type}</span>
                                                                                                        )
                                                                                                    })
                                                                                                }
                                                                                            </div>
                                                                                        </div>
                                                                                    </td>
                                                                                    <td>
                                                                                        {
                                                                                            op.quantityAndTypeAndPrice.map((qtp: any, k: number) => {
                                                                                                return (
                                                                                                    <span className="small">Quantity : {qtp.userQuantity}</span>
                                                                                                )
                                                                                            })
                                                                                        }
                                                                                    </td>
                                                                                    <td className="text-end">&#8377;
                                                                                        {
                                                                                            op.quantityAndTypeAndPrice.reduce((stotal: number, qtp: IPropsQTP) => {
                                                                                                return stotal + (qtp.userQuantity as number) * qtp.price
                                                                                            }, 0)
                                                                                        }
                                                                                    </td>

                                                                                </tr>
                                                                            )
                                                                        })
                                                                    }
                                                                </tbody>
                                                                <tfoot>
                                                                    <tr>
                                                                        <td colSpan={2}>Subtotal</td>
                                                                        <td className="text-end">&#8377; {getTotal(orders)}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td colSpan={2}>Shipping</td>
                                                                        <td className="text-end">&#8377; 500</td>
                                                                    </tr>
                                                                    {/* <tr>
                                                                        <td colSpan={2}>Discount (Code: PMGDiwaliOffer)</td>
                                                                        <td className="text-danger text-end">-&#8377; 30.00</td>
                                                                    </tr> */}
                                                                    <tr className="fw-bold">
                                                                        <td colSpan={2}>TOTAL</td>
                                                                        <td className="text-end">&#8377; {getTotal(orders)+500}</td>
                                                                    </tr>
                                                                </tfoot>
                                                            </table>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                            :
                                            <div>Loading...</div>
                                    }

                                    <div className="card mb-4">
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-lg-6">
                                                    <h3 className="h6">Payment Method</h3>
                                                    <p>Visa -1234 </p>
                                                    <p>Total: &#8377; 750.00 <span
                                                        className="badge bg-success rounded-pill">PAID</span>
                                                    </p>
                                                </div>
                                                <div className="col-lg-6">
                                                    <h3 className="h6">Billing address</h3>
                                                    <address>
                                                        <strong>Ajith Kumar</strong><br />
                                                        12-5 Market St, <br />
                                                        Madurai, TN 624103<br />
                                                        <abbr title="Phone">P:</abbr> (123) 456-7890
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
                                                <strong>Ajith Kumar</strong><br />
                                                12-5 Market St, <br />
                                                Madurai, TN 624103<br />
                                                <abbr title="Phone">P:</abbr> (123) 456-7890
                                            </address>
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
        </>
    )
}