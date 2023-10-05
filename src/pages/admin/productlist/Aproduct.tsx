import { Alert, Button, Divider, IconButton, FormControl, InputLabel, Select, MenuItem, Modal, Paper, Snackbar, Stack, TextField, Typography, FormHelperText, CircularProgress, AlertColor, Avatar } from "@mui/material";
import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { useForm } from "react-hook-form";
import { adminAddProduct, adminGetProduct } from "../../../services/Adminservice";
import { adminLoginVerify } from "../../../services/Adminservice";
import { useNavigate } from "react-router-dom";

interface IPropsError {
    open: boolean,
    severity: AlertColor | undefined,
    message: string
}


const Aproduct = () => {   
    const productCategory = ["Nuts", "Badam"]
    const quantityTypes = ["KG", "Piece"]

    const nav = useNavigate()

    const { register, handleSubmit, formState: { errors, isValid }, reset } = useForm({
        mode: "onChange"
    })

    const [isLoading, setLoading] = useState<boolean>(false)
    const [snackopen, setSnackOpen] = useState<IPropsError>({ open: false, severity: undefined, message: "" })
    const [modalopen, setModalOpen] = useState(false);
    const [quantityChange, setQuantityChange] = useState<string>("");
    const [changeCategory, setChangeCategory] = useState<string>("");
    const [adminId, setAdminId] = useState<string>("");
    const [productList, setProductList] = useState<any>([]);

    const modalHandleOpen = () => setModalOpen(true);

    const modalHandleClose = () => setModalOpen(false);

    const snackHandleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackOpen({ open: false, severity: undefined, message: "" });
    };

    const handleQuantityChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setQuantityChange(event.target.value);
    };

    const handleCategoryChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setChangeCategory(event.target.value)
    }

    useEffect(()=>{
        (async function(){
            try {
                setLoading(true)
                const verify = await adminLoginVerify();                                        
                if(verify.data.status === "Failed"){
                    nav("/admin/login")
                }else{
                    setAdminId(verify.data.data._id)
                    try {               
                        const getProduct = await adminGetProduct(verify.data.data._id)                                                                
                        if(getProduct.data.status === "Failed"){
                            setSnackOpen({ open: true, severity: "error", message: getProduct.data.message })
                        } else {
                            setLoading(false)
                            setProductList(getProduct.data.producList)
                        }
                    } catch (error:any) {
                        setSnackOpen({ open: false, severity: "info", message: error?.messsage })
                        setLoading(false)                    
                    }
                }                
            } catch (err:any) {
                setSnackOpen({ open: false, severity: "info", message: err?.messsage })
                setLoading(false)
            }
        })();  
    },[])

    const addProduct = async (data: any) => {
        try {
            data.image = await convertToBase64(data.image[0])
            data.adminId = adminId;            
            setLoading(true)
            const res = await adminAddProduct(data)            
            if (res.data.status === "Failed") {
                setSnackOpen({ open: true, severity: "error", message: res.data.message })
            } else {
                setSnackOpen({ open: true, severity: "success", message: res.data.message })
                setQuantityChange("")
                setChangeCategory("")
                reset()
                try {               
                    const getProduct = await adminGetProduct(adminId)                                                                
                    if(getProduct.data.status === "Failed"){
                        setSnackOpen({ open: true, severity: "error", message: getProduct.data.message })
                    } else {
                        setLoading(false)
                        setProductList(getProduct.data.producList)
                    }
                } catch (error:any) {
                    setSnackOpen({ open: false, severity: "info", message: error?.messsage })
                    setLoading(false)                    
                }          
            }
        } catch (err:any) {
            setSnackOpen({ open: false, severity: "info", message: err?.messsage })
            setLoading(false)
        }
    }    

    return (
        <>
            <Stack spacing={2}>
                <Stack>
                    <Button variant="contained" onClick={modalHandleOpen}>Add Product</Button>
                </Stack>
                <Divider />
                <Stack spacing={2} direction={"column"} justifyContent={"center"} alignItems={"center"} width={"100%"} height={"100%"}>
                    {   
                        isLoading ? <div>Loading...</div>:                        
                        productList.length ? productList?.map((product:any,i:number)=>{
                            return (<Paper elevation={4} sx={{width:"100%"}}>
                                <Stack direction={"row"} spacing={2} alignItems={"center"} justifyContent={"space-around"}>
                                    <Avatar alt="avatar" src={product.image}/>                                
                                    <Typography>{product.productName}</Typography>
                                </Stack>
                            </Paper>)
                        }):<div>not found</div>
                    }
                </Stack>
            </Stack>

            <Modal sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', }} open={modalopen} onClose={modalHandleClose}>
                <Stack component={Paper} sx={{ position: "relative" }} p={4} direction={"column"} alignItems={"center"} justifyContent={"center"}>
                    <IconButton sx={{ position: "absolute", top: 0, right: 0, mr: 0 }} edge="end" color="inherit" onClick={modalHandleClose}>
                        <CloseIcon />
                    </IconButton>
                    <Typography component={Paper} mb={2} gutterBottom variant={"h5"} textAlign={"center"} bgcolor={"#000"} color={"#fff"} width={"100%"}>Add Product</Typography>
                    <form onSubmit={handleSubmit(addProduct)}>
                        <Stack spacing={2} direction="column" width={"100%"}>
                            <Stack spacing={2} direction="row" width={"100%"}>
                                <TextField fullWidth error={Boolean(errors?.productName)} helperText={errors?.productName && errors.productName?.message?.toString() || ""} size="small" {...register("productName", { required: "Product Name is mandatory" })} variant="outlined" type="text" label="Product Name" required></TextField>
                                <TextField fullWidth size="small" {...register("productDescription")} variant="outlined" type="text" label="Product Description"></TextField>
                            </Stack>
                            <Stack spacing={2} direction="row" width={"100%"}>
                                <TextField fullWidth error={Boolean(errors?.price)} helperText={errors?.price && errors.price?.message?.toString() || ""} size="small" {...register("price", { required: "Price is mandatory" })} variant="outlined" type="number" label="Price" required></TextField>
                                <FormControl fullWidth size="small" error={Boolean(errors?.category)} required>
                                    <InputLabel id="category">Category</InputLabel>
                                    <Select labelId="category" {...register("category", { required: "Category is mandatory" })} onChange={handleCategoryChange} value={changeCategory} label="Category">
                                        {
                                            productCategory.map((cat, i) => {
                                                return (<MenuItem value={cat} key={i}>{cat}</MenuItem>)
                                            })
                                        }
                                    </Select>
                                    <FormHelperText>
                                        {errors?.category && errors.category?.message?.toString() || ""}
                                    </FormHelperText>
                                </FormControl>
                            </Stack>
                            <Stack spacing={2} direction="row" width={"100%"}>
                                <TextField fullWidth size="small" {...register("title")} variant="outlined" type="text" label="Title"></TextField>
                                <Stack width={"100%"} direction="row" spacing={1}>
                                    <TextField fullWidth size="small" {...register("quantity")} variant="outlined" type="number" label="Quantity"></TextField>
                                    <FormControl fullWidth size="small">
                                        <InputLabel id="qtype">Type</InputLabel>
                                        <Select labelId="qtype" {...register("quantityType")} onChange={handleQuantityChange} value={quantityChange} label="Type">
                                            {
                                                quantityTypes.map((qtype, i) => {
                                                    return (<MenuItem value={qtype} key={i}>{qtype}</MenuItem>)
                                                })
                                            }
                                        </Select>
                                    </FormControl>
                                </Stack>
                            </Stack>
                            <Stack spacing={2} direction="row" width={"100%"}>
                                <TextField fullWidth size="small" {...register("minOrder")} variant="outlined" type="number" label="Minimum Order"></TextField>
                                <TextField fullWidth inputProps={{ accept: ".jpg, .jpeg, .png" }} error={Boolean(errors?.image)} helperText={errors?.image && errors.image?.message?.toString() || ""} size="small" {...register("image", {
                                    required: "Image is mandatory", validate: {
                                        isImage: (file) => {
                                            if (file.length === 0) return true;
                                            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
                                            if (allowedTypes.includes(file[0].type)) {
                                                return true;
                                            } else {
                                                return 'Please upload a PNG or JPG image';
                                            }
                                        },
                                    },
                                })} variant="outlined" type="file" required></TextField>
                            </Stack>
                            <Button type="submit" variant="contained" disabled={!isValid || isLoading} endIcon={isLoading && <CircularProgress color="primary" size={20} thickness={6} sx={{ color: 'white' }} />}>Submit</Button>
                        </Stack>
                    </form>
                </Stack>
            </Modal>
            {snackopen.open && <Snackbar open={snackopen.open} autoHideDuration={6000} onClose={snackHandleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert onClose={snackHandleClose} severity={snackopen.severity} sx={{ width: '100%' }}>
                    {snackopen.message}
                </Alert>
            </Snackbar>}
        </>
    )
}

const convertToBase64 = (file: any) => {
    return new Promise((res, rej) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            res(fileReader.result)
        }
        fileReader.onerror = (err) => {
            rej(err)
        }
    })
}

export default Aproduct;