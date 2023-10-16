import { useEffect, useState } from 'react'
import { userLoginVerify } from '../../../services/Userservice';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'
import { userGetProducts } from '../../../services/Userservice';

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
  const [isLoading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    (async function () {
      const verify = await userLoginVerify();
      if (verify.data.status === "Failed") {
        nav("/user/login")
      } else {
        if (window.location.pathname.endsWith("dashboard") || window.location.pathname.endsWith("dashboard/")) {
          nav("/user/dashboard")
          getProductList()
        }
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
      } else {
        setError(res.data.message)        
      }
      setLoading(false)
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
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
              <ul className="dropdown-menu text-small" aria-labelledby="profileDrop">
                <li><a className="dropdown-item" href="#">Settings</a></li>
                <li><a className="dropdown-item" href="#">Profile</a></li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li><a className="dropdown-item" href="#">Sign out</a></li>
              </ul>
            </div>
          </div>

          <div className="mobiBar">
            <button className="btn btn-primary">
              <i className="fa-regular fa-compass"></i> Explore
            </button>
            <button id="cartAdd" className="transBtn">
              <i className="fa-solid fa-cart-shopping"></i>
            </button>
            <button id="userProf" className="transBtn">
              <i className="fa-regular fa-user"></i>
            </button>
            <button id="toggleMenu" className="transBtn">
              <i className="fa-solid fa-bars"></i>
            </button>
          </div>
        </div>
      </header>

      <section id="searchWrap">
        <div className="row justify-content-md-center">
          <div className="col-lg-8 col-md-9">
            <form role="search">
              <div className="input-group">
                <div className="input-group-btn">
                  <button type="button" className="btn btn-default" data-toggle="dropdown">
                    <span id="srch-category">Category</span> <i className="fa fa-angle-down"></i>
                  </button>
                  <ul className="dropdown-menu" id="mnu-category">
                    <li><a href="#Apps">Apps</a></li>
                    <li><a href="#eBooks">eBooks</a></li>
                    <li><a href="#Games">Games</a></li>
                    <li><a href="#Music">Music</a></li>
                    <li><a href="#Videos">Videos</a></li>
                  </ul>
                </div>
                <input type="hidden" id="txt-category" />
                <input type="text" id="txt-search" className="form-control" />
                <span className="input-group-btn">
                  <button id="btn-search" type="submit" className="btn btn-primary">
                    <i className="fa fa-search"></i>
                    Search
                  </button>
                </span>
              </div>
            </form>

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
                <div className="tabHeader">
                  <h2>NEW ARRIVALS</h2>
                  <a href="productlist.html" className="btn btn-primary">View All</a>
                </div>
                <div className="tabContent">
                  <ul className="prodList">
                    <li>
                      <div className="product shadow">
                        <div className="actionBtn">
                          <button className="btn">
                            <i className="fa-regular fa-heart"></i>
                          </button>
                          <button className="btn">
                            <i className="fa-solid fa-cart-shopping"></i>
                          </button>
                        </div>
                        <img src="../../src/asserts/images/prod1.jpg" alt="Product 1" />
                        <span className="title">Keya Oregano</span>
                        <span className="measure">Imported Herb 200gm</span>
                        <span className="price">₹ 300</span>
                        <span className="stock">Min. Order: 100 pieces</span>
                      </div>
                    </li>
                    <li>
                      <div className="product shadow">
                        <div className="actionBtn">
                          <button className="btn">
                            <i className="fa-regular fa-heart"></i>
                          </button>
                          <button className="btn">
                            <i className="fa-solid fa-cart-shopping"></i>
                          </button>
                        </div>
                        <img src="../../src/asserts/images/prod2.jpg" alt="Product 2" />
                        <span className="title">Ceylon CINNAMON</span>
                        <span className="measure">Weight 100g Packing</span>
                        <span className="price">₹ 500</span>
                        <span className="stock">Min. Order: 100 pieces</span>
                      </div>
                    </li>
                    <li>
                      <div className="product shadow">
                        <div className="actionBtn">
                          <button className="btn">
                            <i className="fa-regular fa-heart"></i>
                          </button>
                          <button className="btn">
                            <i className="fa-solid fa-cart-shopping"></i>
                          </button>
                        </div>
                        <img src="../../src/asserts/images/prod3.jpg" alt="Product 3" />
                        <span className="title">Keya Penne Pasta</span>
                        <span className="measure">100% Wheat Pasta, 1kg</span>
                        <span className="price">₹ 300</span>
                        <span className="stock">Min. Order: 100 pieces</span>
                      </div>
                    </li>
                    <li>
                      <div className="product shadow">
                        <div className="actionBtn">
                          <button className="btn">
                            <i className="fa-regular fa-heart"></i>
                          </button>
                          <button className="btn">
                            <i className="fa-solid fa-cart-shopping"></i>
                          </button>
                        </div>
                        <img src="../../src/asserts/images/prod4.jpg" alt="Product 4" />
                        <span className="title">Tata Sampann Spice</span>
                        <span className="measure">Chilli Powder 600g</span>
                        <span className="price">₹ 198</span>
                        <span className="stock">Min. Order: 100 pieces</span>
                      </div>
                    </li>
                    <li>
                      <div className="product shadow">
                        <div className="actionBtn">
                          <button className="btn">
                            <i className="fa-regular fa-heart"></i>
                          </button>
                          <button className="btn">
                            <i className="fa-solid fa-cart-shopping"></i>
                          </button>
                        </div>
                        <img src="../../src/asserts/images/prod5.jpg" alt="Product 5" />
                        <span className="title">Keya Piri Piri</span>
                        <span className="measure">Imported Herb 100gm</span>
                        <span className="price">₹ 100</span>
                        <span className="stock">Min. Order: 100 pieces</span>
                      </div>
                    </li>
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
                  isLoading && <div>Loading...</div>
                }
                {
                  error.length > 0 && <div>{error}</div>
                }
                {
                  productList.length > 0 && !isLoading &&
                  <>
                    <div className="tabHeader">
                      <h2>FEATURED PRODUCTS</h2>
                      <button className="btn btn-primary">View All</button>
                    </div>
                    <div className="tabContent">
                      <ul className="prodList">
                        {
                          productList.slice(0,11).map((prod, i) => {
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
                                <span className="title">{prod.title}</span>
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
  )
}

export default Udashboard;