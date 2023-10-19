import { ChangeEvent, useEffect, useState } from 'react'
import { userGetCategoryList, userLoginVerify } from '@/services/Userservice';
import { Link, useNavigate } from 'react-router-dom';
import { userGetProducts } from '@/services/Userservice';
import { Helmet } from "react-helmet";

interface IPropsProductLisst {
  productName: String,
  productDescription: String,
  category: String,
  title: String,
  quantityAndType: Array<{ price: Number, quantity: String, type: String }>,
  minOrder: Number,
  image: String,
  adminId: String
}

const Udashboard = () => {
  const nav = useNavigate()

  const [productList, setProductList] = useState<IPropsProductLisst[]>([])
  const [productCategory, setProductCategory] = useState<{ categoryName: string }[]>([])
  const [isLoading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [categoryFilter, setCategoryFilter] = useState<string>("")
  const [categoryFilterByNameTrack, setCategoryFilterByNameTrack] = useState<string>("")
  const [categoryFilterByName, setCategoryFilterByName] = useState<string>("")

  const filterByNameChange = (e: string) => {
    setCategoryFilterByNameTrack(e)
  }

  const filterByName = () => {
    if (!categoryFilterByNameTrack.length) {
      setCategoryFilterByName("")
    } else {
      setCategoryFilterByName(categoryFilterByNameTrack)     
    }
  }

  useEffect(() => {
    (async function () {
      const verify = await userLoginVerify();
      if (verify.data.status === "Failed") {
        nav("/user/login")
      } else {
        getProductList()
      }
    })();
  }, [])

  const getProductList = async () => {
    try {
      setLoading(true)
      const res = await userGetProducts();
      if (res.data.status === "Success") {
        setError("")
        setProductList(res.data.producList)
        try {
          const prodCat = await userGetCategoryList();
          if (prodCat.data.status === "Success") {
            setProductCategory(prodCat.data.category)
          }
        } catch (error) {
        }
      } else {
        setError(res.data.message)
      }
      setLoading(false)
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  const addCartAndWishList = (type: string) => {

  }

  return (
    <>
      <Helmet>
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
                    <span className="username">Lauren Cruz</span>
                  </span>

                  <img src="https://github.com/mdo.png" alt="mdo" width="32" height="32"
                    className="rounded-circle" />
                </a>
                <ul className="dropdown-menu text-small" id="profDrop" aria-labelledby="profileDrop">
                  <li><a className="dropdown-item" href="cart.html">Checkout</a></li>
                  <li><a className="dropdown-item" href="profile.html">Profile</a></li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li><a className="dropdown-item" href="index.html">Sign out</a></li>
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
                      <li key={0} className='p-2' onClick={() => setCategoryFilter("")}>{"All"}</li>
                      {
                        productCategory.length > 0 ?
                          productCategory.map((cat, i) => {
                            return (
                              <li key={i + 1} className='p-2' onClick={() => setCategoryFilter(cat?.categoryName)}>{cat?.categoryName}</li>
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
                      <button className="btn btn-primary">View All</button>
                    </div>
                    <ul>
                      <li>
                        <div className="orders">
                          <span className="date">Sep 1 2023</span>
                          <span className="brand">Mr. Nuttz</span>
                          <span className="product">Premium Almonds</span>
                          <span className="tracking">Arriving on Sep 6 2023</span>
                          <p className="text-right">
                            <a href="#">
                              <i className="fa-solid fa-arrow-up"></i>
                            </a>
                          </p>
                        </div>
                      </li>
                      <li>
                        <div className="orders">
                          <span className="date">Sep 1 2023</span>
                          <span className="brand">TROFFINO</span>
                          <span className="product">Assorted Candy</span>
                          <span className="tracking">Arriving on Sep 6 2023</span>
                          <p className="text-right">
                            <a href="#">
                              <i className="fa-solid fa-arrow-up"></i>
                            </a>
                          </p>
                        </div>
                      </li>
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
                  {
                    productList.length > 0 ?
                      <>
                        <div className="tabHeader">
                          <h2>NEW ARRIVALS</h2>
                          <Link to={"/user/dashboard/products"} className="btn btn-primary">View All</Link>
                        </div>
                        <div className="tabContent">
                          <ul className="prodList">
                            {
                              productList.slice(0, 11).map((prod, i) => {
                                return (<li key={i}>
                                  <div className="product shadow">
                                    <div className="actionBtn">
                                      <button className="btn">
                                        <i className="fa-regular fa-heart"></i>
                                      </button>
                                      <button className="btn">
                                        <i className="fa-solid fa-cart-shopping"></i>
                                      </button>
                                    </div>
                                    <img src={prod.image?.toString()} alt={`Product ${i}`} />
                                    <span className="title">{prod.productName}</span>
                                    <span className="measure">{prod.productDescription}</span>
                                    <span className="price">₹ {prod.quantityAndType[0].price.toString()}</span>
                                    <span className="stock">Min. Order: {prod.minOrder.toString()} pieces</span>
                                  </div>
                                </li>)
                              })
                            }
                          </ul>
                        </div>
                      </>
                      :
                      isLoading ? <div>Loading...</div>
                        :
                        error.length > 0 ? <div>{error}</div> : <div>Product not found</div>
                  }
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
                          <img src="../../src/asserts/images/cat1.png" alt="Category 1" />
                        </div>
                      </li>
                      <li>
                        <div className="category theme-2 shadow-sm">
                          <span className="cTitle">Packed Items</span>
                          <span className="prodName">Spam 7 oz</span>
                          <img src="../../src/asserts/images/cat2.png" alt="Category 2" />
                        </div>
                      </li>
                      <li>
                        <div className="category theme-3 shadow-sm">
                          <span className="cTitle">Dry Fruits</span>
                          <span className="prodName">Almonds</span>
                          <img src="../../src/asserts/images/cat3.png" alt="Category 3" />
                        </div>
                      </li>
                      <li>
                        <div className="category theme-4 shadow-sm">
                          <span className="cTitle">Candy</span>
                          <span className="prodName">Simpkins</span>
                          <img src="../../src/asserts/images/cat4.png" alt="Category 4" />
                        </div>
                      </li>
                      <li>
                        <div className="category theme-5 shadow-sm">
                          <span className="cTitle">Herbs</span>
                          <span className="prodName">Keya</span>
                          <img src="../../src/asserts/images/cat5.png" alt="Category 5" />
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="tab-pane fade" id="recom" role="tabpanel" aria-labelledby="recom-tab">
                  {
                    productList.length > 0 ?
                      <>
                        <div className="tabHeader">
                          <h2>FEATURED PRODUCTS</h2>
                          <Link to={"/user/dashboard/products"} className="btn btn-primary">View All</Link>
                        </div>
                        <div className="tabContent">
                          <ul className="prodList">
                            {
                              categoryFilter.length || categoryFilterByName.length ?
                                  productList.filter(pc=>(pc.category.indexOf(categoryFilter)>-1))
                                  .filter(pc => (pc.productName.indexOf(categoryFilterByName) > -1)).map((prod, i) => {
                                    return (<li key={i}>
                                      <div className="product shadow">
                                        <div className="actionBtn">
                                          <button className="btn">
                                            <i className="fa-regular fa-heart"></i>
                                          </button>
                                          <button className="btn">
                                            <i className="fa-solid fa-cart-shopping"></i>
                                          </button>
                                        </div>
                                        <img src={prod.image?.toString()} alt={`Product ${i}`} />
                                        <span className="title">{prod.productName}</span>
                                        <span className="measure">{prod.productDescription}</span>
                                        <span className="price">₹ {prod.quantityAndType[0].price.toString()}</span>
                                        <span className="stock">Min. Order: {prod.minOrder.toString()} pieces</span>
                                      </div>
                                    </li>)
                                  })
                                :
                                productList.slice(0, 11).map((prod, i) => {
                                  return (<li key={i}>
                                    <div className="product shadow">
                                      <div className="actionBtn">
                                        <button className="btn">
                                          <i className="fa-regular fa-heart"></i>
                                        </button>
                                        <button className="btn">
                                          <i className="fa-solid fa-cart-shopping"></i>
                                        </button>
                                      </div>
                                      <img src={prod.image?.toString()} alt={`Product ${i}`} />
                                      <span className="title">{prod.productName}</span>
                                      <span className="measure">{prod.productDescription}</span>
                                      <span className="price">₹ {prod.quantityAndType[0].price.toString()}</span>
                                      <span className="stock">Min. Order: {prod.minOrder.toString()} pieces</span>
                                    </div>
                                  </li>)
                                })
                            }
                          </ul>
                        </div>
                      </>
                      :
                      isLoading ? <div>Loading...</div>
                        :
                        error.length > 0 ? <div>{error}</div> : <div>Product not found</div>
                  }
                </div>
              </div>
            </section>
          </div>
        </section>

        <section id="brandWrap">
          <div className="container">
            <h2>BRANDS WE DEAL</h2>

            <ul>
              <li><a href="#"><img src="../../src/asserts/images/br-1.png" alt="Amara" /></a></li>
              <li><a href="#"><img src="../../src/asserts/images/br-2.png" alt="Fossa" /></a></li>
              <li><a href="#"><img src="../../src/asserts/images/br-3.png" alt="Kyan" /></a></li>
              <li><a href="#"><img src="../../src/asserts/images/br-4.png" alt="Atica" /></a></li>
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
    </>
  )
}

export default Udashboard;