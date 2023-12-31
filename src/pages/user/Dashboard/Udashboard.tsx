import { ChangeEvent, useEffect, useState } from 'react'
import { userAddOrDeleteCart, userAddOrDeleteWishList, userGetCategoryList, userLoginVerify, userOrderList } from '@/services/Userservice';
import { Link, useNavigate } from 'react-router-dom';
import { userGetProducts } from '@/services/Userservice';
import { Helmet } from "react-helmet";
import Cookies from 'js-cookie';
import { IconButton, Skeleton, Stack } from '@mui/material';
import { ArrowRight, Favorite, FavoriteBorder, ShoppingCart, ShoppingCartOutlined } from '@mui/icons-material';
import SnackbarAlert from '@/custom/components/SnackbarAlert';
import { IPropsError, IPropsProductList, IPropsUserData, IPropsCategory } from "../Interface";
import { AxiosError } from 'axios';

const Udashboard = () => {
  const nav = useNavigate()
  
  const [productList, setProductList] = useState<IPropsProductList[]>([])
  const [productCategory, setProductCategory] = useState<IPropsCategory[]>([])
  const [_error, setError] = useState<string>("")
  const [categoryFilter, setCategoryFilter] = useState<string>("")
  const [categoryFilterByNameTrack, setCategoryFilterByNameTrack] = useState<string>("")
  const [categoryFilterByName, setCategoryFilterByName] = useState<string>("")
  const [userData, setUserData] = useState<IPropsUserData>({ _id: "", fullName: "", email: "", image: "" })
  const [_, setLoading] = useState<boolean>(false)
  const [snackopen, setSnackOpen] = useState<IPropsError>({ open: false, severity: undefined, message: "" })

  const filterByNameChange = (e: string) => {
    if (e.length <= 0) {
      setCategoryFilterByName("")
    } else {
      setCategoryFilterByNameTrack(e)
    }
  }

  const filterByName = () => {
    setCategoryFilterByName(categoryFilterByNameTrack)
  }

  useEffect(() => {
    (async function () {
      if (Cookies.get("usertoken")) {
        try {
          const verify = await userLoginVerify();
          if (verify.data.status === "Failed") {
            nav("/user/login")
          } else {
            const { _id, fullName, email, image } = verify.data.userData
            setUserData({ _id, fullName, email, image })
            getCategoryList()
            getProductList(_id)
            getOrderList(_id)
          }
        } catch (error: unknown) {
          setSnackOpen({ open: true, severity: "warning", message: (error as AxiosError).message })
        }
      } else {
        nav("/user/login")
      }
    })();
  }, [nav])

  const getProductList = async (id: string) => {
    try {
      setLoading(true)
      const res = await userGetProducts(id);
      if (res.data.status === "Success") {
        setError("")
        var finalPL = res.data.producList
        setProductList(finalPL)
      } else {
        setError(res.data.message)
      }
      setLoading(false)
    } catch (error: unknown) {
      setError((error as AxiosError).message)
      setLoading(false)
      setSnackOpen({ open: true, severity: "warning", message: (error as AxiosError).message })
    }
  }

  const [orderList, setOrderList] = useState<Array<any>>([])

  const getOrderList = async (_id: string) => {
    try {
      setLoading(true)
      const resOrderList = await userOrderList(_id)
      if (resOrderList.data.status === "Success") {
        setOrderList(resOrderList.data.orderList)
      } else {
        setSnackOpen({ open: true, severity: "error", message: resOrderList.data.message })
      }
      setLoading(false)
    } catch (error: unknown) {
      setLoading(false)
      setSnackOpen({ open: true, severity: "warning", message: (error as AxiosError).message })
    }

  }

  const getCategoryList = async () => {
    try {
      const prodCat = await userGetCategoryList();
      if (prodCat.data.status === "Success") {
        setProductCategory(prodCat.data.category)
      }
    } catch (error: unknown) {
      setSnackOpen({ open: true, severity: "warning", message: (error as AxiosError).message })
    }
  }

  const addCartAndWishList = async (id: string, type: string) => {
    try {
      var res;
      setLoading(true)
      if (type === "wishlist") {
        res = await userAddOrDeleteWishList(userData._id, id)
      } else {
        res = await userAddOrDeleteCart(userData._id, id)
      }
      if (res.data.status === "Success") {
        setProductList(res.data.productList)
      } else {
        setSnackOpen({ open: true, severity: "error", message: res.data.message })

      }
      setLoading(false)
    } catch (error: unknown) {
      setLoading(false)
      setSnackOpen({ open: true, severity: "warning", message: (error as AxiosError).message })
    }
  }

  const userSignOut = () => {
    Cookies.remove("usertoken")
    nav("/")
  }

  return (
    <>
      <Helmet>
        <title>Dashboard</title>
        <link rel="stylesheet" type="text/css" href="../../src/pages/User/Dashboard/Dashboard.css" />
      </Helmet>
      <section id="wrapper">
        <header className="mb-3 ">
          <div className="container">
            <div className="d-flex flex-wrap align-items-center justify-content-between justify-content-lg-between">
              <h1>
                <a href="/" className="d-flex align-items-center mb-2 mb-lg-0 text-dark text-decoration-none">
                  <span className="logo_ic"></span>
                  <span className="logo_txt">SMART STORE</span>
                </a>
              </h1>

              <div className="dropdown text-end">
                <a href="#" className="d-block link-dark text-decoration-none dropdown-toggle" id="profileDrop"
                  data-bs-toggle="dropdown" aria-expanded="false">
                  <span className="textWrap">
                    <span>Welcome</span>
                    <span className="username">{userData.fullName}</span>
                  </span>

                  <img src={userData?.image?.toString()} alt="mdo" width="32" height="32"
                    className="rounded-circle" />
                </a>
                <ul className="dropdown-menu text-small" id="profDrop" aria-labelledby="profileDrop">
                  <li><Link to={"/user/dashboard/cart"} className="dropdown-item">Checkout</Link></li>
                  <li><Link to={"/user/dashboard/profile"} className="dropdown-item">Profile</Link></li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li><a style={{ cursor: "pointer" }} className="dropdown-item text-center" onClick={userSignOut}>Sign out</a></li>
                </ul>
              </div>
            </div>

            <div className="mobiBar">
              <button className="btn btn-primary">
                <i className="fa-regular fa-compass"></i> Explore
              </button>
              <button onClick={() => nav("/user/dashboard/cart")} id="cartAdd" className="transBtn">
                <i className="fa-solid fa-cart-shopping"></i>
              </button>
              <button onClick={() => nav("/user/dashboard/profile")} id="userProf" className="transBtn">
                <i className="fa-regular fa-user"></i>
              </button>

              <div className="dropdown show">
                <button id="toggleMenu dropdown-toggle" className="transBtn" data-toggle="dropdown" data-bs-toggle="dropdown" aria-expanded="false">
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
        </header>

        <section id="searchWrap">
          <div className="row justify-content-md-center">
            <div className="col-lg-8 col-md-9">
              <div role="search">
                <div className="input-group">
                  <div className="input-group-btn dropdown">
                    <button type="button" className="btn btn-default" id="catDrop" data-bs-toggle="dropdown" aria-expanded="false">
                      <span id="srch-category">Category</span> <i className="fa fa-angle-down"></i>
                    </button>
                    <ul className="dropdown-menu" role="menu" aria-labelledby="catDrop" id="mnu-category">
                      <li className={'p-2 ' + (categoryFilter.length === 0 && 'bg-dark text-light')} onClick={() => setCategoryFilter("")}>{"All"}</li>
                      {
                        productCategory.length > 0 ?
                          productCategory.map((cat, i: number) => {
                            return (
                              <li key={i} className={'p-2 ' + (categoryFilter === cat?.categoryName && 'bg-dark text-light')} onClick={() => setCategoryFilter(cat?.categoryName)}>{cat?.categoryName}</li>
                            )
                          }) : <li>Loading...</li>
                      }
                    </ul>
                  </div>
                  <input type="hidden" id="txt-category" />
                  <input type="text" id="txt-search" className="form-control" onChange={(e: ChangeEvent<HTMLInputElement>) => filterByNameChange(e.target.value)} />
                  <span className="input-group-btn">
                    <button id="btn-search" type="submit" className="btn btn-primary" onClick={filterByName}>
                      <i className="fa fa-search"></i>
                      Search
                    </button>
                  </span>
                </div>
              </div>

              <div className="freqWrap">
                <p>Frequently Searched for:</p>

                <ul>
                  <li>Packed Items</li>
                  <li>Spices</li>
                  <li>Candy</li>
                  <li>Dry Fruits</li>
                </ul>
              </div>

            </div>
          </div>
        </section>

        <section id="productWrap">
          <div className="container">
            <section id="orderWrap">
              <div className="row">
                <div className="col-lg-7 col-md-7">
                  <div className="ur-order">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h2>Your Orders</h2>
                      <button className="btn btn-primary" onClick={() => nav('/user/dashboard/orders')}>View All</button>
                    </div>
                    <ul>
                      {
                        orderList.length ?
                          orderList[orderList.length - 1].orderedProducts.map((op: IPropsProductList, j: number) => {
                            return (
                              <li key={j}>
                                <div className="orders">
                                  <span className="date">{convertDate(orderList[orderList.length - 1].createdAt)}</span>
                                  <span className="brand">{op.title}</span>
                                  <span className="product">{op.productName}</span>
                                  <span className="tracking">Arriving on {orderList[orderList.length - 1].deliveryDate ? convertDate(orderList[orderList.length - 1].deliveryDate) : "Soon"}</span>
                                  <p className="text-right">
                                    <a href="#">
                                      <i className="fa-solid fa-arrow-up"></i>
                                    </a>
                                  </p>
                                </div>
                              </li>
                            )
                          })
                          :
                          Array(2).fill(0).map((_, i: number) => {
                            return (
                              <li key={i}>
                                <Stack className="orders" spacing={1}>
                                  <span className="date"><Skeleton animation="wave" variant="rounded" /></span>
                                  <span className="brand"><Skeleton animation="wave" variant="rounded" /></span>
                                  <span className="product"><Skeleton animation="wave" variant="rounded" /></span>
                                  <span className="tracking"><Skeleton animation="wave" variant="rounded" /></span>
                                  <p className="text-right">
                                    <IconButton>
                                      <Skeleton variant="circular" animation="wave" width={40} height={40}>
                                        <ArrowRight />
                                      </Skeleton>
                                    </IconButton>
                                  </p>
                                </Stack>
                              </li>
                            )
                          })
                      }
                    </ul>
                  </div>
                </div>
                <div className="col-lg-5 col-md-5">
                  <div className="colOrdersec">
                    &nbsp;
                  </div>
                </div>
              </div>
            </section>

            <section id="tabsWrap" className="">
              <ul className="nav nav-tabs d-xl-none d-md-none" id="prodTabs" role="tablist">
                <li className="nav-item" role="presentation">
                  <button className="nav-link active" id="trends-tab" data-bs-toggle="tab"
                    data-bs-target="#trends" type="button" role="tab" aria-controls="trends"
                    aria-selected="true">Trendings</button>
                </li>
                <li className="nav-item" role="presentation">
                  <button className="nav-link" id="avail-tab" data-bs-toggle="tab" data-bs-target="#avail"
                    type="button" role="tab" aria-controls="avail" aria-selected="false">Available</button>
                </li>
                <li className="nav-item" role="presentation">
                  <button className="nav-link" id="recom-tab" data-bs-toggle="tab" data-bs-target="#recom"
                    type="button" role="tab" aria-controls="recom" aria-selected="false">We
                    recommend</button>
                </li>
              </ul>
              <div className="tab-content" id="prodTabcontent">
                <div className="tab-pane fade show active" id="trends" role="tabpanel" aria-labelledby="trends-tab">
                  <div className="tabHeader">
                    <h2>NEW ARRIVALS</h2>
                    <Link to={"/user/dashboard/products"} className="btn btn-primary">View All</Link>
                  </div>
                  <div className="tabContent">
                    <ul className="prodList">
                      {
                        productList.length > 0 ?
                          productList.slice(0, 11).map((prod, i) => {
                            return (
                              <li key={i}>
                                <div className="product shadow">
                                  <div className="actionBtn">
                                    <IconButton className="btn" onClick={() => addCartAndWishList(prod._id, "wishlist")}>
                                      {
                                        prod.isWishlist ? <Favorite sx={{ color: '#ff666d' }} /> : <FavoriteBorder sx={{ color: '#ff666d' }} />
                                      }
                                    </IconButton>
                                    <IconButton className="btn" onClick={() => addCartAndWishList(prod._id, "cart")}>
                                      {
                                        prod.isCart ? <ShoppingCart sx={{ color: '#ff666d' }} /> : <ShoppingCartOutlined sx={{ color: '#ff666d' }} />
                                      }
                                    </IconButton>
                                  </div>
                                  <img src={prod.image?.toString()} alt={`Product ${i}`} />
                                  <span className="title">{prod.productName}</span>
                                  <span className="measure">{prod.productDescription}</span>
                                  <span className="price">₹ {prod.quantityAndTypeAndPrice[0].price.toString()}</span>
                                  <span className="stock">Min. Order: {prod.minOrder?.toString()} pieces</span>
                                </div>
                              </li>
                            )
                          })
                          :
                          Array(5).fill(0).map((_, i: number) => {
                            return (
                              <li key={i}>
                                <Stack className="product shadow" spacing={2}>
                                  <div className="actionBtn">
                                    <button className="btn" >
                                      <IconButton>
                                        <Skeleton variant="circular" animation="wave" width={40} height={40}>
                                          <Favorite />
                                        </Skeleton>
                                      </IconButton>
                                    </button>
                                    <button className="btn" >
                                      <IconButton>
                                        <Skeleton variant="circular" animation="wave" width={40} height={40}>
                                          <ShoppingCart />
                                        </Skeleton>
                                      </IconButton>
                                    </button>
                                  </div>
                                  <span className="image"><Skeleton animation="wave" variant="rounded" height={60} /></span>
                                  <span className="title"><Skeleton animation="wave" variant="rounded" /></span>
                                  <span className="measure"><Skeleton animation="wave" variant="rounded" /></span>
                                  <span className="price"><Skeleton animation="wave" variant="rounded" /></span>
                                  <span className="stock"><Skeleton animation="wave" variant="rounded" /></span>
                                </Stack>
                              </li>
                            )
                          })
                      }
                    </ul>
                  </div>
                </div>
                <div className="tab-pane fade" id="avail" role="tabpanel" aria-labelledby="avail-tab">
                  <div className="tabHeader">
                    <h2>RECOMMENDED FOR YOU</h2>
                  </div>
                  <div className="tabContent">
                    <ul className="catList">
                      <li>
                        <div className="category theme-1 shadow-sm">
                          <span className="cTitle">Spices</span>
                          <span className="prodName">Cinnamon</span>
                          <img src="../../src/assets/images/cat1.png" alt="Category 1" />
                        </div>
                      </li>
                      <li>
                        <div className="category theme-2 shadow-sm">
                          <span className="cTitle">Packed Items</span>
                          <span className="prodName">Spam 7 oz</span>
                          <img src="../../src/assets/images/cat2.png" alt="Category 2" />
                        </div>
                      </li>
                      <li>
                        <div className="category theme-3 shadow-sm">
                          <span className="cTitle">Dry Fruits</span>
                          <span className="prodName">Almonds</span>
                          <img src="../../src/assets/images/cat3.png" alt="Category 3" />
                        </div>
                      </li>
                      <li>
                        <div className="category theme-4 shadow-sm">
                          <span className="cTitle">Candy</span>
                          <span className="prodName">Simpkins</span>
                          <img src="../../src/assets/images/cat4.png" alt="Category 4" />
                        </div>
                      </li>
                      <li>
                        <div className="category theme-5 shadow-sm">
                          <span className="cTitle">Herbs</span>
                          <span className="prodName">Keya</span>
                          <img src="../../src/assets/images/cat5.png" alt="Category 5" />
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="tab-pane fade" id="recom" role="tabpanel" aria-labelledby="recom-tab">

                  <div className="tabHeader">
                    <h2>FEATURED PRODUCTS</h2>
                    <Link to={"/user/dashboard/products"} className="btn btn-primary">View All</Link>
                  </div>
                  <div className="tabContent">
                    <ul className="prodList">
                      {
                        productList.length > 0 ?
                          productList.slice(0, (categoryFilter.length || categoryFilterByName.length ? productList.length : 11))
                            .filter(pc => (pc.category.indexOf(categoryFilter) > -1))
                            .filter(pc => (pc.productName.indexOf(categoryFilterByName) > -1))
                            .map((prod, i) => {
                              return (<li key={i}>
                                <div className="product shadow">
                                  <div className="actionBtn">
                                    <button className="btn" onClick={() => addCartAndWishList(prod._id, "wishlist")}>
                                      {
                                        prod.isWishlist ? <IconButton><Favorite sx={{ color: '#ff666d' }} /></IconButton> : <IconButton><FavoriteBorder sx={{ color: '#ff666d' }} /></IconButton>
                                      }
                                    </button>
                                    <button className="btn" onClick={() => addCartAndWishList(prod._id, "cart")}>
                                      {
                                        prod.isCart ? <IconButton><ShoppingCart sx={{ color: '#ff666d' }} /></IconButton> : <IconButton><ShoppingCartOutlined sx={{ color: '#ff666d' }} /></IconButton>
                                      }
                                    </button>
                                  </div>
                                  <img src={prod.image?.toString()} alt={`Product ${i}`} />
                                  <span className="title">{prod.productName}</span>
                                  <span className="measure">{prod.productDescription}</span>
                                  <span className="price">₹ {prod.quantityAndTypeAndPrice[0].price.toString()}</span>
                                  <span className="stock">Min. Order: {prod.minOrder?.toString()} pieces</span>
                                </div>
                              </li>)
                            })
                          :
                          Array(5).fill(0).map((_, i: number) => {
                            return (
                              <li key={i}>
                                <Stack className="product shadow" spacing={2}>
                                  <div className="actionBtn">
                                    <button className="btn" >
                                      <IconButton>
                                        <Skeleton variant="circular" animation="wave" width={40} height={40}>
                                          <Favorite />
                                        </Skeleton>
                                      </IconButton>
                                    </button>
                                    <button className="btn" >
                                      <IconButton>
                                        <Skeleton variant="circular" animation="wave" width={40} height={40}>
                                          <ShoppingCart />
                                        </Skeleton>
                                      </IconButton>
                                    </button>
                                  </div>
                                  <span className="image"><Skeleton animation="wave" variant="rounded" height={60} /></span>
                                  <span className="title"><Skeleton animation="wave" variant="rounded" /></span>
                                  <span className="measure"><Skeleton animation="wave" variant="rounded" /></span>
                                  <span className="price"><Skeleton animation="wave" variant="rounded" /></span>
                                  <span className="stock"><Skeleton animation="wave" variant="rounded" /></span>
                                </Stack>
                              </li>
                            )
                          })
                      }
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </section>

        <section id="brandWrap">
          <div className="container">
            <h2>BRANDS WE DEAL</h2>

            <ul>
              <li><a href="#"><img src="../../src/assets/images/br-1.png" alt="Amara" /></a></li>
              <li><a href="#"><img src="../../src/assets/images/br-2.png" alt="Fossa" /></a></li>
              <li><a href="#"><img src="../../src/assets/images/br-3.png" alt="Kyan" /></a></li>
              <li><a href="#"><img src="../../src/assets/images/br-4.png" alt="Atica" /></a></li>
            </ul>
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

const convertDate = (date: string) => {
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(date))
}

export default Udashboard;