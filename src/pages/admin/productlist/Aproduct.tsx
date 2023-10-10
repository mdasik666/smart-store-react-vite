import { Alert, Button, Divider, IconButton, FormControl, InputLabel, Select, MenuItem, Modal, Paper, Snackbar, Stack, TextField, Typography, FormHelperText, CircularProgress, AlertColor, Avatar, DialogContentText } from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { useForm } from "react-hook-form";
import { adminAddProduct, adminGetProduct, adminLoginVerify, adminUpdateProductById, adminDeleteProductById } from "../../../services/Adminservice";
import { useNavigate } from "react-router-dom";
import { Delete, Update } from "@mui/icons-material";
import ModalDialog from "../../../components/Admindrawer/Dialog";

interface IPropsError {
  open: boolean,
  severity: AlertColor | undefined,
  message: string
}

interface IPropsProductData {
  productName: string,
  productDescription: string,
  price: number,
  category: string,
  title: string,
  quantity: number
  quantityType: string,
  minOrder: number
}

const Aproduct = () => {
  const productCategory = ["Nuts", "Badam"]
  const quantityTypes = ["KG", "Piece"]

  const nav = useNavigate()

  const { register, handleSubmit, formState: { errors, isValid }, reset, setValue, unregister } = useForm({
    mode: "onChange",

  })

  const [isLoading, setLoading] = useState<boolean>(false)
  const [isButtonLoading, setButtonLoading] = useState<boolean>(false)
  const [isDeleteLoading, setDeleteLoading] = useState<boolean>(false)
  const [snackopen, setSnackOpen] = useState<IPropsError>({ open: false, severity: undefined, message: "" })
  const [modalopen, setModalOpen] = useState(false);
  const [quantityChange, setQuantityChange] = useState<string>("");
  const [changeCategory, setChangeCategory] = useState<string>("");
  const [adminId, setAdminId] = useState<string>("");
  const [productList, setProductList] = useState<any>([]);
  const [productKey, setProductKey] = useState<any>([]);
  const [updateProductId, setUpdateProductId] = useState<string>("");

  const modalHandleOpen = () => {
    setUpdateProductId("")
    setModalOpen(true);
  }

  const modalHandleClose = () => {
    setUpdateProductId("")
    setModalOpen(false)
  }

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

  useEffect(() => {
    (async function () {
      setLoading(true)
      try {
        const verify = await adminLoginVerify();
        if (verify.data.status === "Failed") {
          nav("/admin/login")
        } else {
          setAdminId(verify.data.data._id)
          try {
            const getProduct = await adminGetProduct(verify.data.data._id)
            if (getProduct.data.status === "Failed") {
              setSnackOpen({ open: true, severity: "error", message: getProduct.data.message })
            } else {
              setProductList(getProduct.data.producList)
              const { productName, productDescription, price, category, minOrder, image } = getProduct.data.producList[0]
              setProductKey(Object.keys({ productName, productDescription, price, category, minOrder, image }))
            }
          } catch (error: any) {
            setSnackOpen({ open: false, severity: "info", message: error?.messsage })
          }
        }
      } catch (err: any) {
        setSnackOpen({ open: false, severity: "info", message: err?.messsage })
      }
      setLoading(false)
    })();
  }, [])

  const addOrUpdateProduct = async (data: any) => {
    try {
      setButtonLoading(true)
      var res;
      if (updateProductId.length > 0) {
        if (data.image[0]) {
          data.image = await convertToBase64(data.image[0])
          res = await adminUpdateProductById(updateProductId, data)
        } else {
          delete data.image
          res = await adminUpdateProductById(updateProductId, data)
        }
      } else {
        data.image = await convertToBase64(data.image[0])
        data.adminId = adminId;
        res = await adminAddProduct(data)
      }
      if (res.data.status === "Failed") {
        setSnackOpen({ open: true, severity: "error", message: res.data.message })
      } else {
        setSnackOpen({ open: true, severity: "success", message: res.data.message })
        if (updateProductId.length > 0) {
          setUpdateProductId("")
          setModalOpen(false)
          resetForm()
        } else {
          resetForm()
        }
        try {
          const getProduct = await adminGetProduct(adminId)
          if (getProduct.data.status === "Failed") {
            setSnackOpen({ open: true, severity: "error", message: getProduct.data.message })
          } else {
            setProductList(getProduct.data.producList)
          }
        } catch (error: any) {
          setSnackOpen({ open: false, severity: "info", message: error?.messsage })
        }
      }
      setButtonLoading(false)
    } catch (err: any) {
      setSnackOpen({ open: false, severity: "info", message: err?.messsage })
      setButtonLoading(false)
    }
  }

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const updateProduct = async (id: string) => {
    unregister("image")
    setUpdateProductId(id)
    const productdata = productList.filter((data: any) => id == data._id)
    const updateData: IPropsProductData = productdata[0]
    setValue("productName", updateData.productName)
    setValue("productDescription", updateData.productDescription)
    setValue("price", updateData.price)
    setChangeCategory(updateData.category)
    setValue("category", updateData.category)
    setValue("title", updateData.title)
    setValue("quantity", updateData.quantity)
    setQuantityChange(updateData.quantityType)
    setValue("quantityType", updateData.quantityType)
    setValue("minOrder", updateData.minOrder)
    setModalOpen(true)
  }
  const [openDialog, setOpenDialog] = useState(false);
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const deleteProduct = (id: string) => {
    setUpdateProductId(id)
    handleOpenDialog()
  }

  const resetForm = () => {
    setChangeCategory("")
    setQuantityChange("")
    reset()
  }

  const handleDeleteConfirmAction = async () => {
    try {
      setDeleteLoading(true)
      const res = await adminDeleteProductById(updateProductId)
      if (res.data.status === "Failed") {
        setSnackOpen({ open: true, severity: "error", message: res.data.message })
      } else {
        setSnackOpen({ open: true, severity: "success", message: res.data.message })
        try {
          const getProduct = await adminGetProduct(adminId)
          if (getProduct.data.status === "Failed") {
            setSnackOpen({ open: true, severity: "error", message: getProduct.data.message })
          } else {
            setProductList(getProduct.data.producList)
          }
        } catch (error: any) {
          setSnackOpen({ open: false, severity: "info", message: error?.messsage })
        }
      }
      setDeleteLoading(false)
      handleCloseDialog()
    } catch (err: any) {
      setSnackOpen({ open: false, severity: "info", message: err?.messsage })
      setDeleteLoading(false)
      handleCloseDialog()
    }
  };

  return (
    <>
      <Stack spacing={2}>
        <Stack>
          <Button variant="contained" onClick={modalHandleOpen}>Add Product</Button>
        </Stack>
        <Divider />
        <Stack spacing={2} direction={"column"} justifyContent={"center"} alignItems={"center"} width={"100%"} height={"100%"}>
          {
            isLoading ? <div>Loading...</div> :
              productList.length ?
                (<Paper sx={{ width: '100%', overflow: 'hidden' }}>
                  <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                      <TableHead>
                        <TableRow>
                          {productKey?.map((plKey: any, i: number) => (
                            <TableCell key={i} align={"center"}>{plKey}</TableCell>
                          ))}
                          <TableCell key={productKey.length} align={"center"}>{"Actions"}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {productList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((prodList: any) => {
                          return (
                            <TableRow hover role="checkbox" tabIndex={-1} key={prodList._id}>
                              {productKey?.map((plKey: any, i: number) => {
                                const value = prodList[plKey];
                                return (
                                  String(value)?.startsWith("data:image") ? <TableCell key={i} align={"center"}><Avatar src={value} alt="image" /></TableCell> : <TableCell key={i} align={"center"}>{value}</TableCell>
                                );
                              })}
                              <TableCell key={productKey.length} align={"center"}>
                                <Stack direction={"row"} justifyContent={"center"} alignItems={"center"} width={"100%"}>
                                  <IconButton onClick={() => updateProduct(prodList._id)}>
                                    <Update />
                                  </IconButton>
                                  <IconButton disabled={isDeleteLoading} onClick={() => deleteProduct(prodList._id)}>
                                    <Delete />
                                  </IconButton>
                                </Stack>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 100]}
                    component="div"
                    count={productList.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </Paper>)
                : <div>Product Not Found</div>
          }
        </Stack>
      </Stack>

      <Modal disableEnforceFocus open={modalopen} >
        <Stack position={"absolute"} top={"50%"} left={"50%"} width={{ xs: "90%", sm: "80%", md: "50%" }} sx={{
          transform: 'translate(-50%, -50%)',
        }}>
          <Stack component={Paper} sx={{ position: "relative" }} p={4} direction={"column"} alignItems={"center"} justifyContent={"center"}>
            <IconButton sx={{ position: "absolute", top: 0, right: 0, mr: 0 }} edge="end" color="inherit" onClick={modalHandleClose}>
              <CloseIcon />
            </IconButton>
            <Typography component={Paper} mb={2} gutterBottom variant={"h5"} textAlign={"center"} bgcolor={"#000"} color={"#fff"} width={"100%"}>{updateProductId.length > 0 ? "Update Product" : "Add Product"}</Typography>
            <form onSubmit={handleSubmit(addOrUpdateProduct)}>
              <Stack spacing={2} direction="column" width={"100%"}>
                <Stack spacing={2} direction="row" width={"100%"}>
                  <TextField fullWidth error={Boolean(errors?.productName)} helperText={errors?.productName && errors.productName?.message?.toString() || ""} size="small" {...register("productName", { required: "Product Name is mandatory" })} variant="outlined" type="text" label="Product Name"></TextField>
                  <TextField fullWidth size="small" {...register("productDescription")} variant="outlined" type="text" label="Product Description"></TextField>
                </Stack>
                <Stack spacing={2} direction="row" width={"100%"}>
                  <TextField fullWidth error={Boolean(errors?.price)} helperText={errors?.price && errors.price?.message?.toString() || ""} size="small" {...register("price", { required: "Price is mandatory" })} variant="outlined" type="number" label="Price"></TextField>
                  <FormControl fullWidth size="small" error={Boolean(errors?.category)}>
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
                  {
                    updateProductId.length > 0 ?
                      <TextField fullWidth inputProps={{ accept: ".jpg, .jpeg, .png" }} error={Boolean(errors?.image)} helperText={errors?.image && errors.image?.message?.toString() || ""} size="small" {...register("image", {
                        validate: {
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
                      })} variant="outlined" type="file"></TextField>
                      :
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
                      })} variant="outlined" type="file"></TextField>
                  }
                </Stack>
                <Stack spacing={2} direction="row" width={"100%"}>
                  <Button fullWidth onClick={resetForm} variant="contained" color="error" disabled={updateProductId.length > 0 ? isButtonLoading : !isValid || isButtonLoading} endIcon={isButtonLoading && <CircularProgress color="primary" size={20} thickness={6} sx={{ color: 'white' }} />}>Cancel</Button>
                  <Button fullWidth type="submit" variant="contained" disabled={updateProductId.length > 0 ? isButtonLoading : !isValid || isButtonLoading} endIcon={isButtonLoading && <CircularProgress color="primary" size={20} thickness={6} sx={{ color: 'white' }} />}>Submit</Button>
                </Stack>
              </Stack>
            </form>
          </Stack>
        </Stack>
      </Modal >
      {
        snackopen.open && <Snackbar open={snackopen.open} autoHideDuration={6000} onClose={snackHandleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
          <Alert onClose={snackHandleClose} severity={snackopen.severity} sx={{ width: '100%' }}>
            {snackopen.message}
          </Alert>
        </Snackbar>
      }
      <ModalDialog open={openDialog} onClose={handleCloseDialog} dividers onConfirm={handleDeleteConfirmAction} title="Confirm Action" >
        <DialogContentText>Are you sure you want to delete this action?</DialogContentText>
      </ModalDialog >
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