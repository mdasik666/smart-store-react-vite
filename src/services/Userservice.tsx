import axiosInstance from "./axiosInstance"

export const userRegister = async(data:any) => {    
    return await axiosInstance.post('/user/register',data)
}

export const userLogin = async(data:any) => {    
    return await axiosInstance.post('/user/login',data)
}

export const userLoginVerify = async() => {    
    return await axiosInstance.get('/user/dashboard')
}

export const userGetProducts = async() => {    
    return await axiosInstance.get('/user/getproducts')
}

