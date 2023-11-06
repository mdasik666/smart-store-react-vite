import { AlertColor } from "@mui/material"

export interface IPropsCategory {
    categoryName: string
}

export interface IPropsShippingAddressDetails {
    _id: string,
    fullName: string,
    phoneNumber: number,
    houseNoOrBuildingName: string,
    areaOrColony: string,
    country: string,
    city: string,
    zipOrPostalCode: number
}

export interface IPropsCheckout {
    _id:string,
    userId:string,
    checkOutProducts:Array<IPropsProductList>,
    lastCheckout:Array<IPropsProductList>,
    shippingFee:number,
    totalPrice:number
}

export interface IPropsShippingAddress {
    _id: string,
    userId: string,
    shippingAddress: Array<IPropsShippingAddressDetails>
}

export interface IPropsQTP {
    price: number,
    quantity: string,
    type: string,
    userQuantity?: number
}

export interface IPropsProductList {
    _id: string,
    productName: string,
    productDescription: string,
    category: string,
    title: string,
    quantityAndTypeAndPrice: Array<IPropsQTP>,
    minOrder: number,
    image: string,
    adminId?: string,
    isWishlist?: boolean,
    isCart?: boolean,
    isSelect?: boolean
}

export interface IPropsUserData {
    _id: string,
    fullName: string,
    email: string,
    phoneNumber?: string,
    image?: string
}

export interface IPropsError {
    open: boolean,
    severity: AlertColor | undefined,
    message: string
}

export interface IPropsOrders {
  _id:string,
  userId: string,
  orderedProducts: Array<IPropsProductList>,
  razorpay_payment_id: string,
  razorpay_order_id: string,
  razorpay_signature: string,
  paymentType: string,
  shippingAddress: IPropsShippingAddressDetails,
  paid: string,
  deliveryStatus: string,
  deliveryDate: string,
  createdAt:string,
  updatedAt:string
}