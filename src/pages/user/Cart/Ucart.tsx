
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import { userGetCart, userLoginVerify } from "@/services/Userservice";
import { useEffect, useState } from 'react'
import Cookies from "js-cookie";

interface IPropsQTP {
    price: number,
    quantity: string,
    type: string,
    userQuantity?: number
}

interface IPropsProductList {
    _id: string,
    productName: string,
    productDescription: string,
    category: string,
    title: string,
    quantityAndTypeAndPrice: Array<IPropsQTP>,
    minOrder: number,
    image: string
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

interface IPropsUserData {
    _id: string,
    fullName: string,
    email: string
}

interface IPropsTotal {
    pid: string,
    total: number
}

const Ucart = () => {
    const nav = useNavigate()
    const [userData, setUserData] = useState<IPropsUserData>({ _id: "", fullName: "", email: "" })
    const [cartData, setCartDate] = useState<IPropsProductList[]>([])
    const [orderCartData, setOrderCartData] = useState<IPropsProductOrderList[]>([])
    const [orderCartDataSelected, setOrderCartDataSelected] = useState<IPropsProductOrderList[]>([])
    const [isLoading, setLoading] = useState<boolean>(false)
    const [totalPrice, setTotalPrice] = useState<IPropsTotal[]>([])
    const [shippingFee, setShippingFee] = useState<number>(500)

    useEffect(() => {
        (async function () {
            if (Cookies.get("usertoken")) {
                const verify = await userLoginVerify();
                if (verify.data.status === "Failed") {
                    nav("/user/login")
                } else {
                    const { _id } = verify.data.userData
                    try {
                        setLoading(true)
                        const getCart = await userGetCart(_id);
                        if (getCart.data.status === "Success") {
                            var cart = getCart.data.cartData
                            setCartDate(cart)
                            var clonedCartData = JSON.parse(JSON.stringify(cart));
                            clonedCartData?.forEach((ct: any) => {
                                ct.quantityAndTypeAndPrice?.forEach((qt: any) => {
                                    qt.userQuantity = 1
                                })
                            });
                            setOrderCartData(clonedCartData)
                        } else {
                            alert(getCart.data.message)
                        }
                        setLoading(false)
                    } catch (error: any) {
                        alert(error.message)
                    }
                }
            } else {
                nav("/user/login")
            }
        })();
    }, [])

    const addOrRemoveQuantity = (type: string, cart: IPropsProductOrderList, idx: number) => {
        const addOrder = orderCartData.map((cd) => {
            if (cd._id === cart._id) {
                if (type === "+") {
                    (cd.quantityAndTypeAndPrice[idx].userQuantity as number) += 1
                } else {
                    (cd.quantityAndTypeAndPrice[idx].userQuantity as number) -= 1
                }
            }
            return cd
        })
        
        setOrderCartData(addOrder)

        var orderState = addOrder.filter((tp: IPropsProductOrderList) => tp._id === cart._id)[0]
        var total = 0;
        orderState.quantityAndTypeAndPrice.forEach((qtp: IPropsQTP) => {
            if ((qtp.userQuantity as number) > 0) {
                total += qtp.price * (qtp.userQuantity as number);
            }
        })
        var totalState = totalPrice.filter((tp) => tp.pid === cart._id)
        if (totalState.length) {
            var newTotal = totalPrice.map((tp: IPropsTotal) => {
                if (tp.pid === cart._id) {
                    tp.total = total
                }
                return tp;
            })
            setTotalPrice(newTotal)
        }
    }

    const selectProduct = (id: string) => {
        var orderData = orderCartData.map((od) => {
            if (od._id === id) {
                od.isSelect = !od.isSelect
            }
            return od;
        })
        setOrderCartData(orderData)
        var orderState = orderData.filter((od) => (od._id === id))[0]
        var total = 0;
        orderState.quantityAndTypeAndPrice.forEach((qtp: IPropsQTP) => {
            if ((qtp.userQuantity as number) > 0) {
                total += qtp.price * (qtp.userQuantity as number);
            }
        })
        if (orderState.isSelect) {
            setOrderCartDataSelected((prevOrder) => [...prevOrder, orderState])
            setTotalPrice((prevTotal: any) => [...prevTotal, { pid: orderState._id, total }])
        } else {
            setOrderCartDataSelected((prevOrder) => prevOrder.filter(od => od._id !== id))
            setTotalPrice((prevTotal) => prevTotal.filter((pt) => pt.pid !== orderState._id))
        }
    }


    const selectAllItem = () => {
        setTotalPrice(() => [])
        var orderData;
        if (orderCartData.length === orderCartDataSelected.length) {
            orderData = orderCartData.map((od) => {
                od.isSelect = false;
                return od;
            })
            setOrderCartDataSelected(() => [])
        } else {
            orderData = orderCartData.map((od) => {
                od.isSelect = true;
                return od;
            })
            setOrderCartDataSelected(orderData)
            orderData.forEach((ocd: IPropsProductOrderList) => {
                var total = 0;
                ocd.quantityAndTypeAndPrice.forEach((qtp: IPropsQTP) => {
                    if ((qtp.userQuantity as number) > 0) {
                        total += qtp.price * (qtp.userQuantity as number);
                    }
                })
                setTotalPrice((prevTotal: any) => [...prevTotal, { pid: ocd._id, total }])
            })
        }
        setOrderCartData(orderData)
    }

    return (
        <>
            <Helmet>
                <link rel="icon" type="image/svg+xml" href="/vite.svg" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Cart</title>
                <link rel="stylesheet" type="text/css" href="../../src/pages/User/Cart/Cart.css" />
            </Helmet>
            <section id="wrapper">
                <header className="shadow ">
                    <div className="container">
                        <div className="d-flex flex-wrap align-items-center justify-content-between justify-content-lg-between">
                            <div className="col-md-5">
                                <h1 className="cartTitle">
                                    <Link to={"/user/dashboard"}
                                        className="d-flex align-items-center mb-2 mb-lg-0 text-dark text-decoration-none">
                                        <span><i className="fa-solid fa-arrow-left"></i> Shopping Cart</span>
                                        <span> (<span id="cartItem">{cartData.length}</span> Items In Cart)</span>
                                    </Link>
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
                                    <b>{cartData.length}</b>
                                    <i className="fa-solid fa-cart-shopping"></i>
                                    <span>Cart</span>
                                </button>
                                <div className="dropdown show">
                                    <button id="toggleMenu dropdown-toggle" className="transBtn" data-toggle="dropdown" data-bs-toggle="dropdown"
                                        aria-expanded="false">
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

                <section id="plWrap">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-9 col-md-12 col-sm-12">
                                <div className="form-check rememberWrap">
                                    <input className="form-check-input" type="checkbox" checked={orderCartData.length === orderCartDataSelected.length ? true : false} onChange={selectAllItem} id="selectAllitems" />
                                    <label className="form-check-label" htmlFor="selectAllitems">
                                        Select all {cartData.length} items
                                    </label>
                                </div>

                                <div className="row cart-list">
                                    <div className="col-md-12">
                                        {
                                            orderCartData.length > 0 ?
                                                orderCartData.map((cd, i) => {
                                                    return (
                                                        <div key={i} className="cart-item shadow">
                                                            <div className="inputWrap">
                                                                <input type="checkbox" onChange={() => selectProduct(cd._id)} checked={cd?.isSelect ? true : false} id={`cart${i}`} />
                                                                <label htmlFor={`cart${i}`}>&nbsp;</label>
                                                            </div>
                                                            <img src={cd.image.toString()} alt={`Product ${i}`} />
                                                            <div className="cart-detail">
                                                                <span className="title">{cd.productName}</span>
                                                                <div className="count">
                                                                    <ul>
                                                                        {
                                                                            cd.quantityAndTypeAndPrice.map((qtp, j) => {
                                                                                return (
                                                                                    <li key={j}>
                                                                                        <span className="measure">{qtp.quantity} {qtp.type}</span>
                                                                                        <span className="amount">{qtp.price}</span>
                                                                                        <div className="input-group">
                                                                                            <span className="input-group-btn">
                                                                                                <button type="button" onClick={() => addOrRemoveQuantity("-", cd, j)} className="btn btn-default btn-number"
                                                                                                    disabled={qtp.userQuantity === 1} data-type="minus"
                                                                                                    data-field="quant[1]">
                                                                                                    <span className="fa fa-minus"></span>
                                                                                                </button>
                                                                                            </span>
                                                                                            <input type="text" name="quant[1]" className="form-control input-number" disabled value={qtp.userQuantity} />
                                                                                            <span className="input-group-btn">
                                                                                                <button onClick={() => addOrRemoveQuantity("+", cd, j)} type="button" className="btn btn-default btn-number"
                                                                                                    data-type="plus" data-field="quant[1]">
                                                                                                    <span className="fa fa-plus"></span>
                                                                                                </button>
                                                                                            </span>
                                                                                        </div>
                                                                                    </li>
                                                                                )
                                                                            })
                                                                        }
                                                                    </ul>
                                                                </div>
                                                                <span className="price">₹ {(cd.quantityAndTypeAndPrice[0].userQuantity !== undefined ? (cd.quantityAndTypeAndPrice[0].price * cd.quantityAndTypeAndPrice[0].userQuantity).toString() : 0)}</span>
                                                            </div>

                                                        </div>
                                                    )
                                                }) : isLoading ? <div>Loading...</div> : <div>Product not available on cart</div>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-12 col-sm-12">
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
                                                    <span>₹ {totalPrice.reduce((acc: any, tot: any) => { return acc + tot.total }, 0)}</span>
                                                </li>
                                                <li>
                                                    <span>Shipping fee</span>
                                                    <span>₹ {shippingFee}</span>
                                                </li>

                                                <li>
                                                    <span>Cart Total</span>
                                                    <span>₹ {totalPrice.reduce((acc: any, tot: any) => { return acc + tot.total }, 0) + shippingFee}</span>
                                                </li>
                                            </ul>

                                        </div>
                                    </section>
                                    <div className="d-flex justify-content-center">
                                        <a href="#" className="btn btn-primary">Checkout {orderCartDataSelected.length} items
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