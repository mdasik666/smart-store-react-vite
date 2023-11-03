import { useEffect, useState, ChangeEvent } from 'react'
import { userAddOrDeleteCart, userAddOrDeleteWishList, userGetCart, userGetCategoryList, userLoginVerify } from '@/services/Userservice';
import { useNavigate } from 'react-router-dom';
import { userGetProducts } from '@/services/Userservice';
import { Helmet } from "react-helmet";
import Cookies from 'js-cookie';
import { AlertColor, IconButton, Skeleton, Stack } from '@mui/material';
import { Favorite, FavoriteBorder, ShoppingCart, ShoppingCartOutlined } from '@mui/icons-material';
import SnackbarAlert from '@/custom/components/SnackbarAlert';

interface IPropsProductList {
  _id: string,
  productName: string,
  productDescription: string,
  category: string,
  title: string,
  quantityAndTypeAndPrice: Array<{ price: number, quantity: string, type: string }>,
  minOrder: number,
  image: string,
  adminId: string,
  isWishlist?: boolean,
  isCart?: boolean
}

interface IPropsUserData {
  _id: string,
  fullName: string,
  email: string
}

interface IPropsError {
  open: boolean,
  severity: AlertColor | undefined,
  message: string
}

const Uproductlist = () => {
  const nav = useNavigate()

  const [productList, setProductList] = useState<IPropsProductList[]>([])
  const [productCategory, setProductCategory] = useState<{ categoryName: string }[]>([])
  const [isLoading, setLoading] = useState<boolean>(false)
  const [_isError, setError] = useState<string>("")
  const [categoryFilter, setCategoryFilter] = useState<string>("")
  const [categoryFilterByNameTrack, setCategoryFilterByNameTrack] = useState<string>("")
  const [categoryFilterByName, setCategoryFilterByName] = useState<string>("")
  const [categoryFilterByMultipleItem, setCategoryFilterByMultipleItem] = useState<Array<string>>([])
  const [minPrice, setMinPrice] = useState<string>("0")
  const [maxPrice, setMaxPrice] = useState<string>("1000")
  const [changeMinMax, setChangeMinMax] = useState<string>("")
  const [cartDate, setCartDate] = useState<IPropsProductList[]>([])
  const [userData, setUserData] = useState<IPropsUserData>({ _id: "", fullName: "", email: "" })
  const [snackopen, setSnackOpen] = useState<IPropsError>({ open: false, severity: undefined, message: "" })

  const [currentPage, setCurrentPage] = useState<number>(1)
  const itemsPerPage = 10
  const totalPages = Math.ceil(productList.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(p => p + 1)
    }
  }

  const prevPage = () => {
    if (currentPage !== 1) {
      setCurrentPage(p => p - 1)
    }
  }

  const firstNextPage = () => {
    setCurrentPage(1)
  }

  const lastNextPage = () => {
    setCurrentPage(totalPages)
  }

  const getCategoryFilter = (e: string) => {
    setCategoryFilter(e)
    setCategoryFilterByMultipleItem(() => [])
  }

  const getFilterbyMultipleItem = (e: string) => {
    if (e.length === 0) {
      setCategoryFilterByMultipleItem(() => [])
    } else {
      setFilterbyMultipleItem(e)
    }
  }

  const filterByNameChange = (e: string) => {
    console.log(e.length)
    if (e.length <= 0) {
      setCategoryFilterByNameTrack("")
      setCategoryFilterByName("")
    } else {
      setCategoryFilterByNameTrack(e)
    }
  }

  const getMinPrice = (e: string) => {
    if (parseInt(e) >= parseInt(maxPrice)) {
      setMinPrice(String(parseInt(maxPrice) - 10))
    } else {
      setMinPrice(e)
    }
  }

  const getMaxPrice = (e: string) => {
    if (parseInt(e) <= parseInt(minPrice)) {
      setMaxPrice(String(parseInt(minPrice) + 10))
    } else {
      setMaxPrice(e)
    }
  }

  const btnFilterByName = () => {
    setCategoryFilterByName(categoryFilterByNameTrack)
  }

  const setFilterbyMultipleItem = (val: string) => {
    setCategoryFilter("")
    if (categoryFilterByMultipleItem.includes(val)) {
      setCategoryFilterByMultipleItem((prev) => prev.filter(item => item !== val));
    } else {
      setCategoryFilterByMultipleItem((prev) => [...prev, val]);
    }
  }

  useEffect(() => {
    (async function () {
      if (Cookies.get("usertoken")) {
        try {
          const verify = await userLoginVerify();
          if (verify.data.status === "Failed") {
            nav("/user/login")
          } else {
            const { _id, fullName, email } = verify.data.userData
            setUserData({ _id, fullName, email })
            getProductList(_id)
            getCategoryList(_id)
          }
        } catch (error: any) {
          setSnackOpen({ open: true, severity: "warning", message: error.message })
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
    } catch (error: any) {
      setLoading(false)
      setSnackOpen({ open: true, severity: "warning", message: error.message })
    }
  }

  const getCategoryList = async (id: string) => {
    try {
      const prodCat = await userGetCategoryList();
      if (prodCat.data.status === "Success") {
        setProductCategory(prodCat.data.category)
      }
      const getCart = await userGetCart(id);
      if (getCart.data.status === "Success") {
        var cart = getCart.data.cartData
        setCartDate(cart)
      }
    } catch (error: any) {
      setSnackOpen({ open: true, severity: "warning", message: error.message })
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
    } catch (error: any) {
      setLoading(false)
      setSnackOpen({ open: true, severity: "warning", message: error.message })
    }
  }

  const resetFilter = () => {
    setCategoryFilter("")
    setCategoryFilterByName("")
    setCategoryFilterByNameTrack("")
    setChangeMinMax("")
    setMinPrice("0")
    setMaxPrice("1000")
    setCategoryFilterByMultipleItem(() => [])
  }


  return (
    <>
      <Helmet>
        <title>Product</title>
        <link rel="stylesheet" type="text/css" href="../../src/pages/User/Products/Productlist.css" />
      </Helmet>
      <section id="wrapper">
        <header className="shadow ">
          <div className="container">
            <div className="d-flex flex-wrap align-items-center justify-content-between justify-content-lg-between">
              <div className="col-md-2">
                <h1>
                  <a href="/" className="d-flex align-items-center mb-2 mb-lg-0 text-dark text-decoration-none">
                    <span className="logo_txt">SMART STORE</span>
                  </a>
                </h1>
              </div>
              <div className="col-md-8">
                <div className="headerform">
                  <div role="search">
                    <div className="input-group">
                      <div className="input-group-btn">
                        <button type="button" className="btn btn-default" id="catDrop" data-toggle="dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                          <span id="srch-category">Category</span> <i className="fa fa-angle-down"></i>
                        </button>
                        <ul className="dropdown-menu" id="it-category" role="menu" aria-labelledby="catDrop">
                          <li key={0} className={'p-2 ' + (categoryFilter.length === 0 && 'bg-dark text-light')} onClick={() => getCategoryFilter("")}>{"All"}</li>
                          {
                            productCategory.length > 0 ?
                              productCategory.map((cat, i) => {
                                return (
                                  <li key={i + 1} className={'p-2 ' + (categoryFilter === cat?.categoryName && 'bg-dark text-light')} onClick={() => getCategoryFilter(cat?.categoryName)}>{cat?.categoryName}</li>
                                )
                              }) : <li>Loading...</li>
                          }
                        </ul>
                      </div>
                      <input type="hidden" id="txt-category" />
                      <input type="text" id="txt-search" value={categoryFilterByNameTrack} className="form-control" onChange={(e: ChangeEvent<HTMLInputElement>) => filterByNameChange(e.target.value)} />
                      <span className="input-group-btn">
                        <button id="btn-search" type="submit" className="btn btn-primary" onClick={btnFilterByName}>
                          <i className="fa fa-search"></i>
                          Search
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mobiBar">
                <button className="btn btn-primary">
                  <i className="fa-regular fa-compass"></i> Explore
                </button>
                <button id="userProf" className="transBtn" onClick={() => nav("/user/dashboard/profile")}>
                  <i className="fa-regular fa-user"></i>
                  <span>Profile</span>
                </button>
                <button id="ordersMenu" className="transBtn" onClick={() => nav('/user/dashboard/orders')}>
                  <i className="fa-regular fa-file-lines"></i>
                  <span>Orders</span>
                </button>
                <button id="cartAdd" className="transBtn" onClick={() => nav("/user/dashboard/cart")}>
                  <b>{cartDate.length}</b>
                  <i className="fa-solid fa-cart-shopping"></i>
                  <span>Cart</span>
                </button>
                <div className="dropdown show">
                  <button id="toggleMenu" className="transBtn" data-toggle="dropdown" data-bs-toggle="dropdown" aria-expanded="false">
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
            <hr />
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

        </header>

        <section id="plWrap">
          <div className="container bootdey">
            <div className="row">
              <div className="col-md-3">
                <section id="sideWrap" className="shadow">
                  <section className="panel">
                    <div className="panel-head">
                      Categories
                    </div>
                    <div className="panel-body">
                      <div className="form-group has-search catSearch">
                        <input type="text" className="form-control" value={categoryFilterByNameTrack} placeholder="Search" onChange={(e: ChangeEvent<HTMLInputElement>) => filterByNameChange(e.target.value)} />
                        <span className="fa fa-search" onClick={btnFilterByName}></span>
                      </div>

                      <ul className="list-group">
                        <li className="list-group-item">
                          <input className="form-check-input me-1" disabled={categoryFilterByMultipleItem.length === 0} checked={categoryFilterByMultipleItem.length === 0 ? true : false} type="checkbox" aria-label="All" id="all" onChange={(_e: ChangeEvent<HTMLInputElement>) => getFilterbyMultipleItem("")} />
                          <label htmlFor="all">
                            <img src="../../src/assets/images/all.png" alt="Allitems" />
                            All
                          </label>
                        </li>
                        {
                          productCategory.length > 0 ?
                            productCategory.map((cat, i) => {
                              return (
                                <li key={i} className="list-group-item">
                                  <input className="form-check-input me-1" type="checkbox" aria-label={cat.categoryName} id={cat.categoryName} checked={categoryFilterByMultipleItem.includes(cat.categoryName)} onChange={(_e: ChangeEvent<HTMLInputElement>) => getFilterbyMultipleItem(cat.categoryName)} />
                                  <label htmlFor={cat.categoryName}>
                                    <img src={`../../src/assets/images/${cat.categoryName.toLowerCase()}.png`} alt={cat.categoryName} />
                                    {cat.categoryName}
                                  </label>
                                </li>
                              )
                            }) : <li className="list-group-item">Loading...</li>
                        }
                      </ul>
                    </div>
                  </section>

                  <section className="panel">
                    <div className="panel-body">
                      <h3>Min. order</h3>
                      <select value={changeMinMax} onChange={(e: ChangeEvent<HTMLSelectElement>) => setChangeMinMax(e.target.value)} className="form-select" aria-label="Default select example">
                        <option value="">Max</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                      </select>
                    </div>
                  </section>

                  <section className="panel border-bottom-0">
                    <div className="panel-body">
                      <h3>Price Range</h3>
                      <div className="priceRange">
                        <div className="price-input">
                          <div className="field">
                            <span>Min</span>
                            <input type="number" className="input-min" value={minPrice} onChange={(e: ChangeEvent<HTMLInputElement>) => getMinPrice(e.target.value)} />
                          </div>
                          <div className="separator">-</div>
                          <div className="field">
                            <input type="number" className="input-max" value={maxPrice} onChange={(e: ChangeEvent<HTMLInputElement>) => getMaxPrice(e.target.value)} />
                            <span>Max</span>
                          </div>
                        </div>
                        <div className="slider">
                          {/* <div className="progress"></div> */}
                        </div>
                        <div className="range-input">
                          <input type="range" className="range-min" min="0" max="3000" value={minPrice} step="10" onChange={(e: ChangeEvent<HTMLInputElement>) => getMinPrice(e.target.value)} />
                          <input type="range" className="range-max" min="0" max="3000" value={maxPrice} step="10" onChange={(e: ChangeEvent<HTMLInputElement>) => getMaxPrice(e.target.value)} />
                        </div>
                      </div>
                    </div>
                  </section>
                  <div className="d-flex justify-content-around">
                    <button className="btn btn-secondary" onClick={resetFilter}>Reset</button>
                    {/* <button type="button" id="loginBrn" className="btn btn-primary">Apply</button> */}
                  </div>
                </section>
              </div>
              <div className="col-md-9">
                <p>Showing <b>{productList.length}+ products</b> from global suppliers</p>
                <div className="row product-list">
                  {
                    productList.length > 0 ?
                      productList.slice((currentPage - 1) * itemsPerPage, ((currentPage - 1) * itemsPerPage) + itemsPerPage)
                        .filter(pc => (pc.category.toLowerCase().indexOf(categoryFilter.toLowerCase()) > -1))
                        .filter((pc: any) => (categoryFilterByMultipleItem.length ? (categoryFilterByMultipleItem.filter((fmi) => fmi.toLowerCase().indexOf(pc.category.toLowerCase()) > -1).includes(pc.category.toLowerCase())) : (pc.category.toLowerCase().indexOf(categoryFilter.toLowerCase()) > -1)))
                        .filter(pc => (pc.productName.toLowerCase().indexOf(categoryFilterByName.toLowerCase()) > -1))
                        .filter(pc => (pc.quantityAndTypeAndPrice[0].price > parseInt(minPrice) && pc.quantityAndTypeAndPrice[0].price < parseInt(maxPrice)))
                        .filter(pc => (changeMinMax.length ? pc?.minOrder?.toString() === (changeMinMax) : pc?.minOrder?.toString().indexOf("") > -1))
                        .map((prod, i) => {
                          return (
                            <div key={i} className="col-md-3">
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
                            </div>
                          )
                        })
                      :
                      Array(10).fill(0).map((_, i: number) => {
                        return (
                          <div key={i} className="col-md-3">
                            <Stack className="product shadow" spacing={2}>
                              <div className="actionBtn">
                                <button className="btn" >
                                  <IconButton>
                                    <Skeleton variant="circular" animation="wave">
                                      <Favorite />
                                    </Skeleton>
                                  </IconButton>
                                </button>
                                <button className="btn" >
                                  <IconButton>
                                    <Skeleton variant="circular" animation="wave">
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
                          </div>
                        )
                      })
                  }
                </div>

                <div className="d-flex justify-content-between align-items-center b-pagination">
                  <p className="page_left">
                    <span id="noItems">{productList.length}</span> items in <span id="totalItems">{totalPages}</span> Pages.
                  </p>

                  <div className="pagination">
                    <button className="first" onClick={firstNextPage}>
                      &nbsp;
                    </button>
                    <button className="prev" onClick={prevPage}>
                      &nbsp;
                      <span>Previous</span>
                    </button>
                    <div className="pager">
                      <input type="text" id="number" value={currentPage} disabled />
                      of <span id="totalPage">{totalPages}</span>
                    </div>
                    <button className="next" onClick={nextPage}>
                      <span>Next</span>&nbsp;
                    </button>
                    <button className="last" onClick={lastNextPage}>
                      &nbsp;
                    </button>
                  </div>

                </div>
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
      <SnackbarAlert snackopen={snackopen} setSnackOpen={setSnackOpen} />
    </>
  )
}

export default Uproductlist;