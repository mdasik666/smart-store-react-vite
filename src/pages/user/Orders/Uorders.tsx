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
                <title>Orders</title>
                <link rel="stylesheet" type="text/css" href="../../src/pages/User/Orders/Orders.css" />
            </Helmet>
            <center>
              <div>Coming Soon</div>
            </center>
            <SnackbarAlert snackopen={snackopen} setSnackOpen={setSnackOpen} />
        </>
    )
}