
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import { userGetCart, userGetCheckOut, userLoginVerify, userPostCheckOut } from "@/services/Userservice";
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

const Ucart = () => {
    const nav = useNavigate()
    const [userData, setUserData] = useState<IPropsUserData>({ _id: "", fullName: "", email: "" })
    const [orderCartData, setOrderCartData] = useState<IPropsProductOrderList[]>([])
    const [orderCartDataSelected, setOrderCartDataSelected] = useState<IPropsProductOrderList[]>([])
    const [isLoading, setLoading] = useState<boolean>(false)
    const [shippingFee, setShippingFee] = useState<number>(500)

    useEffect(() => {
        (async function () {
            if (Cookies.get("usertoken")) {
                const verify = await userLoginVerify();
                if (verify.data.status === "Failed") {
                    nav("/user/login")
                } else {
                    const { _id, fullName, email } = verify.data.userData
                    setUserData({ _id, fullName, email })
                    try {
                        setLoading(true)
                        const getCart = await userGetCart(_id);
                        if (getCart.data.status === "Success") {
                            const getLastCheckout = await userGetCheckOut(_id);
                            var cart = getCart.data.cartData
                            cart?.forEach((ct: any) => {
                                ct.quantityAndTypeAndPrice?.forEach((qt: any) => {
                                    qt.userQuantity = 0
                                })
                            });
                            if (getLastCheckout.data.status === "Success") {
                                var lastCheckout = getLastCheckout.data.lastCheckoutProducts.lastCheckout;
                                if (lastCheckout.length) {
                                    setOrderCartDataSelected(lastCheckout)
                                    cart?.forEach((ct: IPropsProductOrderList) => {
                                        var lcp = lastCheckout.filter((lco: IPropsProductOrderList) => (lco._id === ct._id))[0]
                                        if (lcp) {
                                            ct.quantityAndTypeAndPrice = lcp.quantityAndTypeAndPrice
                                            ct.isSelect = lcp.isSelect
                                        }
                                    })
                                    setOrderCartData(cart)
                                } else {
                                    setOrderCartData(cart)
                                }
                            } else {
                                alert(getCart.data.message)
                            }
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
    }

    const selectProduct = (id: string) => {
        var orderData = orderCartData.map((od) => {
            if (od._id === id) {
                od.isSelect = !od.isSelect
            }
            return od;
        })
        setOrderCartData(orderData)
        var data = orderData.filter((od: IPropsProductOrderList) => od.isSelect)
        setOrderCartDataSelected(data)
    }


    const selectAllItem = () => {
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
        }
        setOrderCartData(orderData)
    }

    const checkOut = async () => {
        var orderDataClone = JSON.parse(JSON.stringify(orderCartDataSelected))
        if (orderDataClone.length) {
            var filterUserQuantity = orderDataClone.map((ocd: IPropsProductOrderList) => {
                ocd.quantityAndTypeAndPrice = ocd.quantityAndTypeAndPrice.filter((qtp) => (qtp.userQuantity as number) > 0);
                return ocd;
            });
            var selectedWithEmptyQuantity = filterUserQuantity.filter((ocd: IPropsProductOrderList) => ocd.quantityAndTypeAndPrice.length === 0);
            if (selectedWithEmptyQuantity.length) {
                alert("Chceck checkout list select items quantity is 0")
            } else {
                var finalOrderListData = filterUserQuantity.filter((ocd: IPropsProductOrderList) => ocd.quantityAndTypeAndPrice.length > 0);
                if (finalOrderListData.length) {
                    try {
                        setLoading(true)
                        const resOrder = await userPostCheckOut(userData._id, {
                            userId: userData._id,
                            checkOutProducts: finalOrderListData,
                            lastCheckout: orderCartDataSelected,
                            totalPrice: getTotalPrice(),
                            shippingFee: shippingFee
                        })
                        if (resOrder.data.status === "Success") {
                            nav('/user/dashboard/checkout')
                        } else {
                            alert(resOrder.data)
                        }
                        setLoading(false)
                    } catch (error: any) {
                        alert(error.message)
                        setLoading(false)
                    }
                } else {
                    alert("Select any one product")
                }
            }
        } else {
            alert("No selected data")
        }
    }

    const getTotalPrice = () => {
        var finalPrice = orderCartData.reduce((total: number, ocd: IPropsProductOrderList) => {
            return total + (ocd.isSelect ? ocd.quantityAndTypeAndPrice.reduce((stotal: number, qtp: IPropsQTP) => {
                return stotal + (qtp.userQuantity as number) * qtp.price
            }, 0) : 0)
        }, 0)
        return finalPrice;
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
                                        <span> (<span id="cartItem">{orderCartData.length}</span> Items In Cart)</span>
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
                                    <b>{orderCartData.length}</b>
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
                                        Select all {orderCartData.length} items
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
                                                                                                    disabled={qtp.userQuantity === 0} data-type="minus"
                                                                                                    data-field={`quant[${j}]`}>
                                                                                                    <span className="fa fa-minus"></span>
                                                                                                </button>
                                                                                            </span>
                                                                                            <input type="text" name={`quant[${j}]`} className="form-control input-number" disabled value={qtp.userQuantity} />
                                                                                            <span className="input-group-btn">
                                                                                                <button onClick={() => addOrRemoveQuantity("+", cd, j)} type="button" className="btn btn-default btn-number"
                                                                                                    data-type="plus" data-field={`quant[${j}]`}>
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
                                                                <span className="price">₹ {
                                                                    cd.quantityAndTypeAndPrice.reduce((acc, qtp) => {
                                                                        return acc + (qtp.price * (qtp.userQuantity as number))
                                                                    }, 0)
                                                                }</span>
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
                                                    <span>₹ {getTotalPrice()}</span>
                                                </li>
                                                <li>
                                                    <span>Shipping fee</span>
                                                    <span>₹ {shippingFee}</span>
                                                </li>

                                                <li>
                                                    <span>Cart Total</span>
                                                    <span>₹ {getTotalPrice() + shippingFee}</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </section>
                                    <div className="d-flex justify-content-center">
                                        <button onClick={checkOut} className="btn btn-primary">Checkout {orderCartDataSelected.length > 0 ? orderCartDataSelected.length : 0} items</button>
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