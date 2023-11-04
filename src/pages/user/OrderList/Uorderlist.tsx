import { useEffect, useState } from "react"
import { Helmet } from "react-helmet"
import Cookies from "js-cookie"
import { userGetCart, userLoginVerify, userOrderList } from "@/services/Userservice"
import { Link, useNavigate } from "react-router-dom"
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

const Uorderlist = () => {
    const nav = useNavigate()
    const [orderList, setOrderList] = useState<Array<any>>([])
    const [userData, setUserData] = useState<any>()
    const [snackopen, setSnackOpen] = useState<IPropsError>({ open: false, severity: undefined, message: "" })
    const [orderCartData, setOrderCartData] = useState<IPropsProductOrderList[]>([])

    useEffect(() => {
        (async function () {
            if (Cookies.get("usertoken")) {
                try {
                    const verify = await userLoginVerify();
                    if (verify.data.status === "Success") {
                        const { _id, name, email } = verify.data.userData
                        setUserData({ _id, name, email })
                        const resOrderList = await userOrderList(_id)
                        if (resOrderList.data.status === "Success") {
                            setOrderList(resOrderList.data.orderList)
                        } else {
                            setSnackOpen({ open: true, severity: "error", message: resOrderList.data.message })
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

    const getTotal = (orders: any) => {
        return orders.orderedProducts.reduce((total: number, ocd: IPropsProductOrderList) => {
            return total + ocd.quantityAndTypeAndPrice.reduce((stotal: number, qtp: IPropsQTP) => {
                return stotal + (qtp.userQuantity as number) * qtp.price
            }, 0)
        }, 0)
    }

    return (
        <>
            <Helmet>
                <title>Order List</title>
                <link rel="stylesheet" type="text/css" href="../../src/pages/User/OrderList/OrderList.css" />
            </Helmet>
            <section id="wrapper">
                <header className="shadow ">
                    <div className="container">
                        <div className="d-flex flex-wrap align-items-center justify-content-between justify-content-lg-between">
                            <div className="col-md-5">
                                <h1 className="cartTitle">
                                    <Link to="/user/dashboard/cart"
                                        className="d-flex align-items-center mb-2 mb-lg-0 text-dark text-decoration-none">
                                        <span><i className="fa-solid fa-arrow-left"></i> Order #01091993</span>
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
                                <button id="ordersMenu" className="transBtn" >
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

                <section className="myorder-section mt-5 mb-3">
                    <div className="container">
                        <div className="row  justify-content-center">
                            <div className="col-lg-8 col-sm-12">
                                <div className="d-flex justify-content-between align-items-center py-3">
                                    <h2 className="h5 mb-0"><a href="#" className="text-muted"></a> My Orders</h2>
                                </div>
                                <div className="tab-content" id="myTabContent">
                                    <div className="tab-pane  fade  active show" id="orders" role="tabpanel" aria-labelledby="orders-tab">
                                        {
                                            orderList.length ?
                                                orderList.map((order: any, i: number) => {
                                                    return (
                                                        <div className="bg-white card mb-4 order-list shadow-sm">
                                                            <div className="gold-members p-4">
                                                                <div className="media">
                                                                    <div className="media-body">
                                                                        <div>
                                                                            <span className="float-right text-warning mb-2">{order.deliveryStatus} on {order.deliveryStatus === "Ordered" ? convertDate(order.createdAt) : convertDate(order.updatedAt)}</span>
                                                                        </div>
                                                                        <h6 className="mb-2">
                                                                            <div className="text-black text-gray mb-3"><i
                                                                                className="fa fa-truck mr-2" aria-hidden="true"></i>
                                                                                ORDER {order._id}</div>
                                                                        </h6>
                                                                        <p className="mt-3 mb-2">
                                                                            <b>Address:</b>
                                                                        </p>
                                                                        <p className="text-gray mb-1">
                                                                            <i className="icofont-location-arrow"></i>
                                                                            <address>
                                                                                <strong>{order.shippingAddress.fullName}</strong><br />
                                                                                {order.shippingAddress.houseNoOrBuildingName} {order.shippingAddress.areaOrColony}, <br />
                                                                                {order.shippingAddress.city}, {order.shippingAddress.country} {order.shippingAddress.zipOrPostalCode}<br />
                                                                                <abbr title="Phone">P:</abbr> {order.shippingAddress.phoneNumber}
                                                                            </address>
                                                                        </p>

                                                                        <p className="mt-3 mb-2">
                                                                            <b>Products:</b>
                                                                        </p>
                                                                        <p className="text-dark">
                                                                            {
                                                                                order.orderedProducts.map((op:any,i:number)=>{
                                                                                    return op.quantityAndTypeAndPrice.map((qtp:any,j:number)=>{
                                                                                        return (
                                                                                            <div>{op.productName}: {qtp.price} x {qtp.userQuantity} = {
                                                                                                op.quantityAndTypeAndPrice.reduce((stotal: number, qtp: IPropsQTP) => {
                                                                                                    return stotal + (qtp.userQuantity as number) * qtp.price
                                                                                                }, 0)
                                                                                            }</div>
                                                                                        )
                                                                                    })
                                                                                })
                                                                            }                              
                                                                        </p>
                                                                        <hr />
                                                                        <div className="float-right">
                                                                            <Link className="btn btn-sm btn-outline-primary" to="" download><i
                                                                                className="icofont-headphone-alt"></i>
                                                                                Get Invoice</Link>
                                                                            <Link className="btn btn-sm btn-primary" to={`/user/dashboard/order/${order._id}`}><i
                                                                                className="icofont-refresh"></i>
                                                                                View Details</Link>
                                                                        </div>
                                                                        <p className="mb-0 text-black text-primary pt-2"><span
                                                                            className="text-black font-weight-bold">
                                                                            Total Paid:</span> {
                                                                                order.orderedProducts.reduce((total: number, ocd: IPropsProductOrderList) => {
                                                                                    return total + ocd.quantityAndTypeAndPrice.reduce((stotal: number, qtp: IPropsQTP) => {
                                                                                        return stotal + (qtp.userQuantity as number) * qtp.price
                                                                                    }, 0)
                                                                                }, 0)                                                                                
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                                :
                                                <div>Loading...</div>
                                        }
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

function convertDate(dateData: string) {
    var date: any = new Date(dateData);
    const options:any = {
        weekday: 'short',
        month: 'short',  
        day: 'numeric',  
        hour: '2-digit', 
        minute: '2-digit',
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
}

export default Uorderlist;