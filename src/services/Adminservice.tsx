import axiosInstance from "./axiosInstance"

export const adminRegister = async(data:any) => {    
    return await axiosInstance.post('/admin/register',data)
}

export const adminLogin = async(data:any) => {    
    return await axiosInstance.post('/admin/login',data)
}

export const adminLoginVerify = async() => {    
    return await axiosInstance.get('/admin/dashboard')
}

export const adminAddProduct = async(data:any) => {    
    return await axiosInstance.post('/admin/addproduct',data)
}

export const adminGetProduct = async(id:any) => {    
    return await axiosInstance.get(`/admin/getproducts/${id}`)
}
