import axiosInstance from "./axiosInstance"

export const userRegister = async (data: any) => {
    return await axiosInstance.post('/user/register', data)
}

export const userLogin = async (data: any) => {
    return await axiosInstance.post('/user/login', data)
}

export const userLoginVerify = async () => {
    return await axiosInstance.get('/user/dashboard')
}

export const userGetProducts = async (userId: string) => {
    return await axiosInstance.get(`/user/getproducts/${userId}`)
}

export const userOTPVerify = async (email: string) => {
    return await axiosInstance.get(`/user/verifyotp/${email}`)
}

export const userGetCategoryList = async () => {
    return await axiosInstance.get(`/user/productcategory`)
}

export const userAddOrDeleteWishList = async (userId: string, prodId: string) => {
    return await axiosInstance.get(`/user/addordeletewishlist/${userId}/${prodId}`)
}

export const userAddOrDeleteCart = async (userId: string, prodId: string) => {
    return await axiosInstance.get(`/user/addordeletecart/${userId}/${prodId}`)
}

export const userGetWishList = async (userId: string) => {
    return await axiosInstance.get(`/user/getwishlist/${userId}`)
}

export const userGetCart = async (userId: string) => {
    return await axiosInstance.get(`/user/getcart/${userId}`)
}

export const userProfileupdate = async (userId: string, data: any) => {
    return await axiosInstance.put(`/user/profileupdate/${userId}`, data)
}

export const userPostCheckOut = async (userId: string, data: any) => {
    return await axiosInstance.post(`/user/checkout/${userId}`, data)
}

export const userGetCheckOut = async (userId: string) => {
    return await axiosInstance.get(`/user/checkout/${userId}`)
}

export const userGetCountryList = async () => {
    return await axiosInstance.get(`https://restcountries.com/v3.1/all`)
}

export const userGetShippingAddress = async (userId: string) => {
    return await axiosInstance.get(`/user/shipping/${userId}`)
}

export const userPostShippingAddress = async (userId: string, data:any) => {
    return await axiosInstance.post(`/user/shipping/${userId}`,data)
}

